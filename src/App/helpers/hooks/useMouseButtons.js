import { useEffect } from 'react';

const MOUSE_BUTTONS = Object.freeze({
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
  BACK: 3,
  FORWARD: 4,
});
const DEFAULT_HANDLER = () => {};

const useMouseButtons = ({
  left = DEFAULT_HANDLER,
  middle = DEFAULT_HANDLER,
  right = DEFAULT_HANDLER,
  back = DEFAULT_HANDLER,
  forward = DEFAULT_HANDLER,
} = {}) => {
  useEffect(() => {
    const handleMouseButton = e => {
      if (typeof e === 'object') {
        switch (e.button) {
          case MOUSE_BUTTONS.LEFT:
            left();
            break;
          case MOUSE_BUTTONS.MIDDLE:
            middle();
            break;
          case MOUSE_BUTTONS.RIGHT:
            right();
            break;
          case MOUSE_BUTTONS.BACK:
            back();
            break;
          case MOUSE_BUTTONS.FORWARD:
            forward();
            break;
          default:
            // eslint-disable-next-line no-console
            console.warn(`Unknown button code: ${e.button}`);
        }
      }
    };
    document.addEventListener('mouseup', handleMouseButton);
    return () => {
      document.removeEventListener('mouseup', handleMouseButton);
    };
  }, []);
};

export default useMouseButtons;
