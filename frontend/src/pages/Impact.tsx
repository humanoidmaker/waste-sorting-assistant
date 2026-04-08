import { useState, useEffect } from 'react';
import { Leaf, Recycle, TreePine, Award, Droplets, Zap } from 'lucide-react';
import { getClassifyStats } from '../services/api';

const BADGES = [
  { threshold: 1, name: 'First Sort', desc: 'Sorted your first item' },
  { threshold: 10, name: 'Eco Starter', desc: 'Sorted 10 items' },
  { threshold: 25, name: 'Green Learner', desc: 'Sorted 25 items' },
  { threshold: 50, name: 'Green Warrior', desc: 'Sorted 50 items' },
  { threshold: 100, name: 'Planet Champion', desc: 'Sorted 100 items' },
  { threshold: 250, name: 'Eco Hero', desc: 'Sorted 250 items' },
  { threshold: 500, name: 'Earth Guardian', desc: 'Sorted 500 items' },
  { threshold: 1000, name: 'Sustainability Legend', desc: 'Sorted 1000 items' },
];

export default function Impact() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClassifyStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800" /></div>;
  }

  const totalScans = stats?.total_scans || 0;
  const co2Saved = stats?.total_co2_saved || 0;
  const treesEquiv = (co2Saved / 21.77).toFixed(1); // avg tree absorbs 21.77 kg CO2/year
  const waterSaved = (co2Saved * 100).toFixed(0); // rough estimate

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Environmental Impact</h1>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Recycle className="w-10 h-10 text-blue-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{totalScans}</p>
          <p className="text-sm text-gray-500">Items Sorted</p>
        </div>
        <div className="card text-center">
          <Leaf className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{co2Saved} kg</p>
          <p className="text-sm text-gray-500">CO2 Saved</p>
        </div>
        <div className="card text-center">
          <TreePine className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{treesEquiv}</p>
          <p className="text-sm text-gray-500">Trees Equivalent</p>
        </div>
        <div className="card text-center">
          <Droplets className="w-10 h-10 text-cyan-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{waterSaved}L</p>
          <p className="text-sm text-gray-500">Water Saved (est.)</p>
        </div>
      </div>

      {/* Recycling Rate */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Recycling Rate</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="10"
                strokeDasharray={`${(stats?.recycling_rate || 0) * 3.14} 314`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{stats?.recycling_rate || 0}%</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-blue-600">{stats?.recyclable_count || 0}</span> recyclable items</p>
            <p><span className="font-medium text-green-600">{stats?.organic_count || 0}</span> organic/compostable</p>
            <p><span className="font-medium text-red-600">{stats?.hazardous_count || 0}</span> hazardous items</p>
            <p><span className="font-medium text-gray-600">{stats?.non_recyclable_count || 0}</span> non-recyclable</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-500" /> Environmental Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const earned = totalScans >= badge.threshold;
            return (
              <div key={badge.threshold} className={`text-center p-4 rounded-xl border ${earned ? 'bg-accent-50 border-accent-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${earned ? 'bg-accent-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {earned ? <Zap className="w-7 h-7" /> : <Award className="w-7 h-7" />}
                </div>
                <p className="font-medium text-sm mt-2">{badge.name}</p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
                {!earned && <p className="text-xs text-accent-600 mt-1">{badge.threshold - totalScans} more to go</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
