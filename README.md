# Plumbline

A professional, mobile-first web application for home inspectors. Plumbline streamlines the walkthrough process by using AI (Claude Vision) to draft report findings from photos, which are then reviewed and finalized by a human professional.

## 🏛️ Design Philosophy: "The Quiet Notebook"
Plumbline is designed to be a professional instrument, not a flashy startup template.
- **Aesthetic**: Ink-on-paper. Warm off-white backgrounds, near-black text, and a single "plumb-blue" accent.
- **UX**: Single-column mobile layout, generous whitespace, and thumb-friendly interactions (min 48px tap targets).
- **Signature**: A subtle vertical plumb-line on the review screen indicates progress through the inspection.

## 🛡️ Safety First
The AI never makes a final decision. It drafts observations using cautious language ("appears to", "may indicate"). Every finding must be explicitly **Accepted**, **Edited**, or **Discarded** by the inspector.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Local Storage**: IndexedDB (via Dexie.js) for offline-first data and privacy.
- **AI**: Claude 3.5 Sonnet (Vision)
- **Validation**: Zod
- **PDF**: Print-optimized CSS

## 🚀 Getting Started

### Environment Variables
Create a `.env.local` file:
```env
ANTHROPIC_API_KEY=your_api_key_here
MODEL_NAME=claude-3-5-sonnet-20240620
```

### Installation
```bash
npm install
npm run dev
```

## 📂 Project Structure
- `/app`: Next.js App Router pages and API routes.
- `/components`: UI primitives and feature-specific components.
- `/hooks`: Custom hooks for DB and AI logic.
- `/lib`: Zod schemas and database configuration.
- `/styles`: Global CSS and print styles.

## 📄 License
MIT
