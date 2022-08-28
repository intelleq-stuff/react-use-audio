import React, {ReactNode, useCallback, useEffect, useMemo, useReducer, useRef, useState} from 'react'
import {AudioPlayerState, initialState} from '../reducers'
import {HowlOptions, Howl} from 'howler'
import {reducer} from '../reducers'
import {PlayerActions} from '../reducers'
import {playerContext, positionContext} from '../contexts'

interface AudioPlayerContext extends AudioPlayerState {
  player: Howl | null
  load: (args: HowlOptions) => void
}

export interface AudioPlayerProviderProps {
  children: ReactNode
  value?: AudioPlayerContext
}

export function AudioPlayerProvider({children, value}: AudioPlayerProviderProps) {
  Howler.autoUnlock = true
  Howler.html5PoolSize = 100

  const [player, setPlayer] = useState<Howl | null>(null)
  const [{loading, error, playing, stopped, duration, ready, ended}, dispatch] = useReducer(reducer, initialState)

  const playerRef = useRef<Howl>()
  const prevPlayer = useRef<Howl>()

  const [position, setPosition] = useState(0)
  const positionContextValue = useMemo(() => ({position, setPosition}
  ), [position, setPosition])

  const constructHowl = useCallback((audioProps: HowlOptions): Howl => {
    return new Howl(audioProps)
  }, [])

  const load = useCallback(({src, autoplay = false, html5 = false, ...rest}: HowlOptions) => {
    let wasPlaying = false
    if (playerRef.current) {
      // @ts-ignore _src exists
      const {_src} = playerRef.current
      const prevSrc = Array.isArray(_src) ? _src[0] : _src
      if (prevSrc === src) {
        return
      }

      if (loading) {
        prevPlayer.current = playerRef.current
        prevPlayer.current.once("load", () => {
          prevPlayer.current?.unload()
        })
      } else {
        prevPlayer.current = playerRef.current
        prevPlayer.current?.unload()
      }

      wasPlaying = playerRef.current.playing()
      if (wasPlaying) {
        playerRef.current.stop()
        playerRef.current.off()
        playerRef.current = undefined
      }
    }

    dispatch({type: PlayerActions.START_LOAD})

    const shouldAutoplay = wasPlaying || autoplay
    const howl = constructHowl({src, autoplay: shouldAutoplay, html5, ...rest})

    // @ts-ignore _state exists
    if (howl._state === "loaded") {
      dispatch({type: PlayerActions.ON_LOAD, duration: howl.duration()})
    }

    howl.on("load", () => {
      dispatch({type: PlayerActions.ON_LOAD, duration: howl.duration()})
    })

    howl.on("play", () => void dispatch({type: PlayerActions.ON_PLAY}))
    howl.on("end", () => void dispatch({type: PlayerActions.ON_END}))
    howl.on("pause", () => void dispatch({type: PlayerActions.ON_PAUSE}))
    howl.on("stop", () => void dispatch({type: PlayerActions.ON_STOP}))
    howl.on("playerror", (_id: number, error: any) => {
      dispatch({type: PlayerActions.ON_PLAY_ERROR, error: new Error("[Play error] " + error)})
    })

    howl.on("loaderror", (_id: number, error: any) => {
      dispatch({type: PlayerActions.ON_LOAD_ERROR, error: new Error("[Load error] " + error)})
    })

    setPlayer(howl)
    playerRef.current = howl
  }, [constructHowl, loading])

  useEffect(() => {
    // unload the player on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.unload()
      }
    }
  }, [])

  const contextValue: AudioPlayerContext = useMemo(() => {
    return value ? value : {player, load, error, loading, playing, stopped, ready, duration, ended}
  }, [loading, error, playing, stopped, load, value, player, ready, duration, ended])

  return (
    <playerContext.Provider value={contextValue}>
      <positionContext.Provider value={positionContextValue}>
        {children}
      </positionContext.Provider>
    </playerContext.Provider>
  )
}