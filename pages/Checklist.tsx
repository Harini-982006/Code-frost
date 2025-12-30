
import React, { useState, useEffect } from 'react';
import { ChecklistItem } from '../types';
import { Package, Truck, Home, Pill, CheckSquare, Square, Trash2, PlusCircle } from 'lucide-react';

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: '1', task: '3-day supply of non-perishable food', category: 'Essentials', completed: false },
  { id: '2', task: '3 gallons of water per person', category: 'Essentials', completed: false },
  { id: '3', task: 'Flashlight and extra batteries', category: 'Essentials', completed: true },
  { id: '4', task: 'First aid kit', category: 'Essentials', completed: false },
  { id: '5', task: 'Ice scraper and snow brush', category: 'Vehicle', completed: true },
  { id: '6', task: 'Sand or cat litter for traction', category: 'Vehicle', completed: false },
  { id: '7', task: 'Test carbon monoxide detectors', category: 'Home', completed: false },
  { id: '8', task: 'Insulate exposed water pipes', category: 'Home', completed: false },
  { id: '9', task: '7-day supply of medications', category: 'Health', completed: false },
];

const Checklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Essentials' | 'Vehicle' | 'Home' | 'Health'>('All');

  useEffect(() => {
    const saved = localStorage.getItem('winterguard-checklist');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(INITIAL_ITEMS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('winterguard-checklist', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const item: ChecklistItem = {
      id: Date.now().toString(),
      task: newItem,
      category: 'Essentials',
      completed: false
    };
    setItems([...items, item]);
    setNewItem('');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Vehicle': return <Truck className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Health': return <Pill className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredItems = activeTab === 'All' ? items : items.filter(i => i.category === activeTab);
  const completedCount = items.filter(i => i.completed).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Survival Preparedness</h3>
            <p className="text-slate-500">Track your essential winter items and home safety status.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-blue-600">{progress}%</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Completion</p>
          </div>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tabs & Add Item */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto">
          {['All', 'Essentials', 'Vehicle', 'Home', 'Health'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Add custom item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={addItem} className="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className={`group flex items-center justify-between p-5 bg-white rounded-2xl border transition-all ${
              item.completed ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-slate-200 shadow-sm hover:border-blue-200'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => toggleItem(item.id)} className="transition-transform active:scale-90">
                {item.completed ? (
                  <CheckSquare className="w-6 h-6 text-blue-600" />
                ) : (
                  <Square className="w-6 h-6 text-slate-300" />
                )}
              </button>
              <div className="space-y-1">
                <span className={`text-slate-800 font-medium ${item.completed ? 'line-through' : ''}`}>
                  {item.task}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {getCategoryIcon(item.category)}
                  {item.category}
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteItem(item.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400">
            No items in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Checklist;
