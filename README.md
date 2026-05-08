# PoW HTML IDE

A high-performance, minimalist HTML/CSS/JS playground with AI-powered code generation, offloaded to Trigger.dev for reliable long-running tasks.

## Features

- **Live Preview**: Real-time rendering of your code.
- **AI Assistant**: Generate and update code using OpenRouter (Gemini, Claude, GPT-4, etc.).
- **Background Tasks**: Long AI generations are offloaded to Trigger.dev to bypass Cloudflare Worker limits.
- **Real-time Streaming**: Watch the AI write code in real-time even when running in the background.
- **Modern UI**: Sleek dark mode, responsive layout, and CodeMirror editor.

## Prerequisites

- Node.js (v18+)
- [OpenRouter API Key](https://openrouter.ai/)
- [Trigger.dev Account](https://trigger.dev/)

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NUXT_OPEN_ROUTER_KEY=your_openrouter_api_key
   TRIGGER_SECRET_KEY=your_trigger_secret_key
   # Set to true to bypass Trigger.dev and use direct streaming (subject to CF limits)
   # DISABLE_TRIGGER_DEV=false
   ```

## Development Guidelines

To run the project locally, you need two terminal sessions:

1. **Nuxt Dev Server**:
   Starts the frontend and API routes.
   ```bash
   npm run dev
   ```

2. **Trigger.dev Dev Worker**:
   Starts the local worker to handle background AI tasks.
   ```bash
   npm run trigger:dev
   ```

## Production Guidelines

### 1. Deploying Background Tasks (Trigger.dev)

Before deploying the frontend, you must deploy your tasks to Trigger.dev:

```bash
npm run trigger:deploy
```
*Note: Make sure to add your `NUXT_OPEN_ROUTER_KEY` to the environment variables in the Trigger.dev dashboard for your project.*

### 2. Deploying Frontend (Cloudflare Pages)

The project is optimized for Cloudflare Pages.

**Build the app**:
```bash
npm run build
```

**Deploy to Cloudflare**:
```bash
npm run deploy
```

### 3. Environment Variables in Production

Ensure the following variables are set in your Cloudflare Pages dashboard:
- `NUXT_OPEN_ROUTER_KEY`
- `TRIGGER_SECRET_KEY`

## Architecture

- **Framework**: Nuxt 3 (Vue 3, TypeScript)
- **Editor**: CodeMirror 6
- **Styling**: Tailwind CSS
- **AI**: OpenRouter SDK
- **Task Orchestration**: Trigger.dev v3 (Realtime Streams)
- **Deployment**: Cloudflare Pages / Workers
