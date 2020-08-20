import { h } from 'snabbdom/h' // helper function for creating vnodes
import { Modal } from './components/Modal'
import { State } from './store/state'
import { VNode } from 'snabbdom/build/package/vnode'
import { scoreButtonClick, startGame } from './store/actions'

export const view = ({
  score, showTitleScreen: showStartScreen
}: State): VNode => h('section', {
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
          click: scoreButtonClick
        }
      }, 'get points')
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
      h('button', { on: { click: () => startGame() } }, 'Start')
    ]) : null
])
