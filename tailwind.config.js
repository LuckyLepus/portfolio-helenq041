/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // font-sans: 自托管 Glow Sans SC，fallback 到 Outfit（Bunny Fonts）再到系统字体
                sans: ['Glow Sans SC', 'Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                // font-display: 仓耳霏白（如有），否则降级到 Glow Sans SC
                display: ['TsangerFeiBai W03', 'Glow Sans SC', 'sans-serif'],
                // font-serif: Cormorant Garamond via Bunny Fonts
                serif: ['Cormorant Garamond', 'Georgia', 'serif'],
                // font-jinshu: 自托管寒蝉锦书宋，名称与 @font-face 完全一致
                jinshu: ['Chill Jinshu Song Compact ExtraBold', 'Glow Sans SC', 'serif'],
            }
        },
    },
    plugins: [],
}