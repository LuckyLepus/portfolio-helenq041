// assets/js/three-effects.js
// Interactive 3D Background Effect using Three.js
// Renders optimized interactive particle systems that respond to mouse movement and scrolling.

class ThreeBackground {
    constructor(canvasId, themeColor = '#ffffff') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.themeColor = themeColor;
        this.particlesCount = 1200;
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.scrollOffset = 0;
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        // 1. Scene & Camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 30;
        
        // 2. Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 3. Create Particle System
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particlesCount * 3);
        const randomSpeeds = new Float32Array(this.particlesCount);
        
        // Distribute particles in a waving field
        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;
            // X coordinate spread
            positions[i3] = (Math.random() - 0.5) * 80;
            // Y coordinate wave base
            positions[i3 + 1] = (Math.random() - 0.5) * 40;
            // Z coordinate depth
            positions[i3 + 2] = (Math.random() - 0.5) * 40;
            
            randomSpeeds[i] = 0.2 + Math.random() * 0.8;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.randomSpeeds = randomSpeeds;
        
        // Particle Material with gorgeous glow
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, this.themeColor + '99'); // Add alpha
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.PointsMaterial({
            size: 0.8,
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // Add a soft rotating torus/mesh in the background for high-tech premium feel
        const torusGeometry = new THREE.TorusGeometry(12, 3, 16, 100);
        const torusMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(this.themeColor),
            wireframe: true,
            transparent: true,
            opacity: 0.05
        });
        this.torus = new THREE.Mesh(torusGeometry, torusMaterial);
        this.torus.position.set(15, -5, -10);
        this.scene.add(this.torus);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
        
        window.addEventListener('mousemove', (e) => {
            // Normalized coordinates (-0.5 to 0.5)
            this.mouse.targetX = (e.clientX / window.innerWidth) - 0.5;
            this.mouse.targetY = (e.clientY / window.innerHeight) - 0.5;
        });
        
        window.addEventListener('scroll', () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll > 0) {
                this.scrollOffset = window.scrollY / maxScroll;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.0005;
        
        // Smoothly interpolate mouse movement (lerp)
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
        
        // 1. Animate particle waving
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const speed = this.randomSpeeds[i];
            
            // Calculate a waving motion based on X position and time
            positions[i3 + 1] = Math.sin(x * 0.1 + time * speed) * 3 + Math.cos(x * 0.05 + time * 0.5 * speed) * 2;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // 2. Rotate scene slightly based on mouse
        this.particles.rotation.y = this.mouse.x * 0.4 + time * 0.02;
        this.particles.rotation.x = -this.mouse.y * 0.4;
        
        // Apply scroll translation
        this.particles.position.y = this.scrollOffset * -10;
        
        // 3. Rotate background torus
        if (this.torus) {
            this.torus.rotation.x += 0.001;
            this.torus.rotation.y += 0.002;
            this.torus.position.y = -5 + this.mouse.y * 5 + (this.scrollOffset * -12);
            this.torus.position.x = 15 + this.mouse.x * 8;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
