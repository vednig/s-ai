import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Studio AI Beta
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Unlimited AI-powered image and video generation
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
