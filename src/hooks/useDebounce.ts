// useDebounce.ts
import { useCallback, useRef, useEffect } from 'react';

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T, 
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const pendingArgsRef = useRef<Parameters<T>>(null);

  // Cancel pending updates on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback((...args: Parameters<T>) => {
    pendingArgsRef.current = args;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (pendingArgsRef.current) {
        fn(...pendingArgsRef.current);
        pendingArgsRef.current = null;
      }
    }, delay);
  }, [fn, delay]);

  const flush = useCallback(() => {
    if (timeoutRef.current && pendingArgsRef.current) {
      clearTimeout(timeoutRef.current);
      fn(...pendingArgsRef.current);
      pendingArgsRef.current = null;
      return true; // Indicate that a flush occurred
    }
    return false; // No pending updates to flush
  }, [fn]);

  return { debouncedFn, flush };
}