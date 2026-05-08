import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000

export default function Particles({ activeColor }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)
  const targetColor = useMemo(() => new THREE.Color(activeColor), [activeColor])

  const positions = useMemo(() => {
    const values = new Float32Array(PARTICLE_COUNT * 3)

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = 1.4 + Math.random() * 6.4
      const z = 58 - Math.random() * 118

      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = Math.sin(angle) * radius
      values[index * 3 + 2] = z
    }

    return values
  }, [])

  useFrame(({ clock }, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.16) * 0.045
      pointsRef.current.rotation.y += delta * 0.018
    }

    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, 0.05)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={activeColor}
        transparent
        opacity={0.72}
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
