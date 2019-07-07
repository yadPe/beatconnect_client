import React from 'react'

const Cover = ({ url }) => {
  const style = {
    width: '48%',
    paddingBottom: '15%',
    margin: '1.66%',
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