import {createContext, Dispatch} from 'react'
import {AudioPlayerState} from '../reducers'
import {HowlOptions, Howl} from 'howler'

export interface AudioPlayerContext extends AudioPlayerState {
  player: Howl | null
  load: (args: HowlOptions) => void
}

export interface AudioPlayerPositionContext {
  position: number
  setPosition: Dispatch<number>
}

export const playerContext = createContext<AudioPlayerContext | null>(
  null
)

export const positionContext = createContext<AudioPlayerPositionContext>({
  position: 0,
  setPosition: () => {
  }
})