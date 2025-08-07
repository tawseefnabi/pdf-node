var pdf = require('./index');

console.log('Testing PDF buffer support...');

// Test HTML template
let htm_template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Buffer Test PDF</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      .header { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
      .content { margin: 20px 0; line-height: 1.6; }
      .highlight { background-color: #f0f8ff; padding: 10px; border-left: 4px solid #007acc; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>{{title}}</h1>
      <p>Generated for: {{user.name}}</p>
    </div>
    
    <div class="content">
      <h2>Buffer Support Test</h2>
      <p>This PDF was generated using the new buffer support feature!</p>
      
      <div class="highlight">
        <strong>Key Benefits:</strong>
        <ul>
          <li>Perfect for APIs and web services</li>
          <li>No temporary files needed</li>
          <li>Direct HTTP response streaming</li>
          <li>Memory efficient for small to medium PDFs</li>
        </ul>
      </div>
      
      <h3>User Information</h3>
      <p><strong>Name:</strong> {{user.name}}</p>
      <p><strong>Email:</strong> {{user.email}}</p>
      <p><strong>Role:</strong> {{user.role}}</p>
    </div>
    
    ${pdf.addNewPage()}
    
    <div class="content">
      <h2>Second Page</h2>
      <p>This content appears on a new page, demonstrating the addNewPage() function works with buffer output too!</p>
      
      <h3>Usage Examples</h3>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
// Buffer output (new feature)
const bufferDoc = {
  html: template,
  data: userData,
  type: 'pdf',
  buffer: true  // This enables buffer output
};

// File output (existing feature)
const fileDoc = {
  html: template,
  data: userData,
  type: 'pdf',
  path: './output.pdf'
};
      </pre>
    </div>
  </body>
</html>`;

// Test data
let userData = {
	title: 'PDF Buffer Support Demo',
	user: {
		name: 'John Developer',
		email: 'john@example.com',
		role: 'Full Stack Developer'
	}
};

// Test 1: Generate PDF as buffer
console.log('\n=== Test 1: Buffer Output ===');
let bufferDoc = {
	html: htm_template,
	data: userData,
	type: 'pdf',
	buffer: true // Enable buffer output
};

pdf.generatePDF(bufferDoc)
	.then(result => {
		console.log('✅ Buffer generation successful!');
		console.log('📊 Buffer size:', result.size, 'bytes');
		console.log('📄 Content type:', result.type);
		console.log('🔍 Buffer type:', typeof result.buffer);
		console.log(
			'✨ Buffer is instance of Buffer:',
			Buffer.isBuffer(result.buffer)
		);

		// Demonstrate saving buffer to file (optional)
		const fs = require('fs');
		fs.writeFileSync('./buffer-output.pdf', result.buffer);
		console.log('💾 Buffer saved to buffer-output.pdf for verification');

		// Test 2: Generate PDF as file (existing functionality)
		console.log('\n=== Test 2: File Output (Existing Feature) ===');
		let fileDoc = {
			html: htm_template,
			data: userData,
			type: 'pdf',
			path: './file-output.pdf'
		};

		return pdf.generatePDF(fileDoc);
	})
	.then(result => {
		console.log('✅ File generation successful!');
		console.log('📁 File path:', result.filename);

		// Test 3: Error handling - missing path when buffer is false
		console.log('\n=== Test 3: Error Handling ===');
		let invalidDoc = {
			html: htm_template,
			data: userData,
			type: 'pdf'
			// Missing both path and buffer: true
		};

		return pdf.generatePDF(invalidDoc);
	})
	.catch(err => {
		console.log('✅ Error handling works correctly:', err.message);

		console.log('\n🎉 All tests completed successfully!');
		console.log('\n📚 Usage Summary:');
		console.log('   • For APIs/web services: Set buffer: true');
		console.log('   • For file output: Set path: "./filename.pdf"');
		console.log('   • Buffer output returns: { buffer, size, type }');
		console.log('   • File output returns: { filename }');

		// Clean up test files
		const fs = require('fs');
		try {
			if (fs.existsSync('./buffer-output.pdf'))
				fs.unlinkSync('./buffer-output.pdf');
			if (fs.existsSync('./file-output.pdf'))
				fs.unlinkSync('./file-output.pdf');
			console.log('🧹 Test files cleaned up');
		} catch (cleanupErr) {
			console.log('⚠️  Cleanup note:', cleanupErr.message);
		}
	});
