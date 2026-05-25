# Gold List

> A spaced-repetition vocabulary learning app using the Gold List distillation method — built with React Native (Expo).

---

## About

**Gold List** helps you master vocabulary through systematic 14-day review cycles. Based on the Gold List distillation method, the app moves words from short-term to long-term memory through spaced repetition.

Create vocabulary lists (headlists), review them every 14 days, and gradually remove words you've naturally memorized. Over time, only the words that need the most practice remain.

## Features

- **Gold List Distillation** — Systematic 14-day review cycles for long-term retention
- **Vocabulary Headlists** — Create and manage lists of up to 25 words each
- **Spaced Repetition** — Words you forget move to a new cycle; remembered words accumulate
- **Learning Analytics** — Track streaks, completion rates, words mastered, and retention
- **Streak Tracking** — Stay motivated with daily streaks and milestone badges
- **Push Notifications** — Get reminded when your 14-day reviews are due
- **Account Management** — Sign up, log in, password reset, and full account deletion
- **Authentication** — Secure email/password auth via Firebase
- **Data Privacy** — All data encrypted in transit and at rest; no unnecessary permissions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native with Expo SDK 56 |
| Language | TypeScript (strict mode) |
| Routing | Expo Router (file-based) |
| State Management | Zustand |
| Backend | Firebase (Auth + Firestore) |
| Notifications | Expo Notifications |
| Storage | AsyncStorage (local cache) |
| Testing | Jest + React Native Testing Library |
| E2E Tests | Maestro |

## Project Structure

```
src/
├── app/              # Expo Router pages
│   ├── (auth)/       # Login, signup, forgot password
│   └── (tabs)/       # Dashboard, create, progress, settings, legal
├── components/       # Reusable UI components
├── config/           # Firebase configuration
├── constants/        # Theme and spacing constants
├── hooks/            # Custom hooks (theme, color scheme)
├── services/         # Business logic (notifications)
├── stores/           # Zustand stores (auth, headlists, distillation)
├── types/            # TypeScript type definitions
└── __tests__/        # Unit tests
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (or npm/yarn)
- Expo CLI
- A Firebase project (for authentication and data storage)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config values in .env

# Start the dev server
pnpm start

# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run tests
pnpm test
```

### Environment Variables

Create a `.env` file in the project root with the following Firebase configuration:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

### Play Store (Android)

```bash
# Build the production APK/AAB
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

### App Store (iOS)

```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

## License

[MIT](LICENSE)
