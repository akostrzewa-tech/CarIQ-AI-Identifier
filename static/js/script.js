function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
}


const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');
const loadingDiv = document.getElementById('loading');
const resultContainer = document.getElementById('result-container');
const resultContent = document.getElementById('result-content');

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        uploadFile(this.files[0]);
    }
});


async function uploadFile(file) {
    const previewImg = document.getElementById('result-image-preview');
    const reader = new FileReader();

    reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block'; // Pokaż zdjęcie
    }
    reader.readAsDataURL(file);

    // Pokaż ładowanie, ukryj stary wynik
    loadingDiv.style.display = 'block';
    resultContainer.style.display = 'none';
    dropZone.style.opacity = '0.5';
    dropZone.style.pointerEvents = 'none'; 

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            alert("Błąd: " + data.error);
        } else {
            resultContent.innerHTML = data.result;
            resultContainer.style.display = 'block';
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Wystąpił błąd podczas połączenia z serwerem.");
    } finally {
        loadingDiv.style.display = 'none';
        dropZone.style.opacity = '1';
        dropZone.style.pointerEvents = 'auto';
    }
}