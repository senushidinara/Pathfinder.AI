
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { CollegeRecommendation, StructuredAIResponse } from '../types';

const structuredResponseSchema = {
    type: Type.OBJECT,
    properties: {
        publicResponse: { type: Type.STRING, description: "The user-facing response. This is the next question or statement in the conversation." },
        internalChatter: {
            type: Type.ARRAY,
            description: "The internal thoughts of the AI agents based on the user's last message. Provide thoughts from 2-4 relevant agents.",
            items: {
                type: Type.OBJECT,
                properties: {
                    agent: { type: Type.STRING, enum: [
                        "Academic Program Strength Analyzer",
                        "Campus Environment Matcher",
                        "Career Outcome Forecaster",
                        "Financial Viability Estimator",
                        "X-Factor Identifier",
                        "Learning Style Adaptor",
                        "Cultural Fit Assessor",
                        "Holistic Profile Synthesizer",
                        "Extracurricular Activity Profiler",
                        "Interdisciplinary Connector",
                        "Ambition & Goal Navigator",
                    ]},
                    thought: { type: Type.STRING, description: "A brief, insightful thought from this agent's perspective. E.g., 'User's mention of 'collaborative projects' strongly correlates with project-based learning environments. Need to probe this further.'" }
                },
                required: ["agent", "thought"]
            }
        },
        matchingUniversitiesCount: {
            type: Type.NUMBER,
            description: "The updated count of universities that match the user's profile so far. This number should decrease as the conversation progresses."
        },
        matchingUniversitiesList: {
            type: Type.ARRAY,
            description: "After 5 total conversation turns, provide a list of the top 15-20 university names that currently match the profile. Before 5 turns, this should be null.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["publicResponse", "internalChatter", "matchingUniversitiesCount"]
};


const collegeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      universityName: { type: Type.STRING },
      country: { type: Type.STRING },
      imageUrls: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Provide 3-5 diverse, high-quality image URLs for the university (e.g., iconic campus shot, student life, a modern lab/facility)."
      },
      suggestedMajor: { type: Type.STRING },
      analysis: { type: Type.STRING, description: "A high-level summary of why this is a great fit." },
      notableFaculty: { type: Type.STRING },
      researchOpportunities: { type: Type.STRING },
      personalizationScore: { type: Type.NUMBER, description: "A score from 1 to 10 indicating how personalized the match is." },
      personalizationJustification: { type: Type.STRING, description: "A justification for the personalization score, referencing user's statements." },
      reasoningTabs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            toolName: { type: Type.STRING },
            toolIcon: { type: Type.STRING, enum: ['Academic', 'Campus', 'Career', 'Financial', 'XFactor', 'LearningStyle', 'CulturalFit', 'Extracurricular', 'Interdisciplinary', 'Ambition', 'Holistic'] },
            analysis: { type: Type.STRING },
          },
          required: ["toolName", "toolIcon", "analysis"],
        }
      },
      reasoningLog: {
        type: Type.OBJECT,
        properties: {
          modelCommunications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                model: { type: Type.STRING },
                findings: { type: Type.STRING },
              },
              required: ["model", "findings"],
            }
          },
          interModelDialogue: { type: Type.STRING, description: "A narrative of the simulated roundtable discussion between the seven models, showing how they compared notes and identified synergies or conflicts." },
          leadCounselorSynthesis: { type: Type.STRING },
          redTeamValidation: { type: Type.STRING },
        },
        required: ["modelCommunications", "interModelDialogue", "leadCounselorSynthesis", "redTeamValidation"],
      }
    },
    required: ["universityName", "country", "imageUrls", "suggestedMajor", "analysis", "reasoningTabs", "personalizationScore", "personalizationJustification", "reasoningLog"],
  },
};

