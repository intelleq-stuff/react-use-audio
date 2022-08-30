import {Howl, HowlOptions} from 'howler'
import {AudioPlayerContext, playerContext} from '../contexts'
import {useCallback, useContext, useEffect, useMemo} from 'react'

const noop = () => {
}

export type AudioPlayerControls = AudioPlayerContext & {
  play: Howl["play"] | typeof noop
  pause: Howl["pause"] | typeof noop
  stop: Howl["stop"] | typeof noop
  mute: Howl["mute"] | typeof noop
  volume: Howl["volume"] | typeof noop
  fade: Howl["fade"] | typeof noop
  togglePlayPause: () => void
}

export const useAudioPlayer = (options?: HowlOptions): AudioPlayerControls => {
  const {player, preload, load, ...rest} = useContext(playerContext)!

  useEffect(() => {
    const {src, ...restOptions} = options || {}
    if (!src) return
    load({src, ...restOptions})
  }, [options, load])

  const togglePlayPause = useCallback(() => {
    if (!player) return
    if (player.playing()) {
      player.pause()
    } else {
      player.play()
    }
  }, [player])

  const boundHowlerMethods = useMemo(() => {
    return {
      play: player ? player.play.bind(player) : noop,
      pause: player ? player.pause.bind(player) : noop,
      stop: player ? player.stop.bind(player) : noop,
      mute: player ? player.mute.bind(player) : noop,
      volume: player ? player.volume.bind(player) : noop,
      fade: player ? player.fade.bind(player) : noop
    }
  }, [player])

  return useMemo(() => {
    return {
      ...rest,
      ...boundHowlerMethods,
      player,
      preload,
      load,
      togglePlayPause
    }
  }, [rest, player, boundHowlerMethods, preload, load, togglePlayPause])
}