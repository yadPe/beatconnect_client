export default timeStamp => {
  const now = new Date(),
    secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + ' sec ago';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + ' min ago';
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + ' h ago';
  }
  if (secondsPast > 86400) {
    const day = timeStamp.getDate();
    const month = timeStamp
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(' ', '');
    const year = timeStamp.getFullYear() === now.getFullYear() ? '' : ' ' + timeStamp.getFullYear();
    return day + ' ' + month + year;
  }
};
