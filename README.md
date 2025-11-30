# What Should I Eat Now - Development Plan

## Product Overview

**Core Value Proposition**: Help users decide what to eat by understanding their preferences through an interactive quiz, then providing personalized food recommendations with direct ordering options from multiple food delivery platforms.

**User Journey**:
1. User lands on homepage and starts interactive quiz
2. Answers questions about preferences (cuisine, spice level, budget, dietary restrictions, mood, etc.)
3. Receives personalized food recommendations
4. Can compare prices and delivery times across Zomato, Swiggy, and other vendors
5. Redirects to chosen platform to complete order

---

## Tech Stack Options

### Option A: Modern JavaScript Stack (Recommended for AI-assisted development)
- **Frontend**: React + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: OpenAI API or Anthropic Claude API
- **Vector DB** (Stage 4): Pinecone or Supabase Vector
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Why**: Excellent AI copilot support, large community, easy deployment

### Option B: Python Full-Stack (Better for ML/AI work)
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI + Python
- **Database**: PostgreSQL with SQLAlchemy
- **AI/ML**: LangChain + OpenAI/Claude
- **Vector DB**: Weaviate or ChromaDB
- **Hosting**: Vercel (frontend) + Railway (backend)
- **Why**: Stronger ML ecosystem, better RAG libraries

### Option C: Full Next.js (Fastest MVP)
- **Full-Stack**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL + Vector search built-in)
- **Styling**: TailwindCSS + shadcn/ui
- **AI/ML**: Vercel AI SDK + OpenAI
- **Hosting**: Vercel (all-in-one)
- **Why**: Fastest to build, single codebase, best DX with AI tools

**Recommendation**: Start with **Option C** for MVP speed, can migrate later if needed.

---

## Stage-by-Stage Development Plan

### STAGE 1: Interactive Quiz MVP (Week 1-2, ~40-50 hours)

**Goal**: Working quiz interface with smooth UX that captures user preferences

**Features**:
- Landing page with compelling CTA
- Multi-step quiz (8-10 questions):
  - Cuisine preference (multi-select: Indian, Chinese, Italian, Mexican, etc.)
  - Spice level (slider: 0-5)
  - Budget range (slider: ₹100-₹2000)
  - Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
  - Meal type (breakfast, lunch, dinner, snacks)
  - Mood/occasion (comfort food, healthy, celebration, quick bite)
  - Portion size (light, regular, heavy)
  - Cooking preference (delivery only, willing to cook, meal kit)
- Progress indicator
- Back/Next navigation
- Results page (static recommendations for now)

**Tech Implementation**:
- Next.js 14 with App Router
- TailwindCSS + shadcn/ui components
- React Hook Form for form state
- Framer Motion for animations
- Local state management (Context API or Zustand)

**Deliverables**:
- Responsive quiz interface (mobile-first)
- Smooth transitions between questions
- Form validation
- Results page template

---

### STAGE 2: Basic Backend with Rule-Based Recommendations (Week 3-4, ~40-50 hours)

**Goal**: Functional recommendation engine using predefined mapping/rules

**Features**:
- API endpoints for quiz submission
- Rule-based recommendation logic
- Database to store food items and mappings
- User preferences storage (optional, for analytics)

**Recommendation Logic** (Rule-Based):
```
IF cuisine=Indian AND spice>=4 AND budget>400 THEN recommend=[Biryani, Curry Thali, Tandoori]
IF mood=comfort AND vegetarian=true THEN recommend=[Mac&Cheese, Pizza, Pasta]
IF budget<200 AND meal=snacks THEN recommend=[Sandwich, Burger, Rolls]
```

**Database Schema**:
```
Food Items:
- id, name, cuisine, spice_level, avg_price, meal_type, is_veg, tags

User Sessions:
- id, preferences_json, recommendations, timestamp

Recommendation Mappings:
- id, rule_conditions, food_item_ids, priority_score
```

**Tech Implementation**:
- Next.js API routes (or FastAPI if choosing Python)
- PostgreSQL database (Supabase for easy setup)
- Prisma ORM (or SQLAlchemy)
- Seed data: 50-100 popular food items with metadata

**Deliverables**:
- REST API for quiz submission
- Database with seeded food items
- Rule-based matching algorithm (scoring system)
- Results page showing 5-10 recommendations

