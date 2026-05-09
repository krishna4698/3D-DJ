import { Float, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const IMAGE_URLS = [
  '/wedding/venue-mandap.jpg',
  '/wedding/beach-floral-aisle.jpg',
  '/wedding/night-gold-mandap.jpg',
  '/wedding/golden-bead-mandap.jpg',
  '/wedding/garden-heart-stage.jpg',
  '/wedding/seaside-pastel-mandap.jpg',
]

function CameraRig({ progressRef }) {
  const camera = useThree((state) => state.camera)
  const pointer = useThree((state) => state.pointer)
  const size = useThree((state) => state.size)
  const targetLook = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame((_, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef.current || 0, 0, 1)
    const mobile = size.width < 720
    const x = THREE.MathUtils.lerp(0.15, mobile ? 0.35 : -0.7, progress)
    const y = THREE.MathUtils.lerp(0.35, mobile ? 0.55 : 0.15, progress)
    const z = THREE.MathUtils.lerp(7.2, mobile ? 8.8 : 5.6, progress)

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x + pointer.x * 0.18, 3.4, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y + pointer.y * 0.12, 3.4, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3.4, delta)
    targetLook.set(0, mobile ? 0.15 : 0, -0.65 - progress * 0.8)
    camera.lookAt(targetLook)
    camera.fov = THREE.MathUtils.damp(camera.fov, mobile ? 49 : 45, 3, delta)
    camera.updateProjectionMatrix()
  })

  return null
}

function Petals() {
  const meshRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const petals = useMemo(
    () =>
      Array.from({ length: 180 }, () => ({
        x: (Math.random() - 0.5) * 13,
        y: -3 + Math.random() * 8,
        z: -7 + Math.random() * 8,
        scale: 0.035 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.35 + Math.random() * 0.65,
      })),
    [],
  )

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return

    petals.forEach((petal, index) => {
      petal.y -= delta * petal.speed * 0.35
      if (petal.y < -3.2) petal.y = 5

      dummy.position.set(
        petal.x + Math.sin(clock.elapsedTime * petal.speed + petal.phase) * 0.28,
        petal.y,
        petal.z + Math.cos(clock.elapsedTime * 0.25 + petal.phase) * 0.2,
      )
      dummy.rotation.set(clock.elapsedTime * 0.16 + petal.phase, petal.phase, clock.elapsedTime * petal.speed)
      dummy.scale.set(petal.scale * 2.2, petal.scale, petal.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, petals.length]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#f2b6a6" transparent opacity={0.48} side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  )
}

function GoldArch({ position, scale = 1 }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.22 + position[0]) * 0.04
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[1.6, 0.025, 10, 72, Math.PI]} />
        <meshStandardMaterial color="#d8aa4a" metalness={0.8} roughness={0.24} emissive="#3b2508" emissiveIntensity={0.35} />
      </mesh>
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, -0.2, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 1.7, 16]} />
          <meshStandardMaterial color="#d8aa4a" metalness={0.72} roughness={0.26} emissive="#3b2508" emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

function ImageCard3D({ texture, position, galleryPosition, rotation, galleryRotation, size, gallerySize, index, activeId }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const targetRotation = useMemo(() => new THREE.Euler(), [])

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const galleryMode = activeId === 'gallery'
    const nextPosition = galleryMode ? galleryPosition : position
    const nextRotation = galleryMode ? galleryRotation : rotation

    targetPosition.set(nextPosition[0], nextPosition[1] + Math.sin(clock.elapsedTime * 0.5 + index) * 0.08, nextPosition[2])
    targetRotation.set(nextRotation[0], nextRotation[1] + Math.sin(clock.elapsedTime * 0.4 + index) * 0.035, nextRotation[2])

    ref.current.position.lerp(targetPosition, 1 - Math.exp(-delta * 3.6))
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, targetRotation.x, 3.6, delta)
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRotation.y, 3.6, delta)
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, targetRotation.z, 3.6, delta)
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, hovered ? 1.06 : 1, 5, delta))
  })

  const displaySize = activeId === 'gallery' ? gallerySize : size

  return (
    <Float speed={0.85 + index * 0.05} rotationIntensity={0.08} floatIntensity={0.18}>
      <group
        ref={ref}
        position={position}
        rotation={rotation}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <mesh position={[0, 0, -0.04]}>
          <boxGeometry args={[displaySize[0] + 0.18, displaySize[1] + 0.18, 0.12]} />
          <meshStandardMaterial color="#071b12" metalness={0.42} roughness={0.22} emissive="#2e1d08" emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={displaySize} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, -displaySize[1] * 0.5 - 0.08, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[displaySize[0] * 0.95, 0.12]} />
          <meshBasicMaterial color="#d9ad57" transparent opacity={0.28} />
        </mesh>
      </group>
    </Float>
  )
}

