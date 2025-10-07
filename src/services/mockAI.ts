import { GeneratedImage, GeneratedVideo, GenerationOptions } from '../types';

const IMAGE_PLACEHOLDERS = [
  'https://images.pexels.com/photos/1097491/pexels-photo-1097491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1424239/pexels-photo-1424239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
];

const VIDEO_PLACEHOLDERS = [
  {
    video: 'https://videos.pexels.com/video-files/3255275/3255275-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/videos/3255275/free-video-3255275.jpg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    video: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
    thumbnail: 'https://images.pexels.com/videos/3571264/free-video-3571264.jpg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    video: 'https://videos.pexels.com/video-files/2834202/2834202-uhd_2560_1440_25fps.mp4',
    thumbnail: 'https://images.pexels.com/videos/2834202/pexels-photo-2834202.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAIService = {
  async generateImage(options: GenerationOptions): Promise<GeneratedImage> {
    await delay(2000 + Math.random() * 1500);

    const randomImage = IMAGE_PLACEHOLDERS[Math.floor(Math.random() * IMAGE_PLACEHOLDERS.length)];

    return {
      id: crypto.randomUUID(),
      prompt: options.prompt,
      style: options.style,
      size: options.size || '1024x1024',
      realism: options.realism || 80,
      imageUrl: randomImage,
      createdAt: new Date().toISOString()
    };
  },

  async generateVideo(options: GenerationOptions): Promise<GeneratedVideo> {
    await delay(3000 + Math.random() * 2000);

    const randomVideo = VIDEO_PLACEHOLDERS[Math.floor(Math.random() * VIDEO_PLACEHOLDERS.length)];

    return {
      id: crypto.randomUUID(),
      prompt: options.prompt,
      style: options.style,
      resolution: options.resolution || '1080p',
      duration: options.duration || 10,
      videoUrl: randomVideo.video,
      thumbnailUrl: randomVideo.thumbnail,
      createdAt: new Date().toISOString()
    };
  }
};
