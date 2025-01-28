(function () {
    const mergeButton = document.getElementById('merge');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    mergeButton.addEventListener('click', postMergeRequest);

    /**
     * Function requesting merging of files and downloading merged result.
     *
     * Details:
     * - Files are extracted from <input> element.
     * - File names(unique) are extracted from DOM, where they have been ordered by user, specifying the merging order.
     * - Files are appended to form-data, according to user specified order (by file names).
     *
     */
    function postMergeRequest() {
        if (fileInput.files.length !== 1) { // if more than 1 file has been provided
            mergeButton.disabled = true;

            const endpoint = "/merge";
            const url = window.location.origin + endpoint;

            const formData = new FormData();
            const files = [...fileInput.files]; // unordered files stored in input

            const elements = fileList.querySelectorAll('div');
            const orderedFileNames = [...elements].map(item => item.id); // extracting user-ordered file names from DOM elements

            for (let i = 0; i < fileInput.files.length; i++) {
                const index = files.findIndex(item => item.name === orderedFileNames[i]);
                formData.append('files', fileInput.files[index]); // appending files according to specified order
            }

            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(async response => {
                    mergeButton.disabled = false;

                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }
                    const pdfBlob = await response.blob();

                    const pdfUrl = URL.createObjectURL(pdfBlob);

                    const a = document.createElement('a');
                    a.href = pdfUrl;
                    a.download = 'merged.pdf';
                    a.click();

                    URL.revokeObjectURL(pdfUrl);
                })
                .catch(error => {
                    console.error("Error during file upload:", error.message);
                });
        }
    }
})();