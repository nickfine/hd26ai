import { useState, useMemo } from 'react';
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
  Globe,
  Loader2,
} from 'lucide-react';
import AppLayout from './AppLayout';
import {
  getUserTimezone,
  getTimezoneName,
  getTimezoneAbbr,
  convertUKTimeToLocal,
  EVENT_TIMEZONE,
  createUKDate,
  formatDateForICS,
  generateVTIMEZONE,
} from '../lib/timezone';

// ============================================================================
// HELPERS - Transform database milestones to component format
// ============================================================================

/**
 * Get icon component based on title/phase
 */
const getIconComponent = (title, phase) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('launch') || titleLower.includes('opening')) return Flag;
  if (titleLower.includes('registration')) return Users;
  if (titleLower.includes('webinar') || titleLower.includes('rules')) return Mic;
  if (titleLower.includes('social') || titleLower.includes('matching')) return Users;
  if (titleLower.includes('deadline') || titleLower.includes('freeze')) return Clock;
  if (titleLower.includes('tech check')) return Code;
  if (titleLower.includes('ceremony')) return Flag;
  if (titleLower.includes('hacking begins')) return Code;
  if (titleLower.includes('check-in') || titleLower.includes('standup')) return Mic;
  if (titleLower.includes('office hours') || titleLower.includes('mentor')) return Sparkles;
  if (titleLower.includes('night') || titleLower.includes('hangout')) return Moon;
  if (titleLower.includes('morning') || titleLower.includes('kickoff')) return Sun;
  if (titleLower.includes('submission')) return Flag;
  if (titleLower.includes('gallery') || titleLower.includes('browse')) return Trophy;
  if (titleLower.includes('presentation')) return Mic;
  if (titleLower.includes('judging') || titleLower.includes('voting')) return Trophy;
  if (titleLower.includes('award') || titleLower.includes('winner')) return Trophy;
  if (titleLower.includes('celebration') || titleLower.includes('closing')) return Flag;
  return Calendar;
};

/**
 * Get category from title/phase
 */
const getCategory = (title, phase) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('deadline') || titleLower.includes('due')) return 'deadline';
  if (titleLower.includes('ceremony') || titleLower.includes('award') || titleLower.includes('celebration')) return 'ceremony';
  if (titleLower.includes('hacking begins')) return 'hacking';
  if (titleLower.includes('presentation')) return 'presentation';
  if (titleLower.includes('judging')) return 'judging';
  if (titleLower.includes('office hours') || titleLower.includes('hangout') || titleLower.includes('social') || titleLower.includes('check-in')) return 'social';
  if (phase === 'HACKING') return 'hacking';
  return 'logistics';
};

/**
 * Format date label from timestamp
 */
const formatDateLabel = (startTime) => {
  const date = new Date(startTime);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = date.getUTCDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  return `${months[date.getUTCMonth()]} ${day}${suffix}`;
};

/**
 * Transform database milestones to the format expected by the component
 */
