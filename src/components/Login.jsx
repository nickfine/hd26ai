import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Zap, Crown } from 'lucide-react';

function Login({ onNavigate, onLogin, onDemoLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login - just pass the email
    onLogin(email);
    onNavigate('onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
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
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="border-2 border-gray-900 bg-white p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                AUTHENTICATE
              </h1>
              <p className="text-sm text-gray-500">
                Identify yourself to enter the arena
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@company.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 
                               focus:border-gray-900 focus:outline-none
                               text-gray-900 placeholder:text-gray-400
                               transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 
                               focus:border-gray-900 focus:outline-none
                               text-gray-900 placeholder:text-gray-400
                               transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white font-bold
                           hover:bg-gray-800 transition-colors
                           border-2 border-gray-900"
              >
                SIGN IN
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* SSO Mock */}
            <button
              type="button"
              onClick={() => {
                onLogin('sso.user@company.com');
                onNavigate('onboarding');
              }}
              className="w-full py-3 border-2 border-gray-200 text-gray-700 font-medium
                         hover:border-gray-400 transition-colors text-sm"
            >
              Continue with Corporate SSO
            </button>
          </div>

          {/* Demo Captain Login */}
          <div className="mt-6 p-4 border-2 border-dashed border-cyan-400 bg-cyan-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                Demo Mode
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onDemoLogin({
                  id: 101,
                  name: 'Alex Chen',
                  email: 'alex.chen@company.com',
                  skills: ['Backend Development', 'DevOps'],
                  allegiance: 'ai',
                });
              }}
              className="w-full py-3 bg-cyan-500 text-white font-bold
                         hover:bg-cyan-600 transition-colors text-sm
                         flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Login as Captain (Alex Chen)
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Captain of Neural Nexus — AI Side
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            [WIREFRAME] Authentication is mocked for prototype
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;

