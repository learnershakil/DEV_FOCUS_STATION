# 🚀 DEV_FOCUS_STATION

A modern, developer-focused productivity and time management application built with Next.js, TypeScript, and Tailwind CSS. Features a futuristic UI with terminal-inspired design elements, perfect for developers who want to track their coding sessions and manage tasks efficiently.

![Developer Timer App](https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## ✨ Features

### 🕐 Main Countdown Timer
- **36-hour countdown timer** with millisecond precision (HH:MM:SS.MS format)
- Real-time synchronization across all devices
- Visual progress bar with gradient effects
- Sound notifications when timer completes
- Play/Pause/Reset functionality

### 📋 Smart Todo Management
- Create tasks with custom time limits
- Individual countdown timers for each task with millisecond precision
- Play/Pause individual task timers
- Track completion time for finished tasks
- Visual status indicators (RUNNING, COMPLETED)
- Sound notifications for task completion
- Delete completed or unwanted tasks

### 📝 Developer Notes
- Markdown-style note editor
- Real-time auto-save functionality
- Terminal-inspired code editor interface
- Cross-device synchronization

### 🎨 Developer-Themed UI
- Terminal and code editor inspired design
- Monospace fonts throughout
- Code comment styling
- Programming-themed icons (Terminal, Code, Bug, Zap, Coffee)
- Gradient backgrounds with blur effects
- Responsive design for all devices

### 🔊 Audio Notifications
- Web Audio API-based sound system
- Customizable notification sounds
- No external audio files required
- Graceful fallback for audio permission issues

### 💾 Data Persistence
- Server-side data storage in JSON format
- Real-time synchronization across devices
- Automatic backup and restore
- Cross-browser compatibility

## 🛠️ Tech Stack

- **Framework**: Next.js 13.5.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Audio**: Web Audio API
- **Data Storage**: File-based JSON storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev-focus-station
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## ⚙️ Configuration

### 🕐 Changing the Main Timer Duration

The main timer is set to 36 hours by default. To change this:

**File**: `app/api/data/route.ts`
**Location**: Line 25-26 in the `ensureDataFile()` function

```typescript
const defaultData: AppData = {
  mainTimer: 36 * 60 * 60, // 36 hours in seconds - CHANGE THIS VALUE
  mainTimerStarted: Date.now(),
  isMainTimerRunning: false,
  todos: [],
  notes: ''
};
```

**Examples**:
- For 24 hours: `24 * 60 * 60`
- For 12 hours: `12 * 60 * 60`
- For 8 hours: `8 * 60 * 60`
- For 2 hours: `2 * 60 * 60`

**Also update the reset function in**: `components/MainTimer.tsx`
**Location**: Line 85 in the `resetTimer()` function

```typescript
const resetTimer = () => {
  const resetTime = 36 * 60 * 60; // Change this to match your desired duration
  setTimeRemaining(resetTime);
  setIsActive(false);
  onUpdate(resetTime, false, Date.now());
};
```

### 🔊 Customizing Sound Notifications

The app uses Web Audio API to generate notification sounds. To customize:

#### Main Timer Sound
**File**: `components/MainTimer.tsx`
**Location**: Lines 20-35 in the `useEffect` hook

```typescript
const createBeepSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800; // Change frequency (pitch)
  oscillator.type = 'sine'; // Change wave type: 'sine', 'square', 'sawtooth', 'triangle'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Change volume
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5); // Change duration
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5); // Change sound length
};
```

#### Todo Task Sound
**File**: `components/TodoList.tsx`
**Location**: Lines 25-40 in the `useEffect` hook

```typescript
const createNotificationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 600; // Different frequency for todo completion
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};
```

#### Using Custom Audio Files
To use custom audio files instead of generated sounds:

1. **Add audio files** to the `public` folder
2. **Replace the Web Audio API code** with:

```typescript
useEffect(() => {
  if (typeof window !== 'undefined') {
    audioRef.current = new Audio('/path-to-your-audio-file.mp3');
    audioRef.current.volume = 0.5; // Adjust volume
  }
}, []);
```

### 🎨 UI Customization

#### Color Scheme
The app uses a dark theme with cyan, purple, and green accents. To customize colors, modify the Tailwind classes in:
- `app/page.tsx` - Main layout colors
- `components/MainTimer.tsx` - Timer component colors  
- `components/TodoList.tsx` - Todo component colors
- `components/NotesSection.tsx` - Notes component colors

#### Fonts
The app uses `font-mono` (monospace) for the developer aesthetic. To change fonts:
1. Import your desired font in `app/layout.tsx`
2. Replace `font-mono` classes throughout the components

## 📁 Project Structure

```
dev-focus-station/
├── app/
│   ├── api/data/route.ts      # API endpoint for data persistence
│   ├── globals.css            # Global styles and Tailwind imports
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main application page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── MainTimer.tsx          # Main countdown timer component
│   ├── TodoList.tsx           # Todo management component
│   └── NotesSection.tsx       # Notes editor component
├── lib/
│   └── utils.ts               # Utility functions
├── data.json                  # Data storage file (auto-generated)
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔧 API Endpoints

### GET `/api/data`
Retrieves the current application state including timer, todos, and notes.

**Response**:
```json
{
  "mainTimer": 129600,
  "mainTimerStarted": 1640995200000,
  "isMainTimerRunning": false,
  "todos": [...],
  "notes": "..."
}
```

### POST `/api/data`
Updates the application state with new data.

**Request Body**: Complete application state object

## 🎯 Usage Tips

1. **Cross-Device Sync**: Open the app on multiple devices to see real-time synchronization
2. **Audio Permissions**: Click anywhere on the page first to enable audio notifications
3. **Keyboard Shortcuts**: Press Enter in input fields to quickly add todos
4. **Time Format**: Todo times are entered in minutes but displayed with millisecond precision
5. **Data Persistence**: All data is automatically saved and restored between sessions

## 🐛 Troubleshooting

### Audio Not Working
- Ensure you've interacted with the page (clicked somewhere) before expecting audio
- Check browser audio permissions
- Some browsers block audio until user interaction

### Timer Not Syncing
- Check that the development server is running
- Verify the `data.json` file is being created in the project root
- Ensure no firewall is blocking localhost connections

### Milliseconds Not Updating
- The timers update every 100ms for smooth animation
- If performance is poor, the update interval may be automatically adjusted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for developers who love clean code and productive workflows**