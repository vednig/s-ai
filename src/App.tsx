import { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import Gallery from './components/Gallery';
import { TabType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [galleryRefresh, setGalleryRefresh] = useState(0);

  const handleGenerated = () => {
    setGalleryRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        {activeTab === 'image' && <ImageGenerator onGenerated={handleGenerated} />}
        {activeTab === 'video' && <VideoGenerator onGenerated={handleGenerated} />}
        {activeTab === 'gallery' && <Gallery refreshTrigger={galleryRefresh} />}
      </main>
    </div>
  );
}

export default App;