const transformMilestones = (milestones) => {
  if (!milestones || milestones.length === 0) return null;
  
  const preEvent = {
    date: '2026-06-01',
    label: 'Pre-Event',
    subtitle: 'June 1st - 20th',
    events: [],
  };
  
  const day1 = {
    date: '2026-06-21',
    label: 'Day 1',
    subtitle: 'Sunday, June 21st',
    events: [],
  };
  
  const day2 = {
    date: '2026-06-22',
    label: 'Day 2',
    subtitle: 'Monday, June 22nd',
    events: [],
  };
  
  const preEventDates = {};
  
  milestones.forEach(m => {
    const startDate = new Date(m.startTime);
    const endDate = m.endTime ? new Date(m.endTime) : startDate;
    const dateStr = startDate.toISOString().split('T')[0];
    
    const event = {
      id: m.id,
      time: startDate.getUTCHours().toString().padStart(2, '0') + ':' + startDate.getUTCMinutes().toString().padStart(2, '0'),
      endTime: endDate.getUTCHours().toString().padStart(2, '0') + ':' + endDate.getUTCMinutes().toString().padStart(2, '0'),
      title: m.title,
      description: m.description || '',
      location: m.location || 'Online',
      category: getCategory(m.title, m.phase),
      icon: getIconComponent(m.title, m.phase),
    };
    
    // Pre-event: June 1-20
    if (dateStr < '2026-06-21') {
      event.date = formatDateLabel(m.startTime);
      preEventDates[m.id] = dateStr;
      preEvent.events.push(event);
    }
    // Day 1: June 21
    else if (dateStr === '2026-06-21') {
      day1.events.push(event);
    }
    // Day 2: June 22+
    else {
      day2.events.push(event);
    }
  });
  
  return { preEvent, day1, day2, preEventDates };
};

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
        description: 'Sign up and start forming ideas. Browse the marketplace to find teammates.',
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
        description: 'Final deadline to form teams. No changes after this date.',
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
        description: 'Winners announced! Grand Champion and People\'s Champion.',
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


// ============================================================================
// CALENDAR HELPERS
// ============================================================================

/**
 * Format date and time for Google Calendar URL
 * Google Calendar expects: YYYYMMDDTHHMMSS (in UTC or with timezone)
 * Times are in UK timezone, convert to UTC for Google Calendar
 */
