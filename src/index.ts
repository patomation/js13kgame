import { patch } from './lib/patch'
import { h } from 'snabbdom/h' // helper function for creating vnodes
import { VNode } from 'snabbdom/vnode'
import { initCanvas, resizeCanvas, addImage } from './lib/canvas'
import { Sprite } from './classes/Sprite'
import ufo from '../assets/sprites/ufo.png'
import { up, down, left, right } from './lib/input'

import { Modal } from './components/Modal'

interface State {
  score: number,
  showStartScreen: boolean
}

let state: State = {
  score: 5000,
  showStartScreen: true
}

const view = ({
  score, showStartScreen
}: State) => h('section', {
  style: {
    color: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}, [
  h('nav', {
    style: {
      background: 'purple'
    }
  }, [
    h('div', [
      h('span', 'score'),
      h('span', {}, score),
      'hud',
      h('button', {
        on: {
          click: () => setState({ score: state.score + 1000 })
        }
      }, 'get points'),
      h('button', {
        on: {
          click: () => setState({ showModal: true })
        }
      }, 'showModal')
    ])
  ]),
  h('main', {
    style: {
      flexGrow: '1'
    }
  }),
  showStartScreen
    ? Modal({}, [
      h('h1', 'Game Title'),
      h('button', { on: { click: () => setState({ showStartScreen: false }) } }, 'Start')
    ]) : null
])

function setState (newState: Record<string, unknown>) {
  state = { ...state, ...newState }
  render()
}

let vnode: VNode

function render () {
  vnode = patch(vnode, view(state))
}

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container') as Element
  vnode = patch(container, view(state))
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
})

window.onresize = () => resizeCanvas(window.innerWidth, window.innerHeight)
