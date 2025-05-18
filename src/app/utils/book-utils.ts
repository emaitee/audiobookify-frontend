import { Book } from "../[locale]/page";



// Calculate progress based on user's history or position
export const calculateProgress = (book: Book): number => {
  if (book.progress !== undefined) {
    return book.progress;
  }
  
  if (book.episodes && book.episodes.length > 0 && book.currentEpisode !== undefined) {
    const episode = book.episodes[book.currentEpisode];
    if (episode && episode.position && episode.duration) {
      return Math.floor((episode.position / episode.duration) * 100);
    }
  }
  
  return 0; // Default to 0 if we can't calculate progress
};

// Find first episode or use book for playback
export const getPlayableContent = (book: Book) => {
  if (book.isSeries && book.episodes?.[0]) {
    return {
      ...book,
      audioFile: book.episodes[0].audioFile,
      duration: book.episodes[0].duration,
      episodeNumber: book.episodes[0].episodeNumber
    };
  }
  
  return {
    ...book,
    audioFile: book.audioFile || '',
    duration: book.duration || 0
  };
};

// Get appropriate image sizing for optimization
export const getOptimizedImageUrl = (originalUrl: string, width = 300): string => {
  // This is a placeholder function - replace with your actual image optimization logic
  // For example, if using a CDN that supports on-the-fly resizing
  if (originalUrl.includes('?')) {
    return `${originalUrl}&width=${width}`;
  }
  return `${originalUrl}?width=${width}`;
};