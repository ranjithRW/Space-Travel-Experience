import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
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
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 8;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0014;
    }
  });

  return (
    <mesh ref={meshRef} name={name} position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.85}
        metalness={0.08}
        envMapIntensity={0.4}
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

function Scene({ sections, isTopView }) {
  const { camera, scene } = useThree();
  const lightRef = useRef();
  const orbitRefs = useRef([]);
  const timelineRef = useRef(null);
  const planets = useMemo(
    () => [
      {
        name: 'sun',
        orbitRadius: 0,
        startAngle: 0,
        orbitSpeed: 0,
        tilt: 0,
        yOffset: 0,
        scale: 2.8,
        textureUrl: '/textures/sun.jpg',
        emissive: '#ff9a00',
      },
      {
        name: 'mercury',
        orbitRadius: 8,
        startAngle: 0.4,
        orbitSpeed: 0.9,
        tilt: 0.01,
        yOffset: 0.2,
        scale: 0.45,
        textureUrl: '/textures/mercury.jpg',
      },
      {
        name: 'venus',
        orbitRadius: 12,
        startAngle: 2.2,
        orbitSpeed: 0.7,
        tilt: 0.03,
        yOffset: -0.1,
        scale: 0.9,
        textureUrl: '/textures/venus.jpg',
      },
      {
        name: 'earth',
        orbitRadius: 16,
        startAngle: 1.2,
        orbitSpeed: 0.6,
        tilt: 0.04,
        yOffset: 0.25,
        scale: 1,
        textureUrl: '/textures/earth.jpg',
      },
      {
        name: 'mars',
        orbitRadius: 20,
        startAngle: 0.9,
        orbitSpeed: 0.5,
        tilt: 0.02,
        yOffset: -0.15,
        scale: 0.78,
        textureUrl: '/textures/mars.jpg',
      },
      {
        name: 'jupiter',
        orbitRadius: 28,
        startAngle: 2.7,
        orbitSpeed: 0.35,
        tilt: 0.012,
        yOffset: 0.5,
        scale: 2.2,
        textureUrl: '/textures/jupiter.jpg',
      },
      {
        name: 'saturn',
        orbitRadius: 36,
        startAngle: 1.6,
        orbitSpeed: 0.3,
        tilt: 0.05,
        yOffset: 0.4,
        scale: 1.85,
        textureUrl: '/textures/saturn.jpg',
        hasRing: true,
      },
      {
        name: 'uranus',
        orbitRadius: 44,
        startAngle: 2.8,
        orbitSpeed: 0.24,
        tilt: 0.08,
        yOffset: 0.35,
        scale: 1.42,
        textureUrl: '/textures/uranus.jpg',
      },
      {
        name: 'neptune',
        orbitRadius: 52,
        startAngle: 0.3,
        orbitSpeed: 0.18,
        tilt: 0.12,
        yOffset: 0.28,
        scale: 1.32,
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

    const stops = planets.map((p, idx) => {
      const look = [p.orbitRadius, p.yOffset, 0];
      const pos = [p.orbitRadius + 3, p.yOffset + 2, idx < 2 ? 10 - idx * 4 : -6];
      return { look, pos, dur: 1 };
    });

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
    timelineRef.current = tl;

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [camera, scene, sections, planets]);

  useEffect(() => {
    const triggers = ScrollTrigger.getAll();
    if (isTopView) {
      triggers.forEach((st) => st.disable());
    } else {
      triggers.forEach((st) => st.enable());
      if (timelineRef.current) {
        timelineRef.current.play(); // ensure timeline resumes
      }
    }
  }, [isTopView]);

  useFrame((_, delta) => {
    orbitRefs.current.forEach((group, i) => {
      if (group && planets[i]?.orbitSpeed) {
        group.rotation.y += planets[i].orbitSpeed * delta;
      }
    });

    if (isTopView) {
      camera.position.set(0, 80, 0.01);
      camera.lookAt(0, 0, 0);
      if (lightRef.current) {
        lightRef.current.position.copy(camera.position);
      }
      return;
    }

    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });

  return (
    <>
      <color attach="background" args={['#020611']} />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#7aa2ff', '#0b0f1c', 0.35]} />
      <directionalLight position={[-14, 10, 12]} intensity={1.1} castShadow />
      <pointLight ref={lightRef} position={[5, 5, 5]} intensity={2.2} decay={2} distance={120} castShadow />
      <Starfield />
      {planets.map((p, idx) => (
        <group
          key={p.name}
          ref={(node) => {
            orbitRefs.current[idx] = node;
          }}
          rotation={[p.tilt, p.startAngle, 0]}
        >
          <Planet
            name={p.name}
            textureUrl={p.textureUrl}
            position={[p.orbitRadius, p.yOffset, 0]}
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
  const [isTopView, setIsTopView] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isTopView ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTopView]);

  return (
    <div className="page">
      <button
        type="button"
        onClick={() => setIsTopView((prev) => !prev)}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 10,
          padding: '10px 14px',
          background: '#0f172a',
          color: '#e2e8f0',
          border: '1px solid #334155',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {isTopView ? 'Original View' : 'Top View'}
      </button>
      <div className="canvas-wrap">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            outputEncoding: THREE.sRGBEncoding,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <PerspectiveCamera makeDefault fov={55} near={0.1} far={200} />
          <Suspense fallback={null}>
            <Scene sections={sectionsRef} isTopView={isTopView} />
          </Suspense>
        </Canvas>
      </div>

      <div ref={sectionsRef} className="sections" aria-hidden />
    </div>
  );
}

export default App;

