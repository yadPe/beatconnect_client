import store from "../../../../shared/store";

/**
 * Prepare and merge packs data from api to be displayed in packs section
 * @param {Array} packsData [[weeklyPack], packs]
 * @returns redux action with ready to consume pack in it
 */
export const processBeatconnectPacksData = (packsData = [], mode = '') => {
  // Get existing packs from store
  const localPacks = store.getState().packs.packsDashboardData;

  // Clear placeholders here since lastWeekOverview doesn't exist in the api and is constructed locally
  localPacks.lastWeekOverview = [];

  packsData.forEach((packData = []) => {
    // it is the weekly packs array
    if (Array.isArray(packData)) {
      localPacks.lastWeekOverview = packData;
    } else { // it is the other packs object
      Object.entries(packData).forEach(([packType = "", pack = []]) => {
        if (!pack.length) {
          localPacks[mode][packType] = []
          return
        }
        localPacks[mode][packType] = packType === 'weekly' ? pack.slice(1) : pack;
      })

    }
  })

  return { type: 'PACKS_DASHBOARD_QUERY_DATA', payload: localPacks };

}