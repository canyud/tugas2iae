document.addEventListener('DOMContentLoaded', function() {
    const agendaForm = document.getElementById('agendaForm');
    let isEditing = false;

    // Load agendas on page load
    fetchAgendas();

    // Form submission
    agendaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const agendaData = {
            nama: document.getElementById('nama').value,
            tanggal: document.getElementById('tanggal').value,
            jam: document.getElementById('jam').value,
            lokasi: document.getElementById('lokasi').value || null,
            deskripsi: document.getElementById('deskripsi').value || null
        };

        const agendaId = document.getElementById('agendaId').value;

        if (isEditing) {
            updateAgenda(agendaId, agendaData);
        } else {
            createAgenda(agendaData);
        }
    });

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', resetForm);

    // Fetch all agendas
    function fetchAgendas() {
        fetch('/api/agendas')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => displayAgendas(data))
            .catch(error => {
                console.error('Error:', error);
                alert('Gagal memuat agenda: ' + error.message);
            });
    }

    // Create new agenda
    function createAgenda(agendaData) {
        fetch('/api/agendas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendaData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Gagal menyimpan agenda');
            return response.json();
        })
        .then(() => {
            resetForm();
            fetchAgendas();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal menyimpan agenda: ' + error.message);
        });
    }

    // Update agenda
    function updateAgenda(id, agendaData) {
        fetch(`/api/agendas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendaData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Gagal memperbarui agenda');
            return response.json();
        })
        .then(() => {
            resetForm();
            fetchAgendas();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal memperbarui agenda: ' + error.message);
        });
    }

    // Delete agenda
    function deleteAgenda(id) {
        if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
            fetch(`/api/agendas/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) throw new Error('Gagal menghapus agenda');
                fetchAgendas();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Gagal menghapus agenda: ' + error.message);
            });
        }
    }

    // Display agendas
    function displayAgendas(agendas) {
        const agendaList = document.getElementById('agendaList');
        agendaList.innerHTML = '';
        
        if (agendas.length === 0) {
            agendaList.innerHTML = '<div class="col"><p class="text-muted">Tidak ada agenda.</p></div>';
            return;
        }

        agendas.forEach(agenda => {
            const col = document.createElement('div');
            col.className = 'col';
            
            col.innerHTML = `
                <div class="card agenda-card h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${agenda.nama}</h5>
                        <p class="card-text agenda-date">
                            <i class="bi bi-calendar"></i> ${agenda.tanggal} 
                            <i class="bi bi-clock ms-2"></i> ${agenda.jam}
                        </p>
                        ${agenda.lokasi ? `<p class="card-text"><i class="bi bi-geo-alt"></i> ${agenda.lokasi}</p>` : ''}
                        ${agenda.deskripsi ? `<p class="card-text">${agenda.deskripsi}</p>` : ''}
                        <div class="agenda-actions mt-auto">
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="editAgenda(${agenda.id})">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteAgenda(${agenda.id})">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            agendaList.appendChild(col);
        });
    }

    // Edit agenda
    window.editAgenda = function(id) {
        fetch(`/api/agendas/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Gagal memuat agenda');
                return response.json();
            })
            .then(agenda => {
                document.getElementById('agendaId').value = agenda.id;
                document.getElementById('nama').value = agenda.nama;
                document.getElementById('tanggal').value = agenda.tanggal;
                document.getElementById('jam').value = agenda.jam;
                document.getElementById('lokasi').value = agenda.lokasi || '';
                document.getElementById('deskripsi').value = agenda.deskripsi || '';
                
                isEditing = true;
                document.getElementById('submitBtn').textContent = 'Update';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Gagal memuat agenda: ' + error.message);
            });
    }

    // Delete agenda (global function)
    window.deleteAgenda = function(id) {
        deleteAgenda(id);
    }

    // Reset form
    function resetForm() {
        agendaForm.reset();
        document.getElementById('agendaId').value = '';
        isEditing = false;
        document.getElementById('submitBtn').textContent = 'Simpan';
    }
});