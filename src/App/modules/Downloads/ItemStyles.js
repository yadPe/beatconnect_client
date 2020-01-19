import convertRange from '../../utils/convertRange';

export default {
  DownloadsItem: {
    position: 'relative',
    margin: '5px auto',
    textAlign: 'left',
    color: '#fff',
    height: '130',
    width: '90%',
  },
  fade: {
    top: 0,
    left: 0,
    width: '100%',
    filter: props =>
      props.status === 'downloaded'
        ? 'brightness(0.3)'
        : `blur(${props.progress ? convertRange(props.progress, 0, 100, 5, 0) : 4}px) brightness(${
            props.progress ? convertRange(props.progress, 0, 100, 0.5, 1) : 0.5
          })`,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    '&:hover': {
      filter: props => (props.status === 'downloaded' ? ' brightness(0.9)' : ''),
    },
  },
  controls: {
    overflow: 'hidden',
    height: '100%',
  },
  leftControls: {
    position: 'absolute',
    bottom: '5%',
    left: '1%',
  },
  rightControls: {
    position: 'absolute',
    top: '0%',
    right: '1%',
  },
  downloadInfos: {
    userSelect: 'none',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.5vw',
  },
};
