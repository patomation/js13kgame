import { h } from 'snabbdom/h' // helper function for creating vnodes
import { Modal } from './components/Modal'
import { State, state } from './store/state'
import { VNode } from 'snabbdom/build/package/vnode'
import { startGame, resumeGame, newGame, inventoryItemClick } from './store/actions'
import { DialogueBox } from './components/DialogueBox'
import { Orange, Base03 } from './lib/solarized'
import { getComputerTotals } from './store/getters'

export const view = ({
  gameOver,
  score,
  showInventoryScreen,
  showMenuScreen,
  showTitleScreen
}: State): VNode => h('section', {
  style: {
    color: Orange,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}, [
  h('nav', {
    style: {
      background: Base03
    }
  }, [
    h('div', {
      style: {
        display: 'flex',
        fontSize: '2rem',
        padding: '0.5rem'
      }
    }, [
      h('span', 'score'),
      h('span', { style: { paddingLeft: '1rem', flexGrow: '1' } }, score),
      h('span', `computers: ${getComputerTotals().join('/')}`)
    ])
  ]),
  h('main', {
    style: {
      flexGrow: '1'
    }
  }),
  showTitleScreen
    ? Modal({
      style: {
        opacity: '1' // it starts off as visible in the beginning of the game
      }
    }, [
      h('h1', { style: { paddingBottom: '1rem' } }, '404'),
      h('button', { on: { click: () => startGame() } }, 'Start')
    ]) : null,
  showMenuScreen
    ? Modal({}, [
      h('h1', { style: { paddingBottom: '1rem' } }, 'menu'),
      h('button', { on: { click: () => resumeGame() } }, 'resume')
    ]) : null,
  gameOver
    ? Modal({}, [
      h('h1', { style: { paddingBottom: '1rem' } }, 'Game Over'),
      h('button', { on: { click: () => newGame() } }, 'new game')
    ]) : null,
  showInventoryScreen
    ? Modal({}, [
      h('h1', { style: { paddingBottom: '1rem' } }, 'Inventory'),
      h('ol',
        state.inventory.map(({ name }, index) =>
          h('li', { index, on: { click: inventoryItemClick as EventListener } }, name)
        )
      )
    ]) : null,
  DialogueBox('')

])
