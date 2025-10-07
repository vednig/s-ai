import { useState, useEffect } from 'react';
import { Download, Trash2, Image as ImageIcon, Video as VideoIcon, X } from 'lucide-react';
import { storageService } from '../services/storage';
import { GeneratedImage, GeneratedVideo } from '../types';

type FilterType = 'all' | 'images' | 'videos';

interface GalleryProps {
  refreshTrigger: number;
}

export default function Gallery({ refreshTrigger }: GalleryProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedItem, setSelectedItem] = useState<{ type: 'image' | 'video'; data: GeneratedImage | GeneratedVideo } | null>(null);

  useEffect(() => {
    loadContent();
  }, [refreshTrigger]);

  const loadContent = () => {
    setImages(storageService.getImages());
    setVideos(storageService.getVideos());
  };

  const handleDeleteImage = (id: string) => {
    storageService.deleteImage(id);
    loadContent();
    if (selectedItem?.type === 'image' && (selectedItem.data as GeneratedImage).id === id) {
      setSelectedItem(null);
    }
  };

  const handleDeleteVideo = (id: string) => {
    storageService.deleteVideo(id);
    loadContent();
    if (selectedItem?.type === 'video' && (selectedItem.data as GeneratedVideo).id === id) {
      setSelectedItem(null);
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredImages = filter === 'videos' ? [] : images;
  const filteredVideos = filter === 'images' ? [] : videos;
  const hasContent = filteredImages.length > 0 || filteredVideos.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Gallery</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('images')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                filter === 'images'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Images
            </button>
            <button
              onClick={() => setFilter('videos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                filter === 'videos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <VideoIcon className="w-4 h-4" />
              Videos
            </button>
          </div>
        </div>

        {hasContent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow">
                <div
                  className="aspect-square overflow-hidden cursor-pointer"
                  onClick={() => setSelectedItem({ type: 'image', data: image })}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{image.prompt}</p>
                  <div className="flex gap-2 text-xs text-slate-500 mb-3">
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">{image.style}</span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">{image.size}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(image.imageUrl)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredVideos.map((video) => (
              <div key={video.id} className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow">
                <div
                  className="aspect-square overflow-hidden cursor-pointer relative"
                  onClick={() => setSelectedItem({ type: 'video', data: video })}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <VideoIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{video.prompt}</p>
                  <div className="flex gap-2 text-xs text-slate-500 mb-3">
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">{video.style}</span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">{video.resolution}</span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">{video.duration}s</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(video.videoUrl)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No generated content yet</p>
            <p className="text-sm mt-1">Start creating images or videos to see them here</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-xl max-w-5xl max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.type === 'image' ? (
              <div className="p-6">
                <img
                  src={(selectedItem.data as GeneratedImage).imageUrl}
                  alt={(selectedItem.data as GeneratedImage).prompt}
                  className="w-full rounded-lg mb-4"
                />
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium text-slate-900 mb-2">Prompt:</p>
                  <p className="text-slate-600 mb-4">{selectedItem.data.prompt}</p>
                  <div className="flex gap-2 text-sm">
                    <span className="bg-white px-3 py-1 rounded border border-slate-200">
                      {(selectedItem.data as GeneratedImage).style}
                    </span>
                    <span className="bg-white px-3 py-1 rounded border border-slate-200">
                      {(selectedItem.data as GeneratedImage).size}
                    </span>
                    <span className="bg-white px-3 py-1 rounded border border-slate-200">
                      {(selectedItem.data as GeneratedImage).realism}% realism
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <video
                  src={(selectedItem.data as GeneratedVideo).videoUrl}
                  controls
                  autoPlay
                  className="w-full rounded-lg mb-4 bg-black"
                  poster={(selectedItem.data as GeneratedVideo).thumbnailUrl}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="font-medium text-slate-900 mb-2">Prompt:</p>
                  <p className="text-slate-600 mb-4">{selectedItem.data.prompt}</p>
                  <div className="flex gap-2 text-sm">
                    <span className="bg-white px-3 py-1 rounded border border-slate-200">
                      {(selectedItem.data as GeneratedVideo).style}
                    </span>
                    <span className="bg-white px-3 py-1 rounded border border-slate-200">
                      {(selectedItem.data as GeneratedVideo).resolution}
                    </span>
                    <span className="bg-white px-3 py-1 rounded border border-slate-200">
                      {(selectedItem.data as GeneratedVideo).duration}s
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
