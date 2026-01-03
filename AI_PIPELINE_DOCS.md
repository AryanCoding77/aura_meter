# 🔗 AURA METER — AI MODEL CHAIN DOCUMENTATION

## Overview

The Aura Meter uses a **two-stage AI pipeline** powered by Fireworks.ai:

1. **Qwen 2.5 VL 32B** (Vision Analysis) - Objective visual and profile analysis
2. **LLaMA 3.3 70B Instruct** (Roast Generation) - Personality insights, roasts, and aura scoring

---

## 🏗️ Architecture

```
User Uploads Image
       ↓
Convert to Base64
       ↓
Phase 1: Qwen 2.5 VL 32B Vision Analysis
       ↓
Structured JSON Output (Profile Details)
       ↓
Phase 2: LLaMA 3.3 70B Roast Generation
       ↓
Final Aura Result (Score, Roast, Strengths, Weaknesses)
       ↓
Display Results Page
```

---

## 📁 File Structure

```
src/
├── lib/
│   └── fireworks.ts          # AI pipeline implementation
├── pages/
│   ├── Upload.tsx            # Image upload interface
│   └── Results.tsx           # Results display page
└── App.tsx                   # Route configuration
```

---

## 🔧 Implementation Details

### Phase 1: Vision Analysis (Qwen 2.5 VL 32B)

**Model:** `accounts/fireworks/models/qwen2p5-vl-32b-instruct`

**Purpose:** Extract objective visual signals and profile details from the uploaded image.

**Input:**
- Base64 encoded image
- System prompt requesting thorough objective analysis

**Output JSON Structure:**
```json
{
  "image_type": "selfie | chat_screenshot | social_media | mirror_photo | profile_picture | other",
  "visual_tone": "confident | neutral | chaotic | minimal | flashy | professional | casual | unclear",
  "notable_elements": ["element1", "element2", ...],
  "aesthetic_vibe": ["clean", "messy", "dramatic", "professional", ...],
  "confidence_indicators": "low | medium | high | unclear",
  "overall_impression": "2-3 sentence neutral description",
  "profile_details": "Any visible profile information or contextual details"
}
```

**Configuration:**
- Temperature: 0.2 (very low for consistent, objective analysis)
- Max tokens: 1500
- Focus: Thorough, objective, non-judgmental visual analysis

---

### Phase 2: Roast Generation (LLaMA 3.3 70B)

**Model:** `accounts/fireworks/models/llama-v3p3-70b-instruct`

**Purpose:** Generate personalized roast, aura score, strengths, weaknesses, and improvement tips.

**Input:**
- Vision analysis JSON from Phase 1
- System prompt defining roast style and guidelines
- User prompt with detailed formatting instructions

**Output JSON Structure:**
```json
{
  "aura_score": 0-100,
  "aura_label": "Short descriptor (e.g., Main Character Energy)",
  "roast": "2-4 sentence witty, tasteful roast",
  "personality_insight": "2-3 sentence deeper analysis",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "improvement_tips": ["tip1", "tip2", "tip3"],
  "shareable_one_liner": "Instagram-ready quote with score"
}
```

**Configuration:**
- Temperature: 0.7 (balanced for creative yet consistent roasts)
- Max tokens: 2000
- Response format: JSON object
- Tone: Witty, clever, tasteful (no profanity or sensitive topics)

---

## 🎯 Key Features

### Safety & Ethics
- ✅ No assumptions about identity, race, gender, or health
- ✅ Entertainment-focused, not medical/psychological advice
- ✅ Tasteful roasts without cruelty
- ✅ Objective visual analysis only

### User Experience
- ✅ Drag & drop file upload
- ✅ Real-time preview
- ✅ Loading states with progress feedback
- ✅ Error handling with user-friendly messages
- ✅ Shareable results for social media
- ✅ Mobile-responsive design

