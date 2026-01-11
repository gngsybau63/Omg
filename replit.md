# Vaultix v1.3

## Overview
Vaultix is a React + TypeScript security dashboard application built with Vite.

## Project Structure
- `App.tsx` - Main application component
- `index.tsx` - React entry point
- `index.html` - HTML template with Tailwind CSS
- `components/` - React components (AnalysisPanel, Terminal)
- `services/` - Service layer (geminiService for Google Gemini AI)
- `types.ts` - TypeScript type definitions
- `vite.config.ts` - Vite configuration

## Tech Stack
- React 19
- TypeScript
- Vite 6
- Tailwind CSS (via CDN)
- Google Gemini AI (@google/genai)
- Lucide React (icons)

## Development
Run `npm run dev` to start the development server on port 5000.

## Environment Variables
- `GEMINI_API_KEY` - API key for Google Gemini AI integration

## Recent Changes
- 2026-01-11: Configured for Replit environment (port 5000, allowed hosts)
