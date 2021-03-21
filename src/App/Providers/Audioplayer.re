open AudioPlayerProvider;

let audio = Audio.make();
[@react.component]
[@genType]
let make = (~children) => {
  let (playingState, setPlayingState) = React.useState(() => initialState);
  let (playlist: playlist, setPlaylist) = React.useState(() => [||]);

  let _play = () => {
    Audio.play(audio);
  };

  let _updateMetadata = (song: song) => {
    MediaMetadata.make({
      title: song.title,
      artist: song.artist,
      album: "Beatconnect",
      artwork: [|MediaMetadata.makeArtwork(song.id)|],
    })
    ->MediaSession.setMediaSessionMetadata;
  };

  let _setPreviewAudio = (beatmapSetId: int) => {
    Audio.setSrc(audio, {j|https://b.ppy.sh/preview/$beatmapSetId.mp3|j});
  };

  let _setAudioSrc = (~audioFilePath, ~previewOffset=?, ()) => {
    Audio.setSrc(audio, audioFilePath);
    switch (previewOffset) {
    | Some(offset) => Audio.setCurrentTime(audio, offset)
    | None => ()
    };
  };

  let pause = () => {
    Audio.pause(audio);
  };

  let togglePlayPause = () => Audio.paused(audio) ? _play() : pause();

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

    _updateMetadata(song);

    switch (audioFilePath, previewOffset) {
    | (None, None) => _setPreviewAudio(song.id)
    | (None, Some(_)) => _setPreviewAudio(song.id)
    | (Some(audioFilePath), None) => _setAudioSrc(~audioFilePath, ())
    | (Some(audioFilePath), Some(previewOffset)) =>
      _setAudioSrc(~audioFilePath, ~previewOffset, ())
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

  let setVolume = Audio.setVolume(audio);

  let setMuted = muted => {
    Audio.setMuted(audio, muted);
    setPlayingState(oldState => {...oldState, muted});
  };

  Audio.onended(audio, _e => {
    switch (playlist) {
    | [||] => setPlayingState(oldState => {...oldState, isPlaying: false})
    | playlist =>
      let nextSong = playlist->Js_array2.shift->Belt_Option.getExn;
      Audio.setSrc(audio, nextSong.path);
      _play();
      _updateMetadata({
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
      setPlaylist(playlist);
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
