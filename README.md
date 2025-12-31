# UpNews Backend

> Automated positive news aggregation and AI-powered content generation service

UpNews Backend is a Node.js automation service that curates positive news from multiple English sources, intelligently categorizes them, and generates unique French articles using Claude AI. The service runs daily to deliver one high-quality news story per category.

## Features

- **Automated News Aggregation**: Fetches articles from 9 curated positive news RSS feeds
- **Smart Categorization**: 3-tier categorization system with 361 keywords across 7 categories
- **AI-Powered Content Generation**: Creates original French articles using Anthropic's Claude Sonnet 4
- **Multiple Writing Styles**: Randomly selects from Classic, Immersive, and Q&A formats
- **Duplicate Prevention**: 15-day URL tracking to avoid content recycling
- **Daily Scheduling**: Automated cron job execution at 14:00 UTC
- **Quality Monitoring**: Comprehensive logging for categorization performance analysis

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **AI**: Anthropic Claude Sonnet 4
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Railway.app
- **RSS Parsing**: rss-parser

## Categories

The service categorizes articles into 7 main categories:

- **Ecologie**: Environment, climate, sustainability, wildlife
- **Social**: Community, education, housing, social justice
- **Tech**: AI, robotics, digital innovation, technology
- **Santé**: Health, medicine, wellness, mental health
- **Culture**: Art, music, cinema, literature, heritage
- **Science**: Astronomy, physics, research, discoveries
- **Uncategorized**: Fallback for low-confidence matches

## Installation

### Prerequisites

- Node.js (v14 or higher)
- A Supabase account and project
- An Anthropic API key

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd upnews-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Usage

### Run Locally

Execute the news generation process:
```bash
npm start
```

### Analyze Categorization Logs

Review categorization performance:
```bash
node scripts/log-analyzer.js
```

## Project Structure

```
upnews-backend/
├── src/
│   ├── index.js              # Main orchestration script
│   ├── rss-parser.js         # RSS feed fetching and parsing
│   ├── category-mapper.js    # Article categorization engine
│   ├── article-generator.js  # Claude AI article generation
│   ├── prompts.js            # Writing style prompts
│   └── supabase-client.js    # Database client initialization
├── data/
│   ├── rss-sources.json      # 9 positive news RSS sources
│   └── category-mapping.json # Keyword mapping configuration
├── scripts/
│   └── log-analyzer.js       # Categorization performance analyzer
├── logs/                     # Categorization logs (JSON)
└── package.json
```

## How It Works

### Daily Workflow

1. **Fetch News**: Retrieves the top 5 articles from 9 curated RSS sources (~45 articles daily)

2. **Categorize Articles**: Uses a 3-tier categorization strategy:
   - **Tier 1**: Source category mapping (high confidence)
   - **Tier 2**: Keyword pattern matching in title/description (medium confidence)
   - **Tier 3**: Fallback to "uncategorized" (low confidence)

3. **Filter & Select**:
   - Checks database for existing articles scheduled for tomorrow
   - Filters out URLs used in the last 15 days
   - Keeps only medium/high confidence categorizations
   - Randomly selects 1 article per category

4. **Generate Content**:
   - Uses Claude Sonnet 4 with randomly selected writing styles
   - Produces 250-280 word French articles from English sources
   - Extracts title and maintains source attribution

5. **Store in Database**:
   - Inserts articles into Supabase with tomorrow's publication date
   - Includes title, summary, full content, category, and source URL

## RSS Sources

The service aggregates news from the following sources:

- Positive News
- Good News Network
- The Optimist Daily
- Happy Eco News
- Reasons to be Cheerful
- BBC Health
- ScienceDaily Environment
- The Better India
- The Good News Hub

## Writing Styles

### Classic
Traditional newspaper style with formal tone and structured paragraphs (250-280 words).

### Immersive
Narrative storytelling format with engaging sections and a hook (similar length).

### Q&A
Question-answer pedagogical style for complex topics (similar length).

## Deployment

### Railway.app Configuration

The service is configured for deployment on Railway with automated cron scheduling:

- **Schedule**: Daily at 14:00 UTC (4 PM French time)
- **Restart Policy**: ON_FAILURE (max 10 retries)
- **Builder**: Nixpacks (auto-detects Node.js)

Configuration files:
- `railway.json`: Service metadata
- `railway.toml`: Cron schedule and build settings

## Database Schema

### Articles Table

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  published_date DATE NOT NULL,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  source_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin access) | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude AI | Yes |

## Monitoring & Analysis

The service logs all categorization decisions to `logs/categorizations-YYYYMMDD.json`. Use the log analyzer to review performance:

```bash
node scripts/log-analyzer.js
```

The analyzer provides insights on:
- Categorization method distribution
- Confidence level statistics
- Category distribution
- Low-confidence articles needing keyword improvements

## Error Handling

- Exits with status code 0 on success
- Exits with status code 1 on error
- Logs errors to console for Railway monitoring
- Automatic retry via Railway's ON_FAILURE restart policy


**Built with**: Node.js, Claude AI, Supabase, and a commitment to spreading positive news.
