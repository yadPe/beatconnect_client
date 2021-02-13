type playingState = {
  songTitle: string,
  beatmapSetId: int,
  isPlaying: bool,
  volume: int,
  muted: bool,
};

type value = {
  playingState,
  setAudio:
    (
      ~beatmapSetId: int,
      ~setIsPlayable: bool => unit,
      ~songTitle: string,
      ~audioFilePath: option(string)
    ) =>
    unit,
  setVolume: float => unit,
  pause: unit => unit,
  togglePlayPause: unit => unit,
  setMuted: bool => unit,
};

let initialState: playingState = {
  songTitle: "",
  isPlaying: false,
  beatmapSetId: 0,
  volume: 1,
  muted: false,
};

module Provider = {
  let value = {
    playingState: initialState,
    setAudio:
      (
        ~beatmapSetId: int,
        ~setIsPlayable: bool => unit,
        ~songTitle: string,
        ~audioFilePath: option(string),
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

let audio = Audio.make();
[@react.component]
[@genType]
let make = (~children) => {
  let (playingState, setPlayingState) = React.useState(() => initialState);

  Audio.onended(audio, _e => {
    setPlayingState(oldState => {...oldState, isPlaying: false})
  });

  Audio.onpause(
    audio,
    _e => {
      Js.log("PAUSEEEE");
      setPlayingState(oldState => {...oldState, isPlaying: false});
    },
  );

  Audio.onplay(audio, _e => {
    setPlayingState(oldState => {...oldState, isPlaying: true})
  });

  Audio.oncanplay(audio, _e =>
    setPlayingState(oldState => {...oldState, isPlaying: true})
  );

  Audio.onvolumechange(audio, e => {
    setPlayingState(oldState => {...oldState, volume: e.target.volume})
  });

  let setPreviewAudio = (beatmapSetId: int) => {
    Audio.setSrc(audio, {j|https://b.ppy.sh/preview/$beatmapSetId.mp3|j});
  };

  let setAudio =
      (
        ~beatmapSetId,
        ~setIsPlayable: bool => unit,
        ~songTitle,
        ~audioFilePath: option(string),
      ) => {
    Audio.onerror(
      audio,
      _e => {
        setIsPlayable(false);
        setPlayingState(oldState => {...oldState, isPlaying: false});
      },
    );
    if (Belt.Option.isSome(audioFilePath)) {
      Audio.setSrc(audio, Belt.Option.getWithDefault(audioFilePath, ""));
    } else {
      setPreviewAudio(beatmapSetId);
    };
    Audio.play(audio);
    setPlayingState(oldState =>
      {...oldState, isPlaying: false, beatmapSetId, songTitle}
    );
  };

  let pause = () => {
    Audio.pause(audio);
  };

  let play = () => {
    Audio.play(audio);
  };

  let setVolume = Audio.setVolume(audio);

  let togglePlayPause = () => Audio.paused(audio) ? play() : pause();

  let setMuted = muted => {
    Audio.setMuted(audio, muted);
    setPlayingState(oldState => {...oldState, muted});
  };

  let value = {
    playingState,
    pause,
    setAudio,
    setVolume,
    togglePlayPause,
    setMuted,
  };
  <Provider value> children </Provider>;
};
