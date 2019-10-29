export default {
  api: {
    packsBaseUrl: 'https://beatconnect.io/api/packs/?token=3u80rns2wkcidsz7',
    weeklyPackBaseUrl: 'https://beatconnect.io/api/packs/weekly/?token=3u80rns2wkcidsz7',
    beatmapsBaseUrl: 'https://beatconnect.io/api/search/?token=b3z8gl9pzt7iqa89',
  },
  display: {
    defaultLanguage: 'en',
    defaultSection: 'Beatmaps',
    topBarHeight: 48,
    sidePanelCompactedLength: 48,
    sidePanelExpandedLength: 150,
    titleBarHeight: 31,
  },
  beatmaps: {
    availableStatus: ['ranked', 'approved', 'qualified', 'loved', 'unranked', 'all'],
    availableModes: ['all', 'std', 'mania', 'taiko', 'ctb'],
  },
  packs: {
    availableModes: ['std', 'mania', 'taiko', 'ctb'],
  },
};
