const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload(filename, content) {
    fs.writeFileSync(filename, content);
    const form = new FormData();
    form.append('file', fs.createReadStream(filename));

    try {
        const response = await axios.post('http://localhost:5000/api/documents/upload', form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log(`Success ${filename}:`, response.data);
    } catch (error) {
        console.error(`Error ${filename}:`, error.response ? error.response.data : error.message);
    }
}

async function run() {
    await testUpload('test.txt', 'This is a test document with some content to embed.');
    // Create a dummy PDF. It might be invalid, but we'll see the error.
    await testUpload('test.pdf', '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
}

run();
