import { useState, useEffect } from 'react';
import { fetchStakingData } from '../lib/helius';
import { Shield, Users, Percent, Layers, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { CopyButton } from '../components/ui/CopyButton';
import { SearchBar } from '../components/ui/SearchBar';
import { ExportButton } from '../components/ui/ExportButton';

interface StakingData {
  id: number;
  validator_address: string;
  total_stake: number;
  active_stake: number;
  delegators_count: number;
  commission: number;
  apy: number;
  epoch: number;
  timestamp: number;
  created_at: string;
}

type SortField = 'total_stake' | 'active_stake' | 'delegators_count' | 'commission' | 'apy';
type SortOrder = 'asc' | 'desc';

export default function StakingMonitor() {
  const [stakingData, setStakingData] = useState<StakingData[]>([]);
  const [filteredData, setFilteredData] = useState<StakingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStake: 0, totalDelegators: 0, avgApy: 0, currentEpoch: 0 });
  const [selectedValidator, setSelectedValidator] = useState<StakingData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('total_stake');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchStakingDataFromHelius();

    // Setup polling for real-time updates (every 60 seconds)
    const intervalId = setInterval(() => {
      fetchStakingDataFromHelius();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [stakingData, searchQuery, sortField, sortOrder]);

  const fetchStakingDataFromHelius = async () => {
    try {
      const { staking_data, count, statistics } = await fetchStakingData();
      setStakingData(staking_data);
      setStats({
        totalStake: statistics.total_stake,
        totalDelegators: statistics.total_delegators,
        avgApy: statistics.avg_apy,
        currentEpoch: statistics.current_epoch
      });
    } catch (error) {
      console.error('Error fetching staking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = () => {
    let filtered = [...stakingData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(validator =>
        validator.validator_address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

    setFilteredData(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('id-ID');
  };

  const formatFullTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'long'
    });
  };

  const openInExplorer = (address: string) => {
    window.open(`https://solscan.io/account/${address}`, '_blank');
  };

  const calculateStakePercentage = (stake: number) => {
    return ((stake / stats.totalStake) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="shimmer h-32 card" />
        <div className="shimmer h-64 card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Staking Monitor</h2>
          <p className="text-zinc-400 mt-1">Monitor staking data and Solana validators</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total Stake</p>
              <p className="text-3xl font-bold text-white mt-1">{(stats.totalStake / 1000000).toFixed(1)}M</p>
              <p className="text-zinc-500 text-xs mt-1">SOL</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <Layers className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="stat-card cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Total Delegators</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalDelegators.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Avg APY</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.avgApy.toFixed(2)}%</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <Percent className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="stat-card cursor-pointer hover:scale-[1.02] transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm">Current Epoch</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.currentEpoch}</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Export */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search validator address..."
            className="flex-1 max-w-md"
          />

          <div className="flex items-center space-x-2">
            <ExportButton data={filteredData} filename="staking-validators" format="csv" />
            <button
              onClick={fetchStakingDataFromHelius}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Validators Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Top Validators
            <span className="ml-3 text-sm text-zinc-400">({filteredData.length} validators)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-500 font-medium text-sm">Rank</th>
                <th className="text-left py-3 px-4 text-zinc-500 font-medium text-sm">Validator</th>
                <th
                  className="text-left py-3 px-4 text-zinc-500 font-medium text-sm cursor-pointer hover:text-white"
                  onClick={() => handleSort('total_stake')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Total Stake</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-zinc-500 font-medium text-sm cursor-pointer hover:text-white"
                  onClick={() => handleSort('active_stake')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Active Stake</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-zinc-500 font-medium text-sm cursor-pointer hover:text-white"
                  onClick={() => handleSort('delegators_count')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Delegators</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-zinc-500 font-medium text-sm cursor-pointer hover:text-white"
                  onClick={() => handleSort('commission')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Commission</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-zinc-500 font-medium text-sm cursor-pointer hover:text-white"
                  onClick={() => handleSort('apy')}
                >
                  <div className="flex items-center space-x-1">
                    <span>APY</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-zinc-500 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((validator, index) => (
                <tr
                  key={validator.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedValidator(validator)}
                >
                  <td className="py-4 px-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-200 font-mono text-sm">{formatAddress(validator.validator_address)}</span>
                      <CopyButton text={validator.validator_address} />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{validator.total_stake.toLocaleString()} SOL</span>
                      <CopyButton text={validator.total_stake.toString()} />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-zinc-300">{validator.active_stake.toLocaleString()} SOL</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-zinc-500" />
                      <span className="text-white">{validator.delegators_count.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-semibold">{validator.commission}%</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="badge-success">{validator.apy}% APY</span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInExplorer(validator.validator_address);
                      }}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                      title="View on Solscan"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validator Detail Modal */}
      {selectedValidator && (
        <Modal
          isOpen={!!selectedValidator}
          onClose={() => setSelectedValidator(null)}
          title="Validator Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-zinc-800">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <p className="text-zinc-500 text-sm mb-2">Validator Address</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-white font-mono break-all">{selectedValidator.validator_address}</p>
                <CopyButton text={selectedValidator.validator_address} showText />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Total Stake</p>
                <p className="text-white font-bold text-2xl">{selectedValidator.total_stake.toLocaleString()} SOL</p>
                <p className="text-zinc-400 text-sm mt-1">{calculateStakePercentage(selectedValidator.total_stake)}% of network</p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">Active Stake</p>
                <p className="text-white font-bold text-2xl">{selectedValidator.active_stake.toLocaleString()} SOL</p>
                <p className="text-zinc-400 text-sm mt-1">{((selectedValidator.active_stake / selectedValidator.total_stake) * 100).toFixed(1)}% active</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Delegators</p>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-zinc-400" />
                  <p className="text-white font-bold text-2xl">{selectedValidator.delegators_count.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">Commission</p>
                <p className="text-white font-bold text-2xl">{selectedValidator.commission}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-zinc-500 text-sm mb-1">APY</p>
                <p className="text-white font-bold text-2xl">{selectedValidator.apy}%</p>
              </div>
              <div>
                <p className="text-zinc-500 text-sm mb-1">Epoch</p>
                <p className="text-white font-bold text-2xl">{selectedValidator.epoch}</p>
              </div>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-1">Last Updated</p>
              <p className="text-white">{formatFullTimestamp(selectedValidator.timestamp)}</p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={() => openInExplorer(selectedValidator.validator_address)}
                className="w-full px-4 py-3 bg-white hover:bg-zinc-200 text-black rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View on Solscan</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
