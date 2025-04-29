'use client'
import { useState, useRef } from 'react';
import { Plus, Upload, X, PlayCircle, Check, AlertTriangle, BarChart2, FileText, Settings } from 'lucide-react';

const AdminView = () => {
  const [activeTab, setActiveTab] = useState('uploads');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [bookMetadata, setBookMetadata] = useState({
    title: '',
    author: '',
    narrator: '',
    category: 'fiction',
    description: ''
  });
  const [uploadStep, setUploadStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  
  const pendingApprovals = [
    { id: 'a1', title: "The Great Gatsby", author: "F. Scott Fitzgerald", narrator: "Jake Gyllenhaal", status: "pending", date: "Apr 25, 2025" },
    { id: 'a2', title: "Pride and Prejudice", author: "Jane Austen", narrator: "Rosamund Pike", status: "pending", date: "Apr 24, 2025" },
  ];
  
  const [recentUploads, setRecentUploads] = useState([
    { id: 'b1', title: "The Alchemist", author: "Paulo Coelho", narrator: "Jeremy Irons", status: "approved", date: "Apr 23, 2025" },
    { id: 'b2', title: "To Kill a Mockingbird", author: "Harper Lee", narrator: "Sissy Spacek", status: "approved", date: "Apr 22, 2025" },
    { id: 'b3', title: "The Hobbit", author: "J.R.R. Tolkien", narrator: "Andy Serkis", status: "rejected", date: "Apr 21, 2025", reason: "Audio quality issues" },
  ]);
  
  const audioStats = {
    totalBooks: 1245,
    totalHours: 8762,
    pendingApprovals: 7,
    activeUploads: 3
  };
  
interface FileSelectEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget & { files: FileList };
}

const handleFileSelect = (e: FileSelectEvent) => {
    const file = e.target.files[0];
    if (file) {
        setUploadingFile(file);
        // Auto-fill title from filename (remove extension)
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setBookMetadata(prev => ({
            ...prev,
            title: fileName.replace(/_/g, ' ')
        }));
        setUploadStep(2);
    }
};

const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                setCoverPreview(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    }
};
  
  const simulateUpload = () => {
    setUploadProgress(0);
    setUploadStep(3);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Add the new upload to the recent uploads list
            const newUpload = {
              id: `new-${Date.now()}`,
              title: bookMetadata.title,
              author: bookMetadata.author,
              narrator: bookMetadata.narrator,
              status: "pending",
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            setRecentUploads(prev => [newUpload, ...prev]);
            
            // Reset state
            setUploadStep(4);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  const handleClose = () => {
    setShowUploadModal(false);
    setUploadStep(1);
    setUploadingFile(null);
    setCoverPreview(null);
    setBookMetadata({
      title: '',
      author: '',
      narrator: '',
      category: 'fiction',
      description: ''
    });
    setUploadProgress(0);
  };
  
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleCoverUploadClick = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };
  
  const categories = [
    'Fiction', 'Non-Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 
    'Romance', 'Biography', 'Self-Help', 'Business', 'History'
  ];
  
  const UploadModal = () => (
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
            <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex justify-center mb-1">
                {uploadStep > 1 ? <Check size={20} className="text-blue-500" /> : <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">1</span>}
              </div>
              <p className="text-sm">Select File</p>
            </div>
            <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 2 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex justify-center mb-1">
                {uploadStep > 2 ? <Check size={20} className="text-blue-500" /> : <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">2</span>}
              </div>
              <p className="text-sm">Add Details</p>
            </div>
            <div className={`flex-1 p-2 text-center rounded-lg border-2 ${uploadStep >= 3 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex justify-center mb-1">
                {uploadStep > 3 ? <Check size={20} className="text-blue-500" /> : <span className="w-5 h-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs">3</span>}
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
                accept="audio/mp3,audio/mpeg" 
                className="hidden" 
              />
              <Upload size={40} className="text-gray-400 mb-4" />
              <h4 className="text-lg font-medium mb-2">Select Audio File</h4>
              <p className="text-sm text-gray-500 mb-4 text-center">
                MP3 format, max 500MB
              </p>
              <button 
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
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
                    onChange={(e) => setBookMetadata({...bookMetadata, title: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded"
                      value={bookMetadata.author}
                      onChange={(e) => setBookMetadata({...bookMetadata, author: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Narrator</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded"
                      value={bookMetadata.narrator}
                      onChange={(e) => setBookMetadata({...bookMetadata, narrator: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={bookMetadata.category}
                    onChange={(e) => setBookMetadata({...bookMetadata, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                  </select>
                </div>
                
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
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
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
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
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
                Your audiobook has been uploaded and is pending approval.
              </p>
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
              className="px-6 py-2 bg-blue-500 text-white rounded"
              onClick={simulateUpload}
              disabled={!bookMetadata.title || !bookMetadata.author}
            >
              Start Upload
            </button>
          </div>
        )}
        
        {uploadStep === 4 && (
          <div className="flex justify-center">
            <button 
              className="px-6 py-2 bg-blue-500 text-white rounded"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
interface ApprovalItem {
    id: string;
    title: string;
    author: string;
    narrator: string;
    status: string;
    date: string;
    reason?: string;
}

const handleApprove = (id: string) => {
    const updatedPendingApprovals: ApprovalItem[] = pendingApprovals.filter(item => item.id !== id);
    const approvedItem: ApprovalItem | undefined = pendingApprovals.find(item => item.id === id);
    
    if (approvedItem) {
        approvedItem.status = 'approved';
        approvedItem.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setRecentUploads([approvedItem, ...recentUploads]);
    }
};
  
interface RejectItem extends ApprovalItem {
    reason?: string;
}

const handleReject = (id: string) => {
    const updatedPendingApprovals: ApprovalItem[] = pendingApprovals.filter(item => item.id !== id);
    const rejectedItem: RejectItem | undefined = pendingApprovals.find(item => item.id === id);
    
    if (rejectedItem) {
        rejectedItem.status = 'rejected';
        rejectedItem.reason = 'Rejected by admin';
        rejectedItem.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setRecentUploads([rejectedItem, ...recentUploads]);
    }
};
  
  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus size={16} />
          <span>Upload</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold">{audioStats.totalBooks}</h3>
          <p className="text-sm text-gray-600">Total Books</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold">{audioStats.totalHours}</h3>
          <p className="text-sm text-gray-600">Hours of Content</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold">{audioStats.pendingApprovals}</h3>
          <p className="text-sm text-gray-600">Pending Approvals</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold">{audioStats.activeUploads}</h3>
          <p className="text-sm text-gray-600">Active Uploads</p>
        </div>
      </div>
      
      <div className="border-b flex">
        <button 
          className={`px-4 py-2 ${activeTab === 'uploads' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('uploads')}
        >
          Uploads
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'approvals' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('approvals')}
        >
          Approvals
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      {activeTab === 'uploads' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Uploads</h2>
            <button className="text-blue-500 text-sm">View All</button>
          </div>
          
          <div className="flex flex-col gap-3">
            {recentUploads.map(book => (
              <div key={book.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{book.title}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    book.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    book.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  By {book.author} • Narrated by {book.narrator}
                </p>
                <p className="text-xs text-gray-500 mt-1">Uploaded on {book.date}</p>
                
                {book.status === 'rejected' && book.reason && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    Rejection reason: {book.reason}
                  </div>
                )}
                
                <div className="flex gap-2 mt-3">
                  <button className="text-sm text-blue-500">Edit</button>
                  <button className="text-sm text-gray-500">View Details</button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-2 border border-gray-300 rounded-lg text-gray-600">
            Load More
          </button>
        </div>
      )}
      
      {activeTab === 'approvals' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Pending Approvals</h2>
            <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
              {pendingApprovals.length} Pending
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            {pendingApprovals.map(book => (
              <div key={book.id} className="border rounded-lg p-4">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">
                  By {book.author} • Narrated by {book.narrator}
                </p>
                <p className="text-xs text-gray-500 mt-1">Submitted on {book.date}</p>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-1">
                    <PlayCircle size={16} />
                    <span>Listen</span>
                  </button>
                  <button 
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-1"
                    onClick={() => handleApprove(book.id)}
                  >
                    <Check size={16} />
                    <span>Approve</span>
                  </button>
                  <button 
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-1"
                    onClick={() => handleReject(book.id)}
                  >
                    <X size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {pendingApprovals.length === 0 && (
            <div className="mt-4 text-center text-gray-500 text-sm">
              No more approvals pending
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Upload Statistics</h3>
            <div className="h-64 bg-gray-100 flex items-end justify-around rounded p-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                <div key={month} className="flex flex-col items-center h-full justify-end">
                  <div 
                    className="w-12 bg-blue-500 rounded-t" 
                    style={{ height: `${20 + (i * 10) + Math.floor(Math.random() * 35)}%` }}
                  ></div>
                  <span className="text-xs mt-2">{month}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Popular Categories</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fiction</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full w-5/12"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Non-Fiction</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full w-3/12"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fantasy</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full w-2/12"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mystery</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full w-1/12"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Top Performing Books</h3>
              <button className="text-blue-500 text-sm">See All</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">1</span>
                <div>
                  <h4 className="font-medium">The Great Gatsby</h4>
                  <p className="text-sm text-gray-600">8,542 listens</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">2</span>
                <div>
                  <h4 className="font-medium">To Kill a Mockingbird</h4>
                  <p className="text-sm text-gray-600">7,129 listens</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">3</span>
                <div>
                  <h4 className="font-medium">1984</h4>
                  <p className="text-sm text-gray-600">6,751 listens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showUploadModal && <UploadModal />}
      
      <div className="fixed bottom-20 right-4 shadow-lg bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Upload Guide</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <ul className="text-sm space-y-1 list-disc pl-4">
          <li>Audio files must be MP3 format</li>
          <li>Maximum file size: 500MB</li>
          <li>Include chapter markers</li>
          <li>Cover image required (1400×1400)</li>
        </ul>
        <button className="text-blue-500 text-sm mt-2">View Full Requirements</button>
      </div>
    </div>
  );
};

export default AdminView;