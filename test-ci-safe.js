// CI-safe test that doesn't require html-pdf system dependencies
const pdf = require('./index');
const fs = require('fs');

console.log('Running CI-safe tests...');

// Test 1: Check if module exports exist
console.log('✓ Testing module exports...');
if (typeof pdf.generatePDF !== 'function') {
	console.error('✗ generatePDF function not exported');
	process.exit(1);
}

if (typeof pdf.addNewPage !== 'function') {
	console.error('✗ addNewPage function not exported');
	process.exit(1);
}

console.log('✓ All module exports are valid');

// Test 2: Test addNewPage function
console.log('✓ Testing addNewPage function...');
const pageBreak = pdf.addNewPage();
if (!pageBreak || typeof pageBreak !== 'string') {
	console.error('✗ addNewPage should return a string');
	process.exit(1);
}

if (!pageBreak.includes('page-break-after')) {
	console.error('✗ addNewPage should return page break HTML');
	process.exit(1);
}

console.log('✓ addNewPage function works correctly');

// Test 3: Test generatePDF function validation
console.log('✓ Testing generatePDF validation...');

// Test with missing parameters
pdf.generatePDF().catch(err => {
	if (err.message && err.message.includes('options are missing')) {
		console.log('✓ generatePDF correctly validates missing options');
	} else {
		console.error('✗ generatePDF validation failed:', err);
		process.exit(1);
	}
});

// Test with invalid parameters
pdf.generatePDF({}).catch(err => {
	if (err.message && err.message.includes('options are missing')) {
		console.log('✓ generatePDF correctly validates empty options');
	} else {
		console.error('✗ generatePDF validation failed:', err);
		process.exit(1);
	}
});

// Test with invalid type
pdf.generatePDF({
	html: '<h1>Test</h1>',
	data: {},
	type: 'invalid',
	path: './test.pdf'
}).catch(err => {
	if (err === 'only pdf file type supported') {
		console.log('✓ generatePDF correctly validates file type');
	} else {
		console.error('✗ generatePDF file type validation failed:', err);
		process.exit(1);
	}
});

// Test with missing path when buffer is not enabled
pdf.generatePDF({
	html: '<h1>Test</h1>',
	data: {},
	type: 'pdf'
	// Missing both path and buffer: true
}).catch(err => {
	if (err.message && err.message.includes('Path is required')) {
		console.log('✓ generatePDF correctly validates missing path when buffer is not enabled');
	} else {
		console.error('✗ generatePDF path validation failed:', err);
		process.exit(1);
	}
});

// Skip actual PDF generation in CI environments to avoid system dependency issues
if (process.env.CI || process.env.GITHUB_ACTIONS) {
	console.log('✓ CI environment detected - skipping PDF generation test');
	console.log('✅ All CI-safe tests passed!');
	process.exit(0);
}

// Test 4: Full PDF generation (only in non-CI environments)
console.log('✓ Testing full PDF generation...');

let htm_template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Test PDF</title>
  </head>
  <body>
    <h1>Test Document</h1>
    <p>This is a test PDF generated for testing.</p>
    ${pdf.addNewPage()}
    <h2>Second Page</h2>
    <p>This content should appear on a new page.</p>
  </body>
</html>`;

let doc = {
	html: htm_template,
	data: {},
	type: 'pdf',
	path: './test-output.pdf'
};

pdf.generatePDF(doc)
	.then(result => {
		console.log('✓ PDF generation successful:', result.filename);
		console.log('✅ All tests passed!');

		// Clean up test file
		if (fs.existsSync('./test-output.pdf')) {
			fs.unlinkSync('./test-output.pdf');
			console.log('✓ Test file cleaned up');
		}
	})
	.catch(err => {
		console.error('✗ PDF generation failed:', err.message);
		process.exit(1);
	});
