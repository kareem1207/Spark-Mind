# SparkMind - Dementia Early Detection System

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-blue)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0-green)](https://next-auth.js.org/)

A comprehensive Next.js frontend application for early dementia detection through cognitive assessment games and AI-powered analysis.

## 🧠 Features

### 🎮 Cognitive Assessment Games
- **Stroop Color Test** - Tests cognitive flexibility and processing speed
- **Memory Sequence Game** - Evaluates working memory and pattern recognition  
- **Object-Purpose Matching** - Assesses semantic memory and logical reasoning
- **Speech Fluency Test** - Analyzes verbal communication and language processing

### 📊 Analytics & Reporting
- Real-time performance tracking
- Interactive charts and visualizations
- Detailed cognitive assessment reports
- Progress monitoring over time

### 🔐 Authentication & Security
- Google OAuth integration via NextAuth.js
- Secure session management
- Protected routes and API endpoints

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Beautiful SVG illustrations and animations
- Accessible and intuitive interface
- Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google OAuth credentials
- Python backend server (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Backend API
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   
   # Firebase Configuration (Optional)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── games/             # Cognitive games
│   │   │   ├── stroop/        # Stroop Color Test
│   │   │   ├── memory/        # Memory Game
│   │   │   ├── matching/      # Object-Purpose Matching
│   │   │   └── speech/        # Speech Fluency Test
│   │   ├── api-config/        # API configuration
│   │   ├── layout.js          # Root layout
│   │   └── page.js            # Home page
│   ├── components/            # Reusable components
│   │   ├── games/             # Game-specific components
│   │   ├── Navigation.js      # Main navigation
│   │   ├── SessionProvider.js # Auth session provider
│   │   └── DashboardClient.js # Dashboard components
│   └── lib/                   # Utilities and configurations
│       └── auth.js            # NextAuth configuration
├── public/                    # Static assets (SVGs, images)
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind configuration
├── next.config.mjs           # Next.js configuration
└── .env.local                # Environment variables
```

## 🎮 Games Overview

### 1. Stroop Color Test
- **Purpose**: Measures cognitive flexibility and processing speed
- **Duration**: 5-10 minutes
- **Features**: 
  - Color-word conflict resolution
  - Reaction time measurement
  - Progressive difficulty levels
  - Performance analytics

### 2. Memory Sequence Game
- **Purpose**: Assesses working memory and pattern recognition
- **Duration**: 3-7 minutes
- **Features**:
  - Sequential pattern matching
  - Increasing sequence complexity
  - Visual and spatial memory testing
  - Accuracy tracking

### 3. Object-Purpose Matching
- **Purpose**: Evaluates semantic memory and logical reasoning
- **Duration**: 4-8 minutes
- **Features**:
  - Visual object recognition
  - Conceptual understanding assessment
  - Progressive difficulty levels
  - Real-world knowledge testing

### 4. Speech Fluency Test
- **Purpose**: Analyzes verbal communication and language processing
- **Duration**: 8-12 minutes
- **Features**:
  - Audio recording capabilities
  - Multiple speaking tasks
  - Speech pattern analysis
  - Fluency metrics

## 🔧 Configuration

### API Configuration
Access the API Configuration page at `/api-config` to:
- Configure backend server connection
- Test API endpoints
- Set up OpenAI API keys
- Configure Firebase services

### Customization
The application is highly customizable:
- **Colors**: Modify `tailwind.config.js` for theme colors
- **Games**: Add new games in `src/app/games/`
- **Components**: Extend or modify existing components
- **Analytics**: Integrate with your preferred analytics service

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Test Google OAuth login/logout
   - Verify session persistence
   - Check protected route access

2. **Cognitive Games**
   - Play through each game completely
   - Test different difficulty levels
   - Verify score calculation and saving

3. **Responsive Design**
   - Test on different screen sizes
   - Verify mobile navigation
   - Check touch interactions

### API Testing
Use the built-in API Configuration page to test:
- Backend connectivity
- Individual endpoint responses
- Error handling

## 🔌 Backend Integration

The frontend is designed to work with a Python backend providing:
- `/health` - Health check endpoint
- `/api/speech-to-text` - Speech analysis
- `/api/ai-analysis` - AI-powered cognitive analysis
- `/api/memory-game-score` - Game score processing
- `/api/sentiment-analysis` - Sentiment analysis

## 📦 Dependencies

### Core Dependencies
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - User interface library
- **NextAuth.js 5.0** - Authentication framework
- **Tailwind CSS 4.0** - Utility-first CSS framework

### UI & Visualization
- **Lucide React** - Beautiful icons
- **Chart.js** - Interactive charts
- **Recharts** - React chart library
- **Framer Motion** - Animation library

### Audio & Media
- **React Microphone Recorder** - Audio recording
- **Axios** - HTTP client for API requests

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
The application can be deployed on:
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **AWS Amplify** - AWS cloud hosting
- **Docker** - Containerized deployment

### Environment Variables for Production
Make sure to set all environment variables in your production environment:
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `NEXT_PUBLIC_BACKEND_URL` - Production backend URL
- Firebase configuration variables (if using Firebase)

## 🤝 Development Workflow

### Adding New Games
1. Create a new directory in `src/app/games/[game-name]/`
2. Add `page.js` for the game route
3. Create game component in `src/components/games/`
4. Update games list in `GamesClient.js`
5. Add appropriate icons and styling

### Modifying Existing Games
1. Game logic is in individual client components
2. Styling uses Tailwind CSS classes
3. State management uses React hooks
4. Results are passed to dashboard for tracking

### Code Style
- Use TypeScript-style JSDoc comments
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Maintain consistent file naming

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
