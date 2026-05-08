import { Float, Line, Stars, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const CAMERA_PATH = [
  { p: 0, position: [0, 0.35, 18], lookAt: [0, 0, -10], fov: 58, roll: 0 },
  { p: 0.16, position: [0.5, 0.1, -10], lookAt: [0, 0, -34], fov: 62, roll: -0.03 },
  { p: 0.34, position: [-0.2, -0.15, -50], lookAt: [0, 0, -74], fov: 66, roll: 0.02 },
  { p: 0.48, position: [2.5, 1.2, -86], lookAt: [0, 0.2, -105], fov: 56, roll: -0.05 },
  { p: 0.64, position: [-4.6, 1.45, -122], lookAt: [-0.2, 0.2, -140], fov: 52, roll: 0.04 },
  { p: 0.8, position: [3.8, 0.35, -158], lookAt: [0, 0, -178], fov: 58, roll: -0.035 },
  { p: 1, position: [0, 1.05, -202], lookAt: [0, 0.2, -220], fov: 54, roll: 0 },
]

const COLOR_STOPS = ['#8b5cff', '#00d9ff', '#ff2bd6', '#4dffb8', '#b4ff00', '#ffffff']

function samplePath(progress) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  let from = CAMERA_PATH[0]
  let to = CAMERA_PATH[CAMERA_PATH.length - 1]

  for (let index = 0; index < CAMERA_PATH.length - 1; index += 1) {
    if (p >= CAMERA_PATH[index].p && p <= CAMERA_PATH[index + 1].p) {
      from = CAMERA_PATH[index]
      to = CAMERA_PATH[index + 1]
      break
    }
  }

  const local = THREE.MathUtils.smoothstep((p - from.p) / Math.max(to.p - from.p, 0.001), 0, 1)

  return {
    position: new THREE.Vector3(
      THREE.MathUtils.lerp(from.position[0], to.position[0], local),
      THREE.MathUtils.lerp(from.position[1], to.position[1], local),
      THREE.MathUtils.lerp(from.position[2], to.position[2], local),
    ),
    lookAt: new THREE.Vector3(
      THREE.MathUtils.lerp(from.lookAt[0], to.lookAt[0], local),
      THREE.MathUtils.lerp(from.lookAt[1], to.lookAt[1], local),
      THREE.MathUtils.lerp(from.lookAt[2], to.lookAt[2], local),
    ),
    fov: THREE.MathUtils.lerp(from.fov, to.fov, local),
    roll: THREE.MathUtils.lerp(from.roll, to.roll, local),
  }
}

function CameraFlight({ progressRef, velocityRef }) {
  const camera = useThree((state) => state.camera)
  const pointer = useThree((state) => state.pointer)
  const smooth = useRef(0)
  const targetLook = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const targetProgress = THREE.MathUtils.clamp(progressRef.current || 0, 0, 1)
    smooth.current = THREE.MathUtils.damp(smooth.current, targetProgress, 3.8, delta)

    const frame = samplePath(smooth.current)
    const velocityPush = THREE.MathUtils.clamp(Math.abs(velocityRef.current || 0) / 9000, 0, 0.8)

    camera.position.x = THREE.MathUtils.damp(camera.position.x, frame.position.x + pointer.x * 0.5, 4.6, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, frame.position.y + pointer.y * 0.28, 4.6, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, frame.position.z - velocityPush * 2.2, 4.2, delta)

    targetLook.current.lerp(frame.lookAt, 1 - Math.exp(-delta * 4.6))
    camera.lookAt(targetLook.current)
    camera.rotation.z += (frame.roll - camera.rotation.z) * (1 - Math.exp(-delta * 3.2))
    camera.fov = THREE.MathUtils.damp(camera.fov, frame.fov + velocityPush * 2, 4, delta)
    camera.updateProjectionMatrix()
  })

  return null
}

