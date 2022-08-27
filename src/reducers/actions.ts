export enum PlayerActions {
  START_LOAD,
  ON_LOAD,
  ON_PLAY,
  ON_END,
  ON_PAUSE,
  ON_STOP,
  ON_PLAY_ERROR,
  ON_LOAD_ERROR
}

export interface PlayerAction {
  type: PlayerActions
}

export interface ErrorAction extends PlayerAction {
  error: Error
}

export interface LoadAction extends PlayerAction {
  duration: number
}

export type Action = PlayerAction | ErrorAction | LoadAction