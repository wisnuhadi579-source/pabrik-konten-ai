import React from 'react';
import { Tool } from '../types/app';
import { ExternalLink, Play, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ToolCardProps {
  tool: Tool;
  onClick: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-emerald-500/30 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]"
    >
      {/* Image Preview */}
      <div className="aspect-video w-full overflow-hidden relative">
        <img 
          src={tool.images[0]} 
          alt={tool.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
        
        {/* Plan Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            tool.plan === 'Premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {tool.plan}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-emerald-500/50 transition-colors">
            <tool.icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex gap-1">
            {tool.labels.map((label, idx) => (
              <span key={idx} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                {label}
              </span>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {tool.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.features.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-1 text-[11px] text-gray-500">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              {feature}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {tool.isComingSoon ? (
            <button disabled className="flex-1 py-2 bg-white/5 text-gray-500 text-sm font-medium rounded-xl border border-white/5 cursor-not-allowed">
              Coming Soon
            </button>
          ) : (
            <>
              <button 
                onClick={() => onClick(tool.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-bold rounded-xl transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                Buka Alat
              </button>
              <a 
                href={tool.tutorialLink}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl border border-white/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
