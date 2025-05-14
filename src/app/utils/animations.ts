export const ANIMATION_DURATION = 300; // in ms

export const slideInAnimation = {
  entering: { transform: 'translateY(100%)' },
  entered: { transform: 'translateY(0)' },
  exiting: { transform: 'translateY(0)' },
  exited: { transform: 'translateY(100%)' },
};

export const fadeAnimation = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0 },
};
