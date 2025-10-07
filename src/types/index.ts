export interface GeneratedImage {
  id: string;
  prompt: string;
  style: string;
  size: string;
  realism: number;
  imageUrl: string;
  createdAt: string;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  style: string;
  resolution: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

export type TabType = 'image' | 'video' | 'gallery';

export interface GenerationOptions {
  prompt: string;
  style: string;
  size?: string;
  realism?: number;
  resolution?: string;
  duration?: number;
}