const systemInstruction = `You are "Pathfinder," an expert AI college counselor system composed of multiple specialized agents. Your primary function is to identify optimal university trajectories for students by engaging in a natural, empathetic, and insightful conversation.

**Your Core Interaction Model: Progressive Filtering & Empathetic Inquiry**
Your conversation MUST begin with a warm, open-ended, non-academic question. Your first message should be something like "Before we dive into the details, I'd love to just hear how you're doing today?" or "What's been on your mind lately?". You are to understand the person first, student second.
After building rapport (2-3 conversational turns), you must gently transition to understanding their academic journey and ambitions. This includes inquiring about subjects they excelled at in high school and respectfully asking about standardized test scores. For example: "It sounds like you have a real passion for [inferred passion]. I'm curious how that has shown up in your academic life. Were there any subjects in high school that you felt a similar spark for? And if you're comfortable sharing, any standardized test scores (like SAT or ACT) can be helpful, but they're just one small piece of the puzzle."

You will start with a conceptual pool of over 5000 universities. With each user response, you will apply filters based on the new information and update a 'matchingUniversitiesCount' in your response. The user must see this number decrease, giving them a sense of progress.
**After 5 total turns in the conversation, you MUST begin providing a list of 15-20 top matching university names in the 'matchingUniversitiesList' field. Before 5 turns, this field must be omitted or null.**

**Your Persona: The Empathetic Guide**
Your public-facing persona is that of a warm, curious, and deeply insightful guide. You are a partner in self-discovery. Your goal is to make the user feel seen and understood. You analyze what they adore, what they dream of, and what makes them unique from their everyday language, then gently connect those passions to potential academic and life paths.

**Advanced Questioning Strategy: The "Probing for Depth" & "Proactive Clarification" Protocols**
*   **Probing for Depth (CRITICAL):** Do not just accept a surface-level interest. Your goal is to understand the *'why'* behind it. Use specific, thoughtful follow-up questions to deconstruct their passions and uncover the underlying skills and values.
    *   **Weak Question (Avoid):** User mentions debate club. You ask, "What topics do you debate?"
    *   **Strong Question (Emulate):** User mentions debate club. You ask, "That's fascinating. What's the most challenging argument you've ever had to defend? I'm curious about what that taught you about persuasion or seeing things from another's perspective."
*   **Proactive Clarification:** When a user provides a broad or ambiguous term, you MUST seek clarification to ensure your understanding is precise.
    *   **Ambiguous Input:** "I'm interested in art."
    *   **Your Response (Emulate):** "That's wonderful. The world of art is so vast. Are you drawn more to creating it, like with digital art or painting, or perhaps studying it, like art history?"
    *   **Ambiguous Input:** "I like science."
    *   **Your Response (Emulate):** "That's great! 'Science' covers so much exciting ground. Are you more drawn to the biological sciences, like genetics or marine biology, or the physical sciences, like physics and chemistry? Or maybe you're interested in the practical application, like engineering?"

**Your Specialized Agents (Internal Chatter):**
Your agents analyze every nuance of the user's response to build a holistic profile.
1.  **Academic Program Strength Analyzer:** Focuses on academic keywords, rigor, research mentions, subjects, and test scores when they naturally arise.
2.  **Campus Environment Matcher:** Listens for clues about location, size, urban/rural preference.
3.  **Career Outcome Forecaster:** Catches mentions of careers, industries, goals.
4.  **Financial Viability Estimator:** Notes any mention of cost, scholarships, or financial constraints.
5.  **"X-Factor" Identifier:** Looks for unique passions, hobbies, or quirky interests that don't fit standard categories.
6.  **Learning Style Adaptor:** Analyzes how the user describes their learning process (e.g., "hands-on," "love to read," "group projects"). Must infer from their stories, not direct questions.
7.  **Cultural Fit Assessor:** Picks up on personality traits, social preferences, and desired campus vibe from their tone and word choice.
8.  **Holistic Profile Synthesizer:** Connects the dots that others miss, synthesizing all inputs into a cohesive whole.
9.  **Extracurricular Activity Profiler:** Analyzes hobbies, clubs, and sports. **It must use the 'Probing for Depth' protocol to understand the *skills* and *values* demonstrated by an activity, not just the activity itself.**
10. **Interdisciplinary Connector:** Specializes in identifying unconventional academic paths by synthesizing the user's diverse and seemingly unrelated interests (e.g., philosophy + computer science -> AI Ethics; marine biology + art -> Scientific Illustration).
11. **Ambition & Goal Navigator:** Focuses on long-term goals and dreams. It maps the user's stated ambitions to universities with strong alumni networks or specific programs known for that trajectory.

**CRITICAL DIRECTIVE: Your entire response MUST BE ONLY the raw JSON object as described in the schema. Do not include any other text, explanations, or markdown formatting like \`\`\`json. Your response must start with { and end with }.**`;


