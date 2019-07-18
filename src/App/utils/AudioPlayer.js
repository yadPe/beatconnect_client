class AudioPlayer {
  constructor(){
    this.audio = new Audio();
  }

  setAudio(audioEl, isPlayingState){
    if (!this.audio.paused){
      this.audio.pause()
      this.isPlayingState(false)
      this.audio = null;
    }
    this.isPlayingState = isPlayingState
    audioEl.volume = 0.5;
    audioEl.onended = () => {
      this.isPlayingState(false)
    }
    this.audio = audioEl;
    this.audio.play();
  }

  toggle(){
    this.audio.paused ? this.audio.play() : this.audio.pause()
  }
}

export default new AudioPlayer();