import React, { Component } from 'react'
import convertRange from '../App/utils/convertRange'
import store from '../store';

export const AudioPlayerContext = React.createContext();

class AudioPlayerProvider extends Component{
  constructor(props){
    super(props)
    this.setStateAsync = (newState) => new Promise((revolve) => {
      this.setState(newState, revolve)
    })
    this.audio = new Audio();
    this.audio.onended = () => this.setState({isPlaying: false})
    this.audio.volume = convertRange(store.getState().settings.userPreferences.volume, 0, 100, 0, 1);
    this.state = {
      isPlaying: false,
      setAudio: this.setAudio,
      setVolume: this.setVolume,
      pause: this.pause
    }
  }

  setAudio = async (beatmapSetId, isPlayable) => {
    this.audio.onerror = () => {
      isPlayable(false)
      this.setState({isPlaying: false})
    }
    if (!this.audio.paused){
      this.audio.pause()
      await this.setStateAsync({ isPlaying: false })
    }
    this.setPreviewAudio(beatmapSetId);
    await this.setStateAsync({isPlaying: beatmapSetId})
    this.audio.play();
  }

  setVolume = (value) => {
    const converted = convertRange(value, 0, 100, 0, 1)
    this.audio.volume = converted
  }

  pause = () => {
    this.setState({ isPlaying: false }, this.audio.pause())
  }

  setPreviewAudio = (beatmapSetId) => {
    this.audio.src = `https://b.ppy.sh/preview/${beatmapSetId}.mp3`
  }

  render() {
    const { children } = this.props;
    return (
      <AudioPlayerContext.Provider value={this.state}>{children}</AudioPlayerContext.Provider>
    );
  }
}

export default AudioPlayerProvider;