import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const RING_COUNT = 40

export default function Tunnel({ activeColor }) {
  const ringsRef = useRef([])
  const materialsRef = useRef([])
  const targetColor = useMemo(() => new THREE.Color(activeColor), [activeColor])

  const geometry = useMemo(() => new THREE.TorusGeometry(5.25, 0.035, 8, 160), [])

  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, index) => ({
        z: 48 - index * 2.75,
        rotation: index * 0.22,
        scaleX: 1 + Math.sin(index * 0.7) * 0.045,
        scaleY: 1 + Math.cos(index * 0.6) * 0.045,
        opacity: 0.72 + (index % 5) * 0.05,
      })),
    [],
  )

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime

    materialsRef.current.forEach((material) => {
      if (!material) return
      material.color.lerp(targetColor, 0.075)
      material.emissive.lerp(targetColor, 0.075)
    })

    ringsRef.current.forEach((ring, index) => {
      if (!ring) return
      const direction = index % 2 === 0 ? 1 : -1
      const pulse = 1 + Math.sin(time * 2 + index * 0.5) * 0.014
      ring.rotation.z += delta * direction * (0.16 + index * 0.002)
      ring.rotation.x = Math.sin(time * 0.33 + index) * 0.035
      ring.rotation.y = Math.cos(time * 0.28 + index * 0.4) * 0.025
      ring.scale.set(rings[index].scaleX * pulse, rings[index].scaleY * pulse, 1)
    })
  })

  return (
    <group>
      {rings.map((ring, index) => (
        <mesh
          key={ring.z}
          ref={(node) => {
            ringsRef.current[index] = node
          }}
          geometry={geometry}
          position={[0, 0, ring.z]}
          rotation={[0, 0, ring.rotation]}
        >
          <meshStandardMaterial
            ref={(node) => {
              materialsRef.current[index] = node
            }}
            color={activeColor}
            emissive={activeColor}
            emissiveIntensity={2.6}
            metalness={0.12}
            opacity={ring.opacity}
            roughness={0.28}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}
