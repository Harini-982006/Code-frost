
import React, { useState, useEffect } from 'react';
import { getWinterDashboardData } from '../services/geminiService';
import { DashboardSummary, Location } from '../types';
import { Thermometer, Wind, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { time: '6AM', temp: -5 },
  { time: '9AM', temp: -3 },
  { time: '12PM', temp: 0 },
  { time: '3PM', temp: 1 },
  { time: '6PM', temp: -2 },
  { time: '9PM', temp: -6 },
  { time: '12AM', temp: -8 },
];

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setLocation(loc);
          const data = await getWinterDashboardData(loc.latitude, loc.longitude);
          setSummary(data);
          setLoading(false);
        }, async () => {
          // Fallback to default cold region (e.g. Anchorage, Alaska)
          const data = await getWinterDashboardData(61.2181, -149.9003);
          setSummary(data);
          setLoading(false);
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getRiskColor = (level?: string) => {
    switch(level) {
      case 'EXTREME': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium italic">Analyzing real-time winter satellite and ground data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Thermometer className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Feels Like</p>
            <p className="text-3xl font-bold text-slate-800">-8°C</p>
          </div>
        </div>
        <div className={`p-6 rounded-2xl shadow-sm border ${getRiskColor(summary?.riskLevel)} flex items-center gap-4`}>
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium opacity-80">Current Risk</p>
            <p className="text-3xl font-bold">{summary?.riskLevel || 'LOW'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Wind className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Wind Chill</p>
            <p className="text-3xl font-bold text-slate-800">-12°C</p>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Winter Assessment</h3>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              {summary?.summary}
            </p>
          </div>
          <button onClick={fetchDashboard} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="border-t border-slate-100 pt-6 mt-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Grounding Sources</h4>
          <div className="flex flex-wrap gap-3">
            {summary?.groundingSources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-sm border border-slate-200 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                {source.title.substring(0, 30)}...
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Temperature Trend */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">24h Temperature Forecast</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} unit="°" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
