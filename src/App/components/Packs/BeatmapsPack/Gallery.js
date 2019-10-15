import React, { useRef } from 'react'
import injectSheet from 'react-jss'

const styles = {
  Gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 60px)',
    gridTemplateRows: 'repeat(8, 40px)',
    gridGap: '0px',
    justifyContent: 'center'
  },
}

const Gallery = ({ classes, thumbs, getWidth }) => {
  const that = useRef(null)
  console.log(that)
  if (that.current) getWidth(that.current.getBoundingClientRect().width)
  const thumbnails = useRef(new Array(200).fill(null).map((_, i) => <img src={thumbs[i] || thumbs[Math.floor(Math.random() * thumbs.length)]} width={60} height={40} alt='thumb'/> ))
  return (
    <div className={classes.Gallery} ref={that}>
      {thumbnails.current} 
    </div>
  );
}

export default injectSheet(styles)(Gallery);