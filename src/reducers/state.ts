export interface AudioPlayerState {
  loading: boolean
  playing: boolean
  stopped: boolean
  error: Error | null
  duration: number
  ready: boolean
  ended: boolean
}

export const initialState: AudioPlayerState = {
  loading: true,
  playing: false,
  stopped: true,
  ended: false,
  error: null,
  duration: 0,
  ready: false
}