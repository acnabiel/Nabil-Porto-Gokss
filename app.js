/* ========================================
   Profile Page CRUD - app.js
   Token: nabil123
   Data stored in localStorage
   ======================================== */

var ADMIN_TOKEN = "nabil123";
var pendingType = null; // 'project' or 'certificate'

// Default data
var DEFAULT_PROJECTS = [
    { id: 1, title: "ACP-SYSTEM Project", desc: "Platform Sistem website internal untuk mengelola aktivitas siswa, kelas, materi, dan penilaian dalam program Axioo Class.", image: "assets/images/ACP.png", tags: ["Laravel 12","MySQL","Tailwind"] },
    { id: 2, title: "SFI Intel Axioo Class", desc: "SFI (Skills for Innovation) adalah program dari Intel yang bekerja sama dengan Axioo untuk meningkatkan kemampuan siswa & guru.", image: "assets/images/sfi.png", tags: ["Laravel 7","MySQL","JavaScript"] },
    { id: 3, title: "Website Angkatan Sekolah", desc: "Website yang berisikan informasi tentang angkatan sekolah & kenangan-kenangan satu angkatan sekolah seperti E-book years.", image: "assets/images/AKSARA.png", tags: ["Laravel 12","Tailwind","MySQL"] }
];

var DEFAULT_CERTIFICATES = [
    { id: 1, title: "Sertifikat Web Developer Junior", desc: "Sertifikasi keahlian dasar web development HTML, CSS, dan JavaScript dari BNSP.", image: "https://images.unsplash.com/photo-1544265434-6c39dd89dcc3?auto=format&fit=crop&q=80&w=400", tags: ["BNSP","Kompeten","2023"] },
    { id: 2, title: "Peserta LKS Web Tech", desc: "Sertifikat penghargaan sebagai peserta Lomba Kompetensi Siswa bidang Web Technologies tingkat Provinsi.", image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80&w=400", tags: ["LKS","Web Tech","2024"] }
];

// State
var projects = [];
var certificates = [];

function loadData() {
    var sp = localStorage.getItem('nabil_projects');
    var sc = localStorage.getItem('nabil_certificates');
    projects = sp ? JSON.parse(sp) : JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
    certificates = sc ? JSON.parse(sc) : JSON.parse(JSON.stringify(DEFAULT_CERTIFICATES));
    if (!sp) saveData();
    if (!sc) saveData();
}

function saveData() {
    localStorage.setItem('nabil_projects', JSON.stringify(projects));
    localStorage.setItem('nabil_certificates', JSON.stringify(certificates));
}

function isAdmin() {
    return sessionStorage.getItem('nabil_admin') === 'true';
}

// ===== RENDERING =====
function renderAll() {
    renderCards('projects-container', projects, 'project');
    renderCards('certificates-container', certificates, 'certificate');
    if (typeof AOS !== 'undefined') setTimeout(function(){ AOS.refresh(); }, 100);
}

function renderCards(containerId, dataArr, type) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var html = '';
    for (var i = 0; i < dataArr.length; i++) {
        html += buildCard(dataArr[i], type);
    }
    if (dataArr.length === 0) {
        html = '<div class="col-span-full text-center py-16"><p class="text-gray-500 text-lg">Belum ada data. Klik tombol di atas untuk menambahkan.</p></div>';
    }
    container.innerHTML = html;
}

function buildCard(item, type) {
    var tagsHtml = '';
    var colors = type === 'project' ? ['neon-blue','neon-purple'] : ['neon-purple','pink-500'];
    for (var t = 0; t < item.tags.length; t++) {
        tagsHtml += '<span class="px-3 py-1 glass rounded-full text-xs text-' + colors[0] + ' border border-' + colors[0] + '/20">' + item.tags[t] + '</span>';
    }

    var adminHtml = '';
    if (isAdmin()) {
        adminHtml = '<div class="absolute top-3 right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">' +
            '<button onclick="editItem(\'' + type + '\',' + item.id + ')" class="p-2 bg-yellow-500/90 rounded-lg text-white hover:bg-yellow-400 transition shadow-lg backdrop-blur-sm" title="Edit">' +
            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>' +
            '<button onclick="deleteItem(\'' + type + '\',' + item.id + ')" class="p-2 bg-red-500/90 rounded-lg text-white hover:bg-red-400 transition shadow-lg backdrop-blur-sm" title="Hapus">' +
            '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>';
    }

    return '<div class="project-card gradient-border rounded-2xl overflow-hidden relative group" data-aos="fade-up">' +
        adminHtml +
        '<div class="card-top relative overflow-hidden h-52 bg-gradient-to-br from-' + colors[0] + '/20 to-' + colors[1] + '/20 flex items-center justify-center">' +
        '<img src="' + item.image + '" alt="' + item.title + '" class="absolute inset-0 w-full h-full object-cover" onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<div class="p-6 bg-dark-800">' +
        '<h3 class="text-lg font-bold mb-2 text-white">' + item.title + '</h3>' +
        '<p class="text-gray-400 text-sm mb-4 line-clamp-3">' + item.desc + '</p>' +
        '<div class="flex flex-wrap gap-2">' + tagsHtml + '</div>' +
        '</div></div>';
}

