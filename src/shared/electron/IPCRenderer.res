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

let send = channel =>
  switch channel {
  | UPDATE_THUMB_BAR(data) => send(ipcRenderer, "UPDATE_THUMB_BAR", data)
  | UPDATE_PLAY_STATE(isPlaying) => send(ipcRenderer, "UPDATE_PLAY_STATE", isPlaying)
  }

let on = (channel, callback) => on(ipcRenderer, channel, callback)
let removeListener = (channel, callback) => removeListener(ipcRenderer, channel, callback)
