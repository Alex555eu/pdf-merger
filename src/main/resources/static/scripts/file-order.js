(function(){
    const moveUpButton = document.getElementById('move-up');
    const moveDownButton = document.getElementById('move-down');
    const fileList = document.getElementById('file-list');

    let selectedItem = null;

    moveUpButton.addEventListener('click', moveUp);
    moveDownButton.addEventListener('click', moveDown);

    fileList.addEventListener('click', (e) => {
        const item = e.target;
        const closest = item.closest('.file-item');
        if (item && !item.classList.contains('delete-btn')) {
            selectItem(closest);
        }
    })

    function selectItem(item) {
        if (selectedItem) {
            selectedItem.classList.remove('selected');
        }
        if (selectedItem === item) {
            selectedItem = null;
        } else {
            selectedItem = item;
            selectedItem.classList.add('selected');
        }
    }

    function moveUp() {
        if (!selectedItem) return;
        const prevItem = selectedItem.previousElementSibling;
        if (prevItem) {
            fileList.insertBefore(selectedItem, prevItem);
            scrollToElement(selectedItem);
        }
    }

    function moveDown() {
        if (!selectedItem) return;
        const nextItem = selectedItem.nextElementSibling;
        if (nextItem) {
            fileList.insertBefore(nextItem, selectedItem);
            scrollToElement(selectedItem);
        }
    }

    function scrollToElement(element) {
        const container = document.getElementById('file-list');

        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (rect.top < containerRect.top) {
            container.scrollTop -= (containerRect.top - rect.top);
        }

        if (rect.bottom > containerRect.bottom) {
            container.scrollTop += (rect.bottom - containerRect.bottom);
        }
    }
})();