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
    titleBarHeight: 23,
    defaultTransitionDuration: '200ms',
    defaultAccentColor: '#17b04c',
  },
  download: {
    status: {
      queued: 'queued',
      canceled: 'canceled',
      downloading: 'downloading',
      paused: 'paused',
    },
  },
  beatmaps: {
    availableStatusLabels: ['Ranked', 'Approved', 'Qualified', 'Loved', 'Unranked', 'All'],
    availableStatus: ['ranked', 'approved', 'qualified', 'loved', 'unranked', 'all'],
    availableModesLabels: ['Any', 'Osu!', 'Mania', 'Taiko', 'CTB'],
    availableModes: ['all', 'std', 'mania', 'taiko', 'ctb'],
  },
  packs: {
    availableModesLabels: ['Osu!', 'Mania', 'Taiko', 'CTB'],
    availableModes: ['std', 'mania', 'taiko', 'ctb'],
  },
};
