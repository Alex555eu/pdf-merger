(function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    let tmpFileList = null;

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('drag-over');
        const files = event.dataTransfer.files;
        const fileInputFiles = [...fileInput.files];
        updateFileContainers(fileInputFiles, files);
    });

    dropArea.addEventListener('click', () => {
        tmpFileList = fileInput.files;
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        const fileInputFiles = [...tmpFileList];
        updateFileContainers(fileInputFiles, files);
    });

    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.id = file.name;
        fileItem.innerHTML = `
        <span>${file.name}</span>
        <button class="delete-btn">delete</button>
        `;
        const deleteBtn = fileItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            fileItem.remove();
            let updatedFilesList = [...fileInput.files].filter(item => item !== file);
            updateFileContainers(updatedFilesList, null); // overwriting fileInput with files excluding the deleted one
        });
        fileList.appendChild(fileItem);
    }

    function updateFileContainers(oldFiles, newFiles) { // newFiles append oldFiles, file containers consist of dom list and <input> file storage
        const dataTransfer = new DataTransfer();
        oldFiles.forEach(file => {
            dataTransfer.items.add(file);
        });
        if (newFiles) {
            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i];
                if (file && file.type === 'application/pdf') {
                    const fileWithUpdatedName = updateFileName(oldFiles, file);
                    addFileToList(fileWithUpdatedName);
                    dataTransfer.items.add(fileWithUpdatedName);
                } else {
                    alert("Invalid file type. Please upload a PDF.");
                }
            }
        }
        fileInput.files = dataTransfer.files;
    }

    function updateFileName(oldFiles, file) {
        const fileNameBase = file.name.replace('.pdf', '');
        let fileName = file.name;
        let index = 1;

        while(oldFiles.some(item => item.name === fileName)) {
            fileName = `${fileNameBase} (${index}).pdf`;
            index++;
        }

        return new File([file], fileName, {type: file.type});
    }

})();


