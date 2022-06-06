import React, { useContext, useState } from 'react';
import InjectSheet from 'react-jss';
import TextInput from '../../common/TextInput';
import renderIcons from '../../../helpers/renderIcons';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import useMouseButtons from '../../../helpers/hooks/useMouseButtons';
import config from '../../../../shared/config';

const styles = {
  wrapper: {
    gap: '1rem',
    display: 'inline-flex',
    width: `calc(100% - ${config.display.headerRightSaftyMargin}px)`,
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
  const [search, setSearch] = useState('');
  useMouseButtons({ back: quit });
  if (search !== '') setFilter(search);
  const handleInputChange = e => setSearch(e.target.value);
  const beatmapsToDownload = beatmapsets.filter(beatmap => !history.contains(beatmap.id));
  const filteredBeatmapsets =
    search !== ''
      ? beatmapsToDownload.filter(
          ({ title, artist }) =>
            title.toLowerCase().includes(search.toLowerCase()) || artist.toLowerCase().includes(search.toLowerCase()),
        )
      : beatmapsToDownload;
  const packCompleted = beatmapsToDownload.length === 0;
  const downloadTitle = packCompleted ? "You're all set !" : `Download ${filteredBeatmapsets.length} beatmaps`;
  return (
    <div className={classes.wrapper}>
      <div title="Back" role="button" onClick={quit} className={classes.backButton}>
        {renderIcons({ name: 'Back' })}
      </div>
      <p className={classes.name}>{name}</p>
      <div style={{ display: 'flex' }}>
        {!packCompleted && <p title={downloadTitle}>{filteredBeatmapsets.length}</p>}
        <DownloadBeatmapBtn
          pack={filteredBeatmapsets}
          title={downloadTitle}
          noStyle
          className={`${classes.downloadButton} clickable`}
        />
      </div>
      <TextInput onChange={handleInputChange} placeholder="Search" />
    </div>
  );
};

export default InjectSheet(styles)(PackDetailHeader);
