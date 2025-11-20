import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import WhaleActivity from './pages/WhaleActivity';
import MarketFlow from './pages/MarketFlow';
import StakingMonitor from './pages/StakingMonitor';
import RealTimeFeed from './pages/RealTimeFeed';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/whale-activity" replace />} />
          <Route path="/whale-activity" element={<WhaleActivity />} />
          <Route path="/market-flow" element={<MarketFlow />} />
          <Route path="/staking-monitor" element={<StakingMonitor />} />
          <Route path="/real-time-feed" element={<RealTimeFeed />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
