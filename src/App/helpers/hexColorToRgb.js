export default hex => {
  const rgbArray = hex.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16));
  return `rgb(${rgbArray.join(',')})`;
};
