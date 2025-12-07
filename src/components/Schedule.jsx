import { useState } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  ArrowLeft,
  Heart,
  Cpu,
  Calendar,
  Clock,
  MapPin,
  Users,
  Code,
  Trophy,
  Coffee,
  Utensils,
  Mic,
  Flag,
  Moon,
  Sun,
  Sparkles,
  Download,
  ExternalLink,
} from 'lucide-react';

// ============================================================================
// SCHEDULE DATA - June 21-22, 2026
// ============================================================================

const SCHEDULE_DATA = {
  day1: {
    date: '2026-06-21',
    label: 'Day 1',
    subtitle: 'Sunday, June 21st',
    events: [
      {
        id: 'd1-1',
        time: '08:00',
        endTime: '09:00',
        title: 'Registration & Check-in',
        description: 'Collect your badge, swag bag, and get settled. Meet fellow hackers!',
        location: 'Main Lobby',
        category: 'logistics',
        icon: Users,
      },
      {
        id: 'd1-2',
        time: '09:00',
        endTime: '10:00',
        title: 'Opening Ceremony',
        description: 'Welcome address, theme reveal, rules overview, and the official start of HackDay 2026.',
        location: 'Main Auditorium',
        category: 'ceremony',
        icon: Flag,
      },
      {
        id: 'd1-3',
        time: '10:00',
        endTime: '11:00',
        title: 'Team Formation',
        description: 'Find your squad! Network with other participants and form teams. Choose your allegiance: Human or AI.',
        location: 'Collaboration Zone',
        category: 'social',
        icon: Users,
      },
      {
        id: 'd1-4',
        time: '11:00',
        endTime: '11:30',
        title: 'Hacking Begins!',
        description: 'The official start of the 48-hour hackathon. May the best team win!',
        location: 'Hacking Spaces',
        category: 'hacking',
        icon: Code,
      },
      {
        id: 'd1-5',
        time: '12:30',
        endTime: '13:30',
        title: 'Lunch',
        description: 'Fuel up with a variety of food options. Vegetarian and vegan options available.',
        location: 'Cafeteria',
        category: 'meal',
        icon: Utensils,
      },
      {
        id: 'd1-6',
        time: '15:00',
        endTime: '15:30',
        title: 'Afternoon Coffee Break',
        description: 'Recharge with coffee, tea, and snacks. Quick networking opportunity.',
        location: 'Break Area',
        category: 'break',
        icon: Coffee,
      },
      {
        id: 'd1-7',
        time: '18:30',
        endTime: '19:30',
        title: 'Dinner',
        description: 'Hearty dinner to keep you going through the night. Multiple cuisine options.',
        location: 'Cafeteria',
        category: 'meal',
        icon: Utensils,
      },
      {
        id: 'd1-8',
        time: '21:00',
        endTime: '21:30',
        title: 'Evening Check-in',
        description: 'Optional mentor sessions available. Share your progress and get guidance.',
        location: 'Mentor Lounge',
        category: 'social',
        icon: Sparkles,
      },
      {
        id: 'd1-9',
        time: '00:00',
        endTime: '00:30',
        title: 'Midnight Snacks',
        description: 'Pizza, energy drinks, and late-night fuel for the dedicated hackers.',
        location: 'Break Area',
        category: 'meal',
        icon: Moon,
      },
    ],
  },
  day2: {
    date: '2026-06-22',
    label: 'Day 2',
    subtitle: 'Monday, June 22nd',
    events: [
      {
        id: 'd2-1',
        time: '07:00',
        endTime: '08:30',
        title: 'Breakfast',
        description: 'Start the final day right. Full breakfast spread available.',
        location: 'Cafeteria',
        category: 'meal',
        icon: Sun,
      },
      {
        id: 'd2-2',
        time: '09:00',
        endTime: '09:30',
        title: 'Morning Energizer',
        description: 'Quick stretch session and announcements. Last push begins!',
        location: 'Main Auditorium',
        category: 'social',
        icon: Sparkles,
      },
      {
        id: 'd2-3',
        time: '11:00',
        endTime: '11:00',
        title: 'Code Freeze Warning',
        description: 'One hour until submissions close! Finalize your code and prepare your demo.',
        location: 'All Spaces',
        category: 'hacking',
        icon: Clock,
      },
      {
        id: 'd2-4',
        time: '12:00',
        endTime: '12:00',
        title: 'Submissions Due',
        description: 'All projects must be submitted by noon. No late submissions accepted.',
        location: 'Online Portal',
        category: 'deadline',
        icon: Flag,
      },
      {
        id: 'd2-5',
        time: '12:00',
        endTime: '13:00',
        title: 'Lunch & Prep Time',
        description: 'Enjoy lunch while preparing your presentation slides and demo.',
        location: 'Cafeteria',
        category: 'meal',
        icon: Utensils,
      },
      {
        id: 'd2-6',
        time: '13:00',
        endTime: '16:00',
        title: 'Project Presentations',
        description: 'Each team presents their project to judges and participants. 3 minutes per team.',
        location: 'Main Auditorium',
        category: 'presentation',
        icon: Mic,
      },
      {
        id: 'd2-7',
        time: '16:00',
        endTime: '17:00',
        title: 'Judging Deliberation',
        description: 'Judges review all submissions. Participants can explore other projects.',
        location: 'Demo Hall',
        category: 'judging',
        icon: Trophy,
      },
      {
        id: 'd2-8',
        time: '17:00',
        endTime: '18:00',
        title: 'Awards Ceremony',
        description: 'Announcement of winners: Grand Champion, Best Human Team, Best AI Team, and People\'s Champion.',
        location: 'Main Auditorium',
        category: 'ceremony',
        icon: Trophy,
      },
      {
        id: 'd2-9',
        time: '18:00',
        endTime: '18:30',
        title: 'Closing Remarks',
        description: 'Thank you to all participants! Networking and celebrations continue.',
        location: 'Main Auditorium',
        category: 'ceremony',
        icon: Flag,
      },
    ],
  },
};

