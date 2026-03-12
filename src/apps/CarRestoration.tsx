import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

export const CarRestorationApp = () => (
  <div className="p-8 text-white">
    <div className="flex items-center gap-3 mb-6">
      <Sparkles className="w-8 h-8 text-emerald-400" />
      <h1 className="text-3xl font-bold tracking-tight">Cinematic Car Restoration Pro</h1>
    </div>
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <p className="text-gray-400 mb-4">
        Welcome to the Car Restoration Tool. This is a modular component loaded dynamically.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-emerald-400" />
            Prompt Generator
          </h3>
          <textarea 
            className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            placeholder="Describe the car condition..."
          />
          <button className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all">
            Generate Cinematic Prompt
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CarRestorationApp;
