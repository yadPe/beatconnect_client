let getThumbUrl = beatmapId => `https://b.ppy.sh/thumb/${beatmapId}.jpg`

let getListCoverUrl = beatmapId => `https://assets.ppy.sh/beatmaps/${beatmapId}/covers/list@2x.jpg`

let resolveThumbnail = (beatmapId, osuPath, fallbackUrl) => {
  let localPath =
    "file://" ++
    (osuPath ++ ("/Data/bt/" ++ (beatmapId ++ "l.jpg")))
    ->Js.Global.encodeURI
    ->Js.String2.replaceByRe(%re("/\\/g/"), "/")

  let thumbanil = Image.make()
  thumbanil->Image.setSrc(localPath)
  thumbanil->Image.decode
  |> Js.Promise.then_(() => Js_promise.resolve(localPath))
  |> Js.Promise.catch(_ => Js_promise.resolve(fallbackUrl))
}

let resolveThumbURL = (beatmapId, osuPath) =>
  resolveThumbnail(beatmapId, osuPath, getListCoverUrl(beatmapId))

let getBeatmapDifficultyColorHex = (difficulty: float) =>
  switch difficulty {
  | difficulty if difficulty >= 6.5 => "#000"
  | difficulty if difficulty >= 5.3 => "#8866ee"
  | difficulty if difficulty >= 4.0 => "#ff66aa"
  | difficulty if difficulty >= 2.7 => "#ffcc22"
  | difficulty if difficulty >= 2.0 => "#66ccff"
  | _ => "#88b300"
  }

let getBeatmapDifficultyColorRGBA = (difficulty: float) =>
  switch difficulty {
  | difficulty if difficulty >= 6.5 => Css.rgba(0, 0, 0)
  | difficulty if difficulty >= 5.3 => Css.rgba(136, 102, 238)
  | difficulty if difficulty >= 4.0 => Css.rgba(255, 102, 170)
  | difficulty if difficulty >= 2.7 => Css.rgba(255, 204, 34)
  | difficulty if difficulty >= 2.0 => Css.rgba(102, 204, 255)
  | _ => Css.rgba(136, 179, 0)
  }
