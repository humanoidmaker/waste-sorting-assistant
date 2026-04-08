import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Trash2, AlertTriangle, TrendingUp, ScanLine } from 'lucide-react';
import { getClassifyStats, getHistory } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClassifyStats(), getHistory({ limit: 5 })])
      .then(([statsRes, histRes]) => {
        setStats(statsRes.data);
        setRecent(histRes.data.records);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800" /></div>;
  }

  const binColors: Record<string, string> = {
    Blue: 'bg-blue-500',
    Green: 'bg-green-500',
    Red: 'bg-red-500',
    Black: 'bg-gray-800',
    Yellow: 'bg-yellow-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/scan" className="btn-accent flex items-center gap-2">
          <ScanLine className="w-4 h-4" /> Scan Waste
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl"><TrendingUp className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-2xl font-bold">{stats?.total_scans || 0}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl"><Recycle className="w-6 h-6 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Recycling Rate</p>
              <p className="text-2xl font-bold">{stats?.recycling_rate || 0}%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl"><Leaf className="w-6 h-6 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-gray-500">CO2 Saved</p>
              <p className="text-2xl font-bold">{stats?.total_co2_saved || 0} kg</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Hazardous</p>
              <p className="text-2xl font-bold">{stats?.hazardous_count || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Distribution */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Waste Distribution</h2>
          <div className="space-y-3">
            {[
              { label: 'Recyclable', count: stats?.recyclable_count || 0, color: 'bg-blue-500' },
              { label: 'Organic', count: stats?.organic_count || 0, color: 'bg-green-500' },
              { label: 'Hazardous', count: stats?.hazardous_count || 0, color: 'bg-red-500' },
              { label: 'Non-Recyclable', count: stats?.non_recyclable_count || 0, color: 'bg-gray-500' },
            ].map((item) => {
              const total = stats?.total_scans || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Scans</h2>
            <Link to="/scan" className="text-sm text-accent-600 hover:underline">Scan more</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No scans yet. Start sorting waste!</p>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${binColors[item.bin_color] || 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.waste_type}</p>
                    <p className="text-xs text-gray-500">
                      {item.confidence}% confidence | {new Date(item.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                    backgroundColor: item.bin_color === 'Blue' ? '#dbeafe' : item.bin_color === 'Green' ? '#dcfce7' : item.bin_color === 'Red' ? '#fef2f2' : item.bin_color === 'Yellow' ? '#fef9c3' : '#f3f4f6',
                    color: item.bin_color === 'Blue' ? '#1d4ed8' : item.bin_color === 'Green' ? '#15803d' : item.bin_color === 'Red' ? '#b91c1c' : item.bin_color === 'Yellow' ? '#a16207' : '#374151',
                  }}>
                    {item.bin_color} bin
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
