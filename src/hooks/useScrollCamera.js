import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function useScrollCamera(scrollProgressRef) {
  const camera = useThree((state) => state.camera)
  const pointer = useThree((state) => state.pointer)
  const smoothProgress = useRef(0)

  useFrame((_, delta) => {
    const targetProgress = THREE.MathUtils.clamp(scrollProgressRef.current || 0, 0, 1)
    smoothProgress.current = THREE.MathUtils.damp(smoothProgress.current, targetProgress, 4.2, delta)

    const z = THREE.MathUtils.lerp(50, -30, smoothProgress.current)
    const x = pointer.x * 0.42
    const y = pointer.y * 0.26

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 5, delta)
    camera.position.z = z
    camera.lookAt(camera.position.x * 0.16, camera.position.y * 0.12, z - 14)
  })
}
