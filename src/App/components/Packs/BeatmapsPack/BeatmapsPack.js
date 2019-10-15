import React, { useContext, useState } from 'react'
import injectSheet from 'react-jss'
import Gallery from './Gallery'
import renderIcons from '../../../utils/renderIcons'
import { HistoryContext } from '../../../../Providers/HistoryProvider'
import { DownloadQueueContext } from '../../../../Providers/DownloadQueueProvider'

const styles = {
  BeatmapsPack: {
    // background: 'none',
    overflow: 'hidden',
    height: '245px',
    position: 'relative',
    width: '90%',
    margin: 'auto',
    justifyContent: 'center'
  },
  infos: {
    background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.41) 10%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.41) 90%, rgba(0,0,0,0) 100%);',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  details: {
    width: '90%',
    fontSize: '15px',
    display: 'inline-flex',
    // position: 'absolute',
    // bottom: '6px',
    // left: '3%',
    margin: 'auto auto 5px auto',
    '& div': {
      display: 'inline-flex',
    },
    '& p': {
      margin: '2px 5px'
    }
  }
}

const BeatmapsPack = ({ classes, pack, theme }) => {
  const { name, date_from, date_to, mode, beatmapsets } = pack[0];
  const history = useContext(HistoryContext)
  const downloadQueue = useContext(DownloadQueueContext)
  const [width, setWidth] = useState('100%')
  return (
    <div className={`${classes.BeatmapsPack}`}>
      <Gallery thumbs={beatmapsets.map((beatmap, i) => i < 70 ? `https://b.ppy.sh/thumb/${beatmap.id}.jpg` : null).filter(beatmap => beatmap !== null)} getWidth={(w) => setWidth(w)} />
      <div className={classes.infos}>
        <p>{name}</p>
        <button
        style={{width: 120, margin: '0 auto'}}
          onClick={() => downloadQueue.push(
            beatmapsets.map(({ unique_id, id, title, artist }) => (
              { url: `https://beatconnect.io/b/${id}/${unique_id}`, id, fullTitle: `${title} - ${artist}`, onFinished: () => history.save({ id, name: `${title} - ${artist}` }) }
            )))}
        >
          Download
              </button>
        <div className={classes.details}>
          <div style={{ marginRight: 'auto' }}>
            {renderIcons('Calendar', theme.style)}
            <p>{`${date_from} - ${date_to}`}</p>
          </div>
          <div title='missing / total'>
            {renderIcons('Music', theme.style)}
            <p>{`${beatmapsets.filter(beatmap => history.contains(beatmap.id)).length} / ${beatmapsets.length}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default injectSheet(styles)(BeatmapsPack);