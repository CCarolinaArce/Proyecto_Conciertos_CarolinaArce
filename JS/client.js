
const app = {
    // 1. Inicializar la aplicación
    init: function() {
        this.updateCartBadge();
        this.loadFilters();
        this.renderCatalog();
        
        // Listener para el formulario de checkout
        document.getElementById('form-checkout').addEventListener('submit', (e) => this.handleCheckout(e));
    },

    // 2. Navegación SPA (Cambio de vistas)
    navigate: function(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.spa-view').forEach(view => {
            view.classList.remove('active');
        });

        // Mostrar la vista solicitada
        document.getElementById(`view-${viewId}`).classList.add('active');

        // Actualizar los colores de la barra de navegación inferior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Si vamos al carrito, renderizamos sus items
        if (viewId === 'cart') {
            this.renderCart();
        }

        window.scrollTo(0, 0); // Regresar al inicio de la página
    },

    // 3. Renderizar el catálogo de eventos usando el Web Component
    renderCatalog: function(eventsData = getData('events')) {
        const grid = document.getElementById('events-grid');
        
        if (eventsData.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); margin-top: 40px;">
                    <span class="material-symbols-outlined" style="font-size: 40px;">sentiment_dissatisfied</span>
                    <p>No se encontraron eventos con esos filtros.</p>
                </div>`;
            return;
        }

        // Usamos el custom element <event-card> creado en components.js
        grid.innerHTML = eventsData.map(ev => `
            <event-card 
                data-id="${ev.id}"
                data-title="${ev.name}"
                data-price="${ev.price}"
                data-date="${ev.date}"
                data-city="${ev.city}"
                data-image="${ev.image}"
            ></event-card>
        `).join('');
    },

    // 4. Cargar categorías en el select y configurar listeners de los filtros
    loadFilters: function() {
        const categories = getData('categories');
        const catSelect = document.getElementById('filter-category');
        
        categories.forEach(cat => {
            catSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });

        // Configurar los detectores de cambio (event listeners)
        document.getElementById('search-input').addEventListener('input', () => this.applyFilters());
        document.getElementById('filter-city').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-category').addEventListener('change', () => this.applyFilters());
    },

    // 5. Aplicar los filtros en tiempo real
    applyFilters: function() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const city = document.getElementById('filter-city').value;
        const category = document.getElementById('filter-category').value;
        
        const allEvents = getData('events');
        
        const filtered = allEvents.filter(ev => {
            const matchName = ev.name.toLowerCase().includes(searchTerm);
            const matchCity = city ? ev.city === city : true;
            const matchCat = category ? ev.category === category : true;
            
            return matchName && matchCity && matchCat;
        });

        this.renderCatalog(filtered);
    },

    // 6. Vista Detalle del Evento
    showDetail: function(id) {
        const event = getData('events').find(e => e.id === id);
        if(!event) return;
        
        const detailContainer = document.getElementById('view-detail');
        detailContainer.innerHTML = `
            <div class="view-header" style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span class="material-symbols-outlined" onclick="app.navigate('home')" style="cursor: pointer; font-size: 24px; color: var(--primary);">arrow_back</span>
                <h2 style="margin: 0;">Detalles del Evento</h2>
            </div>
            
            <img src="${event.image}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 20px; margin-bottom: 20px; border: 1px solid var(--border);">
            
            <h2 style="color: var(--primary); margin-bottom: 5px; font-size: 1.8rem;">${event.name}</h2>
            
            <div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <span style="display: flex; align-items: center; gap: 5px;"><span class="material-symbols-outlined" style="font-size: 18px;">calendar_today</span> ${event.date} • ${event.time}</span>
                <span style="display: flex; align-items: center; gap: 5px;"><span class="material-symbols-outlined" style="font-size: 18px;">location_on</span> ${event.city}</span>
                <span style="display: flex; align-items: center; gap: 5px;"><span class="material-symbols-outlined" style="font-size: 18px;">category</span> ${event.category}</span>
            </div>
            
            <p style="margin-bottom: 30px; line-height: 1.6; color: #cbd5e1;">${event.desc}</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(168, 85, 247, 0.1); padding: 20px; border-radius: 15px; border: 1px solid var(--primary);">
                <div>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.8rem;">Entrada General</p>
                    <h3 style="margin: 0; font-size: 1.5rem;">$${Number(event.price).toLocaleString('es-CO')}</h3>
                </div>
                <button class="btn-primary" style="width: auto; padding: 12px 25px;" onclick="app.addToCart('${event.id}')">Agregar al Carrito</button>
            </div>
        `;
        
        this.navigate('detail');
    },

    // 7. Lógica del Carrito: Agregar
    addToCart: function(id) {
        const event = getData('events').find(e => e.id === id);
        if(!event) return;
        
        let cart = getData('cart');
        
        // Verificar si ya está en el carrito para sumar cantidad
        const existingItem = cart.find(item => item.id === id);
        if(existingItem) {
            existingItem.qty = (existingItem.qty || 1) + 1;
        } else {
            event.qty = 1; // Asignamos cantidad inicial
            cart.push(event);
        }
        
        saveData('cart', cart);
        this.updateCartBadge();
        
        // Mensaje de confirmación (Requisito del proyecto)
        alert(`¡Añadiste exitosamente una entrada para "${event.name}"!`);
    },

    // 8. Lógica del Carrito: Renderizar
    renderCart: function() {
        const cart = getData('cart');
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        
        if(cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 30px 0;">
                    <span class="material-symbols-outlined" style="font-size: 40px;">shopping_cart</span>
                    <p>Tu carrito está vacío.</p>
                </div>`;
            totalEl.innerText = '0';
            return;
        }
        
        let total = 0;
        container.innerHTML = cart.map((item) => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 15px; margin-bottom: 15px; border-radius: 15px; border: 1px solid var(--border);">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <img src="${item.image}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">
                        <div>
                            <h4 style="margin: 0; font-size: 1rem;">${item.name}</h4>
                            <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: var(--primary);">Cant: ${item.qty} x $${Number(item.price).toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                    <button onclick="app.removeFromCart('${item.id}')" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 8px; padding: 8px; cursor: pointer; display:flex; align-items:center;">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;
        }).join('');
        
        totalEl.innerText = total.toLocaleString('es-CO');
    },

    // 9. Lógica del Carrito: Eliminar
    removeFromCart: function(id) {
        let cart = getData('cart');
        cart = cart.filter(item => item.id !== id);
        saveData('cart', cart);
        
        this.updateCartBadge();
        this.renderCart(); // Re-renderizar para actualizar el total
    },

    // 10. Actualizar el contador de la burbuja flotante
    updateCartBadge: function() {
        const cart = getData('cart');
        // Sumamos las cantidades de todos los items
        const totalItems = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
        document.getElementById('cart-count').innerText = totalItems;
    },

    // 11. Procesar la compra (Checkout)
    handleCheckout: function(e) {
        e.preventDefault(); // Evitar que la página recargue
        
        const cart = getData('cart');
        if(cart.length === 0) {
            alert("No tienes eventos en el carrito para comprar.");
            return;
        }
        
        // Construir el objeto de la venta
        const sale = {
            id: 'VTA-' + Math.floor(Math.random() * 1000000), // Generador simple de ID de ticket
            date: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES'),
            buyer: {
                id: document.getElementById('buyer-id').value,
                name: document.getElementById('buyer-name').value,
                email: document.getElementById('buyer-email').value,
                phone: document.getElementById('buyer-phone').value,
                address: document.getElementById('buyer-address').value
            },
            items: cart,
            total: cart.reduce((acc, item) => acc + (item.price * item.qty), 0)
        };
        
        // Guardar la venta en el "servidor" (localStorage)
        let sales = getData('sales');
        sales.unshift(sale); // Guardarlo al inicio de la lista
        saveData('sales', sales);
        
        // Limpiar el carrito y el formulario
        saveData('cart', []);
        document.getElementById('form-checkout').reset();
        this.updateCartBadge();
        
        // Mensaje de éxito requerido por el proyecto
        alert(`¡Compra realizada con éxito!\nBoleta asignada: ${sale.id}\nTe esperamos en el evento.`);
        
        // Volver al inicio
        this.navigate('home');
    }
};

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});