// ===== MODALS =====
function openAdminPanel(type) {
    pendingType = type;
    if (isAdmin()) {
        openFormModal(type, null);
    } else {
        showModal('auth-modal');
        document.getElementById('token-input').value = '';
        document.getElementById('token-error').classList.add('hidden');
        document.getElementById('token-input').focus();
    }
}

function verifyToken() {
    var val = document.getElementById('token-input').value;
    if (val === ADMIN_TOKEN) {
        sessionStorage.setItem('nabil_admin', 'true');
        hideModal('auth-modal');
        showToast('Login berhasil! Selamat datang Admin 🎉');
        renderAll();
        if (pendingType) {
            openFormModal(pendingType, null);
        }
    } else {
        document.getElementById('token-error').classList.remove('hidden');
        document.getElementById('token-input').classList.add('border-red-500');
        setTimeout(function() { document.getElementById('token-input').classList.remove('border-red-500'); }, 2000);
    }
}

function openFormModal(type, item) {
    document.getElementById('item-type').value = type;
    var titleEl = document.getElementById('form-title');
    resetUploadState();
    if (item) {
        titleEl.textContent = 'Edit ' + (type === 'project' ? 'Proyek' : 'Sertifikat');
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-title').value = item.title;
        document.getElementById('item-desc').value = item.desc;
        document.getElementById('item-tags').value = item.tags.join(', ');
        // Determine if stored image is a data URL or external link
        if (item.image && (item.image.startsWith('data:') || item.image.startsWith('blob:'))) {
            switchImageSource('upload');
            document.getElementById('item-image-data').value = item.image;
            showUploadPreview(item.image, 'File tersimpan');
        } else {
            switchImageSource('link');
            var imgInput = document.getElementById('item-image');
            if (imgInput) imgInput.value = item.image || '';
        }
    } else {
        titleEl.textContent = 'Tambah ' + (type === 'project' ? 'Proyek' : 'Sertifikat');
        document.getElementById('crud-form').reset();
        document.getElementById('item-id').value = '';
        document.getElementById('item-image-data').value = '';
        switchImageSource('upload');
    }
    showModal('form-modal');
}

function showModal(id) {
    var el = document.getElementById(id);
    el.classList.remove('hidden');
    el.classList.add('flex');
}

function hideModal(id) {
    var el = document.getElementById(id);
    el.classList.add('hidden');
    el.classList.remove('flex');
}

function closeAllModals() {
    hideModal('auth-modal');
    hideModal('form-modal');
    pendingType = null;
}

// ESC to close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAllModals();
});

// Enter on token input
document.addEventListener('DOMContentLoaded', function() {
    var tokenInput = document.getElementById('token-input');
    if (tokenInput) {
        tokenInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); verifyToken(); }
        });
    }
});

// ===== CRUD =====
function submitForm(e) {
    e.preventDefault();
    var type = document.getElementById('item-type').value;
    var idVal = document.getElementById('item-id').value;
    var title = document.getElementById('item-title').value.trim();
    var desc = document.getElementById('item-desc').value.trim();
    var tagsStr = document.getElementById('item-tags').value;
    var tags = tagsStr.split(',').map(function(t){ return t.trim(); }).filter(function(t){ return t.length > 0; });

    // Determine image from either upload or link
    var image = '';
    var imageData = document.getElementById('item-image-data');
    var imageLink = document.getElementById('item-image');
    var uploadArea = document.getElementById('upload-area');

    if (uploadArea && !uploadArea.classList.contains('hidden')) {
        // Upload mode
        image = imageData ? imageData.value : '';
    } else {
        // Link mode
        image = imageLink ? imageLink.value.trim() : '';
    }

    if (!image) {
        showToast('Harap upload file atau masukkan link gambar! ⚠️');
        return;
    }

    var arr = type === 'project' ? projects : certificates;
    var obj = { id: idVal ? parseInt(idVal) : Date.now(), title: title, desc: desc, image: image, tags: tags };

    if (idVal) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == idVal) { arr[i] = obj; break; }
        }
        showToast('Data berhasil diupdate! ✏️');
    } else {
        arr.push(obj);
        showToast('Data berhasil ditambahkan! ✅');
    }

    saveData();
    renderAll();
    closeAllModals();
}

