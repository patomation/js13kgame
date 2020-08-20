import { initCanvas, resizeCanvas, addImage } from './lib/canvas'
import { Sprite } from './classes/Sprite'
import ufo from '../assets/sprites/ufo.png'
import { up, down, left, right } from './lib/input'

import { render } from './render'
import { hotkey } from '@patomation/hotkey'
import { pauseGame, startGame } from './store/actions'
import { state } from './store/state'

window.addEventListener('DOMContentLoaded', () => {
  render()

  initCanvas()
  resizeCanvas(window.innerWidth, window.innerHeight)

  const ufoSprite: Sprite = addImage(ufo, 200, 100)
  const moveAmount = 25
  up(() => {
    ufoSprite.y -= moveAmount
  })
  down(() => {
    ufoSprite.y += moveAmount
  })
  left(() => {
    ufoSprite.x -= moveAmount
  })
  right(() => {
    ufoSprite.x += moveAmount
  })

  hotkey('escape').down(() => {
    if (state.gameStarted) {
      pauseGame()
    } else {
      startGame()
    }
  })
})

window.onresize = () => resizeCanvas(window.innerWidth, window.innerHeight)
