import { FC } from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  format?: 'csv' | 'json';
  className?: string;
}

export const ExportButton: FC<ExportButtonProps> = ({ 
  data, 
  filename, 
  format = 'csv', 
  className = '' 
}) => {
  const exportToCSV = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-sm font-bold transition-colors ${className}`}
      disabled={data.length === 0}
    >
      <Download className="w-4 h-4" />
      <span>Export {format.toUpperCase()}</span>
    </button>
  );
};
