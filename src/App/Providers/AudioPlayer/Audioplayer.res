open AudioPlayerProvider

@val external alert: string => unit = "alert"

let audio = Audio.make()

let _play = () => Audio.play(audio)

let ignoreError = promise => promise |> Js.Promise.catch(_ => Js.Promise.resolve())

let _updateMetadata = (song: song) =>
  MediaMetadata.make({
    title: song.title,
    artist: song.artist,
    album: "Beatconnect",
    artwork: [MediaMetadata.makeArtwork(song.id->Js.Int.toString)],
  })->MediaSession.setMediaSessionMetadata

let _setPreviewAudio = (beatmapSetId: int) =>
  Audio.setSrc(audio, `https://b.ppy.sh/preview/${beatmapSetId->Js.Int.toString}.mp3`)

let _setAudioSrc = (~audioFilePath, ~previewOffset=?, ()) => {
  Audio.setSrc(audio, audioFilePath)
  switch previewOffset {
  | Some(offset) => Audio.setCurrentTime(audio, offset)
  | None => ()
  }
}

let pause = () => Audio.pause(audio)

let togglePlayPause = () =>
  (Audio.paused(audio) ? _play() : Js.Promise.resolve(pause())) |> ignoreError

let setVolume = Audio.setVolume(audio)

