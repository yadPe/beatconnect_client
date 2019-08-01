import React, { useState, useEffect } from 'react'

const Cover = ({ url }) => {
  const [loaded, isLoaded] = useState(false);
  const cover = new Image()
  cover.onload = () => isLoaded(true)
  
  useEffect(() => {
    isLoaded(false)
    cover.setAttribute('src', url);
  }, [url]);
  
  const style = {
    opacity: loaded ? 1 : 0,
    filter: `blur(${loaded ? 0 + 'px' : 10 + 'px'})`,
    transition: '1s all',
    width: '100%',
    paddingBottom: '15%',
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