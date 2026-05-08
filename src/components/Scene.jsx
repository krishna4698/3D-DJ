import { Canvas } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useScrollCamera } from '../hooks/useScrollCamera.js'
import Tunnel from './Tunnel.jsx'
import Particles from './Particles.jsx'
import Lights from './Lights.jsx'

function CameraRig({ scrollProgressRef }) {
  useScrollCamera(scrollProgressRef)
  return null
}

export default function Scene({ activeIndex, sectionColors, scrollProgressRef }) {
  const activeColor = sectionColors[activeIndex] || sectionColors[0]

  return (
    <div className="scene-stage" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 68, near: 0.1, far: 150 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#000000', 1)
          scene.background = new THREE.Color('#000000')
          scene.fog = new THREE.Fog('#000000', 20, 120)
        }}
      >
        <CameraRig scrollProgressRef={scrollProgressRef} />
        <Lights activeColor={activeColor} />
        <Tunnel activeColor={activeColor} />
        <Particles activeColor={activeColor} />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.9}
            luminanceThreshold={0.08}
            luminanceSmoothing={0.14}
            mipmapBlur
            radius={0.82}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0006, 0.0008]}
            radialModulation
            modulationOffset={0.36}
          />
          <Vignette offset={0.36} darkness={0.52} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
