export const fetchPublicCollections = () => fetch('https://v2.beatconnect.io/api/collections').then(res => res.json());

export const fetchPublicCollection = id =>
  fetch(`https://v2.beatconnect.io/api/collections/${id}`).then(res => res.json());