function WeddingBackdrop({ activeId }) {
  const textures = useTexture(IMAGE_URLS)
  const groupRef = useRef(null)

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    })
  }, [textures])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const targetZ = activeId === 'gallery' ? -0.55 : activeId === 'services' ? -1.1 : activeId === 'contact' ? -1.55 : 0
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 2.4, delta)
  })

  const cards = [
    {
      position: [2.55, 0.28, -1.55],
      galleryPosition: [-2.65, -0.62, -1.7],
      rotation: [0, -0.25, 0.025],
      galleryRotation: [0, 0.28, -0.025],
      size: [2.75, 3.75],
      gallerySize: [2.55, 3.48],
    },
    {
      position: [4.15, -1.18, -2.8],
      galleryPosition: [0, -0.72, -1.35],
      rotation: [0, -0.42, -0.02],
      galleryRotation: [0, 0, 0],
      size: [2.28, 2.9],
      gallerySize: [2.72, 3.2],
    },
    {
      position: [3.45, 1.62, -3.2],
      galleryPosition: [2.72, -0.62, -1.75],
      rotation: [0, -0.38, 0.035],
      galleryRotation: [0, -0.28, 0.025],
      size: [2.35, 2.75],
      gallerySize: [2.55, 3.0],
    },
    {
      position: [1.55, -1.75, -3.65],
      galleryPosition: [-1.55, -2.45, -2.15],
      rotation: [0, -0.08, -0.02],
      galleryRotation: [0, 0.18, -0.025],
      size: [2.15, 2.15],
      gallerySize: [2.35, 2.35],
    },
    {
      position: [4.35, 1.22, -4.15],
      galleryPosition: [1.45, -2.42, -2.1],
      rotation: [0, -0.46, 0.03],
      galleryRotation: [0, -0.16, 0.02],
      size: [2.1, 2.68],
      gallerySize: [2.38, 2.9],
    },
    {
      position: [2.8, -2.45, -4.7],
      galleryPosition: [3.55, -2.3, -2.55],
      rotation: [0, -0.24, 0],
      galleryRotation: [0, -0.35, 0.02],
      size: [2.2, 2.42],
      gallerySize: [2.25, 2.48],
    },
  ]

  return (
    <group ref={groupRef}>
      {cards.map((card, index) => (
        <ImageCard3D key={IMAGE_URLS[index]} texture={textures[index]} index={index} activeId={activeId} {...card} />
      ))}
      <GoldArch position={[-2.9, -1.15, -2.8]} scale={0.95} />
      <GoldArch position={[2.85, 1.2, -3.8]} scale={0.72} />
    </group>
  )
}

function SoftLights() {
  return (
    <>
      <ambientLight color="#b7a36d" intensity={0.42} />
      <directionalLight position={[3, 5, 5]} color="#ffe5b0" intensity={1.4} />
      <pointLight position={[0, 2.2, 1.6]} color="#ffd083" intensity={13} distance={10} />
      <pointLight position={[-4, -1, -3]} color="#d8aa4a" intensity={9} distance={9} />
      <pointLight position={[4, 1, -4]} color="#ffbd8f" intensity={7} distance={8} />
    </>
  )
}

export default function World({ progressRef, activeId }) {
  return (
    <>
      <CameraRig progressRef={progressRef} />
      <SoftLights />
      <WeddingBackdrop activeId={activeId} />
      <Petals />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.75} luminanceThreshold={0.18} luminanceSmoothing={0.25} mipmapBlur radius={0.55} />
        <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.035} />
        <Vignette offset={0.28} darkness={0.48} />
      </EffectComposer>
    </>
  )
}
