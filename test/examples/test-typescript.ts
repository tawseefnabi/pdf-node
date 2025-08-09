import {generatePDF} from '../../src/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import {fileURLToPath} from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple test function
async function runTest() {
	try {
		console.log('Testing PDF generation with TypeScript...');

		const outputPath = path.join(
			process.cwd(),
			'test-typescript-output.pdf'
		);

		// Simple HTML template
		const simpleHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>TypeScript Test PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; }
          p { line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>TypeScript Test PDF</h1>
        <p>This is a test of the PDF generation functionality using TypeScript.</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `;

		// Test file output
		console.log('Testing file output...');
		await generatePDF({
			html: simpleHTML,
			path: outputPath,
			data: {}, // Empty data object since it's required
			pdfOptions: {
				format: 'A4',
				type: 'pdf' as const // Type assertion to satisfy TypeScript
			}
		});

		// Verify file was created
		try {
			const stats = await fs.stat(outputPath);
			console.log(
				`✓ File created successfully: ${outputPath} (${stats.size} bytes)`
			);
		} catch (err) {
			console.error('✗ File not created:', err);
			return false;
		}

		// Test buffer output
		console.log('Testing buffer output...');
		const result = (await generatePDF({
			html: simpleHTML,
			buffer: true,
			data: {}, // Empty data object since it's required
			pdfOptions: {
				format: 'A4',
				type: 'pdf' as const // Type assertion to satisfy TypeScript
			}
		})) as {buffer: Buffer; size: number; type: string};

		if (result && result.buffer && result.buffer.length > 0) {
			console.log(
				`✓ Buffer generated successfully (${result.buffer.length} bytes)`
			);
		} else {
			console.error('✗ Buffer generation failed');
			return false;
		}

		console.log('\nAll TypeScript tests completed successfully!');
		return true;
	} catch (error) {
		console.error('Test failed:', error);
		return false;
	}
}

// Run the test
runTest().then(success => {
	process.exit(success ? 0 : 1);
});
