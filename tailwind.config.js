/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Glow Sans SC"', '"Glow Sans"', '"Outfit"', 'sans-serif'],
                display: ['"TsangerFeiBai W03"', 'sans-serif'],
                serif: ['"Cormorant Garamond"', 'serif'],
                jinshu: ['"Chill Jinshu Song Compact ExtraBold"', '"寒蝉锦书宋Compact ExtraBold"', 'serif'],
            }
        },
    },
    plugins: [],
}