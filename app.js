// --- 1. COMPONENTE: MODAL DE CONFIRMACIÓN (Eliminar) ---
class ModalConfirmacion extends HTMLElement {
    constructor() {
        super();
        this.onConfirm = null;
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
        <div class="modal-overlay" id="confirmOverlay" style="display: none;">
            <div class="form-card confirm-mini">
                <p id="confirmMsg" style="margin-bottom:20px; font-weight:bold;">¿Está seguro de eliminar este objeto?</p>
                <div class="form-actions" style="display:flex; justify-content: center; gap:10px;">
                    <button class="btn-new btn-si">Sí, eliminar</button>
                    <button class="btn-close-text">Cancelar</button>
                </div>
            </div>
        </div>`;
        this.querySelector('.btn-close-text').onclick = () => this.cerrar();
        this.querySelector('.btn-si').onclick = () => {
            if(this.onConfirm) this.onConfirm();
            this.cerrar();
        };
    }
    abrir(mensaje, callback) {
        this.querySelector('#confirmMsg').innerText = mensaje;
        this.onConfirm = callback;
        this.querySelector('.modal-overlay').style.display = 'flex';
    }
    cerrar() { this.querySelector('.modal-overlay').style.display = 'none'; }
}
customElements.define('modal-confirmacion', ModalConfirmacion);

// --- 2. COMPONENTE: MODAL DE DETALLE (Ver) ---
class ModalDetalle extends HTMLElement {
    connectedCallback() { this.render(); }
    render() {
        this.innerHTML = `
        <div class="modal-overlay" id="detailOverlay" style="display: none;">
            <div class="form-card" style="max-width: 800px;">
                <header class="form-header">
                    <h2>Detalles Completos</h2>
                    <button class="btn-close">×</button>
                </header>
                <div id="detailContent" class="form-body detail-grid"></div>
            </div>
        </div>`;
        this.querySelector('.btn-close').onclick = () => this.cerrar();
    }
    mostrar(data) {
        const content = this.querySelector('#detailContent');
        content.innerHTML = `
            <div class="form-image"><img src="${data.imagen}" style="width:100%; border-radius:4px;"></div>
            <div class="info-text" style="flex:1; padding-left:20px;">
                <p><strong>Dirección:</strong> ${data.direccion}</p>
                <p><strong>Tipo:</strong> ${data.tipo}</p>
                <p><strong>Precio:</strong> $${data.precio}</p>
                <p><strong>Ciudad:</strong> ${data.ciudad || 'N/A'}</p>
                <p><strong>Departamento:</strong> ${data.depto || 'N/A'}</p>
                <p><strong>Matrícula:</strong> ${data.matricula || 'N/A'}</p>
                <p><strong>Área:</strong> ${data.area || '0'} m2</p>
                <p><strong>Propietario:</strong> ${data.propietario || 'N/A'}</p>
                <p><strong>ID Propietario:</strong> ${data.id_prop || 'N/A'}</p>
            </div>`;
        this.querySelector('.modal-overlay').style.display = 'flex';
    }
    cerrar() { this.querySelector('.modal-overlay').style.display = 'none'; }
}
customElements.define('modal-detalle', ModalDetalle);

// --- 3. COMPONENTE: ITEM DE INMUEBLE ---
class InmuebleItem extends HTMLElement {
    connectedCallback() { this.render(); }
    render() {
        const d = JSON.parse(this.getAttribute('data-full'));
        this.innerHTML = `
            <article class="property-item">
                <img src="${d.imagen}" class="property-img">
                <span class="property-type">${d.tipo}</span>
                <span class="property-address">${d.direccion}</span>
                <span class="property-price">$${d.precio}</span>
                <div class="property-actions">
                    <button class="btn-action btn-ver">Ver</button>
                    <button class="btn-action btn-eliminar">Eliminar</button>
                </div>
            </article>`;
        
        this.querySelector('.btn-eliminar').onclick = () => {
            document.querySelector('modal-confirmacion').abrir(
                "¿Seguro que desea eliminar esta propiedad?", 
                () => {
                    this.remove();
                    document.dispatchEvent(new CustomEvent('actualizar-storage'));
                }
            );
        };
        this.querySelector('.btn-ver').onclick = () => {
            document.querySelector('modal-detalle').mostrar(d);
        };
    }
}
customElements.define('inmueble-item', InmuebleItem);

// --- 4. COMPONENTE: MODAL FORMULARIO ---
class ModalFormulario extends HTMLElement {
    connectedCallback() {
        this.render();
        const form = this.querySelector('#propertyForm');
        this.querySelector('.btn-close').onclick = () => this.cerrar();
        this.querySelector('#urlInput').oninput = (e) => {
            this.querySelector('#previewImg').src = e.target.value || 'https://via.placeholder.com/400x400';
        };
        form.onsubmit = (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            document.dispatchEvent(new CustomEvent('nuevo-inmueble', { detail: data }));
            this.cerrar();
            form.reset();
            this.querySelector('#previewImg').src = 'https://via.placeholder.com/400x400';
        };
    }
    render() {
        this.innerHTML = `
        <div class="modal-overlay" style="display: none;">
            <section class="form-card">
                <header class="form-header"><h2>Nuevo Inmueble</h2><button class="btn-close">×</button></header>
                <div class="form-body">
                    <div class="form-image"><img id="previewImg" src="https://via.placeholder.com/400x400"></div>
                    <form class="form-fields" id="propertyForm">
                        <div class="input-group full-width"><label>URL Imagen</label><input type="text" name="imagen" id="urlInput" required></div>
                        <div class="input-group"><label>Dirección</label><input type="text" name="direccion" required></div>
                        <div class="input-group"><label>Tipo</label><select name="tipo"><option>Casa</option><option>Apartamento</option></select></div>
                        <div class="input-group"><label>Ciudad</label><input type="text" name="ciudad"></div>
                        <div class="input-group"><label>Departamento</label><input type="text" name="depto"></div>
                        <div class="input-group"><label>Matrícula</label><input type="text" name="matricula"></div>
                        <div class="input-group"><label>Área (m2)</label><input type="text" name="area"></div>
                        <div class="input-group"><label>Propietario</label><input type="text" name="propietario"></div>
                        <div class="input-group"><label>Identificación</label><input type="text" name="id_prop"></div>
                        <div class="input-group full-width"><label>Valor</label><input type="text" name="precio" required></div>
                        <div class="form-actions"><button type="submit" class="btn-save">Guardar</button></div>
                    </form>
                </div>
            </section>
        </div>`;
    }
    abrir() { this.querySelector('.modal-overlay').style.display = 'flex'; }
    cerrar() { this.querySelector('.modal-overlay').style.display = 'none'; }
}
customElements.define('modal-formulario', ModalFormulario);

// --- 5. LÓGICA DE INICIALIZACIÓN Y STORAGE ---
document.addEventListener('DOMContentLoaded', () => {
    const btnNuevo = document.querySelector('.btn-new');
    const modalForm = document.querySelector('modal-formulario');
    const lista = document.querySelector('.property-list');
    const inputBusqueda = document.querySelector('.search-box input');

    // Cargar datos iniciales de localStorage
    const cargarDatos = () => {
        const guardados = JSON.parse(localStorage.getItem('inmuebles_acme')) || [];
        lista.innerHTML = '';
        guardados.forEach(data => crearElementoInmueble(data));
    };

    const guardarDatos = () => {
        const items = Array.from(lista.querySelectorAll('inmueble-item')).map(item => 
            JSON.parse(item.getAttribute('data-full'))
        );
        localStorage.setItem('inmuebles_acme', JSON.stringify(items));
    };

    const crearElementoInmueble = (data) => {
        const item = document.createElement('inmueble-item');
        item.setAttribute('data-full', JSON.stringify(data));
        lista.appendChild(item);
    };

    // Eventos
    btnNuevo.onclick = () => modalForm.abrir();

    document.addEventListener('nuevo-inmueble', (e) => {
        crearElementoInmueble(e.detail);
        guardarDatos();
    });

    document.addEventListener('actualizar-storage', () => {
        guardarDatos();
    });

    // Buscador
    inputBusqueda.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const items = lista.querySelectorAll('inmueble-item');
        items.forEach(item => {
            const data = JSON.parse(item.getAttribute('data-full'));
            const coincide = data.tipo.toLowerCase().includes(termino) || 
                             data.direccion.toLowerCase().includes(termino) || 
                             data.precio.toString().includes(termino);
            item.style.display = coincide ? 'block' : 'none';
        });
    });

    cargarDatos();
});