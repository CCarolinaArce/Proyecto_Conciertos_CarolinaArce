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
        document.getElementById('form-city').addEventListener('submit', (e) => this.saveCity(e));
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
            customAlert("¡Bienvenido al Panel de Administración!");
        } else {
            customAlert("Credenciales incorrectas. Intenta de nuevo.", "Error de autenticación");
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
        this.navigate('overview'); 
    },

   // --- NAVEGACIÓN SPA (DASHBOARD) ---
    navigate: function(subView) {
        // Ocultar todas las sub-vistas
        document.querySelectorAll('.sub-view').forEach(v => v.style.display = 'none');
        document.getElementById(`subview-${subView}`).style.display = 'block';

        // Actualizar botones del nav
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        if(event) event.currentTarget.classList?.add('active');

        // Renderizar datos correspondientes
        if (subView === 'overview') this.renderOverview(); // <-- NUEVO
        if (subView === 'cities') this.renderCities();
        if (subView === 'categories') this.renderCategories();
        if (subView === 'events') {
            this.updateCategorySelect();
            this.updateCitySelect();
            this.renderEvents();
        }
        if (subView === 'sales') this.renderSales();
    },

    // --- MÓDULO: VISTA GENERAL (DASHBOARD) ---
    renderOverview: function() {
        const events = getData('events');
        const sales = getData('sales');
        const categories = getData('categories');

        // 1. Calcular y renderizar Totales con el Web Component
        const totalEvents = events.length;
        const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
        const totalCategories = categories.length;

        const kpiContainer = document.getElementById('kpi-grid'); // Asumiendo que este ID existe en tu HTML
        kpiContainer.innerHTML = `
            <kpi-card data-label="Total Ventas" data-value="$${totalSales.toLocaleString('es-CO')}" data-icon="point_of_sale"></kpi-card>
            <kpi-card data-label="Eventos Activos" data-value="${totalEvents}" data-icon="festival"></kpi-card>
            <kpi-card data-label="Categorías" data-value="${totalCategories}" data-icon="category"></kpi-card>
        `;

        // 2. Pintar los próximos eventos (Tomamos los primeros 3)
        const overviewEventsList = document.getElementById('overview-events-list');
        
        // Ordenar eventos por fecha más próxima (opcional, aquí solo limitamos a 3 para el resumen)
        const recentEvents = events.slice(0, 3); 

        if (recentEvents.length === 0) {
            overviewEventsList.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No hay eventos programados.</td></tr>`;
            return;
        }

        overviewEventsList.innerHTML = recentEvents.map(ev => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <div style="width: 35px; height: 45px; background: linear-gradient(135deg, var(--primary) 0%, #ff7eb3 100%); border-radius: 8px;"></div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-main); font-size: 0.95rem;">${ev.name}</h4>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${ev.date.split('-')[0]}</span> </div>
                    </div>
                </td>
                <td><span class="badge-category">${ev.category}</span></td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">
                    ${ev.date}<br>
                    <span style="font-size: 0.75rem;">${ev.time}</span>
                </td>
            </tr>
        `).join('');
    },

    toggleForm: function(formId) {
        const form = document.getElementById(formId);
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
        
        if(formId === 'category-form-container') {
            document.getElementById('form-category').reset();
            document.getElementById('cat-id').value = '';
            document.getElementById('cat-form-title').innerText = 'Agregar Categoría';
        } else if (formId === 'city-form-container') {
            document.getElementById('form-city').reset();
            document.getElementById('city-id-original').value = '';
            document.getElementById('city-form-title').innerText = 'Agregar Ciudad';
            document.getElementById('city-code').readOnly = false;
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
            customAlert("Categoría actualizada.");
        } else {
            // Crear
            const newId = cats.length > 0 ? Math.max(...cats.map(c => c.id)) + 1 : 1;
            cats.push({ id: newId, name, desc });
            customAlert("Categoría creada exitosamente.");
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

    deleteCategory: async function(id) {
        if(await customConfirm("¿Estás seguro de eliminar esta categoría?")) {
            let cats = getData('categories');
            cats = cats.filter(c => c.id != id);
            saveData('categories', cats);
            this.renderCategories();
            customAlert("Categoría eliminada.");
        }
    },

    // --- MÓDULO: CIUDADES ---
    renderCities: function() {
        const cities = getData('cities');
        const container = document.getElementById('admin-cities-list');
        container.innerHTML = cities.map(city => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${city.name}</h4>
                    <p>Código: ${city.code}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="adminApp.editCity('${city.code}')"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn-icon danger" onclick="adminApp.deleteCity('${city.code}')"><span class="material-symbols-outlined">delete</span></button>
                </div>
            </div>
        `).join('');
    },
    // * Función para agregar y guardar ciudades.
    saveCity: function(e) {
        e.preventDefault();
        const originalCode = document.getElementById('city-id-original').value;
        const code = document.getElementById('city-code').value.toUpperCase();
        const name = document.getElementById('city-name').value;
        
        let cities = getData('cities');

        if (originalCode) {
            // Actualizar
            const index = cities.findIndex(c => c.code === originalCode);
            if (index !== -1) {
                cities[index].name = name;
                customAlert("Ciudad actualizada.");
            }
        } else {
            // Crear
            if (cities.find(c => c.code === code)) {
                customAlert("El código de la ciudad ya existe.", "Error");
                return;
            }
            cities.push({ code, name });
            customAlert("Ciudad creada exitosamente.");
        }

        saveData('cities', cities);
        this.toggleForm('city-form-container');
        this.renderCities();
    },

    editCity: function(code) {
        const city = getData('cities').find(c => c.code === code);
        if(!city) return;
        document.getElementById('city-id-original').value = city.code;
        document.getElementById('city-code').value = city.code;
        document.getElementById('city-code').readOnly = true;
        document.getElementById('city-name').value = city.name;
        document.getElementById('city-form-title').innerText = 'Editar Ciudad';
        document.getElementById('city-form-container').style.display = 'block';
        window.scrollTo(0,0);
    },

    deleteCity: async function(code) {
        if(await customConfirm("¿Estás seguro de eliminar esta ciudad?")) {
            let cities = getData('cities');
            cities = cities.filter(c => c.code !== code);
            saveData('cities', cities);
            this.renderCities();
            customAlert("Ciudad eliminada.");
        }
    },

    // --- MÓDULO: EVENTOS ---
    updateCategorySelect: function() {
        const cats = getData('categories');
        const select = document.getElementById('ev-category');
        select.innerHTML = '<option value="">Seleccionar Categoría</option>' + 
            cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    },

    updateCitySelect: function() {
        const cities = getData('cities');
        const select = document.getElementById('ev-city');
        select.innerHTML = '<option value="">Seleccionar Ciudad</option>' + 
            cities.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
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
                customAlert("Ya existe un evento con ese código.", "Error");
                return;
            }
            events.push(eventData);
            customAlert("Evento creado exitosamente.");
        } else {
            const index = events.findIndex(ev => ev.id === eventData.id);
            events[index] = eventData;
            customAlert("Evento actualizado.");
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

    deleteEvent: async function(id) {
        if(await customConfirm(`¿Estás seguro de eliminar el evento ${id}?`)) {
            let events = getData('events');
            events = events.filter(e => e.id !== id);
            saveData('events', events);
            this.renderEvents();
            customAlert("Evento eliminado.");
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

        customAlert(`Fecha: ${sale.date}
Cliente: ${sale.buyer.name} (ID: ${sale.buyer.id})
Email: ${sale.buyer.email}
Teléfono: ${sale.buyer.phone}
Dirección: ${sale.buyer.address}

Eventos comprados:
${sale.items.map(i => `- ${i.qty}x ${i.name}`).join('\n')}

TOTAL: $${Number(sale.total).toLocaleString('es-CO')}`, `Detalles de la Compra: ${sale.id}`);
    }
};

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});