// Category styling
const CATEGORY_STYLES = {
  logistics: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' },
  ceremony: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  social: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  hacking: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-700' },
  meal: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  break: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700' },
  deadline: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
  presentation: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  judging: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700' },
};

// ============================================================================
// CALENDAR HELPERS
// ============================================================================

/**
 * Format date and time for Google Calendar URL
 * Google Calendar expects: YYYYMMDDTHHMMSS (in UTC or with timezone)
 */
function formatDateTimeForGoogle(date, time) {
  const [hours, minutes] = time.split(':');
  const dateObj = new Date(date);
  dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
  // Format as YYYYMMDDTHHMMSS
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}T${hour}${min}00`;
}

/**
 * Generate Google Calendar URL for a single event
 */
function generateGoogleCalendarUrl(event, date) {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const startDateTime = formatDateTimeForGoogle(date, event.time);
  const endDateTime = formatDateTimeForGoogle(date, event.endTime);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `HackDay 2026: ${event.title}`,
    dates: `${startDateTime}/${endDateTime}`,
    details: event.description,
    location: event.location,
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Format date for ICS file (YYYYMMDDTHHMMSS)
 */
function formatDateTimeForICS(date, time) {
  const [hours, minutes] = time.split(':');
  const dateObj = new Date(date);
  dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}T${hour}${min}00`;
}

/**
 * Generate ICS file content for all events
 */
function generateICSContent() {
  const events = [];
  
  // Add Day 1 events
  SCHEDULE_DATA.day1.events.forEach(event => {
    events.push({
      ...event,
      date: SCHEDULE_DATA.day1.date,
    });
  });
  
  // Add Day 2 events
  SCHEDULE_DATA.day2.events.forEach(event => {
    events.push({
      ...event,
      date: SCHEDULE_DATA.day2.date,
    });
  });
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HackDay 2026//Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HackDay 2026 Schedule',
  ];
  
  events.forEach(event => {
    const uid = `${event.id}@hackday2026.com`;
    const dtStart = formatDateTimeForICS(event.date, event.time);
    const dtEnd = formatDateTimeForICS(event.date, event.endTime);
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:HackDay 2026: ${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      'END:VEVENT'
    );
  });
  
  icsContent.push('END:VCALENDAR');
  
  return icsContent.join('\r\n');
}

