import { FaceLandmarker, HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useEffect, useRef, useState, createContext, useContext } from 'react';

type FaceTrackingContextType = {
  headMovement: { x: number; y: number; z: number };
  handPush: number;
  isTracking: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

const FaceTrackingContext = createContext<FaceTrackingContextType | null>(null);

export const useFaceTracking = () => {
  const ctx = useContext(FaceTrackingContext);
  if (!ctx) throw new Error('useFaceTracking must be used within a FaceTrackingProvider');
  return ctx;
};

export const FaceTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headMovement, setHeadMovement] = useState({ x: 0, y: 0, z: 0 });
  const [handPush, setHandPush] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        if (!active) return;
        
        const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1
        });
        if (!active) {
          faceLandmarker.close();
          return;
        }
        landmarkerRef.current = faceLandmarker;

        const handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        if (!active) {
          handLandmarker.close();
          return;
        }
        handLandmarkerRef.current = handLandmarker;
        
        setIsTracking(true);
      } catch (err: any) {
        console.error("Camera/MediaPipe init error:", err);
        if (active) setError(err.message || "Failed to initialize camera or tracking.");
      }
    }
    
    init();

    return () => {
      active = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (handLandmarkerRef.current) handLandmarkerRef.current.close();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!isTracking || !video) return;

    let hasStarted = false;

    function predictWebcam() {
      if (!hasStarted) hasStarted = true;
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      const handLandmarker = handLandmarkerRef.current;
      
      if (!video || !landmarker || !handLandmarker) return;
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameRef.current = requestAnimationFrame(predictWebcam);
        return;
      }

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        
        try {
          const results = landmarker.detectForVideo(video, performance.now());
          const handResults = handLandmarker.detectForVideo(video, performance.now());
          
          // Estimate hand push amount
          let currentHandPush = 0;
          if (handResults.landmarks && handResults.landmarks.length > 0) {
            const hand = handResults.landmarks[0];
            let minX = 1, maxX = 0, minY = 1, maxY = 0;
            for (const lm of hand) {
              if (lm.x < minX) minX = lm.x;
              if (lm.x > maxX) maxX = lm.x;
              if (lm.y < minY) minY = lm.y;
              if (lm.y > maxY) maxY = lm.y;
            }
            // Size mapping: difference between max and min
            const size = Math.max(maxX - minX, maxY - minY);
            // If hand bounds are greater than 0.2 of frame, consider it a push
            if (size > 0.2) {
              currentHandPush = Math.min(1, (size - 0.2) * 2.5); // Scales 0 to ~1
            }
          }
          setHandPush(currentHandPush);

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            // Top of nose roughly
            const noseTip = landmarks[1];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
            
            // Normalized coordinates (0 to 1) -> Map to -1 to 1 where 0 is center
            // MediaPipe coords: top-left is 0,0.
            
            // Calculate average depth/z approximation from face width (very rough)
            const faceWidth = Math.abs(leftEye.x - rightEye.x);
            const zApprox = Math.min(1, Math.max(0, faceWidth * 2)); 

            // We want movement relative to the center.
            // Invert X because camera is mirrored
            const xOffset = -((noseTip.x - 0.5) * 2);
            const yOffset = -((noseTip.y - 0.5) * 2);
            
            setHeadMovement({ x: xOffset, y: yOffset, z: zApprox });
          }
        } catch (err) {
          console.error("prediction error", err);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(predictWebcam);
    }
    
    if (video.readyState >= 2) {
      predictWebcam();
    } else {
      video.addEventListener("loadeddata", predictWebcam);
    }

    return () => {
      if (video) video.removeEventListener("loadeddata", predictWebcam);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isTracking]);

  return (
    <FaceTrackingContext.Provider value={{ headMovement, handPush, isTracking, error, videoRef }}>
      {children}
    </FaceTrackingContext.Provider>
  );
};
