import { CSSProperties } from 'vue'

const disStepMap = new Map<number, number>([
  [100, 4],
  [200, 5],
  [300, 6],
  [400, 7]
])

export const useMouseAnimation = (changeCursor: boolean = true) => {
  let x = 0,
    y = 0
  let targetX = 0,
    targetY = 0

  let step = 10
  const SIZE = 50
  const hoverType = ['BUTTON', 'A']
  let init = false

  // 改变鼠标样式
  if (changeCursor) {
    document.body.style.cursor =
      'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiCiAgICAgICAgICAgICAgICB2aWV3Qm94PSIwIDAgOCA4Ij48Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iNCIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMTBiOTgxIi8+PC9zdmc+) 4 4, auto'
  }

  function resetDom(dom: HTMLElement) {
    dom.style.width = SIZE + 'px'
    dom.style.height = SIZE + 'px'
    dom.style.borderRadius = '50%'
  }

  function initDom() {
    const dom = document.createElement('div')
    const styles: CSSProperties = {
      width: SIZE + 'px',
      height: SIZE + 'px',
      backgroundColor: '#ffffff80',
      position: 'absolute',
      top: '0',
      left: '0',
      opacity: '0',
      userSelect: 'none',
      pointerEvents: 'none',
      transition:
        'width 0.3s ease-in-out, height 0.3s ease-in-out, borderRadius 0.3s ease-in-out'
    }
    for (const key in styles) {
      // @ts-expect-error it's ok
      dom.style[key] = styles[key]
    }
    resetDom(dom)
    return dom
  }
  const dom = initDom()
  document.body.appendChild(dom)

  function calcStep() {
    const disX = targetX - x
    const dixY = targetY - y
    const dis = Math.sqrt(disX * disX + dixY * dixY)

    step = disStepMap.get(Math.ceil(dis / 100) * 100) || 7
  }

  let inBtnOrA = false
  function moveBigDom(e: MouseEvent) {
    // [x]: fix position and size when hover btn and a

    const tar = e.target as Element
    // 移动到dom元素上的时候
    if (hoverType.includes(tar.nodeName)) {
      if (inBtnOrA) {
        return
      }
      inBtnOrA = true
      const { left, top, height, width } = tar.getBoundingClientRect()
      const { borderRadius, zIndex } = getComputedStyle(tar)
      const offset = 4

      dom.style.height = height + 2 * offset + 'px'
      dom.style.width = width + 2 * offset + 'px'
      dom.style.borderRadius = borderRadius || '4px'
      dom.style.zIndex = +zIndex - 1 + ''

      targetX = left - offset
      targetY = top - offset
    } else {
      inBtnOrA = false
      calcStep()
      resetDom(dom)
      const tarX = e.pageX - SIZE / 2
      const tarY = e.pageY - SIZE / 2

      targetX = tarX
      targetY = tarY

      if (!init) {
        x = tarX
        y = tarY
        dom.style.opacity = '1'
        init = true
      }
    }
  }
  requestAnimationFrame(move)
  function move() {
    x += (targetX - x) / step
    y += (targetY - y) / step
    dom.style.transform = `translate(${x}px, ${y}px)`
    requestAnimationFrame(move)
  }

  onMounted(() => {
    window.addEventListener('mousemove', moveBigDom)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', moveBigDom)
  })
}
