# UIU Talent Hunt

A modern React + TypeScript application for discovering and showcasing talent from United International University (UIU) students. The platform features an audio portal, player interface, and content management system.

## Features

- **Authentication System**: Email/password login with UIU domain validation (@uiu.ac.bd)
- **Audio Portal**: Browse and discover audio content (songs, podcasts, stories)
- **Audio Player**: Detailed player with featured playlists, audio tables, and leaderboard
- **Content Management**: Blog articles, video portal, and submission system
- **Responsive Design**: Mobile-optimized interface with dark theme support
- **Reusable Hooks**: useNavbar, useFooter, useTabNavigation for component composition

## Tech Stack

- **Framework**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.6
- **Routing**: React Router DOM v6
- **Styling**: CSS Modules with responsive breakpoints
- **Package Manager**: npm

## Project Structure

```
src/
├── pages/
│   ├── home/HomePage.tsx          # Landing page with trending content
│   ├── login/LoginPage.tsx         # Authentication page
│   ├── signup/Signup.tsx           # Registration with email validation
│   ├── audios/
│   │   ├── AudioPortal.tsx        # Audio grid view with 6 items
│   │   └── AudioPlayer.tsx        # Detailed player interface
│   ├── blogs/
│   │   ├── Blogs.tsx              # Blog listing page
│   │   └── ReadBlog.tsx           # Individual blog reader
│   ├── SubmitEntry.tsx            # Content submission selector
│   ├── VideosPage.tsx             # Videos portal
│   └── AudiosPage.tsx             # Legacy audios page
├── hooks/
│   ├── useNavbar.tsx              # Navigation component hook
│   ├── useFooter.tsx              # Footer component hook
│   └── useTabNavigation.tsx       # Tab navigation hook
├── styles/
│   ├── AudioPlayer.module.css     # Player styling
│   ├── AudioPortal.module.css     # Portal grid styling
│   ├── HomePage.module.css
│   ├── LoginPage.module.css
│   ├── Signup.module.css
│   └── [other CSS modules]
└── App.tsx                        # Main routing configuration
```

## Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page
- `/audios` - Audio portal (grid view)
- `/audios/:id` - Audio player (detail view)
- `/blogs` - Blog listing
- `/blogs/:id` - Blog reader
- `/videos` - Videos portal
- `/submit` - Submission selector
- `/submit/:type` - Submission form

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/uiu-talent-hunt.git
cd uiu-react
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Demo Credentials

For testing the authentication system:
- **Email**: `user@uiu.ac.bd`
- **Password**: `password123`

## Authentication

- Email validation requires @uiu.ac.bd domain (supports subdomains like @bscse.uiu.ac.bd)
- Login state stored in localStorage as `isLoggedIn` flag
- Submit Entry button appears only when logged in
- Logout clears authentication state

## Styling

- Dark theme for audio/player pages (#0b1120, #020617)
- Light theme for main pages (white/gray)
- Responsive breakpoints at 1024px and 768px
- Orange accent color (#f97316) for interactive elements
- CSS Modules for scoped styling

## Component Features

### AudioPortal
- 6 audio items in responsive 3-column grid
- Click to navigate to AudioPlayer
- Hover animation with shadow effect
- Play statistics, ratings, comments

### AudioPlayer
- Featured playlist section with metadata
- 5-track audio table with columns: #, Title, Talent, Type, Rating, Plays, Duration
- Genre/mood filter buttons (9 categories)
- Top Audio Talents leaderboard
- Player footer with progress bar and controls

### Navbar
- Conditional Submit Entry button (logged-in only)
- Login/SignUp buttons or Logout button based on auth state
- Logo clickable for home navigation
- Dark header with sticky positioning

## Performance

- Optimized build: 56.15 kB CSS (10.97 kB gzip), 283.56 kB JS (87.87 kB gzip)
- 63 modules in production build
- Fast refresh with Vite HMR

## Future Enhancements

- Create VideoPlayer page (similar to AudioPlayer)
- Add individual submission forms for /submit/video, /submit/audio, /submit/blog
- Implement leaderboard ranking system
- Add user profile pages
- Integration with backend API
- Real audio/video file uploads

## License

MIT
