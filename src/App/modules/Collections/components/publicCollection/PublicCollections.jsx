import React, { useEffect, useState } from 'react';
import Collection from '../Collection';
import { fetchPublicCollections } from '../../xhr/beatconnectV2';

const PublicCollections = ({ select, search }) => {
  const [colletions, setCollections] = useState([]);

  useEffect(() => {
    fetchPublicCollections().then(e=>setCollections(e));
  }, []);

  return colletions.map(collection => (
    <Collection
      defaultCovers={collection.covers}
      name={collection.title}
      mode="publicCollection"
      creator={collection.creator}
      mapsCount={collection.beatmapCount}
      description={collection.description}
      select={select}
      collectionId={collection.id}
    />
  ));
};

export default PublicCollections;
