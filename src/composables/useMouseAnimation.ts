import { CSSProperties } from 'vue'

const disStepMap = new Map<number, number>([
  [100, 3],
  [200, 4],
  [300, 5],
  [400, 6]
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

  function initDom() {
    const dom = document.createElement('div')
    const styles: CSSProperties = {
      width: SIZE + 'px',
      height: SIZE + 'px',
      backgroundColor: '#ffffff',
      filter: 'blur(10px)',
      borderRadius: '50%',
      position: 'absolute',
      top: '0',
      left: '0',
      opacity: '0',
      userSelect: 'none',
      pointerEvents: 'none'
    }
    for (const key in styles) {
      // @ts-expect-error it's ok
      dom.style[key] = styles[key]
    }

    return dom
  }
  const dom = initDom()
  document.body.appendChild(dom)

  function calcStep() {
    const disX = targetX - x
    const dixY = targetY - y
    const dis = Math.sqrt(disX * disX + dixY * dixY)

    step = disStepMap.get(dis) || 10
  }
  function moveBigDom(e: MouseEvent) {
    calcStep()
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
