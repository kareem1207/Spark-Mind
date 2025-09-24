# Spark Mind Frontend Documentation

## Project Overview
Spark Mind is a web application designed for early detection of dementia through interactive cognitive assessment games. The frontend is built using Next.js 13+ and Tailwind CSS, focusing on delivering a smooth, accessible user experience.

## Tech Stack
- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Data Visualization**: Chart.js with react-chartjs-2
- **UI Components**: @headlessui/react
- **Icons**: @heroicons/react

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   ├── games/
│   │   │   ├── stroop/
│   │   │   ├── memory/
│   │   │   ├── matching/
│   │   │   └── speech/
│   │   ├── dashboard/
│   │   └── page.js
│   └── components/
│       ├── Header.js
│       └── Footer.js
├── public/
└── docs/
```

## Key Features
1. **Authentication**
   - Google OAuth integration
   - Protected routes for authenticated users
   - User session management

2. **Games**
   - Stroop Color Test
   - Memory Game
   - Object Matching
   - Speech Assessment

3. **Dashboard**
   - User profile information
   - Performance tracking
   - Progress visualization
   - Recent activity log

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create `.env.local` file with the following variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request with a clear description of the changes

## Code Style
- Use ES6+ features
- Follow Prettier formatting
- Use JSDoc comments for complex functions
- Keep components focused and reusable

## Game Implementation Details
Each game is implemented as a client-side component with the following features:

### Stroop Color Test
- Random color-word combinations
- Timed responses
- Score tracking
- CSV export of results

### Memory Game
- Grid-based card matching
- Timer for memorization phase
- Score system based on matches and attempts
- Progressive difficulty

### Object Matching Game
- Image-based object recognition
- Purpose matching logic
- Time-based scoring
- Results tracking

### Speech Assessment
- Audio recording capabilities
- Natural language processing integration
- Real-time feedback
- Score based on clarity and coherence