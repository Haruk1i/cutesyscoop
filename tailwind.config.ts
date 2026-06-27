import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { blush:'#ff6fb1', candy:'#ffeff7', plum:'#8a2c62', cream:'#fff8fc' }, boxShadow:{soft:'0 20px 60px rgba(255,111,177,.22)'} } }, plugins: [] };
export default config;
