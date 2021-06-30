const timeSince = date => {
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;
  if (secondsPast < 60) {
    return `${parseInt(secondsPast, 10)} sec ago`;
  }
  if (secondsPast < 3600) {
    return `${parseInt(secondsPast / 60, 10)} min ago`;
  }
  if (secondsPast < 86400) {
    return `${parseInt(secondsPast / 3600, 10)} hours ago`;
  }
  if (secondsPast < 2628336.2137829) {
    return `${parseInt(secondsPast / 86400, 10)} days ago`;
  }
  if (secondsPast < 31536000) {
    return `${parseInt(secondsPast / 2628336.2137829, 10)} months ago`;
  }
  const day = date.getDate();
  const month = date
    .toDateString()
    .match(/ [a-zA-Z]*/)[0]
    .replace(' ', '');
  const year = date.getFullYear() === now.getFullYear() ? '' : ` ${date.getFullYear()}`;
  return `${day} ${month + year}`;
};

export default timeSince;

export const secToMinSec = sec => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;

  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  return `${str_pad_left(minutes, '0', 2)}:${str_pad_left(seconds, '0', 2)}`;
};
