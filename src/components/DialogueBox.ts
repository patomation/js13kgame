import { h } from 'snabbdom/h'
import { VNodeStyle } from 'snabbdom/modules/style'
import { VNode } from 'snabbdom/vnode'

export const DialogueBox = (
  text: string
): VNode => h(
  'div', {
    style: {
    }
  },
  text.split('').map((char, i) =>
    h('span', {
      style: {
        opacity: '0',
        transition: 'opacity 50ms',
        transitionDelay: `${i * 10}ms`,
        delayed: {
          opacity: '1'
        }
      } as unknown as VNodeStyle
    }, char))
)
