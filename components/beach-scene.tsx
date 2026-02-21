'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef, Suspense, useEffect, useState } from 'react';

// Basic WebGL Ocean
function Ocean() {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
        // Simple animation
      ref.current.rotation.x = -Math.PI / 2;
      ref.current.position.y = -2;
      // Animate the plane slightly
      ref.current.rotation.z = clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100, 32, 32]} />
      <meshStandardMaterial color="#006D77" wireframe={true} />
    </mesh>
  );
}

// Low-poly dunes
function Dunes() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(50, 20, 10, 5);
    geo.rotateX(-Math.PI / 2);
    
    // Displace vertices to make dunes
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Simple sin wave displacement
        const z = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 2;
        pos.setZ(i, z - 2.5); // lower than camera
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={[0, -2, -15]}>
       <meshStandardMaterial color="#E9D8A6" flatShading={true} />
    </mesh>
  );
}

// Particles
function Particles() {
    const count = 50;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 10 + Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        const xFactor = -50 + Math.random() * 100;
        const yFactor = -20 + Math.random() * 40;
        const zFactor = -50 + Math.random() * 100;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        particles.forEach((particle, i) => {
        const particleParams = particle;
        const t = particle.t += particleParams.speed / 2;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        const s = Math.cos(t);
        dummy.position.set(
            (particle.mx / 10) * a + particleParams.xFactor + Math.cos((t / 10) * particleParams.factor) + (Math.sin(t * 1) * particleParams.factor) / 10,
            (particle.my / 10) * b + particleParams.yFactor + Math.sin((t / 10) * particleParams.factor) + (Math.cos(t * 2) * particleParams.factor) / 10,
            (particle.my / 10) * b + particleParams.zFactor + Math.cos((t / 10) * particleParams.factor) + (Math.sin(t * 3) * particleParams.factor) / 10
        );
        dummy.scale.set(s, s, s);
        dummy.rotation.set(s * 5, s * 5, s * 5);
        dummy.updateMatrix();
        mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current!.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
        </instancedMesh>
    );
}

export default function BeachScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
      return (
          <div className="w-full h-64 bg-gradient-to-b from-sky-400 to-sky-200" />
      );
  }

  return (
    <div className="w-full h-64 relative bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60 }}
        dpr={[1, 1.5]}
        className="absolute inset-0"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        {/* Sky gradient simulation using color */}
        <color attach="background" args={['#87CEEB']} />

        <Suspense fallback={null}>
          <Ocean />
          <Dunes />
          <Particles />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg tracking-tighter">REMOTEJOBS PH</h1>
          <p className="text-white/90 text-sm md:text-base font-medium mt-2 max-w-lg text-center drop-shadow-md">
            Zero-API, File-Based Remote Jobs Directory
          </p>
      </div>
    </div>
  );
}
