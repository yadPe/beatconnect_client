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
  animationDelay: '56ms',
});

export const getDragRegion = (override, header) => ({
  WebkitAppRegion: `drag ${override ? '!important' : ''}`,
  position: 'relative',
  ...(header
    ? {
        '&::after': {
          content: "''",
          height: '24px',
          display: 'block',
          position: 'absolute',
          width: '80px',
          right: 0,
          top: 0,
          WebkitAppRegion: `no-drag !important`,
        },
      }
    : null),
  '& > *': {
    WebkitAppRegion: `no-drag ${override ? '!important' : ''}`,
  },
});
