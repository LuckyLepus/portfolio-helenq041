// assets/js/viewer.js
// Core HTML Slide Viewer & Interaction Controller
// Loads project JSON database, manages keyboard/mouse wheel/swipe controls, maps videos, and renders layout.

class SlideViewer {
    constructor(projectId) {
        this.projectId = projectId;
        this.projectData = null;
        this.currentSlideIndex = 0;
        this.isScrolling = false;
        
        this.init();
    }
    
    async init() {
        try {
            console.log(`Initializing SlideViewer for project: ${this.projectId}`);
            
            // 1. Fetch project database JSON
            const response = await fetch(`assets/data/${this.projectId}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.projectData = await response.json();
            
            // 2. Set theme color as CSS custom property
            document.documentElement.style.setProperty('--theme-color', this.projectData.accentColor);
            
            // 3. Render HTML layouts
            this.renderSidebar();
            this.setupThreeBackground();
            
            // 4. Load first slide
            this.goToSlide(0);
            
            // 5. Add event listeners
            this.addEventListeners();
            
        } catch (err) {
            console.error('Failed to initialize slide viewer:', err);
            document.querySelector('.viewer-display').innerHTML = `
                <div class="glass-panel" style="padding: 40px; text-align: center; max-width: 500px;">
                    <h3 style="color: #ef4444; margin-bottom: 15px;">数据加载失败</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
                        无法读取方案数据库文件，可能由于自动化管线尚在提取数据中，请稍后刷新重试。
                    </p>
                    <a href="index.html" class="glass-btn">返回方案集</a>
                </div>
            `;
        }
    }
    
    renderSidebar() {
        const titleEl = document.querySelector('.sidebar-title');
        const countEl = document.querySelector('.sidebar-slide-count');
        const listEl = document.querySelector('.sidebar-list-container');
        
        if (titleEl) titleEl.textContent = this.projectData.title;
        if (countEl) countEl.textContent = `${this.projectData.totalPages} 页`;
        
        if (listEl) {
            listEl.innerHTML = '';
            this.projectData.slides.forEach((slide, index) => {
                // Generate a brief clean title from slide text
                let slideTitle = `幻灯片 ${slide.pageNum}`;
                if (slide.text) {
                    const cleanText = slide.text.replace(/\r?\n/g, ' ').trim();
                    const words = cleanText.split(/\s+|\|/).filter(w => w.trim().length > 1);
                    if (words.length > 0) {
                        // Extract first meaningful title phrase, cap length
                        slideTitle = words[0].substring(0, 16);
                        if (words[0].length > 16) slideTitle += '...';
                    }
                }
                
                const item = document.createElement('div');
                item.className = 'slide-item';
                item.setAttribute('data-index', index);
                
                item.innerHTML = `
                    <div class="slide-item-num">${slide.pageNum}</div>
                    <div class="slide-item-title">${slideTitle}</div>
                    ${slide.video ? `<div class="slide-item-video-badge" title="含有视频多媒体">▶</div>` : ''}
                `;
                
                item.addEventListener('click', () => this.goToSlide(index));
                listEl.appendChild(item);
            });
        }
    }
    
    setupThreeBackground() {
        // Instantiate the Three.js interactive particle background
        if (window.ThreeBackground) {
            new ThreeBackground('three-bg', this.projectData.accentColor);
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.projectData.totalPages) return;
        
        this.currentSlideIndex = index;
        const slide = this.projectData.slides[index];
        
        // 1. Update active sidebar item
        const items = document.querySelectorAll('.slide-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
                // Scroll into view inside sidebar
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove('active');
            }
        });
        
        // 2. Load static slide image
        const imgEl = document.querySelector('#slide-img');
        if (imgEl) {
            imgEl.style.opacity = 0;
            // Short delay to allow smooth fade out
            setTimeout(() => {
                imgEl.src = slide.imagePath;
                imgEl.style.opacity = 1;
            }, 100);
        }
        
        // 3. Load video container if slide has video
        const videoContainer = document.querySelector('#slide-video-container');
        if (videoContainer) {
            videoContainer.innerHTML = ''; // Clear old video
            
            if (slide.video) {
                videoContainer.classList.add('active');
                
                // Construct relative video path
                const videoSrc = `assets/media/${this.projectId}/${slide.video}`;
                
                const videoEl = document.createElement('video');
                videoEl.src = videoSrc;
                videoEl.controls = true;
                videoEl.autoplay = true;
                videoEl.loop = true;
                videoEl.muted = true; // Mute to satisfy browser autoplay policies
                
                videoContainer.appendChild(videoEl);
            } else {
                videoContainer.classList.remove('active');
            }
        }
        
        // 4. Update slide indicator
        const indicator = document.querySelector('.slide-page-indicator');
        if (indicator) {
            indicator.textContent = `${slide.pageNum} / ${this.projectData.totalPages}`;
        }
        
        // 5. Update text overlay card
        const textContentEl = document.querySelector('#slide-text-content');
        if (textContentEl) {
            if (slide.text) {
                // Formatting text
                const formatted = slide.text.split('\n').filter(line => line.trim()).map(line => `<p style="margin-bottom: 6px;">${line}</p>`).join('');
                textContentEl.innerHTML = formatted;
            } else {
                textContentEl.innerHTML = '<p style="font-style: italic; color: var(--text-dark);">本页无文字内容</p>';
            }
        }
    }
    
    addEventListeners() {
        // Next/Prev Buttons
        const nextBtn = document.querySelector('#next-btn');
        const prevBtn = document.querySelector('#prev-btn');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.goToSlide(this.currentSlideIndex + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => this.goToSlide(this.currentSlideIndex - 1));
        
        // Keyboard arrow controls
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                this.goToSlide(this.currentSlideIndex + 1);
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.goToSlide(this.currentSlideIndex - 1);
            }
        });
        
        // Mouse Wheel Scroll (for natural slide switching)
        window.addEventListener('wheel', (e) => {
            // Check if user is scrolling over scrollable panels (like sidebar or text content)
            const isScrollablePanel = e.target.closest('.sidebar-list-container') || e.target.closest('#slide-text-content');
            if (isScrollablePanel) return; // Allow normal panel scrolling
            
            e.preventDefault();
            if (this.isScrolling) return;
            
            this.isScrolling = true;
            if (e.deltaY > 0) {
                this.goToSlide(this.currentSlideIndex + 1);
            } else {
                this.goToSlide(this.currentSlideIndex - 1);
            }
            
            // Debounce scrolling
            setTimeout(() => {
                this.isScrolling = false;
            }, 800);
        }, { passive: false });
        
        // Mobile Swipe controls
        let touchStartX = 0;
        let touchEndX = 0;
        
        const viewport = document.querySelector('.slide-viewport');
        if (viewport) {
            viewport.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            viewport.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) { // Threshold
                    if (diff > 0) {
                        this.goToSlide(this.currentSlideIndex + 1);
                    } else {
                        this.goToSlide(this.currentSlideIndex - 1);
                    }
                }
            }, { passive: true });
        }
    }
}
