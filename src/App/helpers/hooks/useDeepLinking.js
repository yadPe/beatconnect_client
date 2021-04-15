const { ipcRenderer } = require('electron');
const { useEffect } = require('react');

const getAction = deepLinkArgs => {
  const [action, actionData] = deepLinkArgs.split('/?');

  return { action, actionData };
};

const useDeepLinking = () => {
  useEffect(() => {
    const onDeepLink = (_, args) => {
      const action = getAction(args);
      console.log('deep link', { action, args });
    };
    ipcRenderer.on('beatconnect-open', onDeepLink);
    return () => {
      ipcRenderer.removeListener('beatconnect-open', onDeepLink);
    };
  }, []);
};

export default useDeepLinking;
