import { useDispatch } from 'react-redux';
import { changeCurrentSection } from '../../app.actions';
import { useDownloadHistory } from '../../Providers/HistoryProvider';

const { ipcRenderer } = require('electron');
const { useEffect } = require('react');

const getAction = deepLinkArgs => {
  const [action, actionData] = deepLinkArgs.split('/?');

  return { action, actionData };
};

const useDeepLinking = () => {
  const dispatch = useDispatch();
  const history = useDownloadHistory();

  const handlePreview = beatmapsetId => {
    if (history.contains(beatmapsetId)) {
      dispatch(changeCurrentSection('My Library', { beatmapsetId }));
    } else {
      dispatch(changeCurrentSection('Beatmaps', { beatmapsetId }));
    }
  };

  const deepLinkHandler = deepLinkAction => {
    switch (deepLinkAction.action) {
      case 'preview':
        handlePreview(new URLSearchParams(deepLinkAction.actionData).get('setId'));
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const onDeepLink = (_, args) => {
      const action = getAction(args);
      deepLinkHandler(action);
    };
    ipcRenderer.on('beatconnect-open', onDeepLink);
    return () => {
      ipcRenderer.removeListener('beatconnect-open', onDeepLink);
    };
  }, []);
};

export default useDeepLinking;
