import { Cpu, Heart, Zap } from 'lucide-react';

function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-gray-900" />
            <span className="font-bold text-lg tracking-tight">HACKDAY 2026</span>
          </div>
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            The Arena Awaits
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* VS Badge */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-cyan-500">
              <Cpu className="w-10 h-10" />
              <span className="text-2xl font-mono font-bold">AI</span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-gray-900 flex items-center justify-center">
              <span className="text-xl font-black">VS</span>
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <span className="text-2xl font-bold">HUMAN</span>
              <Heart className="w-10 h-10" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tight">
            THE WAR IS ON
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choose your side. Build your team. Ship something legendary.
          </p>
          <p className="text-sm text-gray-400 mb-12">
            Corporate HackDay 2026 — Where allegiances are tested
          </p>

          {/* CTA */}
          <button
            onClick={() => onNavigate('login')}
            className="group relative px-12 py-4 bg-gray-900 text-white font-bold text-lg 
                       hover:bg-gray-800 transition-all duration-200
                       border-2 border-gray-900 hover:border-gray-700"
          >
            <span className="relative z-10">ENTER THE ARENA</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 
                            opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div className="border border-gray-200 p-4">
              <div className="text-3xl font-bold text-gray-900">48</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
            </div>
            <div className="border border-gray-200 p-4">
              <div className="text-3xl font-bold text-gray-900">∞</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Possibilities</div>
            </div>
            <div className="border border-gray-200 p-4">
              <div className="text-3xl font-bold text-gray-900">1</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Winner</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto text-center text-xs text-gray-400">
          WIREFRAME PROTOTYPE — LOW FIDELITY
        </div>
      </footer>
    </div>
  );
}

export default Landing;

