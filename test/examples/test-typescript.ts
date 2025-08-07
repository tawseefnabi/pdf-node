// TypeScript Example Test
import {generatePDF, PDFOptions} from '../../src/index.js';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

// For ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define TypeScript interfaces
interface User {
	name: string;
	age: number;
	email: string;
}

interface TemplateData {
	users: User[];
	date: string;
}

async function runTypeScriptExample() {
	console.log('Running TypeScript Example...');

	try {
		// Read HTML template
		const html = fs.readFileSync(
			path.join(__dirname, 'template.html'),
			'utf8'
		);

		// Sample typed data
		const users: User[] = [
			{name: 'Alex Johnson', age: 35, email: 'alex@example.com'},
			{name: 'Sarah Williams', age: 28, email: 'sarah@example.com'}
		];

		// PDF options with TypeScript type
		const options: PDFOptions = {
			format: 'A4',
			orientation: 'portrait',
			border: '10mm',
			header: {
				height: '15mm',
				contents:
					'<div style="text-align: center;">TypeScript Example</div>'
			},
			footer: {
				height: '15mm',
				contents: {
					default:
						'<div style="text-align: center; color: #666;">Page {{page}} of {{pages}}</div>'
				}
			}
		};

		// Generate PDF with buffer output
		console.log('Generating PDF...');
		const result = await generatePDF({
			html: html,
			data: {
				users: users,
				date: new Date().toLocaleDateString()
			} as TemplateData,
			type: 'pdf',
			buffer: true, // Get PDF as buffer
			pdfOptions: options
		});

		// Save the buffer to a file
		if ('buffer' in result) {
			fs.writeFileSync('./test-output-typescript.pdf', result.buffer);
			console.log(
				'✅ TypeScript Example - PDF generated successfully from buffer'
			);
		}

		return true;
	} catch (error) {
		console.error('❌ TypeScript Example - Error generating PDF:', error);
		return false;
	}
}

// Run the example
runTypeScriptExample().then(success => {
	process.exit(success ? 0 : 1);
});
