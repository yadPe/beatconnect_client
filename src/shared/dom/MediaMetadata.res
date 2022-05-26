type t

type artwork = {
  src: string,
  sizes: string,
  type_: string,
}

type metadata = {
  title: string,
  artist: string,
  album: string,
  artwork: array<artwork>,
}

@new external make: metadata => t = "MediaMetadata"

let makeArtwork = id => {
  src: PpyHelpers.getListCoverUrl(id),
  sizes: "160x100",
  type_: "image/jpg",
}
