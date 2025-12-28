import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		})
	]
	// server: {
	// 	proxy: {
	// 		'/api/auth': {
	// 			target: 'https://baas.wke.csie.ncnu.edu.tw',
	// 			changeOrigin: true,
	// 			secure: false
	// 		}
	// 	}
	// }
});
