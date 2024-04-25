import { CSSProperties } from 'vue'

export const useMouseAnimation = () => {
  let x = 0,
    y = 0
  let targetX = 0,
    targetY = 0

  let step = 10
  const SIZE = 50
  let initail = false

  const dom = document.createElement('div')
  const styles: CSSProperties = {
    width: SIZE + 'px',
    height: SIZE + 'px',
    backgroundColor: '#00ffff7a',
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

  document.body.appendChild(dom)

  const disStepMap = new Map<number, number>([
    [100, 3],
    [200, 4],
    [300, 5],
    [400, 6]
  ])
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
