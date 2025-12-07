import { useState } from 'react';
import { ArrowLeft, Cpu, Heart, Scale, Check, Zap } from 'lucide-react';
import { SKILLS, ALLEGIANCE_CONFIG } from '../data/mockData';

function Onboarding({ user, updateUser, onNavigate }) {
  const [name, setName] = useState(user?.name || '');
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [allegiance, setAllegiance] = useState(user?.allegiance || 'neutral');

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = () => {
    updateUser({
      name,
      skills: selectedSkills,
      allegiance,
    });
    onNavigate('dashboard');
  };

  const config = ALLEGIANCE_CONFIG[allegiance];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-900" />
            <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Card with dynamic border */}
          <div
            className={`bg-white p-8 transition-all duration-300 ${config.borderRadius} ${config.borderStyle}`}
            style={{ borderColor: config.borderColor }}
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                CONFIGURE YOUR AGENT
              </h1>
              <p className="text-sm text-gray-500">
                Set up your profile and declare your allegiance
              </p>
            </div>

            <div className="space-y-8">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your callsign"
                  className="w-full px-4 py-3 border-2 border-gray-200 
                             focus:border-gray-900 focus:outline-none
                             text-gray-900 placeholder:text-gray-400
                             transition-colors"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                  Areas of Interest
                  <span className="font-normal text-gray-400 ml-2">
                    (Select all that apply)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-2 text-sm text-left border-2 transition-all
                        ${
                          selectedSkills.includes(skill)
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedSkills.includes(skill) && (
                          <Check className="w-4 h-4" />
                        )}
                        {skill}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Allegiance Toggle - CRITICAL FEATURE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                  Declare Allegiance
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {/* Human */}
                  <button
                    onClick={() => setAllegiance('human')}
                    className={`p-4 border-2 transition-all duration-200 rounded-xl
                      ${
                        allegiance === 'human'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Heart
                      className={`w-8 h-8 mx-auto mb-2 ${
                        allegiance === 'human' ? 'text-green-500' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-sm font-bold ${
                        allegiance === 'human' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      HUMAN
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Organic creativity
                    </div>
                  </button>

                  {/* Neutral */}
                  <button
                    onClick={() => setAllegiance('neutral')}
                    className={`p-4 border-2 transition-all duration-200 rounded-lg
                      ${
                        allegiance === 'neutral'
                          ? 'border-gray-500 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Scale
                      className={`w-8 h-8 mx-auto mb-2 ${
                        allegiance === 'neutral' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-sm font-bold ${
                        allegiance === 'neutral' ? 'text-gray-600' : 'text-gray-600'
                      }`}
                    >
                      NEUTRAL
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Free agent
                    </div>
                  </button>

                  {/* AI */}
                  <button
                    onClick={() => setAllegiance('ai')}
                    className={`p-4 border-2 transition-all duration-200 rounded-sm
                      ${
                        allegiance === 'ai'
                          ? 'border-cyan-500 bg-cyan-50 border-dashed'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Cpu
                      className={`w-8 h-8 mx-auto mb-2 ${
                        allegiance === 'ai' ? 'text-cyan-500' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-sm font-bold font-mono ${
                        allegiance === 'ai' ? 'text-cyan-600' : 'text-gray-600'
                      }`}
                    >
                      AI
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Silicon supremacy
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="w-full py-4 bg-gray-900 text-white font-bold
                           hover:bg-gray-800 transition-colors
                           border-2 border-gray-900
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                JOIN AS FREE AGENT
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Your allegiance affects team recommendations in the marketplace
          </p>
        </div>
      </main>
    </div>
  );
}

export default Onboarding;

