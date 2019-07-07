import React, { useState, useEffect } from 'react'

const Cover = ({ url }) => {
  const [loaded, isLoaded] = useState(false);
  const cover = new Image()
  cover.onload = () => isLoaded(true)
  
  useEffect(() => {
    isLoaded(false)
    cover.setAttribute('src', url);
    //style = {...style}
    console.log('effect')
    console.log('new URL', url)
    console.log('SRC', cover.src)
  }, [url, cover.src]);
  
  
  
  const style = {
    opacity: loaded ? 1 : 0,
    filter: `blur(${loaded ? 0 + 'px' : 10 + 'px'})`,
    transition: '1s',
    width: '48%',
    paddingBottom: '15%',
    margin: '10px auto',
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