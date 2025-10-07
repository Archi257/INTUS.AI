/* Project: Intus.ai Med Tech | Author: Archi Sagvekar */
const uploadBox = document.getElementById('uploadBox');
const imageInput = document.getElementById('imageInput');
const phaseSelect = document.getElementById('phaseSelect');
const processBtn = document.getElementById('processBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');
const processedTitle = document.getElementById('processedTitle');

let selectedFile = null;

uploadBox.addEventListener('click', () => {
    imageInput.click();
});

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        alert('Please select a JPG or PNG image file.');
        return;
    }
    
    selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        processBtn.disabled = false;
        
        const uploadContent = uploadBox.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <svg class="upload-icon" style="width: 50px; height: 50px; color: #4caf50;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="upload-text" style="color: #4caf50;">Image Uploaded Successfully</p>
            <p class="upload-subtext">${file.name}</p>
        `;
    };
    reader.readAsDataURL(file);
}

processBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        alert('Please select an image first.');
        return;
    }
    
    const phase = phaseSelect.value;
    
    resultsSection.style.display = 'none';
    loadingIndicator.style.display = 'block';
    processBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('phase', phase);
    
    try {
        const response = await fetch('/process', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Processing failed');
        }
        
        const result = await response.json();
        
        if (result.success) {
            processedImage.src = result.processed_image;
            
            const phaseText = phase === 'arterial' ? 'Arterial Phase' : 'Venous Phase';
            processedTitle.textContent = `Processed Image (${phaseText})`;
            
            loadingIndicator.style.display = 'none';
            resultsSection.style.display = 'block';
            processBtn.disabled = false;
        } else {
            throw new Error(result.error || 'Processing failed');
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        processBtn.disabled = false;
        alert('Error processing image: ' + error.message);
        console.error('Error:', error);
    }
});
