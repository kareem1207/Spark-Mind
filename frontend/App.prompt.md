Create a Next.js frontend application for a Dementia Early Detection System with the following specifications:

Project Requirements:

1. Build a responsive web application using Next.js and Tailwind CSS
2. Integrate Google Authentication for user login
3. Implement a dashboard interface for user progress and results
4. Develop four cognitive assessment games
5. Connect with Python backend API (localhost:8000) for data processing
6. Generate and display results report (PDF) and risk score

Technical Specifications:

Frontend Stack:

- Next.js (JavaScript)
- Tailwind CSS
- Google OAuth for authentication
- RESTful API integration

Core Features:

1. Authentication:

   - Google Sign-in/Sign-out
   - Protected routes
   - Session management

2. Dashboard:

   - User profile overview
   - Test history and progress
   - Risk score visualization
   - Download reports functionality

3. Cognitive Assessment Games:
   a. Stroop Color Test:

   - Display color words in varying ink colors
   - Track response time and accuracy
   - Implement both congruent and incongruent conditions

   b. Memory Game:

   - Card matching interface
   - Track attempts and completion time
   - Multiple difficulty levels

   c. Object-Purpose Matching:

   - Visual matching of objects with their uses
   - Progressive difficulty levels
   - Score tracking

   d. Speech Test:

   - Audio recording capability
   - Topic prompt display
   - Timer functionality
   - Audio file handling

API Integration:

- POST /api/games/results - Submit game results
- POST /api/speech/upload - Upload speech recordings
- GET /api/results/report - Retrieve PDF report
- GET /api/results/score - Fetch risk score

Documentation Requirements:

- Maintain markdown documentation in /frontend/docs
- Document all component specifications
- Include API integration details
- Add setup and deployment instructions

Development Constraints:

- Work exclusively within the frontend directory
- Maintain clean, modular code structure
- Follow Next.js best practices
- Implement responsive design using Tailwind CSS
- Ensure cross-browser compatibility
- Add error handling and loading states

Performance Requirements:

- Optimize asset loading
- Implement lazy loading for components
- Ensure smooth game animations
- Minimize API calls
- Handle offline capabilities
