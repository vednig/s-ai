import { useState } from 'react';
import { Video, Download, RefreshCw, Copy, Play } from 'lucide-react';
import { mockAIService } from '../services/mockAI';
import { storageService } from '../services/storage';
import { GeneratedVideo } from '../types';

interface VideoGeneratorProps {
  onGenerated: () => void;
}

export default function VideoGenerator({ onGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Realistic');
  const [resolution, setResolution] = useState('1080p');
  const [duration, setDuration] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);

  const styles = ['Realistic', 'Animated', 'Cinematic', 'Motion Graphics'];
  const resolutions = ['720p', '1080p', '4K'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const video = await mockAIService.generateVideo({
        prompt,
        style,
        resolution,
        duration,
      });
      setGeneratedVideo(video);
      storageService.saveVideo(video);
      onGenerated();
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = () => {
    if (!generatedVideo) return;
    window.open(generatedVideo.videoUrl, '_blank');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Generate Video</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the video scene you want to generate..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                {prompt && (
                  <button
                    onClick={handleCopyPrompt}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy prompt
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {styles.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resolution
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {resolutions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration: {duration} seconds
                </label>
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>3s</span>
                  <span>30s</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Preview</h2>

            {generatedVideo ? (
              <div className="space-y-4">
                <div className="relative group">
                  <video
                    src={generatedVideo.videoUrl}
                    controls
                    className="w-full rounded-lg shadow-md bg-black"
                    poster={generatedVideo.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900 mb-1">Prompt:</p>
                  <p className="italic">{generatedVideo.prompt}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">
                      {generatedVideo.style}
                    </span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">
                      {generatedVideo.resolution}
                    </span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">
                      {generatedVideo.duration}s
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-slate-600 text-white py-3 rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                <div className="text-center text-slate-400">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Your generated video will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
