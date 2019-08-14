import React, { useState, useEffect } from 'react'

const Cover = ({ url, width, height, paddingBottom }) => {
  const [loaded, isLoaded] = useState(false);
  const cover = new Image()
  cover.onload = () => isLoaded(true)
  
  useEffect(() => {
    isLoaded(false)
    cover.setAttribute('src', url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  
  const style = {
    opacity: loaded ? 1 : 0,
    filter: `blur(${loaded ? 0 + 'px' : 10 + 'px'})`,
    transition: '1s all',
    width: width || '100%',
    height: height || null,
    paddingBottom: paddingBottom ? '15%' : 0,
    // margin: 'auto 0 auto 10px',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url('${url}')`
  }
  return (
    <div className='cover' style={style} />
  );
}

export default Cover;