module.exports = src => {
  src = src.trim();
  const lines = src.substr(src.indexOf('\n')).split('\n');
  let category = null;
  const data = {};

  for (let i = 0; i < lines.length; ++i) {
    try {
      lines[i] = lines[i].trim();
      if (lines[i] === '' || lines[i].indexOf('//') === 0) continue;

      const categoryMatch = lines[i].match(/^\[(.*)\]$/);

      if (categoryMatch) {
        category = categoryMatch[1];
        if (category === 'Events' || category === 'TimingPoints' || category === 'HitObjects') data[category] = [];
        else data[category] = {};
      } else if (category === 'Events' || category === 'TimingPoints' || category === 'HitObjects') {
        if (category === 'Events' && (lines[i][0] === '_' || lines[i][0] === ' '))
          data[category][data.data[category].length - 1] += ',' + lines[i].substr(1);
        else data[category].push(lines[i].split(','));
      } else {
        const lineMatch = lines[i].match(/^(\S*?)\s*:\s*(.*)$/);
        data[category][lineMatch[1]] = lineMatch[2];
      }
    } catch (err) {
      console.warn(`An error occurred while parsing: file will be partially incomplete`, err);
    }
  }
  return data;
};
