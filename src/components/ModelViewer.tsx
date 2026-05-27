import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Auto rotate the model faster
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group rotation={[0.4, 0, 0]}> {/* Tilt the WHOLE SCENE forward so bottom is hidden */}
      <group ref={modelRef}>
        <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
          <primitive 
            object={scene} 
            scale={1.5} 
          />
        </Float>
      </group>
    </group>
  );
}

interface ModelViewerProps {
  url?: string;
  className?: string;
}

export default function ModelViewer({ url = '/model.glb', className = '' }: ModelViewerProps) {
  return (
    <div className={`w-full h-full pointer-events-none flex items-center justify-center ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        
        <Suspense fallback={null}>
          <Center>
            <Model url={url} />
          </Center>
          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the default model so it loads instantly
useGLTF.preload('/model.glb');
