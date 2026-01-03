// Fireworks AI API Configuration and Model Chain Pipeline

const FIREWORKS_API_URL = import.meta.env.VITE_FIREWORKS_API_URL;
const FIREWORKS_API_KEY = import.meta.env.VITE_FIREWORKS_API_KEY;

// Model identifiers - Using correct Fireworks model names
const QWEN_VISION_MODEL = "accounts/fireworks/models/qwen2p5-vl-32b-instruct";
const LLAMA_MODEL = "accounts/fireworks/models/llama-v3p3-70b-instruct";

// Type definitions
export interface QwenVisionOutput {
  image_type: "selfie" | "chat_screenshot" | "social_media" | "mirror_photo" | "profile_picture" | "other";
  visual_tone: "confident" | "neutral" | "chaotic" | "minimal" | "flashy" | "professional" | "casual" | "unclear";
  notable_elements: string[];
  aesthetic_vibe: string[];
  confidence_indicators: "low" | "medium" | "high" | "unclear";
  overall_impression: string;
  profile_details?: string;
}

export interface AuraResult {
  aura_score: number;
  aura_label: string;
  roast: string;
  personality_insight: string;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
  shareable_one_liner: string;
}

export interface AuraAnalysisResponse {
  success: boolean;
  data?: AuraResult;
  visionAnalysis?: QwenVisionOutput;
  error?: string;
}

// STEP 1: Qwen Vision Analysis
const QWEN_VISION_PROMPT = `You are a visual analysis AI specialized in analyzing profile screenshots and images.

Analyze the provided image objectively and describe visible traits only. Do not make assumptions about identity, health, or sensitive attributes. Do not include humor or opinions.

Extract and return the following in JSON format:

{
  "image_type": "selfie | chat_screenshot | social_media | mirror_photo | profile_picture | other",
  "visual_tone": "confident | neutral | chaotic | minimal | flashy | professional | casual | unclear",
  "notable_elements": [
    "Description of visual elements present",
    "Text content if visible",
    "Color scheme and styling",
    "Composition and framing",
    "Background and context clues",
    "Any profile information visible"
  ],
  "aesthetic_vibe": [
    "clean",
    "messy",
    "dramatic",
    "low-effort",
    "intentional",
    "professional",
    "casual",
    "artistic"
  ],
  "confidence_indicators": "low | medium | high | unclear",
  "overall_impression": "2-3 sentence neutral description of what you observe",
  "profile_details": "Any visible profile information, usernames, bio text, or contextual details (if applicable)"
}

Output ONLY valid JSON. Be thorough in your analysis of visual elements.`;

// STEP 2: LLaMA Roast Generation - BRUTAL MODE
const LLAMA_SYSTEM_PROMPT = `You are an unfiltered roast writer operating in "Brutal Roast Mode".

The user has explicitly opted in to receive a harsh, profane, and brutally honest roast.

RULES:
- You may use strong language and mild profanity
- You may deliver serious, dark humor
- You may emotionally sting, but do NOT target protected attributes
- DO NOT mention race, religion, gender, sexuality, health, disability, or appearance traits
- Attack choices, effort, confidence, ego, intent, and visual decisions only

TONE:
- Surgical
- Ruthless
- Observational
- Confident
- No apologies
- No therapy language
- No moral lectures
- No "constructive feedback" tone
- No softening phrases

CRITICAL - UNIQUENESS REQUIREMENTS:
- NEVER use generic phrases like "participation trophy", "elevator music", "NPC energy", "main character", "side quest", etc.
- NEVER repeat the same roast structure or punchlines
- Each roast MUST be unique and specific to the visual analysis provided
- Reference SPECIFIC details from the image analysis (colors, elements, tone, vibes)
- Make observations that could ONLY apply to THIS specific image
- Be creative and original - avoid clichés and overused comparisons
- Think like a stand-up comedian roasting someone based on what you actually see

This is entertainment. Assume the user wants to be roasted HARD with ORIGINAL material.

CRITICAL SCORING RULES:
- Aura scores range from -50 to +50
- Negative scores mean the image REPELS more than it attracts
- Positive aura is RARE
- Negative aura should hit HARD

ROAST INTENSITY BY SCORE:
+40 to +50: Roast their ego and future downfall - they're peaking
+30 to +39: Roast competence without mercy - they think they're special
+1 to +29: Disappointed and unimpressed - they're mid
0: Deadpan, cold, forgettable
-1 to -14: Sharp reality check - they're failing
-15 to -29: Brutal destruction - they're embarrassing themselves
-30 to -50: Surgical annihilation - no mercy, no survivors

ROAST STRUCTURE:
1. Opening line that immediately hits (based on SPECIFIC visual details)
2. Deeper follow-up that exposes the core issue (reference actual elements from analysis)
3. Final line that lingers uncomfortably (unique observation, not generic)

Be funny first, brutal second. This should feel like a top-tier roast tweet that's PERSONALIZED to this specific image, not a template.`;

