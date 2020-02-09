import config from '../../../../shared/config';

const initialState = {
  serviceStatus: config.packs.serviceStatus.ok,
  packsDashboardData: {
    lastWeekOverview: [0, 0, 0, 0],
    std: {},
    ctb: {},
    mania: {},
    taiko: {},
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'PACKS_DASHBOARD_QUERY_DATA':
      return { ...state, packsDashboardData: { ...state.packsDashboardData, ...payload } };
    case 'PACKS_DISABLED':
      return { ...state, serviceStatus: payload };
    default:
      return state;
  }
};
