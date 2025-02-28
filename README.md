# Svelte Tube App

A modern YouTube client built with Svelte and Vite. This application allows users to search for YouTube videos and play them directly within the app.

## Features

- Search for YouTube videos
- Watch videos in the embedded player
- Responsive design for all devices
- Modern UI with smooth animations
- Built with Svelte for high performance

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- A YouTube Data API key (get one from [Google Developer Console](https://console.developers.google.com/))

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd svelte-tubeapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your YouTube API key:
   ```
   VITE_API_URL=https://www.googleapis.com/youtube/v3
   VITE_API_KEY=your_youtube_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## Building for Production

To create a production build:

```
npm run build
```

The build files will be in the `dist` directory and can be deployed to any static hosting service.

## Project Structure

- `src/` - Source code
  - `api/` - API clients and services
  - `components/` - Svelte components
  - `App.svelte` - Main application component
  - `main.js` - Application entry point

## Technologies Used

- [Svelte](https://svelte.dev/) - Reactive UI framework
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Axios](https://axios-http.com/) - HTTP client

## License

MIT
