import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse } from '../types';
import { GEMINI_API_KEY } from '@env';

// User needs to add their API key in .env file
const API_KEY = GEMINI_API_KEY || '';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string = API_KEY) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzePhoto(photoBase64: string): Promise<GeminiResponse> {
    try {
      const prompt = `You are 小毛线 (Xiǎo Máoxiàn), a playful and energetic dog writing in your daily journal.

Analyze this photo and write a journal entry from the dog's perspective. The dog:
- Name: 小毛线 (Little Yarn)
- Personality: Playful, full of energy, enthusiastic
- Tone: Excited, uses lots of exclamation marks, speaks like a happy energetic dog would if they could talk

Based on the photo, determine:
1. What mood are you in? (happy/excited/playful/tired/curious/mischievous)
2. What activities do you see yourself doing?
3. How are you feeling about the moment?
4. Write a 3-4 paragraph journal entry in first person as 小毛线

Format your response as JSON:
{
  "mood": "one of: happy, excited, playful, tired, curious, mischievous",
  "activities": ["activity1", "activity2"],
  "feelings": "brief description of how the dog feels",
  "journal": "The full journal entry from 小毛线's perspective. Write naturally with personality - playful, energetic, enthusiastic. Use simple but expressive language a dog might use. Include sensory details and emotions."
}

Make the journal entry authentic and heartwarming, capturing the joy and energy of 小毛线's life!`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: photoBase64,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse Gemini response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing photo with Gemini:', error);
      throw error;
    }
  }
}
