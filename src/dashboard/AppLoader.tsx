import React, { Suspense, lazy } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';

interface AppLoaderProps {
  appId: string;
  onBack: () => void;
}

// Dynamic import map
const appComponents: Record<string, React.LazyExoticComponent<any>> = {
  'car-restoration': lazy(() => import('../apps/CarRestoration')),
  // Add other apps here as they are created
};

export const AppLoader: React.FC<AppLoaderProps> = ({ appId, onBack }) => {
  const Component = appComponents[appId];

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <h2 className="text-2xl font-bold mb-4">App Not Found</h2>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">
            PABRIK KONTEN AI // {appId}
          </div>
        </div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">Loading Application...</p>
          </div>
        }>
          <Component />
        </Suspense>
      </div>
    </div>
  );
};
