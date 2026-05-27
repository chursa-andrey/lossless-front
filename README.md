# Lossless.fm Mobile App

React Native mobile client for **Lossless.fm** — a mobile-first prototype for uploading, discovering, and playing lossless audio tracks.

The project is part of an independent full-stack work sample built with a Java/Spring Boot backend and a React Native mobile client. It demonstrates authentication flow, secure token handling, real API integration, track feed, upload flow, and custom audio playback.

> Project status: Prototype / work sample. Core functionality is implemented, but the project is not production-ready yet.

---

## Related Repositories

- Backend API: `https://github.com/your-username/your-backend-repo`
- Mobile App: `https://github.com/your-username/your-mobile-repo`

---

## Features

### Implemented

- Email authentication flow
- Google/Facebook social login integration in development mode
- JWT-based session handling with access token refresh
- Secure refresh token storage using device secure storage
- Authenticated API client with automatic retry after token refresh
- Home feed with real backend data
- Infinite scrolling / lazy loading
- Track cards with metadata and purchase links
- WAV/FLAC track upload flow
- Custom audio player
- Centralized player state
- Android background audio playback with notification controls
- Localization support for English and Russian
- Loading, empty, and error states

### In Progress / Planned

- iOS background playback testing
- Likes/dislikes flow
- Genre-based radio algorithm
- Search and library features
- Production social auth configuration
- Production deployment setup

---

## Tech Stack

- React Native
- TypeScript
- Zustand
- TanStack Query
- React Navigation
- React Native Paper
- react-native-video
- react-native-keychain
- react-hook-form
- Zod
- i18next
- REST API integration

---

## Architecture Overview

The mobile app is structured around a clear separation of responsibilities:

- **API layer** handles backend communication and authenticated requests.
- **Auth store** manages session state, access token, restore flow, and logout.
- **Secure storage** keeps the refresh token outside of regular application state.
- **Query layer** manages server state, feed loading, caching, and refresh.
- **Player store** keeps centralized playback state and prevents multiple independent players from running at the same time.
- **Screens and components** are separated by feature and UI responsibility.

The app uses short-lived access tokens in memory and stores the refresh token securely on the device.

---

## Main Flows

### Authentication

The app supports email authentication and Google/Facebook social login integration in development mode.

The session flow includes:

1. User authenticates with email or social provider.
2. Backend returns access and refresh tokens.
3. Access token is kept in runtime state.
4. Refresh token is stored securely on the device.
5. API client automatically refreshes the access token after a `401` response.
6. Logout revokes the refresh token and clears local session state.

### Track Feed

The Home screen displays a real track feed loaded from the backend.

The feed supports:

- lazy loading;
- track metadata;
- uploader data;
- purchase links;
- audio playback from backend audio endpoints.

### Audio Playback

Audio playback is handled through a centralized player flow instead of creating isolated players inside each track card.

This makes it easier to control:

- active track;
- play/pause state;
- progress;
- switching between tracks;
- background playback behavior.

---

## Requirements

Before running the project, make sure your environment is configured for React Native development.

Required tools:

- Node.js
- npm
- React Native development environment
- Android Studio for Android builds
- Xcode and CocoaPods for iOS builds
- Running Lossless.fm backend API

Follow the official React Native setup guide if needed:

https://reactnative.dev/docs/set-up-your-environment

---

## Environment Configuration

The mobile app expects the backend API to be available locally or on a configured development URL.

Typical local backend URLs:

```txt
Android emulator: http://10.0.2.2:8080
iOS simulator: http://localhost:8080