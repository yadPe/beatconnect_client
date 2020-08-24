export const getFadeIn = () => ({
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
});

export const getAppear = () => ({
  '@keyframes appear': {
    from: {
      filter: 'blur(25px)',
      opacity: 0,
    },
    to: {
      filter: 'blur(0px)',
      opacity: 1,
    },
  },
});

export const sectionSwitchAnimation = () => ({
  opacity: 0,
  animation: '140ms ease-in forwards $fadeIn',
});

export const getDragRegion = () => ({
  WebkitAppRegion: 'drag',
  '& > *': {
    WebkitAppRegion: 'no-drag',
  },
});
