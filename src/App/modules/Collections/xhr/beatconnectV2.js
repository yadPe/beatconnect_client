export const fetchPublicCollections = () => fetch('https://v2.beatconnect.io/api/collections').then(res => res.json());
