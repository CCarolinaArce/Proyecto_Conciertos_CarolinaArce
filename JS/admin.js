// JS/admin.js

const adminApp = {
    init: function() {
        // Verificar si hay sesión activa en sessionStorage
        if (sessionStorage.getItem('adminLogged') === 'true') {
            this.showDashboard();
        }

        // Listener del Login
        document.getElementById('form-login').addEventListener('submit', (e) => this.login(e));
        
        // Listeners de los formularios CRUD
        document.getElementById('form-category').addEventListener('submit', (e) => this.saveCategory(e));
        document.getElementById('form-event').addEventListener('submit', (e) => this.saveEvent(e));
    },

    // --- AUTENTICACIÓN ---
    login: function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        
        const credentials = getData('adminCredentials');
        
        if (email === credentials.email && pass === credentials.password) {
            sessionStorage.setItem('adminLogged', 'true');
            this.showDashboard();
            alert("¡Bienvenido al Panel de Administración!");
        } else {
            alert("Credenciales incorrectas. Intenta de nuevo.");
        }
    },

    logout: function() {
        sessionStorage.removeItem('adminLogged');
        document.getElementById('view-dashboard').style.display = 'none';
        document.getElementById('view-login').style.display = 'flex';
        document.getElementById('form-login').reset();
    },

    showDashboard: function() {
        document.getElementById('view-login').style.display = 'none';
        document.getElementById('view-dashboard').style.display = 'flex';
        this.navigate('events'); // Cargar eventos por defecto
    },

    // --- NAVEGACIÓN SPA (DASHBOARD) ---
    navigate: function(subView) {
        // Ocultar todas las sub-vistas
        document.querySelectorAll('.sub-view').forEach(v => v.style.display = 'none');
        document.getElementById(`subview-${subView}`).style.display = 'block';

        // Actualizar botones del nav
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList?.add('active');

        // Renderizar datos correspondientes
        if (subView === 'categories') this.renderCategories();
        if (subView === 'events') {
            this.updateCategorySelect();
            this.renderEvents();
        }
        if (subView === 'sales') this.renderSales();
    },

    toggleForm: function(formId) {
        const form = document.getElementById(formId);
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        
        // Limpiar formularios al abrir/cerrar
        if(formId === 'category-form-container') {
            document.getElementById('form-category').reset();
            document.getElementById('cat-id').value = '';
            document.getElementById('cat-form-title').innerText = 'Agregar Categoría';
        } else {
            document.getElementById('form-event').reset();
            document.getElementById('ev-action').value = 'create';
            document.getElementById('event-form-title').innerText = 'Crear Nuevo Evento';
            document.getElementById('ev-id').readOnly = false;
        }
    },

    // --- MÓDULO: CATEGORÍAS ---
    renderCategories: function() {
        const cats = getData('categories');
        const container = document.getElementById('admin-categories-list');
        container.innerHTML = cats.map(cat => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${cat.name}</h4>
                    <p>${cat.desc}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="adminApp.editCategory(${cat.id})"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon danger" onclick="adminApp.deleteCategory(${cat.id})"><span class="material-symbols-outlined">delete</span></button>
                </div>
            </div>
        `).join('');
    },

    saveCategory: function(e) {
        e.preventDefault();
        const idInput = document.getElementById('cat-id').value;
        const name = document.getElementById('cat-name').value;
        const desc = document.getElementById('cat-desc').value;
        
        let cats = getData('categories');

        if (idInput) {
            // Actualizar
            const index = cats.findIndex(c => c.id == idInput);
            cats[index] = { id: Number(idInput), name, desc };
            alert("Categoría actualizada.");
        } else {
            // Crear
            const newId = cats.length > 0 ? Math.max(...cats.map(c => c.id)) + 1 : 1;
            cats.push({ id: newId, name, desc });
            alert("Categoría creada exitosamente.");
        }

        saveData('categories', cats);
        this.toggleForm('category-form-container');
        this.renderCategories();
    },

    editCategory: function(id) {
        const cat = getData('categories').find(c => c.id == id);
        if(!cat) return;
        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-name').value = cat.name;
        document.getElementById('cat-desc').value = cat.desc;
        document.getElementById('cat-form-title').innerText = 'Editar Categoría';
        document.getElementById('category-form-container').style.display = 'block';
        window.scrollTo(0,0);
    },

    deleteCategory: function(id) {
        if(confirm("¿Estás seguro de eliminar esta categoría?")) {
            let cats = getData('categories');
            cats = cats.filter(c => c.id != id);
            saveData('categories', cats);
            this.renderCategories();
            alert("Categoría eliminada.");
        }
    },

    // --- MÓDULO: EVENTOS ---
    updateCategorySelect: function() {
        const cats = getData('categories');
        const select = document.getElementById('ev-category');
        select.innerHTML = '<option value="">Seleccionar Categoría</option>' + 
            cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    },

    renderEvents: function() {
        const events = getData('events');
        const container = document.getElementById('admin-events-list');
        container.innerHTML = events.map(ev => `
            <div class="list-item">
                <div style="display:flex; gap: 15px; align-items:center;">
                    <img src="${ev.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">
                    <div class="item-info">
                        <h4>${ev.name} <span style="font-size:10px; background:var(--primary); color:white; padding:2px 6px; border-radius:10px;">${ev.id}</span></h4>
                        <p>${ev.city} • ${ev.date} • $${Number(ev.price).toLocaleString('es-CO')}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="adminApp.editEvent('${ev.id}')"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon danger" onclick="adminApp.deleteEvent('${ev.id}')"><span class="material-symbols-outlined">delete</span></button>
                </div>
            </div>
        `).join('');
    },

    saveEvent: function(e) {
        e.preventDefault();
        const action = document.getElementById('ev-action').value;
        const eventData = {
            id: document.getElementById('ev-id').value,
            name: document.getElementById('ev-name').value,
            category: document.getElementById('ev-category').value,
            city: document.getElementById('ev-city').value,
            date: document.getElementById('ev-date').value,
            time: document.getElementById('ev-time').value,
            price: Number(document.getElementById('ev-price').value),
            image: document.getElementById('ev-image').value,
            desc: document.getElementById('ev-desc').value
        };

        let events = getData('events');

        if (action === 'create') {
            // Validar que el ID no exista
            if(events.find(ev => ev.id === eventData.id)) {
                alert("Error: Ya existe un evento con ese código.");
                return;
            }
            events.push(eventData);
            alert("Evento creado exitosamente.");
        } else {
            const index = events.findIndex(ev => ev.id === eventData.id);
            events[index] = eventData;
            alert("Evento actualizado.");
        }

        saveData('events', events);
        this.toggleForm('event-form-container');
        this.renderEvents();
    },

    editEvent: function(id) {
        const ev = getData('events').find(e => e.id === id);
        if(!ev) return;
        
        document.getElementById('ev-action').value = 'update';
        document.getElementById('ev-id').value = ev.id;
        document.getElementById('ev-id').readOnly = true; // No permitir cambiar el ID
        document.getElementById('ev-name').value = ev.name;
        document.getElementById('ev-category').value = ev.category;
        document.getElementById('ev-city').value = ev.city;
        document.getElementById('ev-date').value = ev.date;
        document.getElementById('ev-time').value = ev.time;
        document.getElementById('ev-price').value = ev.price;
        document.getElementById('ev-image').value = ev.image;
        document.getElementById('ev-desc').value = ev.desc;
        
        document.getElementById('event-form-title').innerText = 'Editar Evento';
        document.getElementById('event-form-container').style.display = 'block';
        window.scrollTo(0,0);
    },

    deleteEvent: function(id) {
        if(confirm(`¿Estás seguro de eliminar el evento ${id}?`)) {
            let events = getData('events');
            events = events.filter(e => e.id !== id);
            saveData('events', events);
            this.renderEvents();
            alert("Evento eliminado.");
        }
    },

    // --- MÓDULO: VENTAS ---
    renderSales: function() {
        const sales = getData('sales');
        // El arreglo ya viene ordenado de la más reciente a la más antigua por el unshift en client.js
        const tbody = document.getElementById('admin-sales-list');
        
        if(sales.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">No hay ventas registradas aún.</td></tr>`;
            return;
        }

        tbody.innerHTML = sales.map(sale => `
            <tr>
                <td>${sale.date}</td>
                <td style="color: var(--primary); font-weight: bold;">${sale.id}</td>
                <td>${sale.buyer.name}</td>
                <td>${sale.buyer.city || 'N/A'}</td> <td>$${Number(sale.total).toLocaleString('es-CO')}</td>
                <td>
                    <button class="btn-icon" onclick="adminApp.viewSaleDetail('${sale.id}')" title="Ver Detalles">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    viewSaleDetail: function(id) {
        const sale = getData('sales').find(s => s.id === id);
        if(!sale) return;
        
        let itemsHtml = sale.items.map(item => `
            <li>${item.qty}x ${item.name} ($${Number(item.price * item.qty).toLocaleString('es-CO')})</li>
        `).join('');

        alert(`Detalles de la Compra: ${sale.id}\n
Fecha: ${sale.date}
Cliente: ${sale.buyer.name} (ID: ${sale.buyer.id})
Email: ${sale.buyer.email}
Teléfono: ${sale.buyer.phone}
Dirección: ${sale.buyer.address}

Eventos comprados:
${sale.items.map(i => `- ${i.qty}x ${i.name}`).join('\n')}

TOTAL: $${Number(sale.total).toLocaleString('es-CO')}`);
    }
};

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});