---

### STAGE 3: Enhanced AI-Powered Recommendations (Week 5-7, ~60-70 hours)

**Goal**: Replace rule-based system with intelligent AI that feels accurate and personalized

**Features**:
- ML-based recommendation scoring
- User feedback loop (thumbs up/down on suggestions)
- A/B testing framework
- Recommendation explanation ("We suggested this because...")
- Learning from user interactions

**AI Approach** (Hybrid Model):
1. **Feature Engineering**: Convert user preferences to feature vector
2. **Similarity Matching**: Compare with food item embeddings
3. **LLM Enhancement**: Use GPT-4/Claude to refine and explain suggestions
4. **Feedback Learning**: Adjust weights based on user interactions

**Implementation Strategy**:
```
1. Generate embeddings for all food items (OpenAI embeddings API)
2. Store embeddings in vector database
3. Convert quiz answers to embedding vector
4. Perform similarity search
5. Re-rank with LLM considering context
6. Return top N with explanations
```

**Tech Stack Additions**:
- OpenAI API (embeddings + GPT-4)
- Supabase Vector extension (or Pinecone)
- Caching layer (Redis/Upstash)
- Analytics (Posthog or Mixpanel)

**Deliverables**:
- Embedding generation pipeline
- Vector similarity search
- LLM-powered refinement
- Feedback collection UI
- Analytics dashboard (basic)

---

### STAGE 4: RAG Integration for Better Search (Week 8-9, ~40-50 hours)

**Goal**: Enable semantic search and context-aware recommendations using RAG

**Features**:
- Natural language queries ("I want something spicy but not too heavy")
- Context from previous interactions
- Knowledge base of food descriptions, reviews, ingredients
- Dietary restriction reasoning
- Seasonal/trending recommendations

**RAG Architecture**:
```
1. Knowledge Base:
   - Food descriptions (scraped/curated)
   - Nutritional information
   - User reviews and ratings
   - Seasonal availability
   - Regional specialties

2. RAG Pipeline:
   - User query → Embedding
   - Retrieve relevant chunks from KB
   - Augment with user preference context
   - Generate personalized recommendation with LLM
   - Return with citations/reasoning
```

**Tech Implementation**:
- LangChain or LlamaIndex for RAG
- Chunking strategy for food knowledge base
- Prompt engineering for accurate suggestions
- Caching for common queries

**Data Sources**:
- Curated food database (create or use existing APIs)
- Nutritional APIs (USDA FoodData Central - free)
- Web scraping (recipes, reviews) - ethical/legal considerations

**Deliverables**:
- Populated vector knowledge base
- RAG query pipeline
- Natural language search interface
- Improved recommendation accuracy (target: 80%+ satisfaction)

---

### STAGE 5: Vendor API Integration (Week 10-12, ~60-80 hours)

**Goal**: Connect to food delivery platforms for price comparison and ordering

**Vendor Research & Integration**:

**Available APIs**:
1. **Zomato API** (Limited public access, apply for partnership)
2. **Swiggy API** (No public API, requires business partnership)
3. **Alternatives**:
   - Web scraping (legal grey area, fragile)
   - Affiliate programs (limited data)
   - Aggregator APIs (paid services)

**Realistic Approach for MVP**:
- Start with **mock data** for vendor prices/delivery
- Apply for official API access (can take weeks/months)
- Consider **Rapido** or **Dunzo** (potentially easier API access)
- Use **Google Places API** for restaurant data
- Implement **deep linking** to vendor apps/websites

**Features**:
- Display food items across multiple vendors
- Price comparison table
- Estimated delivery time
- User ratings aggregation
- Direct links/redirects to vendor platforms
- Fallback to Google Maps/search if no API

**Technical Implementation**:
```
1. Create vendor abstraction layer
2. Implement individual vendor adapters
3. Unified data model for results
4. Caching strategy (vendor data changes frequently)
5. Error handling and fallbacks
6. Rate limiting compliance
```

**Deliverables**:
- Vendor integration framework
- Price comparison UI
- Redirect mechanism
- Error handling for unavailable vendors
- Admin panel for managing vendor APIs

---

## Timeline Summary