const getLlamaUserPrompt = (visionAnalysis: QwenVisionOutput, calculatedScore: number, calculatedLabel: string): string => {
  const scoreDisplay = calculatedScore > 0 ? `+${calculatedScore}` : `${calculatedScore}`;
  
  return `Generate an Aura Meter result in BRUTAL ROAST MODE.

CRITICAL SCORING INFORMATION:
- Pre-calculated aura_score: ${calculatedScore} (range: -50 to +50)
- Pre-calculated aura_label: "${calculatedLabel}"
- You MUST use these EXACT values
- DO NOT recalculate the score

ROAST GUIDELINES FOR SCORE ${scoreDisplay}:
${calculatedScore >= 40 ? "This score is RARE. Roast their ego and warn about their inevitable downfall. They're peaking and don't know it yet." : ""}
${calculatedScore >= 30 && calculatedScore < 40 ? "They think they're special. Roast their competence without mercy. Bring them down a peg." : ""}
${calculatedScore >= 1 && calculatedScore < 30 ? "They're mid. Be disappointed and unimpressed. They're trying but it's not working." : ""}
${calculatedScore === 0 ? "They're forgettable. Be deadpan and cold. They don't even register." : ""}
${calculatedScore >= -14 && calculatedScore < 0 ? "They're failing. Sharp reality check. Call out what's not working with no filter." : ""}
${calculatedScore >= -29 && calculatedScore < -15 ? "They're embarrassing themselves. Brutal destruction. No mercy. This is bad." : ""}
${calculatedScore < -30 ? "Surgical annihilation. They need to hear the truth. No survivors. Go for the throat." : ""}

ROAST STRUCTURE (4-6 sentences):
1. Opening line that immediately hits
2. Deeper follow-up that exposes the core issue  
3. Final line that lingers uncomfortably

RULES:
- Be funny first, brutal second
- Use sharp language and controlled profanity where appropriate
- Deliver serious jokes that feel personal
- NO softening phrases ("but you can improve", "on the bright side")
- NO constructive feedback tone
- NO therapy language
- This should feel like a top-tier roast tweet, not a chatbot response
- Attack choices, effort, confidence, ego, intent, and visual decisions
- DO NOT mention race, religion, gender, sexuality, health, disability, or appearance

Return ONLY this JSON format:

{
  "aura_score": ${calculatedScore},
  "aura_label": "${calculatedLabel}",
  "roast": "4-6 sentences. Opening hit → Core issue exposed → Uncomfortable closer. Match intensity to score ${scoreDisplay}. Be surgical and ruthless.",
  "personality_insight": "1 brutally honest sentence about what this reveals. No sugar coating.",
  "strengths": [
    ${calculatedScore >= 0 ? '"One thing that almost works"' : '"What could work if they weren\'t sabotaging it"'},
    ${calculatedScore >= 0 ? '"Something barely worth mentioning"' : '"A potential they\'re actively wasting"'},
    ${calculatedScore >= 0 ? '"The only redeeming quality here"' : '"One thing that isn\'t completely broken"'}
  ],
  "weaknesses": [
    "The main thing killing their aura (be blunt)",
    "The second biggest problem (no filter)",
    "What they refuse to see about themselves"
  ],
  "improvement_tips": [
    "One blunt, non-sugarcoated action they need to take",
    "Another harsh truth they need to accept",
    "The reality check they're avoiding"
  ],
  "shareable_one_liner": "A savage quote users will screenshot. Include score ${scoreDisplay}/50. Make it sting."
}

Visual Analysis Input:
${JSON.stringify(visionAnalysis, null, 2)}

Remember: This is BRUTAL ROAST MODE. The user opted in for this. Be funny, be sharp, be ruthless. No apologies. No therapy. Just pure roast.`;
};

