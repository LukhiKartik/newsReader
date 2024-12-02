# News Feed App

A responsive news feed application built with React Native that displays a list of news articles. Users can refresh the feed, view article details, and handle offline states gracefully.

## Features
- Displays news articles with images, titles, and descriptions.
- Pull-to-refresh functionality.
- Offline mode with cached articles.
- Error handling and fallback images.
- Optimized for performance using FlatList enhancements.

---

## Setup Instructions

### Prerequisites
Ensure the following are installed on your machine:
1. **Node.js** (v14 or higher)
2. **React Native CLI**
3. **Android Studio/Xcode** for running the app on an emulator or device.

---

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/LukhiKartik/newsReader.git

2. npm install


### API Configuration

1. Register on NewsAPI.org to obtain a free API key.
2. Open the articlesSlice.ts file and replace the placeholder YOUR_API_KEY:

### Key Implementation Notes

FlatList Optimization:

Uses initialNumToRender, maxToRenderPerBatch, and windowSize for smooth rendering.
Caches offscreen items with removeClippedSubviews.
Image Loading:

Includes a fallback image if the article's image URL fails to load.
Displays a loading spinner until the image fully loads.
Offline Support:

Detects network status using @react-native-community/netinfo.
Shows cached data when offline.
Error Handling:

Displays user-friendly error messages for API issues.
