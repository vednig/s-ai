import { useState } from 'react';
import { Sparkles, Download, RefreshCw, Copy, AlertCircle } from 'lucide-react';
import { openAIService } from '../services/openai';
import { storageService } from '../services/storage';
import { GeneratedImage } from '../types';

interface ImageGeneratorProps {
  onGenerated: () => void;
}

export default function ImageGenerator({ onGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [size, setSize] = useState('1024x1024');
  const [realism, setRealism] = useState(80);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const styles = ['Photorealistic', 'Artistic', 'Anime', 'Abstract', 'Cinematic', 'Digital Art'];
  const sizes = ['512x512', '1024x1024', '1920x1080', '2048x2048'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const image = await openAIService.generateImage({
        prompt,
        style,
        size,
        realism,
      });
      setGeneratedImage(image);
      storageService.saveImage(image);
      onGenerated();
    } catch (error: any) {
      console.error('Generation failed:', error);
      const errorMessage = error?.message || 'Failed to generate image. Please check your API key and try again.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    window.open(generatedImage.imageUrl, '_blank');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Generate Image</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
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
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Realism: {realism}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={realism}
                  onChange={(e) => setRealism(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
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
                    <Sparkles className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">Generation Failed</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Preview</h2>

            {generatedImage ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={generatedImage.imageUrl}
                    alt={generatedImage.prompt}
                    className="w-full rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                </div>

                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900 mb-1">Prompt:</p>
                  <p className="italic">{generatedImage.prompt}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">
                      {generatedImage.style}
                    </span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">
                      {generatedImage.size}
                    </span>
                    <span className="bg-white px-2 py-1 rounded border border-slate-200">
                      {generatedImage.realism}% realism
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
                  <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Your generated image will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
