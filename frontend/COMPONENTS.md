# Component Documentation

This document provides detailed information about the components used in the SparkMind frontend application.

## Table of Contents

1. [Layout Components](#layout-components)
2. [Authentication Components](#authentication-components)
3. [Game Components](#game-components)
4. [Dashboard Components](#dashboard-components)
5. [Utility Components](#utility-components)

## Layout Components

### Navigation.js
**Location**: `src/components/Navigation.js`

Main navigation component with responsive design and user session management.

**Features**:
- Responsive mobile/desktop navigation
- User authentication status display
- Dynamic navigation items based on session
- Google OAuth integration
- Profile picture and user info display

**Props**: None (uses NextAuth session)

**Dependencies**:
- `next-auth/react` for session management
- `lucide-react` for icons
- `next/image` for optimized images

### Layout.js
**Location**: `src/app/layout.js`

Root layout component that wraps all pages.

**Features**:
- Global styles and Tailwind CSS
- Session provider wrapper
- Navigation component integration
- Metadata configuration

## Authentication Components

### SessionProvider.js
**Location**: `src/components/SessionProvider.js`

Wrapper component for NextAuth session context.

**Features**:
- Provides authentication context to all child components
- Handles session state management
- Enables session hooks throughout the app

**Props**:
- `children` (ReactNode) - Child components to wrap
- `session` (Session) - Initial session data

### SignIn Page
**Location**: `src/app/auth/signin/page.js`

Custom sign-in page with Google OAuth integration.

**Features**:
- Custom branded sign-in interface
- Google OAuth button
- Responsive design with SVG decorations
- Error handling and loading states

## Game Components

### Stroop Color Test

#### StroopGameClient.js
**Location**: `src/components/games/StroopGameClient.js`

Interactive Stroop Color Test implementation.

**Features**:
- Color-word conflict testing
- Reaction time measurement
- Progressive difficulty levels
- Score calculation and analytics
- Pause/resume functionality

**Game Flow**:
1. Instructions screen
2. Practice round (optional)
3. Multiple test rounds with increasing difficulty
4. Results and performance analysis

**State Management**:
- Game state (instructions, playing, paused, completed)
- Current word and color data
- Score and reaction time tracking
- Error count and accuracy calculation

### Memory Game

#### MemoryGameClient.js
**Location**: `src/components/games/MemoryGameClient.js`

Card-based memory game with sequence challenges.

**Features**:
- Card matching mechanics
- Progressive sequence length
- Visual feedback and animations
- Performance tracking
- Multiple difficulty levels

**Game Mechanics**:
- Random card generation with emoji symbols
- Sequence display and user input
- Match validation and scoring
- Time-based challenges

### Object-Purpose Matching

#### MatchingGameClient.js
**Location**: `src/components/games/MatchingGameClient.js`

Semantic memory test matching objects with purposes.

**Features**:
- Object-purpose pair matching
- Three difficulty levels
- Visual object representation with emojis
- Semantic understanding assessment
- Detailed feedback and explanations

**Data Structure**:
```javascript
{
  object: '🔑',
  objectName: 'Key',
  purpose: '🚪',
  purposeName: 'Door',
  description: 'Opens doors and locks'
}
```

### Speech Fluency Test

#### SpeechTestClient.js
**Location**: `src/components/games/SpeechTestClient.js`

Audio recording and speech analysis component.

**Features**:
- Microphone access and recording
- Multiple speaking task types
- Timed recording sessions
- Audio blob generation and storage
- Speech analysis preparation

**Task Types**:
1. **Picture Description** - Visual scene description
2. **Story Telling** - Personal narrative sharing
3. **Process Explanation** - Step-by-step instructions
4. **Opinion Expression** - Abstract thinking assessment

**Recording Features**:
- WebRTC audio recording with MediaRecorder API
- Real-time recording timer
- Auto-stop on time limit
- Audio quality optimization
- Cross-browser compatibility

## Dashboard Components

### DashboardClient.js
**Location**: `src/components/DashboardClient.js`

Main dashboard with analytics and progress tracking.

**Features**:
- Performance overview cards
- Interactive charts (Chart.js/Recharts)
- Recent test results
- Progress tracking over time
- Quick game access

**Chart Types**:
- Performance trends (line chart)
- Test score distribution (bar chart)
- Cognitive domain radar chart
- Progress indicators

**Mock Data Structure**:
```javascript
{
  totalTests: 15,
  averageScore: 87,
  improvementRate: 12,
  testsThisWeek: 3,
  recentResults: [...],
  performanceData: [...]
}
```

### GamesClient.js
**Location**: `src/components/GamesClient.js`

Games listing and selection interface.

**Features**:
- Game cards with descriptions
- Difficulty indicators
- Duration estimates
- Progress tracking
- Quick start functionality

**Game Data Structure**:
```javascript
{
  id: 'stroop',
  title: 'Stroop Color Test',
  description: '...',
  icon: '🎨',
  difficulty: 'Medium',
  duration: '5 minutes',
  color: 'from-purple-500 to-indigo-600',
  bgColor: 'from-purple-50 to-indigo-50',
  features: ['Reaction Time', 'Cognitive Flexibility'],
  href: '/games/stroop'
}
```

## Utility Components

### ApiConfigClient.js
**Location**: `src/components/ApiConfigClient.js`

API configuration and testing interface.

**Features**:
- Backend URL configuration
- API key management
- Connection testing
- Endpoint validation
- Configuration persistence

**Configuration Sections**:
1. **Backend Configuration** - Server URL settings
2. **API Keys** - OpenAI and other service keys
3. **Firebase Configuration** - Firebase service setup
4. **API Testing** - Endpoint connectivity testing

## Component Patterns

### Common Patterns Used

1. **State Management**:
   ```javascript
   const [gameState, setGameState] = useState('instructions')
   const [score, setScore] = useState(0)
   const [isLoading, setIsLoading] = useState(false)
   ```

2. **Effect Hooks**:
   ```javascript
   useEffect(() => {
     // Initialize component
     return () => {
       // Cleanup
     }
   }, [dependencies])
   ```

3. **Conditional Rendering**:
   ```javascript
   {gameState === 'playing' ? (
     <GameComponent />
   ) : (
     <InstructionsComponent />
   )}
   ```

4. **Event Handlers**:
   ```javascript
   const handleGameAction = (action) => {
     setGameState(action)
     // Additional logic
   }
   ```

### Styling Patterns

1. **Responsive Design**:
   ```javascript
   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
   ```

2. **State-based Styling**:
   ```javascript
   className={`button ${isActive ? 'bg-blue-600' : 'bg-gray-400'}`}
   ```

3. **Gradient Backgrounds**:
   ```javascript
   className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
   ```

### Performance Considerations

1. **Lazy Loading**: Components use dynamic imports where appropriate
2. **Memoization**: Complex calculations are memoized
3. **Effect Dependencies**: Carefully managed to prevent unnecessary re-renders
4. **Image Optimization**: Next.js Image component for optimized loading

### Accessibility Features

1. **ARIA Labels**: Screen reader support
2. **Keyboard Navigation**: Full keyboard accessibility
3. **Focus Management**: Proper focus handling
4. **Color Contrast**: WCAG compliant color schemes

## Testing Guidelines

### Component Testing
- Test rendering in different states
- Verify event handlers
- Check prop handling
- Test error boundaries

### Integration Testing
- Test component interactions
- Verify data flow
- Check route navigation
- Test authentication flows

### Responsive Testing
- Mobile viewport testing
- Tablet compatibility
- Desktop layout verification
- Touch interaction testing

## Development Guidelines

1. **File Naming**: Use PascalCase for components
2. **Import Order**: External libs, internal components, relative imports
3. **Props Validation**: Use PropTypes or TypeScript
4. **Error Handling**: Implement proper error boundaries
5. **Loading States**: Always provide loading feedback
6. **Responsive Design**: Mobile-first approach

## Future Enhancements

1. **TypeScript Migration**: Convert to TypeScript for better type safety
2. **Component Library**: Extract reusable components
3. **Testing Suite**: Comprehensive test coverage
4. **Performance Monitoring**: Real-time performance metrics
5. **Internationalization**: Multi-language support