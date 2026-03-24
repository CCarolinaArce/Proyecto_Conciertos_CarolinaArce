// JS/client.js

const app = {
    // 1. Inicializar la app
    init: function() {
        this.updateCartBadge();
        this.loadFilters();
        this.renderCatalog();
        
        // Listener del formulario de checkout
        document.getElementById('form-checkout').addEventListener('submit', (e) => this.handleCheckout(e));
    },

    // 2. Navegación SPA
    navigate: function(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.spa-view').forEach(view => {
            view.classList.remove('active');
        });

        // Mostrar la vista objetivo
        document.getElementById(`view-${viewId}`).classList.add('active');

        // Actualizar colores de la barra de navegación inferior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (event && event.currentTarget && event.currentTarget.classList.contains('nav-item')) {
            event.currentTarget.classList.add('active');
        }

        // Renderizar vistas específicas al entrar
        if (viewId === 'cart') this.renderCart();
        if (viewId === 'profile') this.renderProfile();

        window.scrollTo(0, 0);
    },

    // 3. Renderizar Catálogo (usando el Web Component)
    renderCatalog: function(eventsData = getData('events')) {
        const grid = document.getElementById('events-grid');
        
        if (eventsData.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); margin-top: 40px; grid-column: 1/-1;">
                    <span class="material-symbols-outlined" style="font-size: 40px;">sentiment_dissatisfied</span>
                    <p>No se encontraron eventos con esos filtros.</p>
                </div>`;
            return;
        }

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

    // 4. Filtros
    loadFilters: function() {
        const categories = getData('categories');
        const catSelect = document.getElementById('filter-category');
        
        categories.forEach(cat => {
            catSelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });

        document.getElementById('search-input').addEventListener('input', () => this.applyFilters());
        document.getElementById('filter-city').addEventListener('change', () => this.applyFilters());
        document.getElementById('filter-category').addEventListener('change', () => this.applyFilters());
    },

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

    // 5. Detalles del Evento
    showDetail: function(id) {
        const event = getData('events').find(e => e.id === id);
        if(!event) return;
        
        const detailContainer = document.getElementById('view-detail');
        detailContainer.innerHTML = `
            <div class="view-header">
                <span class="material-symbols-outlined back-btn" onclick="app.navigate('home')">arrow_back</span>
                <h2 style="margin: 0;">Detalles del Evento</h2>
            </div>
            
            <img src="${event.image}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 20px; margin-bottom: 25px; border: 1px solid var(--border);">
            
            <h2 style="color: var(--primary); margin-bottom: 10px; font-size: 2rem;">${event.name}</h2>
            
            <div style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px; display: flex; flex-direction: column; gap: 10px;">
                <span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color:var(--primary);">calendar_today</span> ${event.date} • ${event.time}</span>
                <span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color:var(--primary);">location_on</span> ${event.city}</span>
                <span style="display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color:var(--primary);">category</span> ${event.category}</span>
            </div>
            
            <p style="margin-bottom: 30px; line-height: 1.7; color: #cbd5e1;">${event.desc}</p>
            
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(168, 85, 247, 0.05); padding: 25px; border-radius: 15px; border: 1px solid var(--border);">
                <div>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 5px;">Entrada General</p>
                    <h3 style="margin: 0; font-size: 1.8rem;">$${Number(event.price).toLocaleString('es-CO')}</h3>
                </div>
                <button class="btn-primary" style="width: auto; padding: 15px 30px; font-size: 1.1rem;" onclick="app.addToCart('${event.id}')">Agregar al Carrito</button>
            </div>
        `;
        
        this.navigate('detail');
    },

    // 6. Funcionalidades del Carrito
    addToCart: function(id) {
        const event = getData('events').find(e => e.id === id);
        if(!event) return;
        
        let cart = getData('cart');
        const existingItem = cart.find(item => item.id === id);
        
        if(existingItem) {
            existingItem.qty = (existingItem.qty || 1) + 1;
        } else {
            event.qty = 1;
            cart.push(event);
        }
        
        saveData('cart', cart);
        this.updateCartBadge();
        alert(`¡Añadiste una entrada para "${event.name}" al carrito!`);
    },

    renderCart: function() {
        const cart = getData('cart');
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const checkoutSection = document.getElementById('checkout-section');
        
        if(cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 50px 0;">
                    <span class="material-symbols-outlined" style="font-size: 60px; color: var(--border);">shopping_cart</span>
                    <p style="margin-top: 15px; font-size: 1.1rem;">Tu carrito está vacío.</p>
                </div>`;
            totalEl.innerText = '0';
            checkoutSection.style.display = 'none';
            return;
        }
        
        checkoutSection.style.display = 'block';
        let total = 0;
        
        container.innerHTML = cart.map((item) => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            return `
                <div class="cart-item">
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <img src="${item.image}" style="width: 70px; height: 70px; border-radius: 12px; object-fit: cover;">
                        <div>
                            <h4 style="margin: 0; font-size: 1.1rem; margin-bottom: 5px;">${item.name}</h4>
                            <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">Cantidad: <span style="color:var(--text-main); font-weight:bold;">${item.qty}</span></p>
                            <p style="margin: 2px 0 0 0; font-size: 0.9rem; color: var(--primary); font-weight: bold;">$${Number(item.price).toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                    <button class="btn-icon danger" onclick="app.removeFromCart('${item.id}')" style="background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px; border-radius: 10px; cursor:pointer;">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;
        }).join('');
        
        totalEl.innerText = total.toLocaleString('es-CO');
    },

    removeFromCart: function(id) {
        let cart = getData('cart');
        cart = cart.filter(item => item.id !== id);
        saveData('cart', cart);
        
        this.updateCartBadge();
        this.renderCart(); 
    },

    updateCartBadge: function() {
        const cart = getData('cart');
        const totalItems = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
        document.getElementById('cart-count').innerText = totalItems;
    },

    // 7. Generar Orden de Compra
    handleCheckout: function(e) {
        e.preventDefault();
        
        const cart = getData('cart');
        if(cart.length === 0) return;
        
        const sale = {
            id: 'VTA-' + Math.floor(Math.random() * 900000 + 100000), 
            date: new Date().toLocaleString('es-ES'),
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
        
        let sales = getData('sales');
        sales.unshift(sale);
        saveData('sales', sales);
        
        saveData('cart', []);
        document.getElementById('form-checkout').reset();
        this.updateCartBadge();
        
        alert(`¡Compra realizada con éxito!\nTu código de boleta es: ${sale.id}\nTe esperamos en el evento.`);
        this.navigate('profile');
    },

    // 8. Renderizar Perfil y Tickets
    renderProfile: function() {
        const sales = getData('sales');
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        const ticketsContainer = document.getElementById('user-tickets-list');

        if (sales.length === 0) {
            nameEl.innerText = "Usuario Invitado";
            emailEl.innerText = "Aún no has realizado compras.";
            ticketsContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 40px 0; background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border);">
                    <span class="material-symbols-outlined" style="font-size: 50px; margin-bottom: 10px; opacity: 0.5;">confirmation_number</span>
                    <p>No tienes tickets disponibles.</p>
                </div>`;
            return;
        }

        const lastSale = sales[0]; 
        nameEl.innerText = lastSale.buyer.name;
        emailEl.innerText = lastSale.buyer.email;

        let ticketsHtml = '';
        sales.forEach(sale => {
            sale.items.forEach(item => {
                ticketsHtml += `
                    <div class="ticket-card">
                        <div class="ticket-card-info">
                            <h4>${item.name}</h4>
                            <p><span class="material-symbols-outlined" style="font-size:14px">calendar_today</span> ${item.date} • ${item.time}</p>
                            <p><span class="material-symbols-outlined" style="font-size:14px">location_on</span> ${item.city}</p>
                            <p style="color: var(--primary); font-weight: bold; margin-top: 8px;">
                                Cantidad: ${item.qty} &nbsp;|&nbsp; Orden: ${sale.id}
                            </p>
                        </div>
                        <div class="ticket-qr">
                            <span class="material-symbols-outlined">qr_code_2</span>
                            <p>VÁLIDO</p>
                        </div>
                    </div>
                `;
            });
        });

        ticketsContainer.innerHTML = ticketsHtml;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});