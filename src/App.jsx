import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Starfield({ count = 2200, radius = 160 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const theta = THREE.MathUtils.randFloatSpread(2) * Math.PI;
      const r = radius * Math.cbrt(Math.random());
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        sizeAttenuation
        color="#e8eefc"
        transparent
        opacity={0.85}
      />
    </points>
  );
}

function Planet({ name, textureUrl, position, scale = 1, emissive }) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  return (
    <mesh name={name} position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive={emissive || '#000000'}
        emissiveIntensity={emissive ? 1.5 : 0}
      />
    </mesh>
  );
}

function Ring({ radius = 4.5, thickness = 1, textureUrl }) {
  const geometry = useMemo(() => new THREE.RingGeometry(radius - thickness, radius + thickness, 128), [radius, thickness]);
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [texture]
  );
  return <mesh geometry={geometry} material={material} rotation={[Math.PI / 2.2, 0, Math.PI / 6]} />;
}

function Scene({ sections }) {
  const { camera, scene } = useThree();
  const lightRef = useRef();
  const planets = useMemo(
    () => [
      {
        name: 'sun',
        position: [0, 0, 0],
        scale: 2.5,
        textureUrl: '/textures/sun.jpg',
        emissive: '#ff9a00',
      },
      {
        name: 'mercury',
        position: [6, 0.4, -6],
        scale: 0.4,
        textureUrl: '/textures/mercury.jpg',
      },
      {
        name: 'venus',
        position: [10, -0.3, -10],
        scale: 0.95,
        textureUrl: '/textures/venus.jpg',
      },
      {
        name: 'earth',
        position: [15, 0.5, -15],
        scale: 1,
        textureUrl: '/textures/earth.jpg',
      },
      {
        name: 'mars',
        position: [20, -0.2, -20],
        scale: 0.75,
        textureUrl: '/textures/mars.jpg',
      },
      {
        name: 'jupiter',
        position: [28, 1.4, -26],
        scale: 2.2,
        textureUrl: '/textures/jupiter.jpg',
      },
      {
        name: 'saturn',
        position: [36, 1, -32],
        scale: 1.9,
        textureUrl: '/textures/saturn.jpg',
        hasRing: true,
      },
      {
        name: 'uranus',
        position: [44, 0.6, -38],
        scale: 1.4,
        textureUrl: '/textures/uranus.jpg',
      },
      {
        name: 'neptune',
        position: [52, 0.4, -44],
        scale: 1.35,
        textureUrl: '/textures/neptune.jpg',
      },
    ],
    []
  );

  useEffect(() => {
    camera.position.set(-8, 3, 18);
    camera.lookAt(0, 0, 0);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: sections.current,
        start: 'top top',
        end: '+=7000',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    });

    const stops = [
      { look: [0, 0, 0], pos: [4, 2, 12], dur: 1 }, // sun
      { look: [6, 0.4, -6], pos: [10, 2.5, -2], dur: 1 },
      { look: [10, -0.3, -10], pos: [14, 2.3, -6], dur: 1 },
      { look: [15, 0.5, -15], pos: [18, 2, -10], dur: 1 },
      { look: [20, -0.2, -20], pos: [23, 1.8, -14], dur: 1 },
      { look: [28, 1.4, -26], pos: [30, 2.6, -18], dur: 1 },
      { look: [36, 1, -32], pos: [38, 2.4, -24], dur: 1 },
      { look: [44, 0.6, -38], pos: [46, 2.2, -28], dur: 1 },
      { look: [52, 0.4, -44], pos: [54, 2.1, -32], dur: 1 },
    ];

    stops.forEach((step, i) => {
      tl.to(
        camera.position,
        { x: step.pos[0], y: step.pos[1], z: step.pos[2], duration: step.dur },
        i
      );
      tl.to(
        {},
        {
          duration: step.dur,
          onUpdate: () => camera.lookAt(...step.look),
        },
        i
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [camera, scene, sections, planets]);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });

  return (
    <>
      <color attach="background" args={['#020611']} />
      <ambientLight intensity={0.22} />
      <pointLight ref={lightRef} position={[5, 5, 5]} intensity={1.8} castShadow />
      <Starfield />
      {planets.map((p) => (
        <group key={p.name} position={p.position}>
          <Planet
            name={p.name}
            textureUrl={p.textureUrl}
            position={[0, 0, 0]}
            scale={p.scale}
            emissive={p.emissive}
          />
          {p.hasRing ? <Ring radius={4.5} thickness={0.8} textureUrl="/textures/saturnRing.png" /> : null}
        </group>
      ))}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
}

function App() {
  const sectionsRef = useRef(null);

  return (
    <div className="page">
      <div className="canvas-wrap">
        <Canvas shadows>
          <PerspectiveCamera makeDefault fov={55} near={0.1} far={200} />
          <Suspense fallback={null}>
            <Scene sections={sectionsRef} />
          </Suspense>
        </Canvas>
      </div>

      <div ref={sectionsRef} className="sections" aria-hidden />
    </div>
  );
}

export default App;

