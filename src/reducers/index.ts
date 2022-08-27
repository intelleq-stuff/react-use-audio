import {AudioPlayerState} from './state'
import {Action, PlayerActions, ErrorAction, LoadAction} from './actions'

export * from './actions'
export * from './state'

export function reducer(state: AudioPlayerState, action: Action) {
  switch (action.type) {
    case PlayerActions.START_LOAD:
      return {
        ...state,
        loading: true,
        stopped: true,
        ready: false,
        error: null,
        duration: 0
      }
    case PlayerActions.ON_LOAD:
      return {
        ...state,
        loading: false,
        duration: (action as LoadAction).duration,
        ended: false,
        ready: true
      }
    case PlayerActions.ON_PLAY:
      return {
        ...state,
        playing: true,
        ended: false,
        stopped: false
      }
    case PlayerActions.ON_STOP:
      return {
        ...state,
        stopped: true,
        playing: false
      }
    case PlayerActions.ON_END:
      return {
        ...state,
        stopped: true,
        playing: false,
        ended: true
      }
    case PlayerActions.ON_PAUSE:
      return {
        ...state,
        playing: false
      }
    case PlayerActions.ON_PLAY_ERROR:
      return {
        ...state,
        playing: false,
        stopped: true,
        error: (action as ErrorAction).error
      }
    case PlayerActions.ON_LOAD_ERROR:
      return {
        ...state,
        playing: false,
        stopped: true,
        loading: false,
        error: (action as ErrorAction).error
      }
    default:
      return state
  }
}