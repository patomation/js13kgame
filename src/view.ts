import { h } from 'snabbdom/h' // helper function for creating vnodes
import { Modal } from './components/Modal'
import { State, state } from './store/state'
import { VNode } from 'snabbdom/build/package/vnode'
import { scoreButtonClick, startGame, resumeGame, newGame, inventoryItemClick } from './store/actions'
import { DialogueBox } from './components/DialogueBox'

export const view = ({
  gameOver,
  score,
  showInventoryScreen,
  showMenuScreen,
  showTitleScreen
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
  DialogueBox('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')

])
