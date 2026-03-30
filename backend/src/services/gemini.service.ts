import dotenv from 'dotenv';
import { ENV } from '../config/env.js';

dotenv.config();

export async function analyzeFeedbackWithGemini(title: string, description: string) {
    const prompt = `Analyze this product feedback. Return ONLY valid JSON with these fields: category, sentiment, priority_score (1-10), summary, tags.

    Title: ${title}
    Description: ${description}`;

    const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  const clean = text.replaceAll(/```json|```/g, '').trim();
  return JSON.parse(clean);

}