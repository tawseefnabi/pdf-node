import {generatePDF, addNewPage} from './index.js';
// Test 1: Check if module exports exist
if (typeof generatePDF !== 'function') {
	throw new Error('generatePDF function not exported');
}
if (typeof addNewPage !== 'function') {
	throw new Error('addNewPage function not exported');
}
// Test 2: Test addNewPage function
console.log('✓ Testing addNewPage function...');
const pageBreak = addNewPage();
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
generatePDF(undefined).catch(err => {
	if (err.message && err.message.includes('options are missing')) {
		console.log('✓ generatePDF correctly validates missing options');
	} else {
		console.error('✗ generatePDF validation failed:', err);
		process.exit(1);
	}
});
// Test with invalid parameters
generatePDF({}).catch(err => {
	if (err.message && err.message.includes('options are missing')) {
		console.log('✓ generatePDF correctly validates empty options');
	} else {
		console.error('✗ generatePDF empty options validation failed:', err);
		process.exit(1);
	}
});
// Test with missing required fields
const testMissingFields = async () => {
	// Test missing html
	try {
		await generatePDF({data: {}});
		console.error('✗ Should have failed with missing html');
		process.exit(1);
	} catch (err) {
		if (!err.message.includes('options are missing')) {
			console.error('✗ Wrong validation for missing html:', err);
			process.exit(1);
		}
	}
	// Test missing data
	try {
		await generatePDF({html: '<div>test</div>'});
		console.error('✗ Should have failed with missing data');
		process.exit(1);
	} catch (err) {
		if (!err.message.includes('options are missing')) {
			console.error('✗ Wrong validation for missing data:', err);
			process.exit(1);
		}
	}
	// Test invalid type
	try {
		await generatePDF({
			html: '<div>test</div>',
			data: {},
			type: 'invalid'
		});
		console.error('✗ Should have failed with invalid type');
		process.exit(1);
	} catch (err) {
		if (!err.message.includes('Only PDF file type is supported')) {
			console.error('✗ Wrong validation for invalid type:', err);
			process.exit(1);
		}
	}
	// Test missing path when buffer is false
	try {
		await generatePDF({
			html: '<div>test</div>',
			data: {},
			buffer: false
		});
		console.error('✗ Should have failed with missing path');
		process.exit(1);
	} catch (err) {
		if (
			!err.message.includes(
				'Path is required when buffer option is not set to true'
			)
		) {
			console.error('✗ Wrong validation for missing path:', err);
			process.exit(1);
		}
	}
	console.log('✓ generatePDF validation tests passed');
	// If we get here, all tests passed
	console.log('\n✅ All CI tests passed successfully!');
};
// Run the tests
testMissingFields().catch(err => {
	console.error('Test failed:', err);
	process.exit(1);
});
