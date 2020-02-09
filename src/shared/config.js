import apiConstant from './apiConstant';

export default {
  osu: 'https://osu.ppy.sh',
  beatconnect: 'https://beatconnect.io',
  api: {
    ...apiConstant,
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
    serviceStatus: {
      disabled: 'disabled',
      ok: 'ok',
      error: 'ko',
    },
    availableModesLabels: ['Osu!', 'Mania', 'Taiko', 'CTB'],
    availableModes: ['std', 'mania', 'taiko', 'ctb'],
  },
  settings: {
    importMethod: {
      bulk: 'bulk',
      auto: 'auto',
      manual: 'manual',
    },
  },
};
