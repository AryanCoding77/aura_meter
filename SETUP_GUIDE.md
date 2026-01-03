# 🚀 Aura Meter Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Your `.env` file is already configured with:
- ✅ Fireworks AI API key
- ✅ Supabase credentials (for future features)
- ✅ Razorpay key (for payments)

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🧪 Testing the AI Pipeline

### Upload and Analyze

1. Navigate to `/upload` route
2. Upload an image (screenshot, selfie, profile picture, etc.)
3. Click "Analyze Aura"
4. Wait 10-30 seconds for AI processing
5. View your results with:
   - Aura Score (0-100)
   - Personalized Roast
   - Personality Insights
   - Strengths & Weaknesses
   - Improvement Tips
   - Shareable One-liner

**Note:** The app uses real AI models from Fireworks.ai:
- **Qwen 2.5 VL 32B** for vision analysis
- **LLaMA 3.3 70B** for roast generation

---