### Technical
- ✅ Type-safe TypeScript implementation
- ✅ Async/await error handling
- ✅ File size validation (max 10MB)
- ✅ Image format validation
- ✅ Base64 encoding for API compatibility
- ✅ JSON parsing with fallback error handling

---

## 🚀 Usage

### For Users

1. Navigate to `/upload`
2. Upload or drag-drop an image
3. Click "Analyze Aura"
4. Wait ~10-30 seconds for AI processing
5. View results on `/results` page
6. Share on social media

### For Developers

```typescript
import { analyzeAura } from "@/lib/fireworks";

// Analyze an image file
const result = await analyzeAura(imageFile);

if (result.success) {
  console.log("Aura Score:", result.data.aura_score);
  console.log("Roast:", result.data.roast);
} else {
  console.error("Error:", result.error);
}
```

---

## 🔑 Environment Variables

Required in `.env`:

```env
VITE_FIREWORKS_API_URL=https://api.fireworks.ai/inference/v1/chat/completions
VITE_FIREWORKS_API_KEY=your_api_key_here
```

Get your API key at: https://fireworks.ai/api-keys

---

## 📊 Response Times

- **Vision Analysis:** ~5-10 seconds
- **Roast Generation:** ~5-15 seconds
- **Total Pipeline:** ~10-30 seconds

Times vary based on:
- Image size and complexity
- API server load
- Network latency

---

## 🛡️ Error Handling

The pipeline handles:
- Invalid file types
- File size limits (10MB max)
- API failures with retry logic
- JSON parsing errors
- Network timeouts
- Missing API keys

All errors are user-friendly and actionable.

---

## 🎨 Results Display

The results page shows:
- **Aura Score** (0-100) with color-coded display
- **Aura Label** (e.g., "Silent Confidence")
- **The Roast** (witty AI-generated commentary)
- **Personality Insight** (deeper analysis)
- **Improvement Tips** (3 actionable suggestions)
- **Shareable One-liner** (Instagram-ready quote)

Color coding:
- 80-100: Green (Excellent)
- 60-79: Blue (Good)
- 40-59: Yellow (Average)
- 20-39: Orange (Below Average)
- 0-19: Red (Needs Work)

---

## 🔄 Future Enhancements

Potential improvements:
- [ ] Result history tracking
- [ ] User accounts and profiles
- [ ] Comparison with previous scores
- [ ] Social sharing with custom graphics
- [ ] Batch analysis for multiple images
- [ ] Advanced filtering and moderation
- [ ] A/B testing different prompts
- [ ] Analytics dashboard

---

## 📝 Prompt Engineering Notes

### Vision Prompt Strategy
- Emphasize objectivity and neutrality
- Request structured JSON output
- Avoid subjective interpretations
- Focus on observable visual elements

### Roast Prompt Strategy
- Define clear tone guidelines (witty, not cruel)
- Provide explicit content restrictions
- Request specific JSON structure
- Balance entertainment with insight
- Ensure shareability for social media

---

## 🐛 Troubleshooting

**Issue:** "Failed to extract JSON from response"
- **Solution:** Check API response format, ensure models support JSON output

**Issue:** "API error: 401"
- **Solution:** Verify VITE_FIREWORKS_API_KEY is set correctly

**Issue:** "File too large"
- **Solution:** Compress image or reduce resolution (max 10MB)

**Issue:** Slow analysis times
- **Solution:** Check network connection, consider image optimization

---

## 📚 Resources

- [Fireworks.ai Documentation](https://docs.fireworks.ai/)
- [Qwen2.5-VL Model Card](https://fireworks.ai/models/qwen2p5-vl-32b-instruct)
- [LLaMA 3.1 Model Card](https://fireworks.ai/models/llama-v3p1-8b-instruct)
- [React Router Documentation](https://reactrouter.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

---

## 📄 License & Disclaimer

This is an **entertainment product** for fun and self-improvement only.

**Not intended for:**
- Medical diagnosis
- Psychological assessment
- Spiritual guidance
- Professional advice

Results are AI-generated and should be taken with humor and perspective.
