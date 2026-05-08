import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import World from './World.jsx'

export default function ExperienceCanvas({ progressRef, velocityRef, activeIndex }) {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 58, near: 0.1, far: 260 }}
        dpr={[1, 1.65]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#02000a', 1)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.15
          scene.background = new THREE.Color('#02000a')
          scene.fog = new THREE.FogExp2('#03000d', 0.018)
        }}
      >
        <Suspense fallback={null}>
          <World progressRef={progressRef} velocityRef={velocityRef} activeIndex={activeIndex} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
