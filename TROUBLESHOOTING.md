# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Cannot find module" or "Module not found" errors

**Solution:** Install dependencies first:
```bash
npm install
```

### 2. "Expo CLI not found" or "expo: command not found"

**Solution:** Install Expo CLI globally (optional, but recommended):
```bash
npm install -g expo-cli
```

Or use npx (no global install needed):
```bash
npx expo start
```

### 3. "Unable to resolve module" errors

**Solution:** Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### 4. App.jsx not found

**Solution:** Make sure `App.jsx` is in the root directory. Expo automatically detects:
- `App.js`
- `App.jsx`
- `App.ts`
- `App.tsx`

### 5. Metro bundler issues

**Solution:** Clear Metro bundler cache:
```bash
npx expo start --clear
```

### 6. Port already in use

**Solution:** Kill the process using port 8081:
```bash
# macOS/Linux
lsof -ti:8081 | xargs kill -9

# Or use a different port
npx expo start --port 8082
```

## Quick Start Commands

1. **First time setup:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Run on specific platform:**
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

## Verify Your Setup

Make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ npm or yarn installed
- ✅ All dependencies installed (`npm install`)
- ✅ `App.jsx` file in the root directory
- ✅ `node_modules` folder exists

## Still Having Issues?

1. Check Node.js version: `node --version` (should be v14+)
2. Check npm version: `npm --version`
3. Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
4. Make sure you're in the project root directory when running commands