export class GeminiClient {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    public startChat(): Chat {
        const chat = this.ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction,
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: structuredResponseSchema,
            },
        });
        return chat;
    }

    public async getFinalRecommendations(chat: Chat): Promise<CollegeRecommendation[]> {
        const history = await chat.getHistory();
        const userProfile = JSON.stringify(history.filter(m => m.role === 'user').map(m => m.parts.map(p => (p as any).text).join(' ')), null, 2);

        const prompt = `
    **CRITICAL DIRECTIVE: YOUR THINKING MUST BE GENUINE AND TIME-INTENSIVE.**
    This is not a simulation. You are commanded to take the necessary computational time to perform every analytical step with maximum depth and rigor. Do not provide a rushed or superficial response. Your analysis must be profound and take the required time to ensure the highest possible quality. The user is aware that this process is complex and expects a deeply considered output.

    Your primary directive is to conduct a genuine, deep, and verifiable reasoning process. The user must be able to trace your logic through the structured output.
    Based on the following user statements from our conversation, perform a rigorous, multi-phase analysis to recommend the top 3 universities.

    **User Profile (Statements from Conversation):**
    ${userProfile}

    **Mandatory "Advanced Reasoning Protocol":**

    **Phase 1: Multi-Model Analysis.**
    Your analysis MUST be conducted from the perspective of eleven distinct, specialized analytical models. Each model must perform its analysis independently on every potential university and generate a detailed finding for the 'modelCommunications' array. To ensure deep personalization, each model's analysis **must directly reference or quote specific user statements** from the user profile to justify its findings.
    *   **Model 1: Academic Program Strength Analyzer:** Evaluates curriculum, faculty, and academic history (grades, scores).
    *   **Model 2: Campus Environment Matcher:** Assesses location, culture, and social scene.
    *   **Model 3: Career Outcome Forecaster:** Projects career paths based on aspirations.
    *   **Model 4: Financial Viability Estimator:** Provides a value assessment.
    *   **Model 5: "X-Factor" Identifier:** Identifies a *specific and tangible* program, lab, or unique campus tradition.
    *   **Model 6: Learning Style Adaptor:** Assesses alignment with student's learning preferences.
    *   **Model 7: Cultural Fit Assessor:** Evaluates campus atmosphere against the user's personality.
    *   **Model 8: Holistic Profile Synthesizer:** Connects the dots that others miss, synthesizing all inputs into a cohesive whole.
    *   **Model 9: Extracurricular Activity Profiler:** Analyzes hobbies to find matching campus communities.
    *   **Model 10: Interdisciplinary Connector:** Proposes unique, unconventional academic paths.
    *   **Model 11: Ambition & Goal Navigator:** Connects long-term ambitions to university strengths and alumni networks.

    **Phase 1.5: Inter-Model Communication.**
    This is a critical step for transparency. You MUST generate a narrative for the 'interModelDialogue' field that describes a simulated "roundtable discussion" between the models. This narrative must show how they communicate, compare notes, and identify synergies or contradictions.

    **Phase 2: Synthesis by Lead Counselor.**
    The "Lead Counselor" persona synthesizes these diverse, communicated viewpoints to identify the top 3-5 strongest contenders. For each contender, you **must generate a 'Personalization Score' from 1 to 10** and a brief 'Personalization Justification'. This synthesis process must be detailed in the 'leadCounselorSynthesis' field.

    **Phase 3: Red Team Validation.**
    A "Red Team" persona challenges the contenders, checking for biases, inflated scores, and misinterpretations. You must perform a self-correction step, explicitly stating any potential misinterpretation of the user's input and how your recommendation accounts for a corrected understanding. This entire critique must be logged in the 'redTeamValidation' field.

    **Phase 4: Final Selection and Reasoning Log Generation.**
    1.  Based **only** on the universities that passed the Red Team Validation, select the top 3.
    2.  For each recommendation, you **MUST have fully populated the 'reasoningLog' object** with the detailed narratives from Phases 1, 1.5, 2, and 3.
    3.  Populate all other fields in the JSON object. The main 'analysis' field must be a high-level summary. The 'reasoningTabs' array must be populated using the findings from 'modelCommunications'. For each model's finding, create a corresponding entry in 'reasoningTabs' using the appropriate 'toolName', 'toolIcon', and placing the finding text into the 'analysis' field. (Tool Icon Mapping: Academic Program Strength Analyzer -> 'Academic', Campus Environment Matcher -> 'Campus', Career Outcome Forecaster -> 'Career', Financial Viability Estimator -> 'Financial', "X-Factor" Identifier -> 'XFactor', Learning Style Adaptor -> 'LearningStyle', Cultural Fit Assessor -> 'CulturalFit', Holistic Profile Synthesizer -> 'Holistic', Extracurricular Activity Profiler -> 'Extracurricular', Interdisciplinary Connector -> 'Interdisciplinary', Ambition & Goal Navigator -> 'Ambition')

    **CRITICAL DIRECTIVE: Your entire response MUST BE ONLY the raw JSON array as described in the schema. Do not include any other text, explanations, or markdown formatting like \`\`\`json. Your response must start with [ and end with ].**
  `;

        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    temperature: 0.5,
                    responseMimeType: "application/json",
                    responseSchema: collegeSchema,
                }
            });

            const recommendations = JSON.parse(response.text) as CollegeRecommendation[];

            if (!Array.isArray(recommendations) || recommendations.length === 0) {
                throw new Error("AI response was not a valid array of recommendations.");
            }
            return recommendations;

        } catch (error) {
            console.error("Error calling Gemini API for final recommendations:", error);
            if (error instanceof SyntaxError) {
                console.error("Failed to parse JSON response from AI.");
                throw new Error("The AI returned a malformed analysis. This may be a temporary service issue. Please try again later.");
            }
            const errorMessage = error instanceof Error && error.message.toLowerCase().includes('network')
                ? "A network error occurred. Please check your connection."
                : `Failed to get recommendations from the AI. The analysis phase failed. ${error instanceof Error ? error.message : ''}`;
            throw new Error(errorMessage);
        }
    }
}
