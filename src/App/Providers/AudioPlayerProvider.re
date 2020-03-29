type playingState = {
  songTitle: string,
  beatmapSetId: int,
  isPlaying: bool,
};

type value = {
  playingState,
  setAudio:
    (~beatmapSetId: int, ~setIsPlayable: bool => unit, ~songTitle: string) =>
    unit,
  setVolume: float => unit,
  pause: unit => unit,
};

let initialState: playingState = {
  songTitle: "",
  isPlaying: false,
  beatmapSetId: 0,
};

module Provider = {
  let value = {
    playingState: initialState,
    setAudio:
      (~beatmapSetId: int, ~setIsPlayable: bool => unit, ~songTitle: string) =>
      (),
    setVolume: (vol: float) => (),
    pause: () => (),
  };
  let audioPlayerContext = React.createContext(value);

  let makeProps = (~value, ~children, ()) => {
    "value": value,
    "children": children,
  };

  let make = React.Context.provider(audioPlayerContext);
};

let useAudioPlayer = () => React.useContext(Provider.audioPlayerContext);

let audio = Audio.make();
[@react.component]
[@genType]
let make = (~children) => {
  let (playingState, setPlayingState) = React.useState(() => initialState);

  Audio.onended(audio, _e => {
    setPlayingState(oldState =>
      {...oldState, isPlaying: false, beatmapSetId: 0}
    )
  });

  let setPreviewAudio = (beatmapSetId: int) => {
    Audio.setSrc(audio, {j|https://b.ppy.sh/preview/$beatmapSetId.mp3|j});
  };

  let setAudio = (~beatmapSetId, ~setIsPlayable: bool => unit, ~songTitle) => {
    Audio.onerror(
      audio,
      _e => {
        setIsPlayable(false);
        setPlayingState(oldState => {...oldState, isPlaying: false});
      },
    );
    setPreviewAudio(beatmapSetId);
    Audio.play(audio);
    setPlayingState(_oldState => {isPlaying: true, beatmapSetId, songTitle});
  };

  let pause = () => {
    setPlayingState(oldState =>
      {...oldState, isPlaying: false, beatmapSetId: 0}
    );
    Audio.pause(audio);
  };

  let setVolume = volValue => Audio.setVolume(audio, volValue);

  let value = {playingState, pause, setAudio, setVolume};
  <Provider value> children </Provider>;
};