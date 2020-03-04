type beatmap = {
  artist_name: string,
  artist_name_unicode: string,
  song_title: string,
  song_title_unicode: string,
  creator_name: string,
  difficulty: string,
  audio_file_name: string,
  md5: string,
  osu_file_name: string,
  ranked_status: int,
  n_hitcircles: float,
  n_sliders: float,
  n_spinners: float,
  last_modification_time: float,
  approach_rate: float,
  circle_size: float,
  hp_drain: float,
  overall_difficulty: float,
  slider_velocity: float,
  star_rating_standard: Js.Json.t,
  star_rating_taiko: Js.Json.t,
  star_rating_ctb: Js.Json.t,
  star_rating_mania: Js.Json.t,
  drain_time: int,
  total_time: int,
  preview_offset: int,
  beatmap_id: int,
  beatmapset_id: int,
  thread_id: int,
  grade_standard: int,
  grade_taiko: int,
  grade_ctb: int,
  grade_mania: int,
  local_beatmap_offset: float,
  stack_leniency: float,
  mode: int,
  song_source: string,
  song_tags: string,
  online_offset: float,
  title_font: string,
  unplayed: bool,
  last_played: float,
  osz2: bool,
  folder_name: string,
  last_checked_against_repository: float,
  ignore_sound: bool,
  ignore_skin: bool,
  disable_storyboard: bool,
  disable_video: bool,
  visual_override: bool,
  last_modification_time_2: float,
  mania_scroll_speed: int,
};
type osuDBData = {
  beatmaps: list(beatmap),
  userperms: int,
  isLocked: bool,
};
type t;
[@bs.deriving {jsConverter: newType}]
type osuDatabase = [ | `osudb | `collection];
type osuDbParserInstance = {
  .
  [@bs.meth] "getOsuDBData": unit => osuDBData,
  [@bs.meth] "setBuffer": (abs_osuDatabase, Buffer.t) => unit,
};
[@bs.new] [@bs.module]
external make: unit => osuDbParserInstance = "osu-db-parser";
let parser = make();
let read = (buffer: Buffer.t) => {
  parser##setBuffer(osuDatabaseToJs(`osudb), buffer);
  parser##getOsuDBData();
};