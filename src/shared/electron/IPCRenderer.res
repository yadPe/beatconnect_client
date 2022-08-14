type t
@module("electron") external ipcRenderer: t = "ipcRenderer"

@send external send: (t, string, 'a) => unit = "send"
@send external on: (t, string, 'a => unit) => unit = "on"
@send
external removeListener: (t, string, 'a => unit) => unit = "removeListener"

type updateThumbBarData = {
  isPlaying: bool,
  canPlayNext: bool,
  canPlayPrev: bool,
}

type channel =
  | UPDATE_THUMB_BAR(updateThumbBarData)
  | UPDATE_PLAY_STATE(bool)
  | CLOSE_WINDOW
  | MINIMIZE_WINDOW
  | MAXIMIZE_WINDOW

let send = channel =>
  switch channel {
  | UPDATE_THUMB_BAR(data) => send(ipcRenderer, "UPDATE_THUMB_BAR", data)
  | UPDATE_PLAY_STATE(isPlaying) => send(ipcRenderer, "UPDATE_PLAY_STATE", isPlaying)
  | CLOSE_WINDOW => send(ipcRenderer, "CLOSE_WINDOW", ())
  | MINIMIZE_WINDOW => send(ipcRenderer, "MINIMIZE_WINDOW", ())
  | MAXIMIZE_WINDOW => send(ipcRenderer, "MAXIMIZE_WINDOW", ())
  }

let on = (channel, callback) => on(ipcRenderer, channel, callback)
let removeListener = (channel, callback) => removeListener(ipcRenderer, channel, callback)
