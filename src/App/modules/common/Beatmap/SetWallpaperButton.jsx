import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';

import config from '../../../../shared/config';
import renderIcons from '../../../helpers/renderIcons';
import { setWallpaper } from '../../Beatmaps/reducer/actions';

const makeBeatmapBackgroundUrl = (beatmapSetId, beatmapId) => `${config.beatconnect}/bg/${beatmapSetId}/${beatmapId}/`;

const useStyles = createUseStyles({
  SetWallpaperButton: {
    position: 'absolute',
    top: 125,
    right: 5,
    opacity: isLoading => (isLoading ? 0.3 : 1),
    transition: 'opacity .5s',
  },
});

const SetWallpaperButton = ({ beatmapSetId, beatmapId, isBusy }) => {
  const disabled = !['darwin', 'win32'].includes(process.platform);
  const classes = useStyles(isBusy);

  const handleClick = () => {
    if (isBusy) return;
    setWallpaper(makeBeatmapBackgroundUrl(beatmapSetId, beatmapId));
  };
  return (
    !disabled && (
      <div
        title="Set beatmap art as desktop wallpaper"
        className={classes.SetWallpaperButton}
        onClick={handleClick}
        role="button"
      >
        {renderIcons({ name: 'screenHeart' })}
      </div>
    )
  );
};

const mapDispatchToProps = ({ beatmaps }) => ({ isBusy: beatmaps.switchingWallpaper });
export default connect(mapDispatchToProps)(SetWallpaperButton);
