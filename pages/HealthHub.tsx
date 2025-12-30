
import React, { useState, useEffect } from 'react';
import { getHealthTips } from '../services/geminiService';
import { HealthTip } from '../types';
import { CheckCircle2, HeartPulse, Droplets, Activity, ThermometerSnowflake } from 'lucide-react';

const HealthHub: React.FC = () => {
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      const data = await getHealthTips();
      setTips(data);
      setLoading(false);
    };
    fetchTips();
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Flu': return <HeartPulse className="w-8 h-8 text-rose-500" />;
      case 'Hydration': return <Droplets className="w-8 h-8 text-cyan-500" />;
      case 'Activity': return <Activity className="w-8 h-8 text-emerald-500" />;
      default: return <ThermometerSnowflake className="w-8 h-8 text-blue-500" />;
    }
  };

  if (loading) return <div className="text-center py-20 italic">Loading wellness insights...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-4">Winter Health Guardian</h2>
          <p className="text-blue-100 text-lg">Personalized AI recommendations to stay resilient against extreme cold and seasonal illness.</p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <HeartPulse className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-all flex gap-6 items-start group">
            <div className="p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
              {getCategoryIcon(tip.category)}
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{tip.category}</span>
              <h4 className="text-xl font-bold text-slate-900">{tip.title}</h4>
              <p className="text-slate-600 leading-relaxed">{tip.content}</p>
              <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 pt-2">
                <CheckCircle2 className="w-4 h-4" />
                I'm doing this
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="p-4 bg-white rounded-full shadow-sm">
               <Droplets className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Hydration Reminder</h4>
              <p className="text-slate-600">The air is extremely dry today. Drink 500ml of water in the next hour.</p>
            </div>
         </div>
         <div className="text-emerald-700 font-bold text-sm bg-white px-6 py-3 rounded-2xl shadow-sm">
           Set Reminder
         </div>
      </div>
    </div>
  );
};

export default HealthHub;
