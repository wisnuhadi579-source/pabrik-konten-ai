import React, { useState } from 'react';
import { appRegistry } from '../config/appRegistry';
import { ToolCard } from './ToolCard';
import { AppLoader } from './AppLoader';
import { LayoutGrid, Sparkles, Zap, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Dashboard: React.FC = () => {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = appRegistry.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeAppId) {
    return <AppLoader appId={activeAppId} onBack={() => setActiveAppId(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Zap className="w-6 h-6 text-black fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PABRIK KONTEN AI</h1>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Production Ready Platform</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-400">
              <a href="#" className="text-white hover:text-emerald-400 transition-colors">Dashboard</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Tutorials</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a>
            </nav>
            <div className="h-4 w-[1px] bg-white/10" />
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all">
              My Account
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
              <Sparkles className="w-3 h-3" />
              AI POWERED TOOLS
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
              Transform Your Workflow with <span className="text-emerald-400">AI Intelligence</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              A curated collection of professional AI tools designed to accelerate your content production and creative process.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search for tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
              />
            </div>
          </motion.div>
        </section>

        {/* Tools Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold">Available Tools</h3>
              <span className="ml-2 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500">
                {filteredTools.length} TOTAL
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool) => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={setActiveAppId} 
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-400">No tools found matching your search</h4>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-emerald-400 hover:underline text-sm"
              >
                Clear search query
              </button>
            </div>
          )}
        </section>

        {/* Features Footer */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-16">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold mb-1">High Performance</h4>
              <p className="text-sm text-gray-500">Optimized for speed and efficiency in every generation.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Secure & Private</h4>
              <p className="text-sm text-gray-500">Your data and prompts are encrypted and never shared.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Always Evolving</h4>
              <p className="text-sm text-gray-500">New tools and features added weekly to the platform.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold">PABRIK KONTEN AI</span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; 2026 Pabrik Konten AI. All rights reserved. Built for creators.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