@react.component
let make = (~children) => {
  let playlistErrorCount = React.useRef(0)
  let hasRetried = React.useRef(true)
  let (playingState, setPlayingState) = React.useState(() => initialState)
  let (playlist: playlist, setPlaylist) = React.useState(() => [])
  let (playlistID: string, setPlaylistID) = React.useState(() => "")

  let _canPlay = (offset: int) =>
    if playlist->Belt_Array.length > 0 {
      let currentSongIndex =
        playlist->Belt_Array.getIndexBy(item => item.id == playingState.beatmapSetId)
      switch currentSongIndex {
      | None => None
      | Some(index) =>
        index + offset < playlist->Js_array.length && index + offset > -1
          ? Some(index + offset)
          : None
      }
    } else {
      None
    }

  let _canPlayNextSong = () => _canPlay(1)
  let _canPlayPrevSong = () => _canPlay(-1)

  let setPlaylist = (~beatmapPlaylist: playlist, ~playlistID=?, ()) => {
    setPlaylist(_ => beatmapPlaylist)
    switch playlistID {
    | Some(id) => setPlaylistID(_ => id)
    | None => ()
    }
  }

  let _stop = () => {
    pause()
    setPlaylist(~beatmapPlaylist=[], ~playlistID="", ())
  }

  let playFromPlaylist = (playlistindex: int) => {
    hasRetried.current = false
    let nextSong = playlist[playlistindex]
    Audio.setSrc(audio, nextSong.path)
    _updateMetadata({
      id: nextSong.id,
      title: nextSong.title,
      artist: nextSong.artist,
    })
    _play()
    |> Js.Promise.catch(_ => {
      Js.log2("playFromPlaylist: Error playing song", nextSong.id->Js.Int.toString)
      _setPreviewAudio(nextSong.id)
      hasRetried.current = true
      _play() |> ignoreError
    })
    |> ignore
    setPlayingState(oldState => {
      ...oldState,
      isPlaying: false,
      beatmapSetId: nextSong.id,
      title: nextSong.title,
      artist: nextSong.artist,
    })
  }

  let playNext = () =>
    switch _canPlayNextSong() {
    | Some(nextSong) => playFromPlaylist(nextSong)
    | None => ()
    }

  let playPrevious = () =>
    switch _canPlayPrevSong() {
    | Some(prevSong) => playFromPlaylist(prevSong)
    | None => ()
    }

  React.useEffect3(() => {
    IPCRenderer.send(
      UPDATE_THUMB_BAR({
        isPlaying: playingState.isPlaying,
        canPlayNext: playingState.hasNext,
        canPlayPrev: playingState.hasPrev,
      }),
    )
    IPCRenderer.on("EXEC_PREV", playPrevious)
    IPCRenderer.on("EXEC_NEXT", playNext)
    Some(
      () => {
        IPCRenderer.removeListener("EXEC_PREV", playPrevious)
        IPCRenderer.removeListener("EXEC_NEXT", playNext)
      },
    )
  }, (playingState.isPlaying, playingState.hasNext, playingState.hasPrev))

  React.useEffect0(() => {
    MediaSession.setActionHandler(#play, Some(() => _play() |> ignoreError |> ignore))
    MediaSession.setActionHandler(#pause, Some(pause))
    MediaSession.setActionHandler(#stop, Some(_stop))
    IPCRenderer.on("EXEC_PLAY_PAUSE", () => togglePlayPause()->ignore)
    None
  })

  let updateMediaHandlers = () => {
    let next = switch _canPlayNextSong() {
    | Some(nextSongindex) =>
      setPlayingState(prevState => {...prevState, hasNext: true})
      Some(() => playFromPlaylist(nextSongindex))
    | None =>
      setPlayingState(prevState => {...prevState, hasNext: false})
      None
    }

    MediaSession.setActionHandler(#nexttrack, next)

    let previous = switch _canPlayPrevSong() {
    | Some(prevSongindex) =>
      setPlayingState(prevState => {...prevState, hasPrev: true})
      Some(() => playFromPlaylist(prevSongindex))
    | None =>
      setPlayingState(prevState => {...prevState, hasPrev: false})
      None
    }

    MediaSession.setActionHandler(#previoustrack, previous)
  }

  React.useEffect2(() => {
    updateMediaHandlers()
    None
  }, (playingState.beatmapSetId, playlist))

  let setAudio = (~song: song, ~audioFilePath: option<string>, ~previewOffset: option<int>) => {
    hasRetried.current = false
    setPlaylist(~beatmapPlaylist=[], ~playlistID="", ())
    _updateMetadata(song)

    switch (audioFilePath, previewOffset) {
    | (None, None) => _setPreviewAudio(song.id)
    | (None, Some(_)) => _setPreviewAudio(song.id)
    | (Some(audioFilePath), None) => _setAudioSrc(~audioFilePath, ())
    | (Some(audioFilePath), Some(previewOffset)) => _setAudioSrc(~audioFilePath, ~previewOffset, ())
    }

    _play()
    |> Js.Promise.catch(_ => {
      _setPreviewAudio(song.id)
      hasRetried.current = true
      _play() |> ignoreError
    })
    |> ignore
    setPlayingState(oldState => {
      ...oldState,
      isPlaying: false,
      beatmapSetId: song.id,
      artist: song.artist,
      title: song.title,
    })
  }

  let setMuted = muted => {
    Audio.setMuted(audio, muted)
    setPlayingState(oldState => {...oldState, muted: muted})
  }

  Audio.onended(audio, _e => {
    Js.log2("Audio ended", _e)
    switch _canPlayNextSong() {
    | Some(nextSongindex) => playFromPlaylist(nextSongindex)
    | None => DiscordRPC.clearActivity()
    }
  })

  Audio.onpause(audio, _e => {
    Js.log("PAUSEEEE")
    setPlayingState(oldState => {...oldState, isPlaying: false})
  })

  Audio.onplay(audio, _e => {
    setPlayingState(oldState => {...oldState, isPlaying: true})
    playlistErrorCount.current = 0
  })

  Audio.oncanplay(audio, _e => setPlayingState(oldState => {...oldState, isPlaying: true}))

  Audio.onvolumechange(audio, _ => {
    let volume = Audio.getVolume(audio)
    setPlayingState(oldState => {...oldState, volume: volume})
  })

  Audio.onerror(audio, _e => {
    setPlayingState(oldState => {...oldState, isPlaying: false})
    let skipCount = playlistErrorCount.current
    if skipCount > 12 || skipCount >= playlist->Js_array.length - 1 {
      playlistErrorCount.current = 0
      setPlaylist(~beatmapPlaylist=[], ~playlistID="", ())
      alert(
        "Failed to play a song one or multiple times, please check your osu songs folder setting in the Settings section",
      )
    } else {
      Js.log2("Error playing song", skipCount->Js.Int.toString)

      if hasRetried.current == true {
        playNext()
      }
      playlistErrorCount.current = skipCount + 1
    }
  })

  let value = {
    playingState: playingState,
    pause: pause,
    setAudio: setAudio,
    setPlaylist: setPlaylist,
    setVolume: setVolume,
    togglePlayPause: togglePlayPause,
    setMuted: setMuted,
    playlist: playlist,
    playNext: playNext,
    playPrevious: playPrevious,
    playlistID: playlistID,
  }
  <Provider value> children </Provider>
}
