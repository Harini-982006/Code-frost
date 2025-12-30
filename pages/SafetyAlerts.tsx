
import React, { useState, useEffect } from 'react';
import { getSmartAlerts } from '../services/geminiService';
import { WinterAlert } from '../types';
import { AlertCircle, AlertTriangle, Info, MapPin, ChevronRight, Bell } from 'lucide-react';

const SafetyAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<WinterAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      const data = await getSmartAlerts("Anchorage, Alaska"); // Default location for demo
      setAlerts(data);
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'WARNING': return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      default: return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'CRITICAL': return 'border-red-200 bg-red-50';
      case 'WARNING': return 'border-amber-200 bg-amber-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  if (loading) {
    return (
       <div className="space-y-4 animate-pulse">
         {[1,2,3].map(i => (
           <div key={i} className="h-32 bg-slate-200 rounded-2xl w-full"></div>
         ))}
       </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-3xl p-8 flex items-center justify-between shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
            <MapPin className="w-4 h-4" />
            Current Region
          </div>
          <h3 className="text-3xl font-bold">Active Advisories</h3>
          <p className="text-slate-400">Real-time intelligence from regional weather stations and emergency feeds.</p>
        </div>
        <div className="hidden md:block">
           <Bell className="w-16 h-16 text-slate-800" />
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.length > 0 ? alerts.map((alert) => (
          <div key={alert.id} className={`p-6 rounded-3xl border ${getStyle(alert.type)} flex flex-col md:flex-row gap-6 items-start transition-all hover:shadow-md`}>
            <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
              {getIcon(alert.type)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-bold text-slate-900">{alert.title}</h4>
                <span className="text-xs font-bold text-slate-400 uppercase">{alert.timestamp}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{alert.description}</p>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-blue-500 font-bold uppercase text-[10px] tracking-widest">Recommended Action:</span>
                  {alert.action}
                </div>
              </div>
            </div>
            <button className="self-center p-2 hover:bg-slate-200 rounded-full transition-colors">
              <ChevronRight className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium">No active critical alerts for your region.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyAlerts;
