function actualizarPanel() {
    const contenedor = document.getElementById('status-container');

    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                contenedor.innerHTML = '<p class="empty-msg">No hay dispositivos en el registro.</p>';
                return;
            }

            let html = '<div class="grid-container">';
            data.forEach(equipo => {
                const claseEstado = equipo.estado.toLowerCase();
                
                // Si está online y tiene servicios, los preparamos
                let serviciosHtml = '';
                if (equipo.estado === "Online" && equipo.servicios.length > 0) {
                    serviciosHtml = `<div class="services-list">
                                        <small>Servicios: ${equipo.servicios.join(', ')}</small>
                                     </div>`;
                }

                html += `
                    <div class="card device-${claseEstado}">
                        <div class="card-header">
                            <h3>${equipo.nombre}</h3>
                            <span class="badge ${claseEstado}">${equipo.estado}</span>
                        </div>
                        <div class="card-body">
                            <p class="ip-text">Dirección IP: <code>${equipo.ip}</code></p>
                            ${serviciosHtml}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            contenedor.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
            contenedor.innerHTML = '<p class="error-msg">Error de comunicación con el servidor de monitoreo.</p>';
        });
}

actualizarPanel();
setInterval(actualizarPanel, 2000);