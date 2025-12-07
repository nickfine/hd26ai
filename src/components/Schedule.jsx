import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Code,
  Trophy,
  Mic,
  Flag,
  Moon,
  Sun,
  Sparkles,
  Download,
  ExternalLink,
  Users,
} from 'lucide-react';
import AppLayout from './AppLayout';

// ============================================================================
// SCHEDULE DATA - Remote Hackathon
// Pre-event: June 1st onwards | Hacking: June 21-22, 2026
// ============================================================================

const SCHEDULE_DATA = {
  preEvent: {
    date: '2026-06-01',
    label: 'Pre-Event',
    subtitle: 'June 1st - 20th',
    events: [
      {
        id: 'pre-1',
        time: '09:00',
        endTime: '10:00',
        title: 'HackDay 2026 Launch',
        description: 'Official announcement and kickoff! Registration opens, theme revealed, and rules published.',
        location: 'Online - Live Stream',
        category: 'ceremony',
        icon: Flag,
        date: 'June 1st',
      },
      {
        id: 'pre-2',
        time: '09:00',
        endTime: '23:59',
        title: 'Registration & Team Formation Opens',
        description: 'Sign up, choose your allegiance (Human or AI), and start forming teams. Browse the marketplace to find teammates.',
        location: 'HackDay Portal',
        category: 'logistics',
        icon: Users,
        date: 'June 1st',
      },
      {
        id: 'pre-3',
        time: '12:00',
        endTime: '13:00',
        title: 'Rules & Guidelines Webinar',
        description: 'Deep dive into the rules for Human and AI teams. Q&A session with organizers.',
        location: 'Online - Zoom',
        category: 'social',
        icon: Mic,
        date: 'June 5th',
      },
      {
        id: 'pre-4',
        time: '15:00',
        endTime: '16:00',
        title: 'Team Matching Social',
        description: 'Virtual networking event for free agents looking for teams. Speed-dating style introductions.',
        location: 'Online - Gather.town',
        category: 'social',
        icon: Users,
        date: 'June 10th',
      },
      {
        id: 'pre-5',
        time: '23:59',
        endTime: '23:59',
        title: 'Team Formation Deadline',
        description: 'Final deadline to form teams and lock in your allegiance. No changes after this date.',
        location: 'HackDay Portal',
        category: 'deadline',
        icon: Clock,
        date: 'June 15th',
      },
      {
        id: 'pre-6',
        time: '14:00',
        endTime: '15:00',
        title: 'Pre-Hack Tech Check',
        description: 'Test your setup, verify access to collaboration tools, and meet your team virtually.',
        location: 'Online - Slack/Discord',
        category: 'logistics',
        icon: Code,
        date: 'June 18th',
      },
    ],
  },
  day1: {
    date: '2026-06-21',
    label: 'Day 1',
    subtitle: 'Sunday, June 21st',
    events: [
      {
        id: 'd1-1',
        time: '09:00',
        endTime: '10:00',
        title: 'Opening Ceremony',
        description: 'Welcome address, final rules reminder, and the official countdown to hacking. Join the live stream!',
        location: 'Online - Live Stream',
        category: 'ceremony',
        icon: Flag,
      },
      {
        id: 'd1-2',
        time: '10:00',
        endTime: '10:00',
        title: 'Hacking Begins!',
        description: 'The clock starts now! 48 hours to build something amazing. May the best team win!',
        location: 'Remote - Your Workspace',
        category: 'hacking',
        icon: Code,
      },
      {
        id: 'd1-3',
        time: '12:00',
        endTime: '12:30',
        title: 'Midday Check-in',
        description: 'Quick standup on Slack. Share what you\'re working on, ask for help, connect with other teams.',
        location: 'Online - Slack',
        category: 'social',
        icon: Users,
      },
      {
        id: 'd1-4',
        time: '15:00',
        endTime: '16:00',
        title: 'Office Hours: Mentors Available',
        description: 'Book 15-minute slots with mentors for technical guidance, feedback, or brainstorming.',
        location: 'Online - Calendly/Zoom',
        category: 'social',
        icon: Sparkles,
      },
      {
        id: 'd1-5',
        time: '18:00',
        endTime: '18:30',
        title: 'Evening Standup',
        description: 'Share your progress! Optional video call for teams to demo early prototypes.',
        location: 'Online - Zoom',
        category: 'social',
        icon: Mic,
      },
      {
        id: 'd1-6',
        time: '21:00',
        endTime: '22:00',
        title: 'Night Owl Hangout',
        description: 'Casual virtual hangout for those hacking through the night. Music, chat, and co-working vibes.',
        location: 'Online - Discord',
        category: 'break',
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
        time: '09:00',
        endTime: '09:30',
        title: 'Morning Kickoff',
        description: 'Day 2 begins! Quick announcements, submission reminders, and final stretch motivation.',
        location: 'Online - Live Stream',
        category: 'ceremony',
        icon: Sun,
      },
      {
        id: 'd2-2',
        time: '09:00',
        endTime: '10:00',
        title: 'Final Office Hours',
        description: 'Last chance to get mentor feedback before code freeze. Book your slot early!',
        location: 'Online - Calendly/Zoom',
        category: 'social',
        icon: Sparkles,
      },
      {
        id: 'd2-3',
        time: '09:00',
        endTime: '09:00',
        title: 'Code Freeze Warning',
        description: 'One hour until submissions close! Finalize your code, record your demo, prepare your pitch.',
        location: 'Online - Slack Reminder',
        category: 'hacking',
        icon: Clock,
      },
      {
        id: 'd2-4',
        time: '10:00',
        endTime: '10:00',
        title: 'Submissions Due',
        description: 'All projects must be submitted via the portal. Include: repo link, demo video, and description.',
        location: 'HackDay Portal',
        category: 'deadline',
        icon: Flag,
      },
      {
        id: 'd2-5',
        time: '10:00',
        endTime: '12:00',
        title: 'Project Gallery Opens',
        description: 'Browse all submissions! Watch demo videos, leave comments, and vote for People\'s Champion.',
        location: 'HackDay Portal',
        category: 'presentation',
        icon: Trophy,
      },
      {
        id: 'd2-6',
        time: '13:00',
        endTime: '16:00',
        title: 'Live Presentations',
        description: 'Teams present their projects live to judges and participants. 3 minutes per team + Q&A.',
        location: 'Online - Live Stream',
        category: 'presentation',
        icon: Mic,
      },
      {
        id: 'd2-7',
        time: '16:00',
        endTime: '17:00',
        title: 'Judging & Voting',
        description: 'Judges deliberate while participants cast final votes for People\'s Champion.',
        location: 'HackDay Portal',
        category: 'judging',
        icon: Trophy,
      },
      {
        id: 'd2-8',
        time: '17:00',
        endTime: '18:00',
        title: 'Awards Ceremony',
        description: 'Winners announced! Grand Champion, Best Human Team, Best AI Team, and People\'s Champion.',
        location: 'Online - Live Stream',
        category: 'ceremony',
        icon: Trophy,
      },
      {
        id: 'd2-9',
        time: '18:00',
        endTime: '19:00',
        title: 'Closing Celebration',
        description: 'Thank you to all participants! Virtual celebration, shoutouts, and wrap-up.',
        location: 'Online - Zoom Party',
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

// Pre-event date mapping
const PRE_EVENT_DATES = {
  'pre-1': '2026-06-01',
  'pre-2': '2026-06-01',
  'pre-3': '2026-06-05',
  'pre-4': '2026-06-10',
  'pre-5': '2026-06-15',
  'pre-6': '2026-06-18',
};

/**
 * Generate ICS file content for all events
 */
function generateICSContent() {
  const events = [];
  
  // Add Pre-event items
  SCHEDULE_DATA.preEvent.events.forEach(event => {
    events.push({
      ...event,
      date: PRE_EVENT_DATES[event.id] || SCHEDULE_DATA.preEvent.date,
    });
  });
  
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

function Schedule({ user, teams, allegianceStyle, onNavigate, eventPhase }) {
  const [activeDay, setActiveDay] = useState('preEvent');

  const currentDayData = SCHEDULE_DATA[activeDay];
  const isPreEvent = activeDay === 'preEvent';

  const handleAddToCalendar = (event) => {
    // For pre-event items, use the specific date mapping
    let eventDate = currentDayData.date;
    if (isPreEvent && PRE_EVENT_DATES[event.id]) {
      eventDate = PRE_EVENT_DATES[event.id];
    }
    const url = generateGoogleCalendarUrl(event, eventDate);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddAllToCalendar = () => {
    downloadAllEventsAsICS();
  };

  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="schedule"
    >
      <div className="p-4 sm:p-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-900 rounded-full mb-4">
            <Calendar className="w-5 h-5" />
            <span className="font-bold text-sm">JUNE 1ST - 22ND, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            EVENT SCHEDULE
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From launch to celebration — your complete guide to HackDay 2026. 
            Team formation starts June 1st, hacking kicks off June 21st!
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
                      {isPreEvent && event.date && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs 
                                          font-bold rounded bg-gray-900 text-white">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs 
                                        font-bold rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
                        <Clock className="w-3 h-3" />
                        {event.time}{event.time !== event.endTime ? ` - ${event.endTime}` : ''}
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
              <span className="font-bold text-gray-900">Remote Hackathon</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              All times are in your local timezone. Hack from anywhere in the world!
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
      </div>
    </AppLayout>
  );
}

export default Schedule;