/**
 * Download all events as ICS file
 */
function downloadAllEventsAsICS() {
  const icsContent = generateICSContent();
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hackday-2026-schedule.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// COMPONENT
// ============================================================================

function Schedule({ user, allegianceStyle, onNavigate }) {
  const [activeDay, setActiveDay] = useState('day1');
  
  const AllegianceIcon = {
    human: Heart,
    neutral: Heart,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  const currentDayData = SCHEDULE_DATA[activeDay];

  const handleAddToCalendar = (event) => {
    const url = generateGoogleCalendarUrl(event, currentDayData.date);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddAllToCalendar = () => {
    downloadAllEventsAsICS();
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${allegianceStyle?.font || 'font-sans'}`}>
      {/* Header */}
      <header
        className="border-b-2 px-4 sm:px-6 py-4 bg-white"
        style={{ borderColor: allegianceStyle?.borderColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Back to Mission Control</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight hidden sm:inline">HACKDAY 2026</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center ${allegianceStyle?.borderRadius}`}
              style={{
                backgroundColor: allegianceStyle?.bgColor,
                border: `2px solid ${allegianceStyle?.borderColor}`,
              }}
            >
              <AllegianceIcon
                className="w-4 h-4"
                style={{ color: allegianceStyle?.color }}
              />
            </div>
            <span className="hidden sm:inline text-sm font-bold text-gray-900">{user?.name}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 rounded-full mb-4">
            <Calendar className="w-5 h-5" />
            <span className="font-bold text-sm">JUNE 21-22, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            EVENT SCHEDULE
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            48 hours of hacking, creating, and competing. Plan your HackDay experience 
            and add events to your calendar.
          </p>
        </div>

        {/* Add All to Calendar Button */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={handleAddAllToCalendar}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold 
                       hover:bg-gray-800 transition-colors rounded-lg shadow-lg"
          >
            <Download className="w-5 h-5" />
            Add All Events to Calendar
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 mb-6">
          {Object.entries(SCHEDULE_DATA).map(([key, day]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveDay(key)}
              className={`flex-1 py-3 px-4 font-bold text-center transition-all border-2 
                ${activeDay === key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
            >
              <div className="text-lg">{day.label}</div>
              <div className={`text-xs ${activeDay === key ? 'text-gray-300' : 'text-gray-500'}`}>
                {day.subtitle}
              </div>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[23px] sm:left-[31px] top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Events */}
          <div className="space-y-4">
            {currentDayData.events.map((event, index) => {
              const Icon = event.icon;
              const categoryStyle = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.logistics;
              
              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline Node */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-white 
                                  flex items-center justify-center shadow-md ${categoryStyle.bg}`}
                    >
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${categoryStyle.text}`} />
                    </div>
                  </div>

                  {/* Event Card */}
                  <div
                    className={`flex-1 p-4 sm:p-5 bg-white border-2 rounded-lg shadow-sm 
                                hover:shadow-md transition-shadow ${categoryStyle.border}`}
                  >
                    {/* Time Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs 
                                        font-bold rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
                        <Clock className="w-3 h-3" />
                        {event.time} - {event.endTime}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs 
                                        font-medium rounded bg-gray-100 text-gray-600`}>
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {event.description}
                    </p>

                    {/* Add to Calendar Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(event)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold 
                                 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Add to Google Calendar
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-10 text-center">
          <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-900">48 Hours of Innovation</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              All times are in local event timezone. Make sure to check in early and stay hydrated!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('rules')}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 
                           hover:bg-gray-200 rounded transition-colors"
              >
                View Rules
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 text-sm font-bold text-white bg-gray-900 
                           hover:bg-gray-800 rounded transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-white mt-8">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-400">
          HACKDAY 2026 — HUMAN VS AI — June 21-22, 2026
        </div>
      </footer>
    </div>
  );
}

export default Schedule;

