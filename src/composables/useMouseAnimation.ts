import { CSSProperties } from 'vue'

export const useMouseAnimation = () => {
  let x = 0,
    y = 0
  let targetX = 0,
    targetY = 0

  const step = 8
  const SIZE = 50

  const dom = document.createElement('div')
  const styles: CSSProperties = {
    width: SIZE + 'px',
    height: SIZE + 'px',
    backgroundColor: 'red',
    borderRadius: '50%',
    position: 'absolute',
    top: '0',
    left: '0',
    opacity: '0'
  }
  for (const key in styles) {
    // @ts-expect-error it's ok
    dom.style[key] = styles[key]
  }

  document.body.appendChild(dom)

  function moveBigDom(e: MouseEvent) {
    targetX = e.pageX - SIZE / 2
    targetY = e.pageY - SIZE / 2
    dom.style.opacity = '1'
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
