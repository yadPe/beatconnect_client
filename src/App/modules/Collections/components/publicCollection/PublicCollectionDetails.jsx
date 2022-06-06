import React, { useEffect, useState } from 'react';
import BeatmapPackDetail from '../../../Packs/BeatmapPackDetail';
import { fetchPublicCollection } from '../../xhr/beatconnectV2';

const PublicCollectionDetails = ({ select, collectionId }) => {
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    fetchPublicCollection(collectionId).then(setCollection);
  }, []);

  return collection && <BeatmapPackDetail pack={collection} select={select} />;
};

export default PublicCollectionDetails;
