import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring } from 'framer-motion';
import * as THREE from 'three';
import { useFaceTracking } from './FaceTrackerProvider';
import { generateWallpaperCanvas, generateCeilingCanvas, generateFloorCanvas } from '../lib/Textures';

// We apply a post-processing pass for the VHS/Retro aesthetic
import { EffectComposer, Noise, Glitch, Scanline, Bloom, Vignette } from '@react-three/postprocessing';
import { GlitchMode, BlendFunction } from 'postprocessing';

const VirtualCamera = () => {
  const { headMovement, handPush } = useFaceTracking();
  const { camera } = useThree();
  
  // Use Framer Motion's useSpring to smooth the raw face tracking coordinates
  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });
  const springZ = useSpring(0, { stiffness: 50, damping: 20 });
  
  const forwardRef = useRef(0);

  useEffect(() => {
    // Map Movement: roughly -1 to 1 based on face offset
    // Constrain the values to prevent clipping through the walls
    const targetX = Math.max(-2.5, Math.min(2.5, headMovement.x * 4));
    const targetY = Math.max(-1.2, Math.min(1.2, headMovement.y * 3));
    
    // Closer to camera = larger face width (larger headMovement.z). 
    // We want closer face to move the camera FORWARD (negative Z direction).
    const validZ = headMovement.z === 0 ? 0.3 : headMovement.z;
    const targetZ = Math.max(-5, Math.min(5, (0.3 - validZ) * 10));

    springX.set(targetX); 
    springY.set(targetY);
    springZ.set(targetZ);
  }, [headMovement, springX, springY, springZ]);

  useFrame((state, delta) => {
    // Smoothly push camera forward when hand is pushing
    if (handPush > 0) {
      forwardRef.current += handPush * delta * 25; // Speed multiplier for pushing forward
    }

    // We modify camera position, NOT rotation, for the parallax lookup
    // Camera is fixed to the monitor plane roughly, but it shifts as user moves their head
    
    // We want the default position to be (0, 1.5, 0)
    // The "window" is at z=0. The scene extends from z=0 down to z=-200
    
    camera.position.x = springX.get();
    camera.position.y = 1.5 + springY.get(); // height of eyes
    camera.position.z = 2 + springZ.get() - forwardRef.current; // Base offset from the "window"
    
    // It always looks dead into the corridor so the parallax makes walls slide
    camera.lookAt(springX.get() * 0.1, 1.5, -100 - forwardRef.current);
    camera.updateProjectionMatrix();
  });

  return null;
};

const Corridor = () => {
  // Use the procedurally generated canvases as textures
  const wallpaperTex = useMemo(() => new THREE.CanvasTexture(generateWallpaperCanvas()), []);
  const ceilingTex = useMemo(() => new THREE.CanvasTexture(generateCeilingCanvas()), []);
  const floorTex = useMemo(() => new THREE.CanvasTexture(generateFloorCanvas()), []);

  // Configure textures to repeat along the long hallway
  useMemo(() => {
    wallpaperTex.wrapS = wallpaperTex.wrapT = THREE.RepeatWrapping;
    wallpaperTex.repeat.set(500, 2); // Repeat down the long Z axis

    ceilingTex.wrapS = ceilingTex.wrapT = THREE.RepeatWrapping;
    ceilingTex.repeat.set(2, 500);

    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(2, 500);
  }, [wallpaperTex, ceilingTex, floorTex]);

  const hallwayLength = 10000;
  const hallwayWidth = 10;
  const hallwayHeight = 4.5;

  return (
    // Shift the corridor so it extends far behind the camera too, eliminating any front/back boundaries
    <group position={[0, hallwayHeight / 2, -hallwayLength / 2 + 1000]}>
      {/* Box geometry with inverted normals to create a room. */}
      {/* We use an array of materials to apply different textures to different faces. */}
      {/* Faces: right, left, top, bottom, front, back */}
      <mesh scale={[1, 1, 1]}>
        <boxGeometry args={[hallwayWidth, hallwayHeight, hallwayLength]} />
        {/* Right Wall */}
        <meshStandardMaterial map={wallpaperTex} side={THREE.BackSide} attach="material-0" color="#f5e08c" />
        {/* Left Wall */}
        <meshStandardMaterial map={wallpaperTex} side={THREE.BackSide} attach="material-1" color="#f5e08c" />
        {/* Ceiling */}
        <meshStandardMaterial map={ceilingTex} side={THREE.BackSide} attach="material-2" color="#c1bea9" />
        {/* Floor */}
        <meshStandardMaterial map={floorTex} side={THREE.BackSide} attach="material-3" />
        {/* Front Wall (behind player) */}
        <meshStandardMaterial map={wallpaperTex} side={THREE.BackSide} attach="material-4" color="#f5e08c" />
        {/* Back Wall (far end) */}
        <meshStandardMaterial map={wallpaperTex} side={THREE.BackSide} attach="material-5" color="#111" />
      </mesh>
    </group>
  );
};

