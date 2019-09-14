import React, { useState, useEffect, memo } from 'react'

const Cover = ({ url, width, height, paddingBottom, noFade }) => {
  const [loaded, isLoaded] = useState(false);
  const cover = new Image()
  cover.onload = () => isLoaded(url)
  
  useEffect(() => {
    // isLoaded(false)
    if (loaded !== url)
      cover.setAttribute('src', url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, loaded]);
  
  const style = {
    opacity: noFade ? 1 : loaded ? 1 : 0,
    filter: noFade ? '' : `blur(${loaded ? 0 + 'px' : 10 + 'px'})`,
    transition: '200ms all',
    width: width || '100%',
    height: height || null,
    paddingBottom: paddingBottom ? '15%' : 0,
    // margin: 'auto 0 auto 10px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url('${url}')`,
    backgroundColor: 'rgba(255, 255, 255, 0.02)'
  }
  return (
    <div className='cover' style={style} />
  );
}

const areEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}
export default memo(Cover, areEqual);