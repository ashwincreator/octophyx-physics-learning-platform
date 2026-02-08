# OctoPhyx - Quantum Physics Learning Platform

An interactive, AI-powered physics learning platform that generates explanations, animations, visualizations, and solutions for physics concepts. Built with modern web technologies and powered by advanced LLMs.

## 🐙 Features

### Core Learning Features
- **AI-Powered Explanations**: Generate detailed physics concept explanations with formulas and real-world applications
- **Interactive Visualizations**: Charts, graphs, and data tables for better understanding
- **Voice Input**: Hands-free learning with voice-to-text physics topic input
- **Physics Topics Library**: 27+ pre-loaded physics concepts across 7 categories (Mechanics, Waves, Electromagnetism, Quantum, Thermodynamics, Optics, Relativity)
- **Concept Cards**: Key formulas, definitions, and learning points with difficulty levels
- **Practice Problems**: AI-generated practice problems with step-by-step solutions

### Problem Solver
- **Submit Physics Problems**: Text or image-based problem input
- **AI-Generated Solutions**: Step-by-step solutions with formulas and diagrams
- **Solution Diagrams**: AI-generated visual diagrams for physics problems
- **Hint System**: Intelligent hints to guide learning without spoiling solutions
- **Problem History**: Save and bookmark problems for future reference
- **Difficulty Detection**: Automatic difficulty level assessment

### Design & UX
- **Blueprint Aesthetic**: Professional technical design with deep royal blue background and grid patterns
- **Responsive Design**: Optimized for desktop and mobile devices
- **LaTeX/Math Rendering**: Beautiful mathematical notation with KaTeX
- **Animated Mascot**: Engaging OctoPhyx quantum particle octopus logo with loading states
- **Dark Theme**: Eye-friendly blueprint-inspired color scheme

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL/TiDB database
- Google API Key (for image generation and maps)

### Installation

```bash
# Clone the repository
git clone https://github.com/ashwincreator/octophyx-physics-learning-platform.git
cd octophyx-physics-learning-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Push database schema
pnpm db:push

# Seed physics topics
pnpm tsx seed-physics-topics.mjs

# Start development server
pnpm dev
```

### Environment Variables
```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
VITE_GOOGLE_API_KEY=your_google_api_key
GOOGLE_API_KEY=your_google_api_key
VITE_APP_TITLE=OctoPhyx
VITE_APP_LOGO=octophyx-logo.png
```

## 📁 Project Structure

```
octophyx-physics-learning-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client and utilities
│   │   └── contexts/      # React contexts
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   ├── problemSolver.ts   # Problem solver procedures
│   └── _core/             # Core framework
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── storage/               # S3 storage helpers
```

## 🔧 Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- Wouter (routing)
- tRPC (type-safe API)
- Framer Motion (animations)
- KaTeX (math rendering)
- Recharts (data visualization)

### Backend
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL2
- Node.js

### AI & APIs
- LLM Integration (Claude/GPT)
- Google APIs (Images, Maps)
- Voice Transcription (Whisper)

## 📚 Usage

### Learning Physics Topics
1. Navigate to home page
2. Enter a physics topic or use voice input
3. Click "Generate" to get AI-powered explanation
4. View concept cards, formulas, visualizations, and practice problems
5. Click "Topics Library" to explore all available topics

### Solving Physics Problems
1. Click "Problem Solver" button
2. Enter problem text or upload an image
3. Select physics category (optional)
4. Click "Solve Problem"
5. View step-by-step solution with diagrams
6. Get hints if needed
7. Bookmark problems for later review

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/physics.search.test.ts

# Watch mode
pnpm test --watch
```

## 🗄️ Database Schema

### Main Tables
- **users**: User authentication and profiles
- **physicsTopics**: Pre-loaded physics concepts
- **generatedContent**: AI-generated explanations and content
- **structuredContent**: Parsed structured data for visualizations
- **physicsProblems**: Student-submitted problems
- **problemSolutions**: AI-generated solutions

## 🔐 Security

- Environment variables for sensitive data (API keys, secrets)
- OAuth authentication via Manus
- Protected tRPC procedures for user data
- Database connection pooling
- HTTPS-only in production

## 🚀 Deployment

The project is built for deployment on Manus platform:

1. Create a checkpoint via the Management UI
2. Click "Publish" button
3. Configure custom domain (optional)
4. Platform handles SSL, scaling, and monitoring

## 📝 API Routes

All API routes are under `/api/trpc`:

### Physics Procedures
- `physics.searchTopics` - Search physics topics
- `physics.getTopicsByCategory` - Get topics by category
- `physics.getAllTopics` - Get all topics
- `physics.generateContent` - Generate explanations
- `physics.getContent` - Get generated content
- `physics.getUserContent` - Get user's content history

### Problem Solver Procedures
- `problemSolver.submitProblem` - Submit a problem
- `problemSolver.generateSolution` - Generate solution
- `problemSolver.getProblemWithSolution` - Get problem and solution
- `problemSolver.getProblemHistory` - Get user's problems
- `problemSolver.toggleBookmark` - Bookmark/unbookmark
- `problemSolver.getHints` - Get hints for problem

### Auth Procedures
- `auth.me` - Get current user
- `auth.logout` - Logout user

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Manus](https://manus.im) platform
- Physics concepts from educational resources
- AI powered by advanced language models
- Community feedback and contributions

## 📧 Contact

For questions, suggestions, or issues:
- GitHub Issues: [Report a bug](https://github.com/ashwincreator/octophyx-physics-learning-platform/issues)
- GitHub Discussions: [Start a discussion](https://github.com/ashwincreator/octophyx-physics-learning-platform/discussions)

---

**Made with ❤️ for physics learners everywhere** 🐙✨
