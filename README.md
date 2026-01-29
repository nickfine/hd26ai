# HD26AI - HackDay 2026 Web App

A modern React web application for managing HackDay events, deployed on Vercel.

## Live Demo

**Production:** https://hd26ai.vercel.app

## Features

- **Dashboard**: Overview of event stats, team info, and recent activity
- **Profile Management**: User profiles with skills and availability
- **Ideas Marketplace**: Browse, create, and join team ideas
- **Team Formation**: Create teams, invite members, manage join requests
- **Submission Portal**: Submit projects with demos and descriptions
- **Voting System**: Vote for favorite projects
- **Judge Scoring**: Judges can score submissions on multiple criteria
- **Results Display**: Celebration view with winners and confetti
- **Admin Panel**: Event configuration and user management
- **Real-time Activity Feed**: Live updates of event activity

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Database and real-time subscriptions
- **Vercel** - Hosting and deployment
- **Lucide React** - Icons
- **Canvas Confetti** - Celebration effects

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── public/              # Static assets
│   ├── adaptlogo.png    # App logo
│   └── avatars/         # User avatars
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components (Button, Card, Modal, etc.)
│   │   ├── shared/      # Shared components (NavItem, StatusBanner, etc.)
│   │   └── *.jsx        # Page components (Dashboard, Profile, etc.)
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js   # Authentication
│   │   ├── useSupabase.js # Database operations
│   │   └── useTheme.js  # Theme management
│   ├── lib/             # Utilities and configuration
│   │   ├── constants.js # App constants
│   │   ├── design-system.js # Design tokens
│   │   └── supabase.js  # Supabase client
│   ├── styles/          # CSS
│   │   └── tokens.css   # CSS custom properties
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── supabase/
│   └── migrations/      # Database migrations
└── tests/               # Test files
```

## Event Phases

The app supports 7 event phases:

1. **Registration** - Users sign up and create profiles
2. **Team Formation** - Create/join teams, browse ideas
3. **Hacking** - Build projects (submissions open)
4. **Submission** - Final submission deadline
5. **Voting** - Participants vote for favorites
6. **Judging** - Judges score submissions
7. **Results** - Winners announced with celebration

## User Roles

| Role | Permissions |
|------|-------------|
| Participant | Join teams, submit projects, vote |
| Team Captain | All participant permissions + manage team |
| Judge | Score submissions, view all projects |
| Admin | Full access, configure event settings |
| Observer | View-only access |

## Accessibility

- Skip links for keyboard navigation
- `aria-current` for navigation state
- `aria-live` regions for dynamic content
- `prefers-reduced-motion` support
- WCAG AA color contrast compliance

## Companion App

This web app works alongside **HD26Forge**, a Confluence Forge app that provides the same functionality embedded in Atlassian Confluence.

- HD26AI (this app): https://hd26ai.vercel.app
- HD26Forge: Confluence full-page app

## Deployment

The app auto-deploys to Vercel on push to `main` branch.

Manual deployment:
```bash
npm run build
vercel --prod
```

## Development

### Adding a New Component

1. Create component in `src/components/`
2. Add to appropriate index.js for exports
3. Use design tokens from `lib/design-system.js`
4. Follow existing patterns for consistency

### Design System

The app uses a consistent design system with:
- CSS custom properties in `styles/tokens.css`
- Tailwind configuration in `tailwind.config.js`
- Reusable UI components in `components/ui/`

## LicenseMIT