function SpaceDust({ velocityRef }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)

  const positions = useMemo(() => {
    const count = 2600
    const values = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const radius = 5 + Math.random() * 34
      const angle = Math.random() * Math.PI * 2
      values[index * 3] = Math.cos(angle) * radius
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.62
      values[index * 3 + 2] = 22 - Math.random() * 244
    }

    return values
  }, [])

  useFrame(({ clock }, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.1) * 0.04
    }

    if (materialRef.current) {
      const speed = THREE.MathUtils.clamp(Math.abs(velocityRef.current || 0) / 6000, 0, 1)
      materialRef.current.size = THREE.MathUtils.damp(materialRef.current.size, 0.045 + speed * 0.08, 3, delta)
      materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, 0.48 + speed * 0.32, 3, delta)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#9adfff"
        transparent
        opacity={0.5}
        size={0.055}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function HeroSignal() {
  const groupRef = useRef(null)

  useFrame(({ clock }) => {
    const beat = 1 + Math.sin(clock.elapsedTime * 4) * 0.035
    if (groupRef.current) {
      groupRef.current.scale.setScalar(beat)
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.55, 0.035, 8, 180]} />
        <meshBasicMaterial color="#8b5cff" transparent opacity={0.86} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.025, 8, 160]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.76} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <icosahedronGeometry args={[0.56, 2]} />
        <meshStandardMaterial color="#ffffff" emissive="#8b5cff" emissiveIntensity={2.2} roughness={0.2} toneMapped={false} />
      </mesh>

      {Array.from({ length: 28 }, (_, index) => (
        <VisualizerBar key={index} index={index} />
      ))}
    </group>
  )
}

function VisualizerBar({ index }) {
  const ref = useRef(null)
  const x = (index - 13.5) * 0.24

  useFrame(({ clock }) => {
    if (!ref.current) return
    const height = 0.25 + Math.abs(Math.sin(clock.elapsedTime * 3.2 + index * 0.55)) * 1.05
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, height, 0.2)
  })

  return (
    <mesh ref={ref} position={[x, -2.1, 0]}>
      <boxGeometry args={[0.055, 1, 0.055]} />
      <meshBasicMaterial color={index % 2 ? '#8b5cff' : '#00d9ff'} toneMapped={false} />
    </mesh>
  )
}

