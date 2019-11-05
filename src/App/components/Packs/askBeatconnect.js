import config from '../../../config';
import store from '../../../store';

const getPacksDashboardData = async (mode, callBack) => {
  const { packsBaseUrl, weeklyPackBaseUrl } = config.api;
  const { packsDashboardData } = store.getState().main;

  const queries = [];
  if (!packsDashboardData.lastWeekOverview || !packsDashboardData.lastWeekOverview.length)
    queries.push(weeklyPackBaseUrl);
  if (!packsDashboardData[mode] || !packsDashboardData[mode].yearly.length) queries.push(`${packsBaseUrl}&m=${mode}`);

  if (queries.length) {
    const promises = queries.map(queryUrl => fetch(queryUrl));

    const results = await Promise.all(promises);

    const jsonResults = await Promise.all(results.filter(res => res.ok).map(res => res.json()));

    return callBack(jsonResults);
  }

  return packsDashboardData;
};

export default getPacksDashboardData;
