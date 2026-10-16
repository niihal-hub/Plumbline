# Plumbline - Home Inspection Assistant

## Safety Rules
- **Cautious Language**: Always use phrases like "appears to" and "may indicate". Never state definite diagnoses, costs, or code violations.
- **No Invention**: Never invent building codes.
- **Uncertainty**: If a photo is unclear, set `needs_closer_look: true` and specify what is missing. Do not guess.
- **Disclaimer**: Every report must display: "Draft prepared with AI assistance and reviewed by the inspector. Not a substitute for professional judgment."
- **Privacy**: Photos/notes stay in IndexedDB. Server only for analysis; no server-side storage.

## Design Rules ("Quiet Notebook")
- **Palette**: 
  - Background: `#FAF8F4` (Off-white paper)
  - Text: `#1A1A18` (Near-black ink)
  - Accent: `#1F3A5F` (Plumb-blue)
  - Borders: 1px, 10% ink
- **Typography**:
  - Headings: Refined Serif (Instrument Serif / Fraunces)
  - UI: Clean Sans (Geist / Inter)
  - Data: Monospace (measurements, dates)
  - Body: 1.6 line height, generous whitespace
- **UI Elements**:
  - Radius: 6px
  - Taps: Min 48px
  - Borders: Hairline dividers instead of boxes. No cards-inside-cards.
  - Icons: Thin 1.5px line icons (Lucide).
  - No gradients, no shadows, no glassmorphism.
- **Severity Indicators**: Small filled dots + text labels.
  - Info: Grey, Monitor: Amber, Repair: Orange, Urgent: Red.
- **Signature Detail**: Thin vertical plumb line on review screen with a sliding progress dot.

## Technical Constraints
- Next.js App Router + TypeScript + Tailwind.
- Local-first: IndexedDB for all storage.
- Analysis: Claude Vision API $\rightarrow$ Zod Validation $\rightarrow$ Retry once.
- Export: Print-optimized CSS for PDF.
