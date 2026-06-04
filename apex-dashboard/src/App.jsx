import React, { useState, useEffect } from 'react';
import DashboardExtensions from './DashboardExtensions';

const App = () => {
  const [metrics, setMetrics] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  
  // New state to hold our POS data at the top level
  const [posData, setPosData] = useState({ revenue: 0, buyers: 0 });
  const [error, setError] = useState(false);

  const TARGET_DATE = '2026-04-10';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CV Metrics & Anomalies
        const [metricsRes, anomaliesRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/stores/ST1008/metrics?date=${TARGET_DATE}`),
          fetch(`http://127.0.0.1:8000/stores/ST1008/anomalies?date=${TARGET_DATE}`)
        ]);

        if (!metricsRes.ok || !anomaliesRes.ok) throw new Error('API Offline');
        
        setMetrics(await metricsRes.json());
        setAnomalies(await anomaliesRes.json());

        // Fetch our custom POS data to bypass the date-format bug
        const [deptRes, loyaltyRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/dashboard/micro-funnels'),
          fetch('http://127.0.0.1:8000/api/dashboard/loyalty-ratio')
        ]);

        const deptData = await deptRes.json();
        const loyaltyData = await loyaltyRes.json();

        // Calculate True Revenue and True Buyers
        const totalRev = (deptData.departments || []).reduce((sum, dept) => sum + dept.GMV, 0);
        const totalBuyers = (loyaltyData.ratios?.Loyalty || 0) + (loyaltyData.ratios?.Guest || 0);

        setPosData({ revenue: totalRev, buyers: totalBuyers });
        setError(false);
      } catch (err) {
        setError(true);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="p-10 text-red-600 font-bold text-2xl">⚠️ API Offline. Please start the FastAPI backend.</div>;
  if (!metrics) return <div className="p-10 text-xl text-gray-600 animate-pulse">Loading Store Intelligence...</div>;

  // Mathematically fuse CV Footfall with POS Buyers
  const trueConversion = metrics.unique_visitors > 0 
    ? ((posData.buyers / metrics.unique_visitors) * 100).toFixed(2) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Apex Retail Intelligence</h1>
        <p className="text-gray-500 mt-1">Live Feed: Store ST1008 (Brigade Road) | Date: {TARGET_DATE}</p>
      </header>
      
      {/* KPI Cards (Now powered by merged data!) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unique Visitors</h2>
          <p className="text-4xl font-black mt-2">{metrics.unique_visitors}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversion Rate</h2>
          <p className="text-4xl font-black mt-2 text-green-600">{trueConversion}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue (INR)</h2>
          <p className="text-4xl font-black mt-2">₹{posData.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Queue Depth</h2>
          <p className="text-4xl font-black mt-2">{metrics.current_queue_depth}</p>
        </div>
      </div>

      {/* Anomalies Alert Section */}
      {anomalies && anomalies.count > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-600 flex items-center">
            <span className="mr-2">🚨</span> Active System Alerts
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {anomalies.anomalies.map((anomaly, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-red-700">[{anomaly.severity}] {anomaly.type}</span>
                  <p className="text-sm text-red-600 mt-1">{anomaly.suggested_action}</p>
                </div>
                <div className="text-red-800 font-mono font-bold bg-red-100 px-3 py-1 rounded">
                  Val: {anomaly.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">Average Dwell Time by Zone</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics.avg_dwell_ms_by_zone).map(([zone, ms]) => (
            <div key={zone} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-600 text-sm mb-1">{zone}</p>
              <p className="text-2xl font-bold text-indigo-600">{(ms / 1000).toFixed(1)}s</p>
            </div>
          ))}
        </div>
      </div>

      <DashboardExtensions />

    </div>
  );
};

export default App;