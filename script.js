// Fungsi untuk menangani pratinjau gambar setelah di-upload + hapus gambar
function setupImageUpload(inputId, imgId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    const label = document.querySelector(`[for="${inputId}"]`);
    const box = document.getElementById(inputId).parentElement; 

    // Buat tombol hapus
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.style.display = "none";
    box.appendChild(deleteBtn);

    input.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                img.src = e.target.result;
                img.style.display = 'block';
                if (label) label.style.display = 'none';
                deleteBtn.style.display = 'block';
            };
            
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Aksi tombol hapus
    deleteBtn.addEventListener('click', function() {
        img.src = "";
        img.style.display = "none";
        input.value = ""; 
        if (label) label.style.display = 'flex';
        deleteBtn.style.display = "none";
    });
}

// Fungsi untuk memperbarui detail laporan (subtitle dan footer) secara dinamis
function updateReportDetails() {
    const area = document.getElementById('input-area').value || 'Area [Belum diisi]';
    const gedung = document.getElementById('input-gedung').value || 'Gedung [Belum diisi]';
    const periode = document.getElementById('input-periode').value || 'Periode [Belum diisi]';
    const tanggalInput = document.getElementById('input-tanggal').value;

    let tanggalTampil = 'Tanggal [Belum diisi]';
    if (tanggalInput) {
        const dateParts = tanggalInput.split('-');
        if (dateParts.length === 3) {
            tanggalTampil = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
    }
    
    const subtitleElement = document.getElementById('subtitle');
    if (subtitleElement) {
        subtitleElement.textContent = `${gedung} - ${area} - ${periode} | TANGGAL ${tanggalTampil}`;
    }

    const footerElement = document.getElementById('footer-location-date');
    if (footerElement) {
        footerElement.textContent = `${tanggalTampil} | ${gedung}`; 
    }
}

// Inisialisasi fungsionalitas:
document.addEventListener('DOMContentLoaded', (event) => {
    setupImageUpload('upload-before', 'img-before');
    setupImageUpload('upload-progress', 'img-progress');
    setupImageUpload('upload-after', 'img-after');

    updateReportDetails(); 

    document.getElementById('input-area')?.addEventListener('change', updateReportDetails);
    document.getElementById('input-gedung')?.addEventListener('input', updateReportDetails);
    document.getElementById('input-periode')?.addEventListener('input', updateReportDetails);
    document.getElementById('input-tanggal')?.addEventListener('change', updateReportDetails);
});

// Fungsi untuk mencetak laporan
function printReport() {
    window.print();
}
// Fungsi untuk resize image sebelum ditampilkan
function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;

            // Hitung rasio resize
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            // Render ke canvas
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Kembalikan dalam bentuk base64
            callback(canvas.toDataURL("image/jpeg", 0.5)); // 0.5 = quality
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Update di setupImageUpload
function setupImageUpload(inputId, imgId) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    const label = document.querySelector(`[for="${inputId}"]`);
    const box = document.getElementById(inputId).parentElement; 

    // Tombol hapus
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.style.display = "none";
    box.appendChild(deleteBtn);

    input.addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            resizeImage(event.target.files[0], 1280, 720, function(resizedDataUrl) {
                img.src = resizedDataUrl;
                img.style.display = 'block';
                if (label) label.style.display = 'none';
                deleteBtn.style.display = 'block';
            });
        }
    });

    deleteBtn.addEventListener('click', function() {
        img.src = "";
        img.style.display = "none";
        input.value = ""; 
        if (label) label.style.display = 'flex';
        deleteBtn.style.display = "none";
    });
}
