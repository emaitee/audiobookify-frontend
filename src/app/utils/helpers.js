// Helper function for formatting time
export function formatTime(seconds, verbose = false) {
    if (verbose && seconds > 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours} hr ${mins} min`;
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }