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
  let initail = false

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
      backgroundColor: '#ffffff',
      position: 'absolute',
      top: '0',
      left: '0',
      opacity: '0',
      userSelect: 'none',
      pointerEvents: 'none',
      transition:
        'width 0.3s ease-in-out, height 0.3s ease-in-out, borderRadius 1s ease-in-out'
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
  function moveBigDom(e: MouseEvent) {
    // TODO: fix position and size when hover btn and a
    calcStep()
    // 移动到dom元素上的时候
    // @ts-expect-error don't care
    if (e.target?.nodeName === 'BUTTON') {
      // @ts-expect-error don't care
      const rect = e.target.getBoundingClientRect()
      const { left, top, height, width } = rect

      dom.style.height = height + 'px'
      dom.style.width = width + 'px'
      dom.style.borderRadius = '10px'
      dom.style.transform = `translate(${left - width / 2}px, ${top - height / 2}px)`
    } else {
      resetDom(dom)
      const tarX = e.pageX - SIZE / 2
      const tarY = e.pageY - SIZE / 2

      targetX = tarX
      targetY = tarY

      if (!initail) {
        x = tarX
        y = tarY
        dom.style.opacity = '1'
        initail = true
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
