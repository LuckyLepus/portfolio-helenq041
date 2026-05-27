import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
uniform float uHover;
uniform float uTime;
varying vec2 vUv;

// Random noise function
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Smooth noise function for cloud-like distortion
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix( mix( rand( i + vec2(0.0,0.0) ), 
                     rand( i + vec2(1.0,0.0) ), u.x),
                mix( rand( i + vec2(0.0,1.0) ), 
                     rand( i + vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Smooth cloud-like directions for dispersion
  float n1 = noise(uv * 5.0) * 2.0 - 1.0;
  float n2 = noise(uv * 5.0 + vec2(12.3, 45.6)) * 2.0 - 1.0;
  float n3 = noise(uv * 5.0 + vec2(78.9, 12.3)) * 2.0 - 1.0;
  
  // Add a tiny bit of random static so it still feels like particles
  float staticNoiseX = rand(uv * 10.0) * 0.1 - 0.05;
  float staticNoiseY = rand(uv * 10.0 + 1.0) * 0.1 - 0.05;
  
  vec3 dir = vec3(n1 + staticNoiseX, n2 + staticNoiseY, n3);
  
  // Exponential dispersion curve
  float dispersion = pow(uHover, 2.0) * 1.5; // Reduced dispersion distance
  pos += dir * dispersion;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  
  // Size grows slightly as it scatters
  gl_PointSize = (1.5 + rand(uv) * 1.5) * (1.0 + uHover * 0.5); 
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uHover;
varying vec2 vUv;
void main() {
  vec4 color = texture2D(uTexture, vUv);
  if (color.a < 0.1) discard; // discard transparent
  
  // Fade out slightly when highly scattered
  float alpha = color.a * (1.0 - uHover * 0.3);
  gl_FragColor = vec4(color.rgb, alpha);
}
`;

function Particles({ url, isHovered }: { url: string, isHovered: boolean }) {
  const texture = useTexture(url);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // 300x195 grid = 58,500 particles for finer detail
  const { positions, uvs } = useMemo(() => {
    const w = 300;
    const h = 195; 
    const pos = new Float32Array(w * h * 3);
    const uv = new Float32Array(w * h * 2);
    let i = 0, j = 0;
    
    // The canvas will be 2.5x larger, so we make the base geometry 2.5x smaller
    // so it visually matches the original card size but has room to expand.
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        pos[i++] = (x / w - 0.5) * 1.3; // Width
        pos[i++] = (y / h - 0.5) * 0.85; // Height
        pos[i++] = 0;
        
        uv[j++] = x / w;
        uv[j++] = y / h; // Map texture UVs
      }
    }
    return { positions: pos, uvs: uv };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly animate hover value
      const targetHover = isHovered ? 1 : 0;
      materialRef.current.uniforms.uHover.value += (targetHover - materialRef.current.uniforms.uHover.value) * 0.05;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-uv" args={[uvs, 2]} count={uvs.length / 2} array={uvs} itemSize={2} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uHover: { value: 0 },
          uTime: { value: 0 }
        }}
        transparent={true}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleImage({ url, isHovered, className = '' }: { url: string, isHovered: boolean, className?: string }) {
  return (
    <div className={`w-full h-full pointer-events-none flex items-center justify-center ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ pointerEvents: 'none' }}>
        <React.Suspense fallback={null}>
          <Particles url={url} isHovered={isHovered} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
