import { error } from 'electron-log';
import config from '../../../../shared/config';
import store from '../../../../shared/store';

const checkResponse = res => {
  if (res.ok) return true;
  if (res.status === 503) {
    store.dispatch({ type: 'PACKS_DISABLED', payload: config.packs.serviceStatus.disabled });
    return false;
  }
  // store.dispatch({ type: 'PACKS_DISABLED', payload: config.packs.serviceStatus.error });
  return false;
};

const getPacksDashboardData = async (mode, callBack) => {
  const { packs, weeklyPacks } = config.api;
  const { packsDashboardData } = store.getState().packs;

  const queries = [];
  if (!packsDashboardData.lastWeekOverview || packsDashboardData.lastWeekOverview[0] === 0) queries.push(weeklyPacks);
  if (!packsDashboardData[mode] || !packsDashboardData[mode].yearly) queries.push(`${packs}&m=${mode}`);

  if (queries.length) {
    const promises = queries.map(queryUrl => fetch(queryUrl));

    try {
      const results = await Promise.all(promises);
      const jsonResults = await Promise.all(results.filter(checkResponse).map(res => res.json()));
      return callBack(jsonResults, mode);
    } catch (err) {
      error(err);
    }
  }

  return packsDashboardData;
};

export default getPacksDashboardData;
