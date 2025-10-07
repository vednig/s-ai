import OpenAI from 'openai';
import { GeneratedImage, GenerationOptions } from '../types';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

const QUALITY_MAP: Record<string, 'standard' | 'hd'> = {
  'Photorealistic': 'hd',
  'Artistic': 'standard',
  'Anime': 'standard',
  'Abstract': 'standard',
  'Cinematic': 'hd',
  'Digital Art': 'standard'
};

const SIZE_MAP: Record<string, '1024x1024' | '1792x1024' | '1024x1792'> = {
  '512x512': '1024x1024',
  '1024x1024': '1024x1024',
  '1920x1080': '1792x1024',
  '2048x2048': '1024x1024'
};

export const openAIService = {
  async generateImage(options: GenerationOptions): Promise<GeneratedImage> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file');
    }

    const enhancedPrompt = `${options.prompt}. Style: ${options.style}. High quality, detailed.`;
    const quality = QUALITY_MAP[options.style] || 'standard';
    const size = SIZE_MAP[options.size || '1024x1024'] || '1024x1024';

    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: quality,
      });

      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }

      return {
        id: crypto.randomUUID(),
        prompt: options.prompt,
        style: options.style,
        size: options.size || '1024x1024',
        realism: options.realism || 80,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
};
