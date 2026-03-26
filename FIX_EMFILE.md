# Fix EMFILE: Too Many Files Open Error

## Quick Fix (Recommended)

### Option 1: Install Watchman (Best Solution)

Watchman is Facebook's file watching service that's recommended for React Native/Expo projects:

```bash
# Install using Homebrew (macOS)
brew install watchman

# Then restart your terminal and run:
npm start
```

### Option 2: Increase File Descriptor Limit (Temporary Fix)

Run this before starting Expo:

```bash
# Increase the limit for this session
ulimit -n 4096

# Then start Expo
npm start
```

To make this permanent, add to your `~/.zshrc` or `~/.bash_profile`:
```bash
ulimit -n 4096
```

### Option 3: Use Expo with Reduced File Watching

I've already created a `metro.config.js` that reduces file watching. Try:

```bash
npm run start:clear
```

### Option 4: Clean and Restart

Sometimes clearing caches helps:

```bash
# Clear all caches
rm -rf node_modules
rm -rf .expo
rm -rf .expo-shared
npm cache clean --force

# Reinstall
npm install

# Start with cleared cache
npm run start:clear
```

## Why This Happens

The EMFILE error occurs when the system runs out of file descriptors. Metro bundler watches many files, and macOS has a default limit that can be exceeded with large projects.

## Best Practice

**Install Watchman** - it's the recommended solution for React Native/Expo development and will prevent this issue from happening again.

```bash
brew install watchman
```

After installing, restart your terminal and run `npm start` again.
