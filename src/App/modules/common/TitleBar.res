open CssJs

let makeWrapperStyle = () =>
  style(. [zIndex(500), position(fixed), right(zero), display(#flex), alignItems(center)])

let makeControlStyle = (~bgColor=?, ~spacer=false, ()) =>
  style(. [
    unsafe("WebkitAppRegion", "no-drag"),
    padding2(~v=zero, ~h=px(7)),
    selector(.
      "&:hover",
      [
        backgroundColor(
          switch bgColor {
          | None => rgba(255, 255, 255, #num(0.25))
          | Some(c) => c
          },
        ),
      ],
    ),
    marginLeft(spacer ? #auto : #zero),
  ])

@react.component
let make = (~height: int) => {
  let {AudioPlayerProvider.playingState: playingState} = AudioPlayerProvider.useAudioPlayer()
  let artist = playingState.artist
  let title = playingState.title
  let songTitle = `${artist} - ${title}`

  let _title = playingState.isPlaying ? `Beatconnect \\u23F5 ${songTitle}bot` : "Beatconnect"

  let onMinimizeClick = _ => IPCRenderer.send(MINIMIZE_WINDOW)
  let onCloseClick = _ => IPCRenderer.send(CLOSE_WINDOW)
  let onMaximizeClick = _ => IPCRenderer.send(MAXIMIZE_WINDOW)

  <div className={makeWrapperStyle()}>
    <div className={makeControlStyle(~spacer=true, ())} onClick=onMinimizeClick>
      {Icon.make(~name="Dash", ~width=height, ~height, ())}
    </div>
    <div className={makeControlStyle()} onClick=onMaximizeClick>
      {Icon.make(~name="Square", ~width=height, ~height, ())}
    </div>
    <div className={makeControlStyle(~bgColor=red, ())} onClick=onCloseClick>
      {Icon.make(~name="Cancel", ~width=height, ~height, ())}
    </div>
  </div>
}

let default = make
