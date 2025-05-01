// import { useState, useEffect } from 'react';

// interface UseDebounceProps<T> {
//   value: T;
//   delay: number;
// }

// export function useDebounce<T>({ value, delay }: UseDebounceProps<T>): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     // Set a timeout to update the debounced value after the specified delay
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     // Clear the timeout if the value changes or the component unmounts
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// }