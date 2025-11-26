# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript compile + Vite build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a macOS-style interactive CV/portfolio website built with React, TypeScript, and TailwindCSS v4.

### Core Pattern: OS Simulation

The app simulates a desktop operating system with windows, dock, and menu bar:

- **OSContext** (`src/context/OSContext.tsx`) - Global state management for window system and OS features. Provides:
  - Window actions: `openWindow`, `closeWindow`, `minimizeWindow`, `maximizeWindow`, `focusWindow`, `updateWindowBounds`
  - Theme: `isDarkMode`, `toggleTheme`
  - Sound: `isSoundEnabled`, `toggleSound`
  - Spotlight: `isSpotlightOpen`, `toggleSpotlight`, `closeSpotlight`
  - Responsive: `isMobile`
- **WindowManager** (`src/components/OS/WindowManager.tsx`) - Renders all open windows with AnimatePresence for animations.
- **Window** (`src/components/OS/Window.tsx`) - Draggable, resizable window component with macOS-style controls. Supports 8-direction resize handles.
- **Spotlight** (`src/components/OS/Spotlight.tsx`) - macOS-style search modal (Cmd+Space). Searches apps, actions, and skills from CV data.

### Desktop Components

- **Desktop** (`src/components/Desktop/Desktop.tsx`) - Root component, wraps content in OSProvider.
- **Dock** (`src/components/Desktop/Dock.tsx`) - macOS-style dock that opens apps via `openWindow()`.
- **MenuBar** (`src/components/Desktop/MenuBar.tsx`) - Top menu bar.

### Apps (in `src/apps/`)

Apps are React components rendered inside windows:

- **TerminalApp** - AI chatbot terminal that uses Google Gemini for intelligent responses about CV data. Falls back to keyword matching (`src/utils/chatbot.ts`) if no API key is configured.
- **PreviewApp** - CV preview display.
- **FinderApp** - Projects browser.

### Data

- **cv_data.ts** (`src/data/cv_data.ts`) - Central CV data store with typed `CVData` interface. Contains personal info, skills, experience, projects, and education.

### Utilities (in `src/utils/`)

- **aiService.ts** - Google Gemini API integration for AI chatbot. Sends conversation history with CV context as system instruction.
- **chatbot.ts** - Fallback keyword-based response generator when Gemini API is unavailable.
- **sounds.ts** - System sounds manager using Web Audio API. Plays sounds on window open/close/minimize.

### Theming

CSS custom properties defined in `src/index.css`:
- Light theme (default): `--bg-primary`, `--bg-window`, `--text-primary`, etc.
- Dark theme: Applied via `.dark` class on root element
- Smooth 200ms transitions on theme change

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here  # Required for AI chatbot (free tier available)
```

## Tech Stack

- React 19 + TypeScript
- Vite 7
- TailwindCSS v4 (uses `@tailwindcss/postcss`)
- Framer Motion for animations
- Lucide React for icons
- date-fns for date utilities

## Keyboard Shortcuts

- `Cmd/Ctrl + Space` - Open Spotlight search
