import { GeneratedImage, GeneratedVideo } from '../types';

const IMAGES_KEY = 'genfinity_images';
const VIDEOS_KEY = 'genfinity_videos';

export const storageService = {
  saveImage(image: GeneratedImage): void {
    const images = this.getImages();
    images.unshift(image);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  },

  getImages(): GeneratedImage[] {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteImage(id: string): void {
    const images = this.getImages().filter(img => img.id !== id);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  },

  saveVideo(video: GeneratedVideo): void {
    const videos = this.getVideos();
    videos.unshift(video);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  },

  getVideos(): GeneratedVideo[] {
    const data = localStorage.getItem(VIDEOS_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteVideo(id: string): void {
    const videos = this.getVideos().filter(vid => vid.id !== id);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  },

  clearAll(): void {
    localStorage.removeItem(IMAGES_KEY);
    localStorage.removeItem(VIDEOS_KEY);
  }
};
