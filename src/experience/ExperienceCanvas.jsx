import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import World from './World.jsx'

export default function ExperienceCanvas({ progressRef, activeId }) {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.35, 7.2], fov: 45, near: 0.1, far: 80 }}
        dpr={[1, 1.65]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#02140e', 1)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1
          scene.background = new THREE.Color('#02140e')
          scene.fog = new THREE.FogExp2('#061a12', 0.055)
        }}
      >
        <Suspense fallback={null}>
          <World progressRef={progressRef} activeId={activeId} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
