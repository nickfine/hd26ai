import { useState } from 'react';
import {
  Users,
  User,
  Heart,
  Cpu,
  Calendar,
  Trophy,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Vote,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG } from '../data/mockData';
import AppLayout from './AppLayout';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITY_FEED = [
  { id: 1, type: 'join', user: 'Maya Rodriguez', callsign: 'HTML Hotshot', team: 'Neural Nexus', side: 'ai', time: '2 min ago' },
  { id: 2, type: 'create', user: 'Jordan Lee', callsign: 'Prompt Wizard', team: 'Quantum Collective', side: 'ai', time: '5 min ago' },
  { id: 3, type: 'join', user: 'Casey Brooks', callsign: 'CSS Wizard', team: 'Human Touch', side: 'human', time: '12 min ago' },
  { id: 4, type: 'allegiance', user: 'River Chen', callsign: 'Stack Overflow', side: 'ai', time: '15 min ago' },
  { id: 5, type: 'create', user: 'Pat O\'Brien', callsign: 'Circuit Breaker', team: 'Carbon Coalition', side: 'human', time: '23 min ago' },
  { id: 6, type: 'join', user: 'Skyler Vance', callsign: 'Data Drifter', team: 'Digital Overlords', side: 'ai', time: '31 min ago' },
];

// Helper to format name with callsign: "First 'Callsign' Last"
const formatNameWithCallsign = (name, callsign) => {
  if (!callsign) return name;
  const parts = name.split(' ');
  if (parts.length < 2) return name;
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, callsign, lastName };
};

const MOCK_SCHEDULE = [
  { id: 1, time: '10:00 AM', title: 'Opening Ceremony', description: 'Kickoff & rules explanation' },
  { id: 2, time: '10:30 AM', title: 'Team Formation Deadline', description: 'Final team submissions' },
  { id: 3, time: '11:00 AM', title: 'Hacking Begins', description: 'Start building!' },
  { id: 4, time: '5:00 PM', title: 'Submission Deadline', description: 'All projects due' },
];

const MOCK_AWARDS = [
  { id: 1, title: 'Grand HackDay Champion', prize: 'T-Shirts + Digital Swag', icon: Trophy, description: 'Champion t-shirts, Zoom backgrounds, Slack avatars' },
  { id: 2, title: 'Best Human Team', prize: 'Digital Swag', icon: Heart, description: 'Human team Zoom backgrounds & Slack avatars' },
  { id: 3, title: 'Best AI Team', prize: 'Digital Swag', icon: Cpu, description: 'AI team Zoom backgrounds & Slack avatars' },
];

const MOCK_FAQ = [
  { id: 1, question: 'How do teams work?', answer: 'Teams can have 2-6 members. You can join an existing team or create your own. All team members must choose the same allegiance (Human or AI).' },
  { id: 2, question: 'What can I build?', answer: 'Anything! Web apps, mobile apps, APIs, games, tools - as long as it fits the theme. AI-side teams are encouraged to use AI tools heavily, while Human-side teams should minimize AI assistance.' },
  { id: 3, question: 'How is judging done?', answer: 'Projects are judged on innovation, execution, design, and theme adherence. There will be peer voting for People\'s Choice award.' },
  { id: 4, question: 'Can I switch allegiances?', answer: 'You can switch until team formation deadline. After that, your allegiance is locked for the duration of the hackathon.' },
];

// ============================================================================
// COMPONENT
// ============================================================================

