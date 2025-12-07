import { useState } from 'react';
import { ArrowLeft, Crown, Gavel, Megaphone, Shield, Users, Loader2, User } from 'lucide-react';
import adaptLogo from '../../adaptlogo.png';

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

function Login({ onNavigate, onLogin, onDemoLogin, onOAuthSignIn, authLoading, authError }) {
  const [showDemoMode, setShowDemoMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="border-2 border-gray-900 bg-white p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                AUTHENTICATE
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to enter the arena
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-6 p-3 bg-red-50 border-2 border-red-200 text-red-700 text-sm">
                {authError}
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3">
              {/* Google Sign In */}
              <button
                type="button"
                onClick={() => onOAuthSignIn?.('google')}
                disabled={authLoading}
                className="w-full py-3 px-4 border-2 border-gray-200 bg-white
                           hover:border-gray-400 hover:bg-gray-50 transition-all
                           flex items-center justify-center gap-3 font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <>
                    <GoogleIcon />
                    <span className="text-gray-700">Continue with Google</span>
                  </>
                )}
              </button>

            </div>

            {/* Info text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing in, you agree to participate in HackDay 2026
            </p>
          </div>

          {/* Demo Mode Toggle */}
          <div className="mt-4 sm:mt-6">
            <button
              type="button"
              onClick={() => setShowDemoMode(!showDemoMode)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 
                         transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              {showDemoMode ? 'Hide Demo Mode' : 'Use Demo Mode (for testing)'}
            </button>

            {/* Demo Mode - Role Selection */}
            {showDemoMode && (
              <div className="mt-3 p-4 border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                    Select Demo Role
                  </span>
                </div>
                
                <div className="space-y-3">
                  {/* Participant / Team Member */}
                  <button
                    type="button"
                    onClick={() => {
                      onDemoLogin({
                        id: 202,
                        name: 'Casey Brooks',
                        email: 'casey.brooks@company.com',
                        skills: ['Frontend Development', 'UI/UX Design'],
                        allegiance: 'human',
                        role: 'participant',
                      });
                    }}
                    className="w-full py-3 bg-green-600 text-white font-bold
                               hover:bg-green-700 transition-colors text-sm
                               flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Team Member
                  </button>
                  
                  {/* Participant / Captain */}
                  <button
                    type="button"
                    onClick={() => {
                      onDemoLogin({
                        id: 101,
                        name: 'Alex Chen',
                        email: 'alex.chen@company.com',
                        skills: ['Backend Development', 'DevOps'],
                        allegiance: 'ai',
                        role: 'participant',
                      });
                    }}
                    className="w-full py-3 bg-cyan-500 text-white font-bold
                               hover:bg-cyan-600 transition-colors text-sm
                               flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    Team Captain
                  </button>
                  
                  {/* Ambassador */}
                  <button
                    type="button"
                    onClick={() => {
                      onDemoLogin({
                        id: 2001,
                        name: 'Sarah Mitchell',
                        email: 'sarah.mitchell@company.com',
                        skills: ['Product Management'],
                        allegiance: 'human',
                        role: 'ambassador',
                      });
                    }}
                    className="w-full py-3 bg-green-500 text-white font-bold
                               hover:bg-green-600 transition-colors text-sm
                               flex items-center justify-center gap-2"
                  >
                    <Megaphone className="w-4 h-4" />
                    Ambassador
                  </button>
                  
                  {/* Judge */}
                  <button
                    type="button"
                    onClick={() => {
                      onDemoLogin({
                        id: 3001,
                        name: 'Dr. Elena Vasquez',
                        email: 'elena.vasquez@company.com',
                        skills: [],
                        allegiance: 'neutral',
                        role: 'judge',
                      });
                    }}
                    className="w-full py-3 bg-amber-500 text-white font-bold
                               hover:bg-amber-600 transition-colors text-sm
                               flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-4 h-4" />
                    Judge
                  </button>
                  
                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => {
                      onDemoLogin({
                        id: 4001,
                        name: 'HackDay Admin',
                        email: 'admin@company.com',
                        skills: [],
                        allegiance: 'neutral',
                        role: 'admin',
                      });
                    }}
                    className="w-full py-3 bg-purple-600 text-white font-bold
                               hover:bg-purple-700 transition-colors text-sm
                               flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Demo mode uses mock data — no authentication required
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