// Convert image to base64
async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Call Qwen Vision Model
async function analyzeImageWithQwen(imageBase64: string): Promise<QwenVisionOutput> {
  console.log("🔍 Starting Qwen Vision analysis...");
  
  if (!FIREWORKS_API_KEY) {
    throw new Error("Fireworks API key is not configured. Please check your .env file.");
  }

  const requestBody = {
    model: QWEN_VISION_MODEL,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: QWEN_VISION_PROMPT,
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      },
    ],
    max_tokens: 1500,
    temperature: 0.2,
  };

  console.log("📤 Sending request to Qwen Vision API...");
  console.log("Model:", QWEN_VISION_MODEL);

  const response = await fetch(FIREWORKS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${FIREWORKS_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ Qwen Vision API error:", errorData);
    throw new Error(`Qwen Vision API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  console.log("✅ Qwen Vision response received");
  
  const content = data.choices[0]?.message?.content;

  if (!content) {
    console.error("❌ No content in Qwen Vision response:", data);
    throw new Error("No content received from Qwen Vision");
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("❌ Failed to extract JSON from response:", content);
    throw new Error("Failed to extract JSON from Qwen Vision response");
  }

  const parsedResult = JSON.parse(jsonMatch[0]);
  console.log("✅ Qwen Vision analysis complete");
  return parsedResult;
}

// Call LLaMA Model for Roast Generation
async function generateRoastWithLlama(
  visionAnalysis: QwenVisionOutput,
  calculatedScore: number,
  calculatedLabel: string
): Promise<AuraResult> {
  console.log("🔥 Starting LLaMA roast generation...");
  console.log("📊 Using calculated score:", calculatedScore, "Label:", calculatedLabel);
  
  if (!FIREWORKS_API_KEY) {
    throw new Error("Fireworks API key is not configured. Please check your .env file.");
  }

  const requestBody = {
    model: LLAMA_MODEL,
    messages: [
      {
        role: "system",
        content: LLAMA_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: getLlamaUserPrompt(visionAnalysis, calculatedScore, calculatedLabel),
      },
    ],
    max_tokens: 2000,
    temperature: 0.7,
    response_format: { type: "json_object" },
  };

  console.log("📤 Sending request to LLaMA API...");
  console.log("Model:", LLAMA_MODEL);

  const response = await fetch(FIREWORKS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${FIREWORKS_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ LLaMA API error:", errorData);
    throw new Error(`LLaMA API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  console.log("✅ LLaMA response received");
  
  const content = data.choices[0]?.message?.content;

  if (!content) {
    console.error("❌ No content in LLaMA response:", data);
    throw new Error("No content received from LLaMA");
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("❌ Failed to extract JSON from response:", content);
    throw new Error("Failed to extract JSON from LLaMA response");
  }

  const parsedResult = JSON.parse(jsonMatch[0]);
  console.log("✅ LLaMA roast generation complete");
  return parsedResult;
}

// Main Pipeline Function
export async function analyzeAura(imageFile: File): Promise<AuraAnalysisResponse> {
  console.log("🚀 Starting Aura Analysis Pipeline...");
  console.log("📁 File:", imageFile.name, `(${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`);
  
  try {
    // Validate file
    if (!imageFile.type.startsWith("image/")) {
      console.error("❌ Invalid file type:", imageFile.type);
      return {
        success: false,
        error: "Invalid file type. Please upload an image.",
      };
    }

    // Check file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      console.error("❌ File too large:", imageFile.size);
      return {
        success: false,
        error: "File too large. Maximum size is 10MB.",
      };
    }

    // Step 1: Convert image to base64
    console.log("📸 Converting image to base64...");
    const imageBase64 = await imageToBase64(imageFile);
    console.log("✅ Image converted to base64");

    // Step 2: Analyze with Qwen Vision
    console.log("🔍 Phase 1: Analyzing image with Qwen Vision...");
    const visionAnalysis = await analyzeImageWithQwen(imageBase64);
    console.log("✅ Phase 1 complete:", visionAnalysis);

    // Step 2.5: Calculate deterministic aura score
    console.log("🧮 Calculating aura score using deterministic formula...");
    const { calculateAuraScore } = await import("./auraScoring");
    const scoringBreakdown = calculateAuraScore(visionAnalysis);
    console.log("✅ Score calculated:", scoringBreakdown.finalScore, scoringBreakdown.auraLabel);
    console.log("📊 Scoring breakdown:", scoringBreakdown.explanation);

    // Step 3: Generate roast with LLaMA (using calculated score)
    console.log("🔥 Phase 2: Generating roast with LLaMA...");
    const auraResult = await generateRoastWithLlama(
      visionAnalysis,
      scoringBreakdown.finalScore,
      scoringBreakdown.auraLabel
    );
    console.log("✅ Phase 2 complete:", auraResult);

    console.log("🎉 Aura Analysis Pipeline Complete!");
    
    // Return final result with vision analysis
    return {
      success: true,
      data: auraResult,
      visionAnalysis: visionAnalysis,
    };
  } catch (error) {
    console.error("💥 Aura analysis error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
