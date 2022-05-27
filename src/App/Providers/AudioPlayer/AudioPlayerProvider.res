type playingState = {
  artist: string,
  title: string,
  beatmapSetId: int,
  isPlaying: bool,
  volume: int,
  muted: bool,
  hasNext: bool,
  hasPrev: bool,
}

type song = {
  id: int,
  artist: string,
  title: string,
}

type playlistItem = {
  id: int,
  path: string,
  title: string,
  artist: string,
}

type playlist = array<playlistItem>

type value = {
  playingState: playingState,
  playlist: playlist,
  playlistID: string,
  setPlaylist: (~beatmapPlaylist: playlist, ~playlistID: string=?, unit) => unit,
  setAudio: (~song: song, ~audioFilePath: option<string>, ~previewOffset: option<int>) => unit,
  setVolume: float => unit,
  pause: unit => unit,
  togglePlayPause: unit => unit,
  setMuted: bool => unit,
  playNext: unit => unit,
  playPrevious: unit => unit,
}

let initialState: playingState = {
  artist: "",
  title: "",
  isPlaying: false,
  beatmapSetId: 0,
  volume: 1,
  muted: false,
  hasNext: false,
  hasPrev: false,
}

module Provider = {
  let value = {
    playingState: initialState,
    playlist: [],
    playlistID: "",
    setPlaylist: (~beatmapPlaylist as _: playlist, ~playlistID as _=?, unit) => unit,
    setAudio: (
      ~song as _: song,
      ~audioFilePath as _: option<string>,
      ~previewOffset as _: option<int>,
    ) => (),
    setVolume: (_vol: float) => (),
    pause: () => (),
    togglePlayPause: () => (),
    setMuted: (_muted: bool) => (),
    playNext: () => (),
    playPrevious: () => (),
  }
  let audioPlayerContext = React.createContext(value)

  let makeProps = (~value, ~children, ()) =>
    {
      "value": value,
      "children": children,
    }

  let make = React.Context.provider(audioPlayerContext)
}

let useAudioPlayer = () => React.useContext(Provider.audioPlayerContext)
