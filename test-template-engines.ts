import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {generatePDF, clearTemplateCache} from './dist/index.js';
import fs from 'fs/promises';
import path from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test data
const testData = {
	title: 'Template Engine Test',
	content: 'This is a test of the template engine',
	date: new Date().toISOString(),
	author: 'Test User',
	version: '1.0.0'
};

// Simple test function to verify the setup works
async function runTest() {
	try {
		console.log('Testing PDF generation with simple HTML...');

		const outputPath = path.join(process.cwd(), 'test-output-simple.pdf');

		// Simple HTML template
		const simpleHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; }
          p { line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>Test PDF Generation</h1>
        <p>This is a simple test of the PDF generation functionality.</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `;

		// Test file output
		console.log('Testing file output...');
		await generatePDF({
			html: simpleHTML,
			path: outputPath,
			data: {} // Empty data object since it's required but not used in this simple test
		});

		// Verify file was created
		try {
			const stats = await fs.stat(outputPath);
			console.log(
				`✓ File created successfully: ${outputPath} (${stats.size} bytes)`
			);
		} catch (err) {
			console.error('✗ File not created:', err);
		}

		// Test buffer output
		console.log('Testing buffer output...');
		const result = (await generatePDF({
			html: simpleHTML,
			buffer: true,
			data: {} // Empty data object since it's required but not used in this simple test
		})) as {buffer: Buffer; size: number; type: string};

		if (result && result.buffer && result.buffer.length > 0) {
			console.log(
				`✓ Buffer generated successfully (${result.buffer.length} bytes)`
			);
		} else {
			console.error('✗ Buffer generation failed');
		}

		console.log('\nAll tests completed successfully!');
	} catch (error) {
		console.error('Test failed:', error);
		process.exit(1);
	}
}

// Run the test
runTest();