function editItem(type, id) {
    var arr = type === 'project' ? projects : certificates;
    var item = null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) { item = arr[i]; break; }
    }
    if (item) openFormModal(type, item);
}

function deleteItem(type, id) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    if (type === 'project') {
        projects = projects.filter(function(x){ return x.id !== id; });
    } else {
        certificates = certificates.filter(function(x){ return x.id !== id; });
    }
    saveData();
    renderAll();
    showToast('Data berhasil dihapus! 🗑️');
}

// ===== TOAST =====
function showToast(msg) {
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.animation = 'none';
    toast.offsetHeight; // reflow
    toast.style.animation = '';
    setTimeout(function() { toast.classList.add('hidden'); }, 3000);
}

// ===== FILE UPLOAD =====
var currentImageSource = 'upload'; // 'upload' or 'link'

function switchImageSource(mode) {
    currentImageSource = mode;
    var uploadArea = document.getElementById('upload-area');
    var linkArea = document.getElementById('link-area');
    var btnUpload = document.getElementById('btn-upload');
    var btnLink = document.getElementById('btn-link');
    if (!uploadArea || !linkArea) return;

    if (mode === 'upload') {
        uploadArea.classList.remove('hidden');
        linkArea.classList.add('hidden');
        if (btnUpload) btnUpload.classList.add('active');
        if (btnLink) btnLink.classList.remove('active');
    } else {
        uploadArea.classList.add('hidden');
        linkArea.classList.remove('hidden');
        if (btnUpload) btnUpload.classList.remove('active');
        if (btnLink) btnLink.classList.add('active');
    }
}

function resetUploadState() {
    var placeholder = document.getElementById('upload-placeholder');
    var preview = document.getElementById('upload-preview');
    var fileInput = document.getElementById('file-input');
    var imageData = document.getElementById('item-image-data');
    if (placeholder) placeholder.classList.remove('hidden');
    if (preview) preview.classList.add('hidden');
    if (fileInput) fileInput.value = '';
    if (imageData) imageData.value = '';
}

function handleFileSelect(e) {
    var file = e.target.files[0];
    if (!file) return;
    processFile(file);
}

function processFile(file) {
    var maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        showToast('File terlalu besar! Maksimal 2MB ⚠️');
        return;
    }

    var validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (validTypes.indexOf(file.type) === -1) {
        showToast('Format tidak didukung! Gunakan PNG, JPG, atau PDF ⚠️');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(ev) {
        var dataUrl = ev.target.result;
        document.getElementById('item-image-data').value = dataUrl;

        if (file.type === 'application/pdf') {
            showUploadPreview(null, file.name, true);
        } else {
            showUploadPreview(dataUrl, file.name, false);
        }
    };
    reader.readAsDataURL(file);
}

function showUploadPreview(imgSrc, fileName, isPdf) {
    var placeholder = document.getElementById('upload-placeholder');
    var preview = document.getElementById('upload-preview');
    var previewImg = document.getElementById('preview-img');
    var previewName = document.getElementById('preview-name');

    if (placeholder) placeholder.classList.add('hidden');
    if (preview) preview.classList.remove('hidden');
    if (previewName) previewName.textContent = fileName || '';

    if (isPdf) {
        if (previewImg) {
            previewImg.style.display = 'none';
        }
        if (previewName) previewName.textContent = '📄 ' + fileName;
    } else if (imgSrc) {
        if (previewImg) {
            previewImg.style.display = 'block';
            previewImg.src = imgSrc;
        }
    }
}

// Drag and drop
document.addEventListener('DOMContentLoaded', function() {
    var dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            var files = e.dataTransfer.files;
            if (files.length > 0) {
                processFile(files[0]);
            }
        });
    }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderAll();
});
