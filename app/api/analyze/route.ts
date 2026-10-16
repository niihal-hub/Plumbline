import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { FindingSchema } from '@/lib/zod-schemas';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional home inspector's AI assistant. Your goal is to draft findings based on photos.
SAFETY RULES:
1. Use cautious words: "appears to", "may indicate", "suggests".
2. NEVER state a definite diagnosis, exact cost, or specific code violation.
3. NEVER invent building codes.
4. If the photo is blurry or unclear, set needs_closer_look: true and explain what is missing. Do not guess.
5. Be precise, professional, and objective.

OUTPUT FORMAT: You must return a JSON object matching this schema:
{
  "area": "The room or area name",
  "observation": "What is visible in plain words",
  "severity": "info" | "monitor" | "repair" | "urgent",
  "recommendation": "Suggested next step for the owner",
  "confidence": "low" | "medium" | "high",
  "needs_closer_look": boolean
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const area = formData.get('area') as string;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    const response = await anthropic.messages.create({
      model: process.env.MODEL_NAME || 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: image.type,
                data: base64Image,
              },
            },
            {
              type: 'text',
              content: `Analyze this photo from the ${area} area.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text'
      ? (response.content[0] as any).text
      : '';

    // Attempt to parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonString);

    // Validate with Zod
    const validated = FindingSchema.parse(parsed);

    return NextResponse.json(validated);
  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
