import config from '../../../config';
import store from '../../../store';

// const allWeekly = [
//   `${packsBaseUrl}&t=weekly&m=std`,
//   `${packsBaseUrl}&t=weekly&m=mania`,
//   `${packsBaseUrl}&t=weekly&m=ctb`,
//   `${packsBaseUrl}&t=weekly&m=taiko`,
// ];

// const monthlyYearlyByMode = mode => [`${packsBaseUrl}&t=monthly&m=${mode}`, `${packsBaseUrl}&t=yearly&m=${mode}`];

// const getPacksDashboardData = async (mode, callBack) => {
//   const promises = [...allWeekly, ...monthlyYearlyByMode(mode)].map(getUrl => fetch(getUrl));

//   const results = await Promise.all(promises);

//   const jsonResults = await Promise.all(results.filter(res => res.ok).map(res => res.json()));

//   // const output = {};
//   // jsonResults.forEach(result => {
//   //   if (!output[result[0].mode]) output[result[0].mode] = {};
//   //   output[result[0].mode][result[0].type] = result;
//   // });

//   return callBack(jsonResults);
// };

const getPacksDashboardData = async (mode, callBack) => {
  const { packsBaseUrl, weeklyPackBaseUrl } = config.api;
  const { packsDashboardData } = store.getState().main;

  const queries = [];
  if (!packsDashboardData.lastWeekOverview) queries.push(weeklyPackBaseUrl);
  if (!packsDashboardData[mode]) queries.push(`${packsBaseUrl}&m=${mode}`);

  if (queries.length) {
    const promises = queries.map(queryUrl => fetch(queryUrl));

    const results = await Promise.all(promises);

    const jsonResults = await Promise.all(results.filter(res => res.ok).map(res => res.json()));

    console.log(jsonResults);
    return callBack(jsonResults);
  }

  return packsDashboardData;
};

export default getPacksDashboardData;
