open AudioPlayerProvider;

let audio = Audio.make();

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

let setVolume = Audio.setVolume(audio);

[@react.component]
[@genType]
let make = (~children) => {
  let (playingState, setPlayingState) = React.useState(() => initialState);
  let (playlist: playlist, setPlaylist) = React.useState(() => [||]);

  let _canPlay = (offset: int) =>
    if (playlist->Belt_Array.length > 0) {
      let currentSongIndex =
        playlist->Belt_Array.getIndexBy(item =>
          item.id == playingState.beatmapSetId
        );
      switch (currentSongIndex) {
      | None => None
      | Some(index) =>
        index + offset < playlist->Js_array.length && index + offset > (-1)
          ? Some(index + offset) : None
      };
    } else {
      None;
    };

  let _canPlayNextSong = () => _canPlay(1);
  let _canPlayPrevSong = () => _canPlay(-1);

  let setPlaylist = (beatmapPlaylist: playlist) => {
    setPlaylist(_ => beatmapPlaylist);
  };

  let _stop = () => {
    pause();
    setPlaylist([||]);
  };

  React.useEffect0(() => {
    MediaSession.setActionHandler(`play, Some(_play));
    MediaSession.setActionHandler(`pause, Some(pause));
    MediaSession.setActionHandler(`stop, Some(_stop));
    None;
  });

  let playFromPlaylist = (playlistindex: int) => {
    let nextSong = playlist[playlistindex];
    Audio.setSrc(audio, nextSong.path);
    _updateMetadata({
      id: nextSong.id,
      title: nextSong.title,
      artist: nextSong.artist,
    });
    _play();
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
  };

  let updateMediaHandlers = () => {
    (
      switch (_canPlayNextSong()) {
      | Some(nextSongindex) =>
        setPlayingState(prevState => {...prevState, hasNext: true});
        Some(() => playFromPlaylist(nextSongindex));
      | None =>
        setPlayingState(prevState => {...prevState, hasNext: false});
        None;
      }
    )
    |> MediaSession.setActionHandler(`nexttrack);
    (
      switch (_canPlayPrevSong()) {
      | Some(prevSongindex) =>
        setPlayingState(prevState => {...prevState, hasPrev: true});
        Some(() => playFromPlaylist(prevSongindex));
      | None =>
        setPlayingState(prevState => {...prevState, hasPrev: false});

        None;
      }
    )
    |> MediaSession.setActionHandler(`previoustrack);
  };

  React.useEffect2(
    () => {
      updateMediaHandlers();
      None;
    },
    (playingState.beatmapSetId, playlist),
  );

    let playNext = () => {
    switch (_canPlayNextSong()) {
    | Some(nextSong) => playFromPlaylist(nextSong)
    | None => ()
    };
  }

    let playPrevious = () => {
    switch (_canPlayPrevSong()) {
    | Some(prevSong) => playFromPlaylist(prevSong)
    | None => ()
    };
  }

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

    _play();
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

  let setMuted = muted => {
    Audio.setMuted(audio, muted);
    setPlayingState(oldState => {...oldState, muted});
  };

  Audio.onended(audio, _e => {
    switch (_canPlayNextSong()) {
    | Some(nextSongindex) => playFromPlaylist(nextSongindex)
    | None => ()
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
    playNext,
    playPrevious,
  };
  <Provider value> children </Provider>;
};
