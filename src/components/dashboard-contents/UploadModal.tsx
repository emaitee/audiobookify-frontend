'use client'

import {  Upload, X, Check,  FileText } from 'lucide-react';
import { BookMetadata } from './AdminPage';

const narrationLanguages = ["English", "Hausa", "Yoruba"]

interface UploadModalProps {
  handleClose: () => void;
  uploadStep: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUploadClick: () => void;
  coverInputRef: React.RefObject<HTMLInputElement>;
  handleCoverSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverPreview: string | null;
  handleCoverUploadClick: () => void;
  bookMetadata: BookMetadata;
  setBookMetadata: React.Dispatch<React.SetStateAction<BookMetadata>>;
  categories: string[];
  handleSeriesToggle: (isSeries: boolean) => void;
  uploadingFile: File | null;
  uploadProgress: number;
  setUploadStep: React.Dispatch<React.SetStateAction<number>>;
  uploadAudiobook: () => Promise<void>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  handleClose, uploadStep, fileInputRef, handleFileSelect, handleFileUploadClick,
  coverInputRef, handleCoverSelect, coverPreview, handleCoverUploadClick,
  bookMetadata, setBookMetadata, categories, handleSeriesToggle, uploadingFile,
  uploadProgress, setUploadStep, uploadAudiobook
}) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4 text-black">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Upload New Audiobook</h3>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-6">
          <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 1 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
            <div className="flex justify-center mb-1">
              {uploadStep > 1 ? <Check size={20} className="text-indigo-500" /> : <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">1</span>}
            </div>
            <p className="text-sm">Select File</p>
          </div>
          <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 2 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
            <div className="flex justify-center mb-1">
              {uploadStep > 2 ? <Check size={20} className="text-indigo-500" /> : <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">2</span>}
            </div>
            <p className="text-sm">Add Details</p>
          </div>
          <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 3 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
            <div className="flex justify-center mb-1">
              {uploadStep > 3 ? <Check size={20} className="text-indigo-500" /> : <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">3</span>}
            </div>
            <p className="text-sm">Upload</p>
          </div>
        </div>
        
        {uploadStep === 1 && (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect} 
              accept="audio/mp3,audio/mpeg,audio/amr" 
              className="hidden" 
            />
            <Upload size={40} className="text-gray-400 mb-4" />
            <h4 className="text-lg font-medium mb-2">Select Audio File</h4>
            <p className="text-sm text-gray-500 mb-4 text-center">
              MP3 format, max 500MB
            </p>
            <button 
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg"
              onClick={handleFileUploadClick}
            >
              Browse Files
            </button>
          </div>
        )}
        
        {uploadStep === 2 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <input 
                  type="file" 
                  ref={coverInputRef}
                  onChange={handleCoverSelect} 
                  accept="image/*" 
                  className="hidden" 
                />
                {coverPreview ? (
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full aspect-square object-cover rounded mb-2" 
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded mb-2">
                    <FileText size={40} className="text-gray-400" />
                  </div>
                )}
                <button 
                  className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  onClick={handleCoverUploadClick}
                >
                  {coverPreview ? 'Change Cover' : 'Upload Cover'}
                </button>
              </div>
            </div>
            
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  value={bookMetadata.title}
                  onChange={(e) => setBookMetadata(prev => ({...prev, title: e.target.value}))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    value={bookMetadata.author}
                    onChange={(e) => setBookMetadata(prev => ({...prev, author: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Narrator</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    value={bookMetadata.narrator}
                    onChange={(e) => setBookMetadata(prev => ({...prev, narrator: e.target.value}))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={bookMetadata.category}
                    onChange={(e) => setBookMetadata(prev => ({...prev, category: e.target.value}))}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">narrationLanguage</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={bookMetadata.narrationLanguage || 'english'}
                    onChange={(e) => setBookMetadata(prev => ({...prev, narrationLanguage: e.target.value}))}
                  >
                    {narrationLanguages.map(lang => (
                      <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox"
                  id="isSeries"
                  checked={bookMetadata.isSeries}
                  onChange={(e) => handleSeriesToggle(e.target.checked)}
                  className="rounded text-indigo-500 mr-2"
                />
                <label htmlFor="isSeries" className="text-sm">This is a series with multiple episodes</label>
              </div>
              
              {bookMetadata.isSeries && (
                <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
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
                  
                  <div className="grid grid-cols-2 gap-3">
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
                    <div>
                      <label className="block text-sm font-medium mb-1">Total Episodes</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full p-2 border rounded"
                        value={bookMetadata.seriesInfo.totalEpisodes}
                        onChange={(e) => setBookMetadata({
                          ...bookMetadata,
                          seriesInfo: {
                            ...bookMetadata.seriesInfo,
                            totalEpisodes: parseInt(e.target.value) || 1
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={bookMetadata.description}
                  onChange={(e) => setBookMetadata({...bookMetadata, description: e.target.value})}
                />
              </div>
              
              <div className="pt-2">
                <p className="text-sm flex items-center gap-1 mb-2">
                  <span className="font-medium">Selected file:</span> 
                  {uploadingFile?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {((uploadingFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
        
        {uploadStep === 3 && (
          <div className="p-6">
            <h4 className="text-lg font-medium mb-4">Uploading "{bookMetadata.title}"</h4>
            
            <div className="mb-8">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{uploadProgress}% complete</span>
                <span>
                  {uploadingFile 
                    ? `${Math.round(uploadProgress * uploadingFile.size / 100 / 1024 / 1024).toFixed(2)} MB / ${(uploadingFile.size / 1024 / 1024).toFixed(2)} MB`
                    : '0 MB / 0 MB'}
                </span>
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
              <h5 className="text-sm font-medium mb-2">Details</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Title:</span> {bookMetadata.title}
                </div>
                <div>
                  <span className="text-gray-500">Author:</span> {bookMetadata.author}
                </div>
                <div>
                  <span className="text-gray-500">Narrator:</span> {bookMetadata.narrator}
                </div>
                <div>
                  <span className="text-gray-500">Category:</span> {bookMetadata.category}
                </div>
                <div>
                  <span className="text-gray-500">narrationLanguage:</span> {bookMetadata.narrationLanguage || 'English'}
                </div>
                {bookMetadata.isSeries && (
                  <>
                    <div>
                      <span className="text-gray-500">Series:</span> Yes
                    </div>
                    <div>
                      <span className="text-gray-500">Episode:</span> {bookMetadata.seriesInfo.currentEpisode} of {bookMetadata.seriesInfo.totalEpisodes}
                    </div>
                    <div>
                      <span className="text-gray-500">Episode Title:</span> {bookMetadata.seriesInfo.episodeTitle}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {uploadStep === 4 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h4 className="text-xl font-medium mb-2">Upload Complete!</h4>
            <p className="text-gray-600 mb-6">
              {bookMetadata.isSeries 
                ? `Your audiobook episode has been uploaded and is pending approval.`
                : `Your audiobook has been uploaded and is pending approval.`}
            </p>
            {bookMetadata.isSeries && (
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-4">
                <p className="text-sm mb-2">You can upload more episodes for this series later.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {uploadStep === 1 && (
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 text-red-500"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      )}
      
      {uploadStep === 2 && (
        <div className="flex justify-between">
          <button 
            className="px-4 py-2 border border-gray-300 rounded"
            onClick={() => setUploadStep(1)}
          >
            Back
          </button>
          <button 
            className="px-6 py-2 bg-indigo-500 text-white rounded"
            onClick={uploadAudiobook}
            disabled={!bookMetadata.title || !bookMetadata.author || !bookMetadata.narrationLanguage}
          >
            Start Upload
          </button>
        </div>
      )}
      
      {uploadStep === 4 && (
        <div className="flex justify-center">
          <button 
            className="px-6 py-2 bg-indigo-500 text-white rounded"
            onClick={handleClose}
          >
            Done
          </button>
        </div>
      )}
    </div>
  </div>
);

export default UploadModal