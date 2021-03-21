type playingState = {
  artist: string,
  title: string,
  beatmapSetId: int,
  isPlaying: bool,
  volume: int,
  muted: bool,
};

type song = {
  id: int,
  artist: string,
  title: string,
};

type playlistItem = {
  id: int,
  path: string,
  title: string,
  artist: string,
};

type playlist = array(playlistItem);

type value = {
  playingState,
  playlist,
  setPlaylist: playlist => unit,
  setAudio:
    (
      ~song: song,
      ~setIsPlayable: bool => unit,
      ~audioFilePath: option(string),
      ~previewOffset: option(int)
    ) =>
    unit,
  setVolume: float => unit,
  pause: unit => unit,
  togglePlayPause: unit => unit,
  setMuted: bool => unit,
};

let initialState: playingState = {
  artist: "",
  title: "",
  isPlaying: false,
  beatmapSetId: 0,
  volume: 1,
  muted: false,
};

module Provider = {
  let value = {
    playingState: initialState,
    playlist: [||],
    setPlaylist: playlist => (),
    setAudio:
      (
        ~song: song,
        ~setIsPlayable: bool => unit,
        ~audioFilePath: option(string),
        ~previewOffset: option(int),
      ) =>
      (),
    setVolume: (vol: float) => (),
    pause: () => (),
    togglePlayPause: () => (),
    setMuted: (muted: bool) => (),
  };
  let audioPlayerContext = React.createContext(value);

  let makeProps = (~value, ~children, ()) => {
    "value": value,
    "children": children,
  };

  let make = React.Context.provider(audioPlayerContext);
};

let useAudioPlayer = () => React.useContext(Provider.audioPlayerContext);