function NeonTunnel() {
  const ringsRef = useRef([])

  const rings = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => ({
        z: -20 - index * 1.28,
        radius: 5.6 + Math.sin(index * 0.8) * 0.45,
        color: COLOR_STOPS[index % COLOR_STOPS.length],
        rot: index * 0.18,
      })),
    [],
  )

  useFrame(({ clock }, delta) => {
    ringsRef.current.forEach((ring, index) => {
      if (!ring) return
      const pulse = 1 + Math.sin(clock.elapsedTime * 3.8 + index * 0.4) * 0.035
      ring.rotation.z += delta * (index % 2 === 0 ? 0.22 : -0.18)
      ring.scale.setScalar(pulse)
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
          position={[Math.sin(index * 0.45) * 0.25, Math.cos(index * 0.4) * 0.16, ring.z]}
          rotation={[Math.PI / 2, 0, ring.rot]}
        >
          <torusGeometry args={[ring.radius, 0.035, 8, 96]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.92} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function SpeakerStack({ position = [0, 0, 0], mirror = 1 }) {
  const cones = useRef([])

  useFrame(({ clock }) => {
    cones.current.forEach((cone, index) => {
      if (!cone) return
      const pulse = 1 + Math.abs(Math.sin(clock.elapsedTime * 4.5 + index)) * 0.09
      cone.scale.set(pulse, pulse, 1)
    })
  })

  return (
    <group position={position} rotation={[0, mirror * -0.12, 0]}>
      {Array.from({ length: 6 }, (_, index) => {
        const col = index % 2
        const row = Math.floor(index / 2)
        return (
          <group key={index} position={[col * 1.1 - 0.55, row * 1.12 - 1.08, 0]}>
            <mesh>
              <boxGeometry args={[0.92, 0.92, 0.36]} />
              <meshStandardMaterial color="#060613" roughness={0.38} metalness={0.72} emissive="#111133" />
            </mesh>
            <mesh
              ref={(node) => {
                cones.current[index] = node
              }}
              position={[0, 0, 0.22]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.27, 0.36, 0.08, 40]} />
              <meshStandardMaterial
                color="#080a18"
                emissive={index % 2 ? '#8b5cff' : '#00d9ff'}
                emissiveIntensity={1.4}
                roughness={0.22}
                metalness={0.4}
                toneMapped={false}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function LightBeam({ position, rotation, color, scale = [1, 1, 1] }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[1.1, 9, 48, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.13}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}

function DJStage() {
  const stageRef = useRef(null)
  const haloRef = useRef(null)

  useFrame(({ clock }) => {
    if (stageRef.current) {
      stageRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.025
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += 0.004
      haloRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.5) * 0.04)
    }
  })

  return (
    <group ref={stageRef} position={[0, -1.35, -98]}>
      <mesh position={[0, -0.36, 0]}>
        <boxGeometry args={[10.5, 0.26, 3.4]} />
        <meshStandardMaterial color="#050511" metalness={0.6} roughness={0.28} emissive="#09092a" />
      </mesh>

      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[4.8, 1.5, 1.4]} />
        <meshStandardMaterial color="#080816" metalness={0.78} roughness={0.2} emissive="#21104c" emissiveIntensity={1.2} />
      </mesh>

      <mesh ref={haloRef} position={[0, 1.7, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.15, 0.035, 8, 160]} />
        <meshBasicMaterial color="#ff2bd6" transparent opacity={0.9} toneMapped={false} />
      </mesh>

      <SpeakerStack position={[-5.3, 0.58, -0.2]} mirror={-1} />
      <SpeakerStack position={[5.3, 0.58, -0.2]} mirror={1} />

      <LightBeam position={[-3.4, 3.4, -1.4]} rotation={[0.55, 0.2, -0.48]} color="#00d9ff" scale={[1, 1.2, 1]} />
      <LightBeam position={[3.4, 3.2, -1.4]} rotation={[0.54, -0.2, 0.48]} color="#ff2bd6" scale={[1, 1.2, 1]} />

      <Line points={[[-6, 2.9, -0.8], [0, 0.7, 3.5], [6, 2.9, -0.8]]} color="#00d9ff" lineWidth={2} transparent opacity={0.65} />
      <Line points={[[-4.6, 2.2, 1.2], [4.6, 0.7, 2.8]]} color="#ff2bd6" lineWidth={2} transparent opacity={0.55} />
    </group>
  )
}

function HologramPanel({ position, rotation, title, copy, color }) {
  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
      <group position={position} rotation={rotation}>
        <mesh>
          <planeGeometry args={[4.9, 2.4]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.012]}>
          <planeGeometry args={[5.05, 2.55]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.16} toneMapped={false} />
        </mesh>
        {Array.from({ length: 7 }, (_, index) => (
          <mesh key={index} position={[-1.8 + index * 0.62, 0.54, 0.05]}>
            <boxGeometry args={[0.34, 0.035, 0.025]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8 - index * 0.07} toneMapped={false} />
          </mesh>
        ))}
        {Array.from({ length: 5 }, (_, index) => (
          <mesh key={index} position={[-1.8, -0.08 - index * 0.25, 0.05]}>
            <boxGeometry args={[3.4 - index * 0.34, 0.026, 0.025]} />
            <meshBasicMaterial color="#bceeff" transparent opacity={0.45} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

function AboutHolograms() {
  return (
    <group position={[0, 0.2, -134]}>
      <HologramPanel
        position={[-3.4, 1.2, 0]}
        rotation={[0, 0.36, 0.02]}
        title="PERFORMER PROFILE"
        copy="Nine years active. Bass-heavy sets, cinematic builds, and a clean festival-ready visual identity."
        color="#00d9ff"
      />
      <HologramPanel
        position={[3.2, -0.95, -2.2]}
        rotation={[0, -0.42, -0.02]}
        title="SIGNATURE SOUND"
        copy="Melodic techno, afro house, bass pressure, peak-time edits, and late-night room control."
        color="#8b5cff"
      />
    </group>
  )
}

function GalleryPanels() {
  const textures = useTexture([
    '/artist/artist-architecture-tall.jpeg',
    '/artist/artist-bridge-portrait.jpeg',
    '/artist/dj-speaker-mark.png',
    '/artist/dj-illustration-deck.jpg',
  ])

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      texture.needsUpdate = true
    })
  }, [textures])

  const panels = [
    { position: [-4.2, 0.8, -168], rotation: [0, 0.36, -0.06], size: [2.5, 4.45], texture: textures[0] },
    { position: [0.2, -0.15, -174], rotation: [0, -0.08, 0.04], size: [2.45, 4.35], texture: textures[1] },
    { position: [4.2, 0.85, -181], rotation: [0, -0.35, 0.08], size: [3.8, 2.6], texture: textures[2] },
    { position: [-1.8, 2.35, -187], rotation: [0, 0.2, -0.12], size: [2.35, 2.35], texture: textures[3] },
  ]

  return (
    <group>
      {panels.map((panel, index) => (
        <Float key={panel.position.join('-')} speed={1 + index * 0.12} rotationIntensity={0.16} floatIntensity={0.28}>
          <group position={panel.position} rotation={panel.rotation}>
            <mesh>
              <boxGeometry args={[panel.size[0] + 0.16, panel.size[1] + 0.16, 0.08]} />
              <meshStandardMaterial
                color="#080814"
                emissive={index % 2 ? '#8b5cff' : '#00d9ff'}
                emissiveIntensity={0.55}
                metalness={0.46}
                roughness={0.32}
              />
            </mesh>
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={panel.size} />
              <meshBasicMaterial map={panel.texture} toneMapped={false} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}

function BookingPortal() {
  const ref = useRef(null)

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * 0.18
    ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.2) * 0.025)
  })

  return (
    <group position={[0, 0, -216]}>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusKnotGeometry args={[2.2, 0.045, 180, 12, 3, 5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.86} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.4]}>
        <octahedronGeometry args={[0.74, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#00d9ff" emissiveIntensity={2.4} roughness={0.18} toneMapped={false} />
      </mesh>
    </group>
  )
}

function SceneLights({ activeIndex }) {
  const color = COLOR_STOPS[activeIndex] || COLOR_STOPS[0]

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight position={[0, 4, 10]} color="#8b5cff" intensity={34} distance={45} />
      <pointLight position={[-6, 2, -55]} color="#00d9ff" intensity={52} distance={60} />
      <pointLight position={[6, 5, -100]} color="#ff2bd6" intensity={70} distance={72} />
      <pointLight position={[0, 1, -174]} color={color} intensity={64} distance={72} />
    </>
  )
}

export default function World({ progressRef, velocityRef, activeIndex }) {
  return (
    <>
      <CameraFlight progressRef={progressRef} velocityRef={velocityRef} />
      <SceneLights activeIndex={activeIndex} />
      <Stars radius={150} depth={90} count={3600} factor={4.4} saturation={0} fade speed={0.65} />
      <SpaceDust velocityRef={velocityRef} />
      <HeroSignal />
      <NeonTunnel />
      <DJStage />
      <AboutHolograms />
      <GalleryPanels />
      <BookingPortal />

      <EffectComposer multisampling={0}>
        <Bloom intensity={2.05} luminanceThreshold={0.08} luminanceSmoothing={0.12} mipmapBlur radius={0.82} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0008, 0.0012]}
          radialModulation
          modulationOffset={0.28}
        />
        <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.16} />
        <Vignette offset={0.28} darkness={0.62} />
      </EffectComposer>
    </>
  )
}
