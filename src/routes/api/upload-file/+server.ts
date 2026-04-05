import { error, json } from '@sveltejs/kit';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const POST = async ({ request }) => {
	if (process.env.NODE_ENV === 'production') {
		throw error(403, 'Forbidden');
	}

	const { slug, fileName, base64Data } = await request.json();

	if (!slug || !fileName || !base64Data) {
		throw error(400, 'Missing data');
	}

	try {
        const isModel = fileName.endsWith('.glb') || fileName.endsWith('.gltf');
        const subfolder = isModel ? 'models' : 'images';
        
		const dirPath = join(process.cwd(), 'static', subfolder, 'posts', slug);
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, { recursive: true });
		}

		const filePath = join(dirPath, fileName);
		const buffer = Buffer.from(base64Data, 'base64');
		
		writeFileSync(filePath, buffer);

		return json({ 
			success: true, 
			url: `/${subfolder}/posts/${slug}/${fileName}` 
		});
	} catch (e) {
		console.error('Local upload error:', e);
		throw error(500, 'Failed to upload locally');
	}
};
