/* global queueLength */

document.addEventListener('DOMContentLoaded', function() {
    const uPathElement = document.getElementById('uPath');
    const maxBytes = document.forms.upload.maxBytes.value;
    const maxFilesPerBatch = document.forms.upload.maxFiles.value;
    // Feature detection for drag&drop upload
    const isAdvancedUpload = function() {
        const div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    const form = document.querySelector('.box');
    if(form) {
        form.action = `file.php?path=${uPathElement.value}`;
        const input = form.querySelector('input[type="file"]');
        const label = document.getElementById('uploadstats')
        const errorMsg = form.querySelector('.box__error span');
        const restartButtons = form.querySelectorAll('.box__restart');
        let droppedFiles = false;
        
        // Initialize form-specific variables
        form.isSubmitting = false;
        form.uploadQueue = [];

        const showFiles = function(files) {
            let thing = files.length > 1 ? (input.getAttribute('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name
            label.innerHTML = `<p><b>Starting upload</b></p><p>${thing}</p>`;
        };

        // Letting the server side know we are going to make an Ajax request
        const ajaxFlag = document.createElement('input');
        ajaxFlag.setAttribute('type', 'hidden');
        ajaxFlag.setAttribute('name', 'ajax');
        ajaxFlag.setAttribute('value', 1);
        form.appendChild(ajaxFlag);
        input.addEventListener('change', function(e) {
            showFiles(e.target.files);
            const uploadButton = form.querySelector('.box__button');
            if (uploadButton) {
                uploadButton.click(); // Programmatically trigger the click
            }
        });
        if (isAdvancedUpload) {
            form.classList.add('has-advanced-upload'); // Letting the CSS part know drag&drop is supported by the browser

            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(event) {
                form.addEventListener(event, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            ['dragover', 'dragenter'].forEach(function(event) {
                form.addEventListener(event, function() {
                    form.classList.add('is-dragover');
                });
            });
            ['dragleave', 'dragend', 'drop'].forEach(function(event) {
                form.addEventListener(event, function() {
                    form.classList.remove('is-dragover');
                });
            });
            form.addEventListener('drop', function(e) {
                droppedFiles = e.dataTransfer.files; // The files that were dropped
                showFiles(droppedFiles);
                const uploadButton = form.querySelector('.box__button');
                if (uploadButton) {
                    uploadButton.click(); // Programmatically trigger the click ONLY if files are within the limit
                }
            });
        }

 form.addEventListener('submit', function(e) {
    e.preventDefault();
    label.style.display = "block";
    this.isSubmitting = false;
    this.classList.add('is-uploading');
    this.classList.remove('is-error');
    let filesToProcess = [];
    if (droppedFiles) {
        filesToProcess = Array.from(droppedFiles);
        droppedFiles = null;
    } else if (input.files) {
        filesToProcess = Array.from(input.files);
        input.value = '';
    }

    this.uploadQueue = []; // Reset the queue for a new submission
    let currentBatch = [];
    let currentBatchSize = 0;
    const maxSizeBytes = parseInt(maxBytes, 10);
    const oversizedFiles = [];
    this.queueLength = 0;
    if (filesToProcess.length > 0) {
        for (let i = 0; i < filesToProcess.length; i++) {
            const file = filesToProcess[i];
            if (file.size >= maxSizeBytes) {
                oversizedFiles.push(file.name);
                this.classList.add('is-error');
               label.innerHTML += `<p>${file.name} exceeds the upload limit.</p>`;
            } else if (currentBatchSize + file.size <= maxSizeBytes && currentBatch.length < maxFilesPerBatch) { // Added a max file limit per batch for good measure (adjust as needed)  && currentBatch.length < 5
                currentBatch.push(file);
                currentBatchSize += file.size;
            } else {
                // Current file doesn't fit, create a new batch
                if (currentBatch.length > 0) {
                    this.uploadQueue.push([...currentBatch]);
                }
                currentBatch = [file];
                currentBatchSize = file.size;
            }
            // Create the last batch if it's not empty
            if (i === filesToProcess.length - 1 && currentBatch.length > 0) {
                this.uploadQueue.push([...currentBatch]);
                
            }
        }
       if(this.queueLength === 0) this.queueLength=this.uploadQueue.length;
        if (this.uploadQueue.length > 0) {
            
            processUploadQueue(this);
            this.isSubmitting = false;
        } else if (oversizedFiles.length > 0 && !this.classList.contains('is-error')) {
            this.classList.remove('is-uploading');
            this.isSubmitting = false;
            label.innerHTML += '<p>No valid files to upload.</p>';
        } else if (filesToProcess.length === 0) {
            this.classList.remove('is-uploading');
            this.isSubmitting = false;
        }
    } else {
        this.classList.remove('is-uploading');
        this.isSubmitting = false;
    }
});

   function processUploadQueue(currentForm) {
     if (currentForm.uploadQueue.length > 0 && !currentForm.isSubmitting) {
        currentForm.isSubmitting = true;
        const nextBatch = currentForm.uploadQueue.shift();
        const remainingCount = currentForm.uploadQueue.length;
        const inputElement = currentForm.querySelector('input[type="file"]');
       // label.innerHTML += nextBatch.length > 1 ? (inputElement.getAttribute('data-multiple-caption') || '').replace('{count}', nextBatch.length) : nextBatch[0].name;
        if (remainingCount > 0) {
            label.innerHTML +=`<p>${remainingCount+1} batches ${nextBatch.length} files in the batch</p>`;
        }else{ label.innerHTML +=`<p>last batch ${nextBatch.length} files in the batch</p>`;}
        uploadFiles(nextBatch, currentForm, remainingCount > 0);
    } else if (currentForm.uploadQueue.length === 0) {
        currentForm.isSubmitting = false; // Allow new submissions
       
        label.innerHTML += '<p>151 Upload complete.</p>';
    }
}

        const uploadFiles = function(filesToSend, currentForm, hasMoreBatches) {
            if (!filesToSend || filesToSend.length === 0) {
                if (hasMoreBatches) {
                    processUploadQueue(currentForm); // Pass the current form
                } else {
                    currentForm.isSubmitting = false;
                    label.innerHTML += '<p><b>158 Upload complete.<b></p>';
                }
                return;
            }
            currentForm.classList.add('is-uploading');
            currentForm.classList.remove('is-error', 'is-success');
            const ajaxData = new FormData();
            const inputElement = currentForm.querySelector('input[type="file"]');
            const inputName = inputElement ? inputElement.getAttribute('name') : 'file';

            filesToSend.forEach(function(file) {
                ajaxData.append(inputName, file);
            });

            const ajax = new XMLHttpRequest();
            const cancelButton = currentForm.querySelector('.box__uploading .cancel');
            if (cancelButton) {
                
                cancelButton.addEventListener('click', function(e) {
                    ajax.abort();
                    ajaxData = null;
                    
                    label.innerHTML += '<p>cancelled</p>';
                    if (inputElement) inputElement.value = '';
                    currentForm.classList.remove('is-uploading');
                    currentForm.isSubmitting = false; // Allow new submissions
                    currentForm.uploadQueue = []; // Clear the queue on cancel
                });
            }

            ajax.open(currentForm.getAttribute('method'), currentForm.getAttribute('action'), true);
            ajax.upload.onprogress = function(e) {
                const progressText = currentForm.querySelector('#progress');
                const progressBar = currentForm.querySelector('#prog div');
                if (progressText) progressText.textContent = `Upload ${Math.floor(e.loaded / 1024 /1024)} of ${Math.floor(e.total / 1024 / 1024)} MB `;
                if (progressBar) progressBar.style.width = `${Math.floor(e.loaded / e.total * 100)}%`;
            };
            ajax.onload = function() {
                currentForm.classList.remove('is-uploading');
                currentForm.isSubmitting = false; // Allow the next batch to start

                try {
                    const data = JSON.parse(ajax.responseText);
                    currentForm.classList.toggle('is-success', data.success >= 1);
                    currentForm.classList.toggle('is-error', !data.success);
                    
                     label.innerHTML += `${filesToSend.length} files uploaded 206`;
                    if (data.success >= 1) {
                        window.triggerFileListReload();
                    }
                    const errorMsgElement = currentForm.querySelector('.box__error span');
                    if (!data.success && errorMsgElement) {
                        errorMsgElement.textContent = data.message;
                        label.innerHTML += `<p>${data.message}</p>`;
                    }

                    if (hasMoreBatches) {
                        processUploadQueue(currentForm); // Trigger the next batch, passing the form
                    } else {
                        label.innerHTML += '<p><b>Upload complete.<b></p>';
                    }

                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    alert('Error processing server response.');
                    currentForm.classList.add('is-error');
                    
                    label.innerHTML += '<p>Invalid server response.</p>';
                    currentForm.isSubmitting = false; // Allow new submissions even on error
                    currentForm.uploadQueue = []; // Clear the queue on error
                }
            };
            ajax.onerror = function() {
                currentForm.classList.remove('is-uploading');
                alert('Error. Please, try again!');
                currentForm.classList.add('is-error');
                const errorMsgElement = currentForm.querySelector('.box__error span');
                if (errorMsgElement) errorMsgElement.textContent = 'Network error.';
                currentForm.isSubmitting = false; // Allow new submissions even on error
                currentForm.uploadQueue = []; // Clear the queue on error
            };

            ajax.send(ajaxData);
        };

        // Restart the form if has a state of error/success
        Array.prototype.forEach.call(restartButtons, function(entry) {
            entry.addEventListener('click', function(e) {
                e.preventDefault();
                const fileInput = document.getElementById('file');
               
                if (fileInput) fileInput.value = '';
                
                form.classList.remove('is-error', 'is-success');
                input.click();
            });
        });

        input.addEventListener('focus', function() {
            input.classList.add('has-focus');
        });
        input.addEventListener('blur', function() {
            input.classList.remove('has-focus');
        });
    };
});