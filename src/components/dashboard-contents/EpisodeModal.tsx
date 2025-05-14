'use client'
import {  JSX } from 'react';
import {  Upload, X, PlayCircle,  Download } from 'lucide-react';
import { Book, Episode } from '@/app/[locale]/page-old';

type EpisodeModalPropTypes = {
  selectedBook: Book | null;
  handleCloseEpisodesModal: () => void;
  renderErrorState: (key: string) => JSX.Element | null;
  isLoading: boolean;
  episodes: Episode[];
  bookMetadata: {
    seriesInfo: {
      episodeTitle: string;
      currentEpisode: number;
    };
  };
  setBookMetadata: React.Dispatch<React.SetStateAction<{
    seriesInfo: {
      episodeTitle: string;
      currentEpisode: number;
    };
  }>>;
  uploadNewEpisode: (bookId: string, file: File) => Promise<{ success: boolean; id: string; message: string }>;
  isUploadingEpisode: boolean;
}

const EpisodesModal: React.FC<EpisodeModalPropTypes> = ({
  selectedBook, handleCloseEpisodesModal, renderErrorState,
  isLoading, episodes, bookMetadata, setBookMetadata, uploadNewEpisode,
  isUploadingEpisode,
}) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4 text-black">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">
          {selectedBook?.title} - Episodes
        </h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={handleCloseEpisodesModal}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4">
        {renderErrorState('episodes')}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading episodes...</p>
          </div>
        ) : (
          <>
            {episodes.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-gray-500">No episodes available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {episodes.map((episode, index) => (
                  <div key={episode._id || index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{episode.title || `Episode ${episode.episodeNumber}`}</h4>
                        <p className="text-sm text-gray-500">
                          Episode {episode.episodeNumber} • {episode.duration || 'Unknown duration'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          File: {episode.audioFile?.split('/').pop() || 'Unknown file'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-indigo-500 hover:text-indigo-700">
                          <PlayCircle size={18} />
                        </button>
                        <a 
                          href={episode.audioFile} 
                          download
                          className="text-gray-500 hover:text-gray-700"
                          title="Download episode"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {selectedBook?.isSeries && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Upload New Episode</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Episode Title</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded"
                  value={bookMetadata.seriesInfo.episodeTitle}
                  onChange={(e) => setBookMetadata({
                    ...bookMetadata,
                    seriesInfo: {
                      ...bookMetadata.seriesInfo,
                      episodeTitle: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Episode Number</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full p-2 border rounded"
                  value={bookMetadata.seriesInfo.currentEpisode}
                  onChange={(e) => setBookMetadata({
                    ...bookMetadata,
                    seriesInfo: {
                      ...bookMetadata.seriesInfo,
                      currentEpisode: parseInt(e.target.value) || 1
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                id="episodeUpload"
                accept="audio/mp3,audio/mpeg" 
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (!file) return;
                  if (file && selectedBook) {
                    try {
                      await uploadNewEpisode(selectedBook._id, file);
                      e.target.value = '';
                    } catch (error:any) {
                      alert(`Failed to upload episode: ${error.message}`);
                    }
                  }
                }}
              />
              <label 
                htmlFor="episodeUpload"
                className="px-4 py-2 bg-indigo-500 text-white rounded flex items-center gap-2 cursor-pointer hover:bg-indigo-600"
              >
                <Upload size={16} />
                <span>Select Episode File</span>
              </label>
              {isUploadingEpisode && (
                <div className="text-sm text-gray-500 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
                  Uploading...
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              MP3 format, max 500MB per episode
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default EpisodesModal