function formatDateTimeForGoogle(date, time) {
  // Create UK date and convert to UTC
  const ukDate = createUKDate(date, time);
  
  // Format as YYYYMMDDTHHMMSSZ (UTC)
  const year = ukDate.getUTCFullYear();
  const month = String(ukDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(ukDate.getUTCDate()).padStart(2, '0');
  const hour = String(ukDate.getUTCHours()).padStart(2, '0');
  const min = String(ukDate.getUTCMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}T${hour}${min}00Z`;
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
 * Format date for ICS file (YYYYMMDDTHHMMSSZ in UTC)
 * Times are in UK timezone, convert to UTC for ICS
 */
function formatDateTimeForICS(date, time) {
  // Create UK date and convert to UTC
  const ukDate = createUKDate(date, time);
  return formatDateForICS(ukDate, 'UTC');
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
  
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HackDay 2026//Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HackDay 2026 Schedule',
    generateVTIMEZONE(EVENT_TIMEZONE),
  ];
  
  events.forEach(event => {
    const uid = `${event.id}@hackday2026.com`;
    const dtStart = formatDateTimeForICS(event.date, event.time);
    const dtEnd = formatDateTimeForICS(event.date, event.endTime || event.time);
    
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

function Schedule({ user, teams, onNavigate, eventPhase, event }) {
  const [activeDay, setActiveDay] = useState('preEvent');
  const [showUKTime, setShowUKTime] = useState(false);

  // Transform database milestones or fall back to hardcoded data
  const scheduleData = useMemo(() => {
    const transformed = transformMilestones(event?.milestones);
    if (transformed) {
      return {
        data: { preEvent: transformed.preEvent, day1: transformed.day1, day2: transformed.day2 },
        preEventDates: transformed.preEventDates,
      };
    }
    return {
      data: SCHEDULE_DATA,
      preEventDates: PRE_EVENT_DATES,
    };
  }, [event?.milestones]);

  const currentDayData = scheduleData.data[activeDay];
  const isPreEvent = activeDay === 'preEvent';
  
  // Get user's timezone info
  const userTimezone = getUserTimezone();
  const timezoneName = getTimezoneName();
  const timezoneAbbr = getTimezoneAbbr();

  const handleAddToCalendar = (calEvent) => {
    // For pre-event items, use the specific date mapping
    let eventDate = currentDayData.date;
    if (isPreEvent && scheduleData.preEventDates[calEvent.id]) {
      eventDate = scheduleData.preEventDates[calEvent.id];
    }
    const url = generateGoogleCalendarUrl(calEvent, eventDate);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddAllToCalendar = () => {
    // Generate ICS from current schedule data
    const events = [];
    
    scheduleData.data.preEvent.events.forEach(ev => {
      events.push({
        ...ev,
        date: scheduleData.preEventDates[ev.id] || scheduleData.data.preEvent.date,
      });
    });
    
    scheduleData.data.day1.events.forEach(ev => {
      events.push({ ...ev, date: scheduleData.data.day1.date });
    });
    
    scheduleData.data.day2.events.forEach(ev => {
      events.push({ ...ev, date: scheduleData.data.day2.date });
    });
    
    // Generate and download ICS
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HackDay 2026//Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:HackDay 2026 Schedule',
      generateVTIMEZONE(EVENT_TIMEZONE),
    ];
    
    events.forEach(ev => {
      const uid = `${ev.id}@hackday2026.com`;
      const dtStart = formatDateTimeForICS(ev.date, ev.time);
      const dtEnd = formatDateTimeForICS(ev.date, ev.endTime || ev.time);
      
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:HackDay 2026: ${ev.title}`,
        `DESCRIPTION:${(ev.description || '').replace(/\n/g, '\\n')}`,
        `LOCATION:${ev.location || 'Online'}`,
        'END:VEVENT'
      );
    });
    
    icsContent.push('END:VCALENDAR');
    
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hackday-2026-schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="schedule"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-md border border-white/10">
            <Calendar className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm text-text-primary">JUNE 1ST - 22ND, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display"
              style={{ textShadow: '0 0 30px rgba(255, 107, 53, 0.4)' }}>
            EVENT SCHEDULE
          </h1>
          <p className="text-arena-secondary max-w-2xl mx-auto mb-4">
            From launch to celebration — your complete guide to HackDay 2026. 
            Team formation starts June 1st, hacking kicks off June 21st!
          </p>
          
          {/* Timezone Indicator */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <Globe className="w-4 h-4 text-brand" />
              <span className="text-xs text-arena-secondary">
                Showing times in{' '}
                <button
                  type="button"
                  onClick={() => setShowUKTime(!showUKTime)}
                  className="text-brand hover:text-text-primary font-bold underline"
                >
                  {showUKTime ? `${EVENT_TIMEZONE} (UK)` : `${timezoneName} (${timezoneAbbr})`}
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Add All to Calendar Button */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={handleAddAllToCalendar}
            className="flex items-center gap-2 px-6 py-3 font-bold text-text-primary
                       bg-gradient-to-r from-[#FF8A50] to-[#FF4500] 
                       hover:from-[#FF9966] hover:to-[#FF5722]
                       hover:-translate-y-0.5 transition-all rounded-lg 
                       shadow-lg hover:shadow-[0_8px_30px_rgba(255,107,53,0.3)]"
          >
            <Download className="w-5 h-5" />
            Add All Events to Calendar
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 mb-6">
          {Object.entries(scheduleData.data).map(([key, day]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveDay(key)}
              className={`flex-1 py-3 px-4 font-bold text-center transition-all rounded-card backdrop-blur-md
                ${activeDay === key
                  ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white border border-white/20 shadow-[0_0_20px_rgba(255,107,53,0.3)]'
                  : 'glass-card text-arena-secondary hover:border-brand/30 hover:text-text-primary'
                }`}
            >
              <div className="text-lg">{day.label}</div>
              <div className={`text-xs ${activeDay === key ? 'text-text-primary/70' : 'text-arena-muted'}`}>
                {day.subtitle}
              </div>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line - Animated glow */}
          <div className="absolute left-[23px] sm:left-[31px] top-0 bottom-0 w-0.5 timeline-line" />

          {/* Events */}
          <div className="space-y-4">
            {currentDayData.events.map((event, index) => {
              const Icon = event.icon;
              
              // Get event date for conversion
              let eventDate = currentDayData.date;
              if (isPreEvent && scheduleData.preEventDates[event.id]) {
                eventDate = scheduleData.preEventDates[event.id];
              }
              
              // Convert times to user's timezone
              const startTimeConverted = convertUKTimeToLocal(
                eventDate,
                event.time,
                showUKTime ? EVENT_TIMEZONE : null
              );
              const endTimeConverted = event.endTime && event.endTime !== event.time
                ? convertUKTimeToLocal(
                    eventDate,
                    event.endTime,
                    showUKTime ? EVENT_TIMEZONE : null
                  )
                : null;
              
              // Format time display
              const timeDisplay = endTimeConverted
                ? `${startTimeConverted.time} - ${endTimeConverted.time}`
                : startTimeConverted.time;
              
              // Show UK time as well if not already showing it
              const ukTimeDisplay = !showUKTime
                ? ` (${event.time}${event.endTime && event.endTime !== event.time ? ` - ${event.endTime}` : ''} UK)`
                : '';
              
              return (
                <div key={event.id} className="relative flex gap-4">
                  {/* Timeline Node - with orange glow */}
                  <div className="relative z-10 flex-shrink-0">
                    {/* Glow backdrop */}
                    <div className="absolute inset-0 rounded-full bg-brand/20 blur-xl scale-125" />
                    <div
                      className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-arena-black 
                                  flex items-center justify-center shadow-md glass-card"
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                    </div>
                  </div>

                  {/* Event Card - Glass styling */}
                  <div
                    className={`flex-1 p-4 sm:p-5 glass-card rounded-card 
                                hover:border-brand/30 hover:-translate-y-1 transition-all duration-300
                                ${event.category === 'deadline' 
                                  ? 'border-2 border-red-500/60 bg-red-950/30' 
                                  : event.title === 'Hacking Begins!'
                                    ? 'border-2 border-green-500/60 bg-green-950/30'
                                    : ''}`}
                  >
                    {/* Time Badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {isPreEvent && event.date && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs 
                                          font-bold rounded bg-brand text-white">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs 
                                        font-bold rounded bg-arena-elevated text-brand">
                        <Clock className="w-3 h-3" />
                        {timeDisplay}
                        {ukTimeDisplay && (
                          <span className="text-arena-secondary font-normal ml-1">
                            {ukTimeDisplay}
                          </span>
                        )}
                        {!showUKTime && (
                          <span className="text-arena-secondary font-normal ml-1 text-[10px]">
                            ({timezoneAbbr})
                          </span>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs 
                                        font-medium rounded bg-arena-elevated text-arena-secondary">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-text-primary mb-1"
                        style={{ textShadow: '0 0 20px rgba(255, 107, 53, 0.4)' }}>
                      {event.title}
                    </h3>
                    <p className="text-sm text-arena-secondary mb-3">
                      {event.description}
                    </p>

                    {/* Add to Calendar Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(event)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold 
                                 text-text-primary bg-arena-elevated hover:bg-arena-border rounded transition-colors"
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
          <div className="glass-card inline-block p-6 rounded-card">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-brand" />
              <span className="font-bold text-text-primary"
                    style={{ textShadow: '0 0 20px rgba(255, 107, 53, 0.4)' }}>
                Remote Hackathon
              </span>
            </div>
            <p className="text-sm text-arena-secondary mb-4">
              Times are automatically converted to your local timezone ({timezoneAbbr}). 
              Click the timezone indicator above to toggle between local and UK times. 
              Hack from anywhere in the world!
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('rules')}
                className="px-4 py-2 text-sm font-bold text-arena-secondary 
                           glass-card hover:text-text-primary hover:border-brand/30
                           rounded-lg transition-all"
              >
                View Rules
              </button>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 text-sm font-bold text-text-primary 
                           bg-gradient-to-r from-[#FF8A50] to-[#FF4500]
                           hover:from-[#FF9966] hover:to-[#FF5722]
                           hover:-translate-y-0.5 transition-all rounded-lg"
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