function Dashboard({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  eventPhase = 'voting',
}) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="dashboard"
    >
      <div className="p-4 sm:p-6">
          {/* Bento Grid */}
          {/* 
            PROMO TILES: Placeholder slots for promotional graphics.
            Replace placeholder content with actual images using:
            <img src={promoImage} alt="Promo" className="w-full h-full object-cover" />
            
            Future: Import promo images and randomly assign to slots:
            const PROMO_IMAGES = [promo1, promo2, promo3, ...];
            const shuffled = [...PROMO_IMAGES].sort(() => Math.random() - 0.5);
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Promo Tile 1 - Always visible, full width */}
            <div className="md:col-span-2 border-2 border-dashed border-gray-300 bg-gradient-to-br from-cyan-50 to-teal-50 
                            flex items-center justify-center min-h-[200px] relative overflow-hidden"
                 data-promo-slot="1">
              {/* Placeholder - Replace with actual promo graphic */}
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-cyan-300" />
                </div>
                <p className="text-sm text-cyan-400 font-medium">Promo Graphic 1</p>
                <p className="text-xs text-cyan-300 mt-1">Coming Soon</p>
              </div>
            </div>

            {/* Team Finder Feature Box */}
            <div className="p-5 border-2 border-gray-900 bg-white">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                Team Finder
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Find Your Squad</h3>
              <p className="text-sm text-gray-500 mb-4">
                Browse open teams looking for members or discover free agents with matching skills.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace', { tab: 'teams' })}
                  className="flex-1 py-3 bg-gray-900 text-white font-bold text-sm
                             hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Browse Teams
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace', { tab: 'people' })}
                  className="flex-1 py-3 border-2 border-gray-900 text-gray-900 font-bold text-sm
                             hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Free Agents
                </button>
              </div>
            </div>

            {/* Project Gallery Feature Box - Only show during voting phase */}
            {eventPhase === 'voting' && (
              <div className="p-5 border-2 border-amber-400 bg-amber-50">
                <div className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-2">
                  Project Gallery
                </div>
                <h3 className="text-xl font-black text-amber-900 mb-3">Vote for Projects</h3>
                <p className="text-sm text-amber-700 mb-4">
                  Browse all submitted hackathon projects and vote for your favorites!
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('voting')}
                  className="w-full py-3 bg-amber-400 text-amber-900 font-bold text-sm
                             hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  Browse &amp; Vote
                </button>
              </div>
            )}

            {/* Live Activity Feed Widget */}
            <div className="p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Live Activity
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Live
                </div>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {MOCK_ACTIVITY_FEED.map((activity) => {
                  const config = ALLEGIANCE_CONFIG[activity.side] || ALLEGIANCE_CONFIG.neutral;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div
                        className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs
                          ${activity.side === 'ai' ? '' : 'rounded-full'}`}
                        style={{ backgroundColor: config.bgColor }}
                      >
                        {activity.side === 'ai' 
                          ? <Cpu className="w-3 h-3" style={{ color: config.color }} />
                          : <Heart className="w-3 h-3" style={{ color: config.color }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-bold text-gray-900 inline-flex items-center gap-1 flex-wrap ${activity.side === 'ai' ? 'font-mono' : ''}`}>
                          {(() => {
                            const formatted = formatNameWithCallsign(activity.user, activity.callsign);
                            if (typeof formatted === 'string') return formatted;
                            return (
                              <>
                                {formatted.firstName}
                                <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full border bg-white
                                    ${activity.side === 'ai' 
                                      ? 'border-cyan-500 text-cyan-700' 
                                      : activity.side === 'human' 
                                        ? 'border-green-500 text-green-700' 
                                        : 'border-gray-400 text-gray-600'}`}>
                                  {formatted.callsign}
                                </span>
                                {formatted.lastName}
                              </>
                            );
                          })()}
                        </span>
                        {activity.type === 'join' && (
                          <span className="text-gray-500"> joined </span>
                        )}
                        {activity.type === 'create' && (
                          <span className="text-gray-500"> created </span>
                        )}
                        {activity.type === 'allegiance' && (
                          <span className="text-gray-500"> chose {activity.side.toUpperCase()} side</span>
                        )}
                        {activity.team && (
                          <span className="font-bold" style={{ color: config.color }}>
                            {activity.team}
                          </span>
                        )}
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schedule Preview Widget */}
            <div className="p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Schedule Preview
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                {MOCK_SCHEDULE.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex gap-3 pb-3 ${index < MOCK_SCHEDULE.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="w-16 flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-gray-900">{item.time}</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 
                           flex items-center justify-center gap-1"
              >
                View Full Schedule
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Awards List Widget */}
            <div className="p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Awards & Prizes
                </div>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-3">
                {MOCK_AWARDS.map((award) => {
                  const Icon = award.icon;
                  const isAI = award.title.includes('AI');
                  const isHuman = award.title.includes('Human');
                  const isChampion = award.title.includes('Champion');
                  return (
                    <div 
                      key={award.id} 
                      className={`p-3 border-2 transition-all hover:shadow-md flex items-center gap-3
                        ${isAI ? 'border-cyan-300 border-dashed' : isHuman ? 'border-green-300 rounded-xl' : isChampion ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}
                    >
                      <Icon className={`w-8 h-8 flex-shrink-0
                        ${isAI ? 'text-cyan-600' : isHuman ? 'text-green-600' : 'text-amber-500'}`} 
                      />
                      <div className="min-w-0">
                        <div className={`font-bold text-sm ${isAI ? 'font-mono text-cyan-700' : isHuman ? 'text-green-700' : 'text-amber-700'}`}>
                          {award.title}
                        </div>
                        <div className="text-xs text-gray-500">{award.prize}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo Tile 2 - Shows in last slot when voting tile is hidden */}
            {eventPhase !== 'voting' && (
              <div className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-purple-50 to-indigo-50 
                              flex items-center justify-center min-h-[200px] relative overflow-hidden"
                   data-promo-slot="2">
                {/* Placeholder - Replace with actual promo graphic */}
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-purple-300" />
                  </div>
                  <p className="text-sm text-purple-400 font-medium">Promo Graphic 2</p>
                  <p className="text-xs text-purple-300 mt-1">Coming Soon</p>
                </div>
              </div>
            )}

            {/* FAQ Widget */}
            <div className="md:col-span-2 p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Frequently Asked Questions
                </div>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {MOCK_FAQ.map((faq) => (
                  <div key={faq.id} className="border border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left
                                 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-sm text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id 
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </AppLayout>
  );
}

export default Dashboard;
