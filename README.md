# AlignPal

A React Native app built with Expo SDK 54 to help users manage and prevent back pain through exercises, pain tracking, and posture tips.

## Features

- **Dashboard**: Clean and modern interface showing your progress, exercises, and pain tracking
- **History**: View your past pain levels, exercise sessions, and track your progress over time
- **Exercise Tracking**: Daily exercise recommendations for back health
- **Pain Level Tracking**: Simple interface to log your pain levels (1-10 scale)
- **Progress Stats**: Track your activity, exercise time, and pain levels
- **Posture Tips**: Helpful tips for maintaining good posture throughout the day
- **Navigation**: Bottom tab navigation between Dashboard and History screens

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Project Structure

```
AlignPal/
├── App.jsx                    # Main app entry point
├── src/
│   ├── navigation/
│   │   └── AppNavigator.jsx   # Bottom tab navigation setup
│   ├── screens/
│   │   ├── DashboardScreen.jsx  # Dashboard screen
│   │   └── HistoryScreen.jsx    # History screen
│   └── components/
│       ├── WelcomeCard.jsx       # Welcome section
│       ├── StatsCard.jsx         # Progress statistics
│       ├── ExerciseCard.jsx      # Exercise recommendations
│       ├── PainTrackerCard.jsx  # Pain level tracking
│       └── PostureTipCard.jsx    # Posture tips
├── package.json
├── app.json
├── babel.config.js
└── metro.config.js
```

## Technologies Used

- **React Native** 0.76.5
- **Expo SDK** 54.0.0
- **React Navigation** - Bottom tab navigation
- **React Native Safe Area Context** - Safe area handling
- **Expo Vector Icons** - Icon library

## Screens

### Dashboard Screen
- Welcome message
- Progress statistics (days active, exercise time, pain level)
- Today's exercise recommendations
- Pain level tracker (1-10 scale)
- Posture tips

### History Screen
- Complete history of pain tracking sessions
- Exercise history with duration
- Notes and observations
- Color-coded pain levels (Mild/Moderate/Severe)
- Filter functionality (UI only)

## Notes

This is currently a **frontend-only implementation**. All UI components are built and styled, but no actual data persistence or functionality is implemented yet. Full functionality (data persistence, exercise videos, backend integration, etc.) will be added in future updates.
