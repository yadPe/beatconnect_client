const initialState = {
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
    default:
      return state;
  }
};
