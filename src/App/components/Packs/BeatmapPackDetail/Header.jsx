import React, { useContext } from 'react';
import InjectSheet from 'react-jss';
import TextInput from '../../common/TextInput';
import renderIcons from '../../../utils/renderIcons';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import { HistoryContext } from '../../../../Providers/HistoryProvider';

const styles = {
  wrapper: {
    display: 'inline-flex',
    width: '100%',
    '& > *': {
      marginTop: 'auto',
      marginBottom: 'auto',
    },
  },
  backButton: {
    margin: 'auto 20px auto 10px',
    cursor: 'pointer',
    '& > svg': {
      margin: 'auto',
      display: 'block',
    },
  },
  name: {
    flexGrow: 1,
  },
  downloadButton: {
    cursor: 'pointer',
    margin: 'auto 10px auto 5px',
  },
};

const PackDetailHeader = ({ classes, pack: { beatmapsets, name, type }, filter: { filter, setFilter }, quit }) => {
  const history = useContext(HistoryContext);
  const handleInputChange = e => setFilter(e.target.value);
  const beatmapsToDownload = beatmapsets.filter(beatmap => !history.contains(beatmap.id));
  const packCompleted = beatmapsToDownload.length === 0;
  const downloadTitle = packCompleted ? "You're all set !" : `Download ${beatmapsToDownload.length} beatmaps`;
  return (
    <div className={classes.wrapper}>
      <div title="Back" role="button" onClick={quit} className={classes.backButton}>
        {renderIcons('Back')}
      </div>
      <p className={classes.name}>{name}</p>
      {/* <p>{beatmapsets.length}</p> */}
      {!packCompleted && <p title={downloadTitle}>{beatmapsToDownload.length}</p>}
      <DownloadBeatmapBtn
        pack={beatmapsToDownload}
        title={downloadTitle}
        noStyle
        className={`${classes.downloadButton} clickable`}
      />
      <TextInput onChange={handleInputChange} placeHolder="Search" />
    </div>
  );
};

export default InjectSheet(styles)(PackDetailHeader);