const LightFixtures = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create an array of positions for the fluorescent lights. We use a pool of 30 lights.
  const lights = useMemo(() => Array.from({ length: 30 }).map(() => ({
    intensity: Math.random() > 0.8 ? 0.3 : 1.2,
    color: '#fffae6', // sick yellowish white
    flickerSpeed: Math.random() * 0.5 + 0.1,
    isFlickering: Math.random() > 0.6,
  })), []);

  useFrame((state) => {
    const camZ = state.camera.position.z;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        // First child is ambientLight, so we skip it (i=0) if we used flat children,
        // but we wrapped the dynamic lights in their own groups.
        if (child.type !== "Group") return; 
        
        // Find how many 10-unit blocks camera has moved passed
        const passedBlocks = Math.floor((-camZ) / 10);
        // The real index for this light out of the 30 pool
        // Subtract 4 so lights actually render slightly behind the camera as well to prevent snapping
        const lightIndex = passedBlocks + i - 4; 
        const zPos = -Math.abs(lightIndex) * 10 - 2;
        
        child.position.z = zPos;

        // Apply flickering only to the PointLight inside this LightGroup
        if (child.children.length > 1) {
          const ptLight = child.children[1] as THREE.PointLight;
          if (ptLight && lights[i - 1]?.isFlickering) {
            ptLight.intensity = lights[i - 1].intensity * (Math.random() > 0.9 ? 0.1 : 1.0);
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.15} color="#443c1a" />
      {lights.map((light, i) => (
        <group key={i}>
          {/* Visual light box */}
          <mesh position={[0, 3.4, 0]}>
            <boxGeometry args={[1.5, 0.1, 0.4]} />
            <meshBasicMaterial color={light.color} />
          </mesh>
          <pointLight 
            position={[0, 3.4, 0]}
            distance={15} 
            decay={1.8} 
            intensity={light.intensity} 
            color={light.color} 
          />
        </group>
      ))}
    </group>
  );
};

const Entity = () => {
  const entityRef = useRef<THREE.Group>(null);
  const { headMovement } = useFaceTracking();
  const springX = useSpring(0, { stiffness: 40, damping: 25 });
  const springY = useSpring(0, { stiffness: 40, damping: 25 });

  useEffect(() => {
    springX.set(headMovement.x);
    springY.set(headMovement.y);
  }, [headMovement, springX, springY]);

  useFrame(() => {
    if (entityRef.current) {
      // The entity mirrors your movements slightly and stares back
      // Since positive x offset means user moved right, the entity could sway slightly left
      entityRef.current.position.x = -springX.get() * 0.5;
      entityRef.current.rotation.y = springX.get() * 0.2;
    }
  });

  return (
    <group ref={entityRef} position={[0, 1.5, -95]}>
      <mesh>
        <planeGeometry args={[1.5, 3]} />
        <meshBasicMaterial 
          color="black" 
          transparent={true} 
          opacity={0.85} 
          alphaMap={null} // We could use a texture, but a black plane works for a glitched silhouette
        />
      </mesh>
    </group>
  );
};

const GlitchEffects = () => {
  const { headMovement } = useFaceTracking();
  const glitchRef = useRef<any>(null);

  useFrame(() => {
    if (glitchRef.current) {
      // If user comes too close (z tracking), increase glitch
      // Using z offset rough estimate
      if (headMovement.z > 0.8) {
        // High panic
      }
    }
  });

  return (
    <EffectComposer>
      <Noise opacity={0.6} blendFunction={BlendFunction.MULTIPLY} />
      {/* A subtle continuous CRT scanline */}
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.2} opacity={0.1} />
      <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} opacity={0.5} />
      <Glitch
        delay={new THREE.Vector2(2, 10)} // Random delay between glitches
        duration={new THREE.Vector2(0.1, 0.3)} // Random duration
        strength={new THREE.Vector2(0.02, 0.05)} // Glitch strength
        mode={GlitchMode.SPORADIC}
        active={true}
        ratio={0.1}
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};

export const BackroomsScene = () => {
  return (
    <Canvas 
      camera={{ position: [0, 1.5, 2], fov: 60 }} 
      dpr={[1, 1]}
      gl={{ antialias: false }} // Low resolution style
    >
      <color attach="background" args={['#000']} />
      {/* Fog to hide the far end of the corridor */}
      <fog attach="fog" args={['#24200b', 30, 120]} />
      
      <Corridor />
      <LightFixtures />
      <Entity />
      
      <VirtualCamera />
      <GlitchEffects />
    </Canvas>
  );
};
