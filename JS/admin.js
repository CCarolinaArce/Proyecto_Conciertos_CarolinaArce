// js/admin.js

// --- LÓGICA DE INGRESO (LOGIN) ---
const loginForm = document.getElementById('admin-login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Valida el usuario (esto es solo de prueba, en la vida real se usa un backend seguro)
        if (email === 'admin@mail.com' && password === '123456') {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            window.location.hash = '#/dashboard';
        } else {
            alert('Credenciales incorrectas!!!.');
        }
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Elimina la llave de sesión y nos manda al login
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.hash = '#/login';
    });
}

    // --- NAVEGACIÓN ENTRE PESTAÑAS ---
    window.showSection = (sectionId) => {
        document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
        document.getElementById(`section-${sectionId}`).style.display = 'block';
        if(sectionId === 'events') updateCategorySelect();
    };

    // --- MÓDULO: CATEGORÍAS ---
    const formCategory = document.getElementById('form-category');
    const listCategories = document.getElementById('list-categories');

    const renderCategories = () => {
        const categories = Store.get('categories');
        listCategories.innerHTML = '';
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${cat.name}</strong> - ${cat.description}
                <button onclick="editCategory('${cat.id}')">Editar</button>
                <button onclick="deleteCategory('${cat.id}')">Eliminar</button>
            `;
            listCategories.appendChild(li);
        });
    };

    formCategory.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('cat-id').value;
        const name = document.getElementById('cat-name').value;
        const desc = document.getElementById('cat-desc').value;
        let categories = Store.get('categories');

        if (id) {
            // Si hay ID, estamos editando una categoría existente
            const index = categories.findIndex(c => c.id === id);
            categories[index] = { id, name, description: desc };
            alert('Categoría actualizada.');
        } else {
            // Si no hay ID, creamos una nueva
            categories.push({ id: Date.now().toString(), name, description: desc });
            alert('Categoría creada.');
        }

        // Guardamos los cambios y limpiamos la pantalla
        Store.save('categories', categories);
        formCategory.reset();
        document.getElementById('cat-id').value = '';
        renderCategories();
        updateCategorySelect();
    });

    // Rellena el formulario con los datos actuales para poder editarlos
    window.editCategory = (id) => {
        const cat = Store.get('categories').find(c => c.id === id);
        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-name').value = cat.name;
        document.getElementById('cat-desc').value = cat.description;
    };

    window.deleteCategory = (id) => {
        if(confirm('¿Estás seguro de eliminar esta categoría?')) {
            // Filtramos la lista para quedarnos solo con las categorías que NO coinciden con este id
            let categories = Store.get('categories').filter(c => c.id !== id);
            Store.save('categories', categories);
            renderCategories();
        }
    };

    // --- MÓDULO: EVENTOS ---
    const formEvent = document.getElementById('form-event');
    const listEvents = document.getElementById('list-events');
    const evCategorySelect = document.getElementById('ev-category');

    const updateCategorySelect = () => {
        const categories = Store.get('categories');
        evCategorySelect.innerHTML = '<option value="">Seleccione Categoría</option>';
        categories.forEach(cat => {
            evCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    };

    const renderEvents = () => {
        const events = Store.get('events');
        listEvents.innerHTML = '';
        events.forEach(ev => {
            listEvents.innerHTML += `
                <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 5px;">
                    <strong>[${ev.code}] ${ev.name}</strong> - ${ev.city} | $${ev.price}
                    <button onclick="editEvent('${ev.id}')">Editar</button>
                    <button onclick="deleteEvent('${ev.id}')">Eliminar</button>
                </div>
            `;
        });
    };

    formEvent.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('ev-id').value;
        const evData = {
            id: id || Date.now().toString(),
            code: document.getElementById('ev-code').value,
            name: document.getElementById('ev-name').value,
            categoryId: document.getElementById('ev-category').value,
            price: document.getElementById('ev-price').value,
            date: document.getElementById('ev-date').value,
            time: document.getElementById('ev-time').value,
            city: document.getElementById('ev-city').value,
            image: document.getElementById('ev-image').value,
            description: document.getElementById('ev-desc').value
        };

        let events = Store.get('events');
        if (id) {
            // Actualizar evento existente
            const index = events.findIndex(e => e.id === id);
            events[index] = evData;
            alert('Evento actualizado correctamente.');
        } else {
            // Crear nuevo evento
            events.push(evData);
            alert('Evento creado correctamente.');
        }

        Store.save('events', events);
        formEvent.reset();
        document.getElementById('ev-id').value = '';
        renderEvents();
    });

    window.editEvent = (id) => {
        const ev = Store.get('events').find(e => e.id === id);
        document.getElementById('ev-id').value = ev.id;
        document.getElementById('ev-code').value = ev.code;
        document.getElementById('ev-name').value = ev.name;
        document.getElementById('ev-category').value = ev.categoryId;
        document.getElementById('ev-price').value = ev.price;
        document.getElementById('ev-date').value = ev.date;
        document.getElementById('ev-time').value = ev.time;
        document.getElementById('ev-city').value = ev.city;
        document.getElementById('ev-image').value = ev.image;
        document.getElementById('ev-desc').value = ev.description;
    };

    window.deleteEvent = (id) => {
        if(confirm('¿Estás seguro de eliminar este evento?')) {
            let events = Store.get('events').filter(e => e.id !== id);
            Store.save('events', events);
            renderEvents();
        }
    };

    // --- MÓDULO: VENTAS ---
    const renderSales = () => {
        const sales = Store.get('sales');
        // Ordenamos las ventas de más reciente a más antigua usando sort()
        sales.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const tbody = document.getElementById('list-sales');
        tbody.innerHTML = '';

        sales.forEach(sale => {
            const dateStr = new Date(sale.date).toLocaleDateString();
            tbody.innerHTML += `
                <tr>
                    <td>${dateStr}</td>
                    <td>${sale.city}</td>
                    <td>${sale.buyer.name} (${sale.buyer.email})</td>
                    <td>$${sale.total}</td>
                    <td><button onclick="viewSaleDetail('${sale.id}')">Ver detalle</button></td>
                </tr>
            `;
        });
    };

    window.viewSaleDetail = (id) => {
        const sale = Store.get('sales').find(s => s.id === id);
        if (sale) {
            const itemsList = sale.items.map(i => `- ${i.name} ($${i.price})`).join('\n');
            alert(`Detalle de Venta:
Fecha: ${new Date(sale.date).toLocaleString()}
Cliente: ${sale.buyer.name}
RUT/DNI: ${sale.buyer.idNum}
Email: ${sale.buyer.email}
Teléfono: ${sale.buyer.phone}
------------------------
Eventos comprados:
${itemsList}
TOTAL: $${sale.total}`);
        }
    };

    // --- ENRUTADOR SPA DEL ADMINISTRADOR ---
    const adminRouter = () => {
        const hash = window.location.hash || '#/login';
        const loginSection = document.getElementById('admin-login-section');
        const dashboardSection = document.getElementById('admin-dashboard-section');

        if (hash === '#/dashboard') {
            // Seguridad: Si no tiene la sesión iniciada, lo devolvemos al login
            if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
                window.location.hash = '#/login';
                return;
            }
            if (loginSection) loginSection.style.display = 'none';
            if (dashboardSection) dashboardSection.style.display = 'block';
            
            // Inicializar vistas al entrar al dashboard
            renderCategories();
            renderEvents();
            renderSales();
            updateCategorySelect();
        } else {
            // Mostrar Login
            if (loginSection) loginSection.style.display = 'block';
            if (dashboardSection) dashboardSection.style.display = 'none';
        }
    };

    window.addEventListener('hashchange', adminRouter);
    adminRouter();
