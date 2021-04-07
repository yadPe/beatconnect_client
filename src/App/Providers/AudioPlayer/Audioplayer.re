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
  let (playlistID: string, setPlaylistID) = React.useState(() => "");

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

  let setPlaylist = (~beatmapPlaylist: playlist, ~playlistID=?, ()) => {
    setPlaylist(_ => beatmapPlaylist);
    switch (playlistID) {
    | Some(id) => setPlaylistID(_ => id)
    | None => ()
    };
  };

  let _stop = () => {
    pause();
    setPlaylist(~beatmapPlaylist=[||], ~playlistID="", ());
  };

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
  };

  let playNext = () => {
    switch (_canPlayNextSong()) {
    | Some(nextSong) => playFromPlaylist(nextSong)
    | None => ()
    };
  };

  let playPrevious = () => {
    switch (_canPlayPrevSong()) {
    | Some(prevSong) => playFromPlaylist(prevSong)
    | None => ()
    };
  };

  React.useEffect3(
    () => {
      IPCRenderer.send(
        UPDATE_THUMB_BAR({
          isPlaying: playingState.isPlaying,
          canPlayNext: playingState.hasNext,
          canPlayPrev: playingState.hasPrev,
        }),
      );
      IPCRenderer.on("EXEC_PREV", playPrevious);
      IPCRenderer.on("EXEC_NEXT", playNext);
      Some(
        () => {
          IPCRenderer.removeListener("EXEC_PREV", playPrevious);
          IPCRenderer.removeListener("EXEC_NEXT", playNext);
        },
      );
    },
    (playingState.isPlaying, playingState.hasNext, playingState.hasPrev),
  );

  React.useEffect0(() => {
    MediaSession.setActionHandler(`play, Some(_play));
    MediaSession.setActionHandler(`pause, Some(pause));
    MediaSession.setActionHandler(`stop, Some(_stop));
    IPCRenderer.on("EXEC_PLAY_PAUSE", togglePlayPause);
    None;
  });

  let updateMediaHandlers = () => {
    let next =
      switch (_canPlayNextSong()) {
      | Some(nextSongindex) =>
        setPlayingState(prevState => {...prevState, hasNext: true});
        Some(() => playFromPlaylist(nextSongindex));
      | None =>
        setPlayingState(prevState => {...prevState, hasNext: false});
        None;
      };

    MediaSession.setActionHandler(`nexttrack, next);

    let previous =
      switch (_canPlayPrevSong()) {
      | Some(prevSongindex) =>
        setPlayingState(prevState => {...prevState, hasPrev: true});
        Some(() => playFromPlaylist(prevSongindex));
      | None =>
        setPlayingState(prevState => {...prevState, hasPrev: false});
        None;
      };

    MediaSession.setActionHandler(`previoustrack, previous);
  };

  React.useEffect2(
    () => {
      updateMediaHandlers();
      None;
    },
    (playingState.beatmapSetId, playlist),
  );

  let setAudio =
      (
        ~song: song,
        ~audioFilePath: option(string),
        ~previewOffset: option(int),
      ) => {
    setPlaylist(~beatmapPlaylist=[||], ~playlistID="", ());
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

  Audio.onerror(
    audio,
    _e => {
      setPlayingState(oldState => {...oldState, isPlaying: false});
      playNext();
    },
  );

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
    playlistID,
  };
  <Provider value> children </Provider>;
};
