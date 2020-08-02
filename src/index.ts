// import snabbdom from 'snabbdom'
import { init } from 'snabbdom/init'
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
import { h } from 'snabbdom/h' // helper function for creating vnodes
import { VNode } from 'snabbdom/vnode'

import { Modal } from './components/Modal'

const patch = init([ // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule // attaches event listeners
])

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
    background: '#222',
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
      flexGrow: '1',
      background: 'gray'
    }
  }, 'myApp'),
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
})