| Stage | Duration | Effort | Cumulative |
|-------|----------|--------|------------|
| Stage 1: Quiz MVP | 2 weeks | 40-50h | 2 weeks |
| Stage 2: Basic Backend | 2 weeks | 40-50h | 4 weeks |
| Stage 3: AI Enhancement | 3 weeks | 60-70h | 7 weeks |
| Stage 4: RAG Integration | 2 weeks | 40-50h | 9 weeks |
| Stage 5: Vendor APIs | 3 weeks | 60-80h | 12 weeks |
| **TOTAL** | **12 weeks** | **240-300h** | **3 months** |

**Realistic Timeline** (Solo, Intermediate + AI Tools):
- **MVP Launch** (Stages 1-2): 4-5 weeks
- **AI-Enhanced Version**: 8-9 weeks
- **Full Product** (with vendor integration): 12-15 weeks

**Effort Distribution** (assuming 20-25 hours/week):
- Development: 60%
- Testing/Debugging: 20%
- Learning/Research: 15%
- Deployment/DevOps: 5%

---

## Immediate Next Steps

1. **Choose tech stack** (recommend Option C: Next.js + Supabase)
2. **Set up development environment**
   - Install Node.js, VS Code, Git
   - Create GitHub repository
   - Set up Next.js project with TypeScript
   - Configure TailwindCSS and shadcn/ui
3. **Design quiz questions** (content strategy)
4. **Create wireframes/mockups** (Figma or Excalidraw)
5. **Start Stage 1 development**

---

## Success Metrics (KPIs)

**Stage 1-2 MVP**:
- Quiz completion rate >70%
- Page load time <2s
- Mobile responsive (all devices)

**Stage 3-4 AI**:
- Recommendation accuracy (user satisfaction) >75%
- Response time <3s
- User return rate >30%

**Stage 5 Full Product**:
- Vendor data freshness <24h
- Successful redirects >90%
- Cross-vendor price savings highlighted

---

## Risk Mitigation

**Technical Risks**:
- ❌ Vendor APIs not available → ✅ Use mock data + deep links
- ❌ AI costs too high → ✅ Implement aggressive caching
- ❌ Performance issues → ✅ Use edge functions, CDN
- ❌ Database scaling → ✅ Start with Supabase (auto-scaling)

**Timeline Risks**:
- Solo development can face blockers → Build in 20% buffer time
- API approval delays → Don't block on Stage 5, launch earlier
- Scope creep → Stick to MVP features per stage

---

## Cost Estimates (Monthly, Production)

**MVP (Stages 1-2)**:
- Hosting: $0-20 (Vercel free tier)
- Database: $0-25 (Supabase free tier)
- **Total: $0-45/month**

**AI-Enhanced (Stages 3-4)**:
- Above + OpenAI API: $50-200/month (depends on usage)
- Vector DB: $0-70 (Supabase or Pinecone free tier)
- **Total: $50-315/month**

**Full Product (Stage 5)**:
- Above + Vendor APIs: $0-100 (most require partnerships)
- Caching/Redis: $0-10 (Upstash free tier)
- **Total: $50-425/month**

Scale-up costs kick in at ~1000+ daily active users.

---

## Development Environment Setup

```bash
# Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL (local or Supabase)
- Git
- VS Code + extensions (ESLint, Prettier, Tailwind)

# Project initialization
npx create-next-app@latest what-should-i-eat-now
cd what-should-i-eat-now

# Install dependencies
npm install @radix-ui/react-slider
npm install @radix-ui/react-checkbox
npm install framer-motion
npm install zustand
npm install react-hook-form
npm install zod

# Development tools
npm install -D prisma
npm install @prisma/client

# AI/ML (Stage 3+)
npm install openai
npm install @supabase/supabase-js
```

---

## Notes

- **AI Tool Usage**: Leverage ChatGPT/Claude/Cursor for code generation, debugging, and learning
- **Learning Resources**: Allocate 15% of time for tutorials and documentation
- **Testing**: Manual testing initially, add automated tests in Stage 3
- **Deployment**: Deploy each stage to production for real-world testing
- **User Feedback**: Get 5-10 beta users after Stage 2 for valuable insights
- **Iteration**: Be prepared to adjust based on user feedback
- **API Access**: Start vendor API applications early (Stage 2) as approval takes time
