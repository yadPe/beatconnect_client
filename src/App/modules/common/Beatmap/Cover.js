import React, { useState, useEffect, useRef } from 'react';
import config from '../../../../shared/config';

const Cover = ({ url, width, height, paddingBottom, noFade, canLoad = true }) => {
  const [loaded, isLoaded] = useState(false);
  const coverRef = useRef();
  useEffect(() => {
    if (!coverRef.current && canLoad) {
      coverRef.current = new Image();
      coverRef.current.onload = () => isLoaded(true);
    }
    if (canLoad && !loaded) {
      coverRef.current.setAttribute('src', url);
    }
  }, [canLoad, coverRef.current]);

  const style = {
    opacity: noFade ? 1 : loaded ? 1 : 0,
    filter: noFade ? '' : `blur(${loaded ? 0 : 10}px)`,
    transition: `all ${config.display.defaultTransitionDuration}`,
    width: width || '100%',
    height: height || null,
    paddingBottom: paddingBottom ? '15%' : 0,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: loaded && `url('${url}')`,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  };
  return <div className="cover" style={style} />;
};

export default Cover;
