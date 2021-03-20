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

let audio = Audio.make();
[@react.component]
[@genType]
let make = (~children) => {
  let (playingState, setPlayingState) = React.useState(() => initialState);
  let (playlist: playlist, setPlaylist) = React.useState(() => [||]);

  let play = () => {
    Audio.play(audio);
  };

  let updateMetadata = (song: song) => {
    MediaMetadata.make({
      title: song.title,
      artist: song.artist,
      artwork: [|MediaMetadata.makeArtwork(song.id)|],
    })
    ->MediaSession.setMediaSessionMetadata;
  };

  Audio.onended(audio, _e => {
    switch (playlist) {
    | [||] => setPlayingState(oldState => {...oldState, isPlaying: false})
    | playlist =>
      let nextSong = playlist->Js_array2.shift->Belt_Option.getExn;
      Audio.setSrc(audio, nextSong.path);
      play();
      updateMetadata({
        id: nextSong.id,
        title: nextSong.title,
        artist: nextSong.artist,
      });
      setPlayingState(oldState =>
        {
          ...oldState,
          isPlaying: false,
          beatmapSetId: nextSong.id,
          title: nextSong.title,
          artist: nextSong.artist,
        }
      );
      setPlaylist(_ => playlist);
    }
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

  let setAudioSrc = (~audioFilePath, ~previewOffset=?, ()) => {
    Audio.setSrc(audio, audioFilePath);
    switch (previewOffset) {
    | Some(offset) => Audio.setCurrentTime(audio, offset)
    | None => ()
    };
  };

  let setPlaylist = (beatmapPlaylist: playlist) => {
    setPlaylist(_ => beatmapPlaylist);
  };

  let setAudio =
      (
        ~song: song,
        ~setIsPlayable: bool => unit,
        ~audioFilePath: option(string),
        ~previewOffset: option(int),
      ) => {
    Audio.onerror(
      audio,
      _e => {
        setIsPlayable(false);
        setPlayingState(oldState => {...oldState, isPlaying: false});
      },
    );

    setPlaylist([||]);

    updateMetadata(song);

    switch (audioFilePath, previewOffset) {
    | (None, None) => setPreviewAudio(song.id)
    | (None, Some(_)) => setPreviewAudio(song.id)
    | (Some(audioFilePath), None) => setAudioSrc(~audioFilePath, ())
    | (Some(audioFilePath), Some(previewOffset)) =>
      setAudioSrc(~audioFilePath, ~previewOffset, ())
    };

    Audio.play(audio);
    setPlayingState(oldState =>
      {
        ...oldState,
        isPlaying: false,
        beatmapSetId: song.id,
        artist: song.artist,
        title: song.title,
      }
    );
  };

  let pause = () => {
    Audio.pause(audio);
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
    setPlaylist,
    setVolume,
    togglePlayPause,
    setMuted,
    playlist,
  };
  <Provider value> children </Provider>;
};
