import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function Lights({ activeColor }) {
  const keyLightRef = useRef(null)
  const rimLightRef = useRef(null)
  const targetColor = useMemo(() => new THREE.Color(activeColor), [activeColor])

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime

    if (keyLightRef.current) {
      keyLightRef.current.position.set(Math.sin(time * 0.72) * 4.8, Math.cos(time * 0.48) * 3.2, 28 + Math.sin(time * 0.34) * 26)
      keyLightRef.current.color.lerp(targetColor, delta * 4)
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.set(Math.cos(time * 0.58) * -4.2, Math.sin(time * 0.66) * 3.7, -22 + Math.cos(time * 0.4) * 24)
      rimLightRef.current.color.lerp(targetColor, delta * 4)
    }
  })

  return (
    <>
      <ambientLight intensity={0.06} />
      <pointLight ref={keyLightRef} color={activeColor} intensity={52} distance={60} decay={1.45} />
      <pointLight ref={rimLightRef} color={activeColor} intensity={38} distance={55} decay={1.6} />
    </>
  )
}
