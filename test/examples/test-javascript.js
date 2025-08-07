// JavaScript Example Test
import {generatePDF} from '../../dist/index.js';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// For ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runJavaScriptExample() {
	console.log('Running JavaScript Example...');

	try {
		// Read HTML template
		const html = fs.readFileSync(
			path.join(__dirname, 'template.html'),
			'utf8'
		);

		// Sample data
		const users = [
			{name: 'John Doe', age: 30, email: 'john@example.com'},
			{name: 'Jane Smith', age: 25, email: 'jane@example.com'}
		];

		// PDF options
		const options = {
			format: 'A4',
			orientation: 'portrait',
			border: '10mm',
			header: {
				height: '15mm',
				contents:
					'<div style="text-align: center;">JavaScript Example</div>'
			},
			footer: {
				height: '15mm',
				contents: {
					default:
						'<div style="text-align: center; color: #666;">Page {{page}} of {{pages}}</div>'
				}
			}
		};

		// Generate PDF
		console.log('Generating PDF...');
		const result = await generatePDF({
			html: html,
			data: {
				users: users,
				date: new Date().toLocaleDateString()
			},
			path: './test-output-javascript.pdf',
			type: 'pdf',
			pdfOptions: options
		});

		console.log(
			'✅ JavaScript Example - PDF generated successfully at:',
			result.filename
		);
		return true;
	} catch (error) {
		console.error('❌ JavaScript Example - Error generating PDF:', error);
		return false;
	}
}

// Run the example
runJavaScriptExample().then(success => {
	process.exit(success ? 0 : 1);
});
