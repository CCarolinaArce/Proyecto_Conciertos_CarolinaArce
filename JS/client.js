// js/client.js

// DOMContentLoaded asegura que el código espere a que el HTML termine de cargar antes de ejecutarse
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos clave de la interfaz
    const eventsGrid = document.getElementById('events-grid');
    const categoryFilter = document.getElementById('category-filter');
    const cityFilter = document.getElementById('city-filter');
    const searchInput = document.getElementById('search-input');
    
    // Obtenemos el carrito del localStorage o creamos un arreglo vacío si no existe
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Llenamos la lista desplegable de categorías de manera dinámica
    if (categoryFilter) {
        const categories = Store.get('categories');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categoryFilter.appendChild(option);
        });
    }

    // Renderizar eventos en index.html
    const renderEvents = () => {
        if (!eventsGrid) return;
        const events = Store.get('events');
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCity = cityFilter.value;
        const selectedCategory = categoryFilter.value;

        // Limpiamos la grilla antes de volver a dibujar
        eventsGrid.innerHTML = '';

        // Filtramos los eventos comparando la búsqueda, la ciudad y la categoría
        const filteredEvents = events.filter(e => {
            const matchName = e.name.toLowerCase().includes(searchTerm);
            const matchCity = selectedCity ? e.city === selectedCity : true;
            const matchCategory = selectedCategory ? e.categoryId === selectedCategory : true;
            return matchName && matchCity && matchCategory;
        });

        // Creamos nuestro componente <event-card> por cada evento que pasó el filtro
        filteredEvents.forEach(e => {
            // * REUTILIZACIÓN DEL COMPONENTE: En este bucle instanciamos <event-card> múltiples veces según los eventos existan.
            const card = document.createElement('event-card');
            card.setAttribute('id', e.id);
            card.setAttribute('name', e.name);
            card.setAttribute('date', e.date);
            card.setAttribute('time', e.time);
            card.setAttribute('price', e.price);
            card.setAttribute('image', e.image);
            card.setAttribute('city', e.city);
            eventsGrid.appendChild(card);
        });
    };

    if (eventsGrid) {
        renderEvents();
        searchInput.addEventListener('input', renderEvents);
        cityFilter.addEventListener('change', renderEvents);
        categoryFilter.addEventListener('change', renderEvents);
    }

    // Lógica para añadir al carrito (escucha el evento del Web Component)
    document.addEventListener('add-to-cart', (e) => {
        const item = e.detail;
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('¡Evento añadido al carrito exitosamente!');
    });

    // Lógica del Carrito
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const cartCount = document.getElementById('cart-count');

    const updateCartCount = () => {
        if (cartCount) cartCount.textContent = cart.length;
    };
    updateCartCount();

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            renderCartItems();
            // Mostramos la ventana flotante (modal) del carrito
            cartModal.style.display = 'block';
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    // Dibuja la lista de productos dentro del carrito
    const renderCartItems = () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += parseFloat(item.price);
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" width="50">
                    <span>${item.name}</span>
                    <span>$${item.price}</span>
                    <button onclick="removeFromCart(${index})">X</button>
                </div>
            `;
        });
        cartTotalSpan.textContent = total;
    };

    // Elimina un producto específico del carrito mediante su posición (index)
    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    };

    // --- CHECKOUT (Procesar la compra) ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('El carrito está vacío.');
                return;
            }

            // Creamos un objeto con los datos del comprador obtenidos del formulario
            const buyer = {
                idNum: document.getElementById('buyer-id').value,
                name: document.getElementById('buyer-name').value,
                address: document.getElementById('buyer-address').value,
                phone: document.getElementById('buyer-phone').value,
                email: document.getElementById('buyer-email').value
            };

            // Armamos la boleta de venta (id único basado en fecha, datos del comprador, productos y total)
            const newSale = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                buyer,
                items: cart,
                total: cart.reduce((sum, item) => sum + parseFloat(item.price), 0),
                city: cart[0].city // Tomamos la ciudad del primer evento como referencia
            };

            // Guardamos la nueva venta en nuestra "base de datos" (localStorage)
            const sales = Store.get('sales');
            sales.push(newSale);
            Store.save('sales', sales);

            // Vaciamos el carrito tras comprar
            cart = [];
            localStorage.removeItem('cart');
            updateCartCount();
            cartModal.style.display = 'none';
            checkoutForm.reset();

            alert('¡Compra realizada con éxito! Boleta asignada.');
        });
    }

    // --- ENRUTADOR SPA (Single Page Application) ---
    const router = () => {
        const hash = window.location.hash || '#/'; // Obtiene la URL tras el "#" (Ej. #/detalle/123)
        const mainView = document.getElementById('main-view'); // Vista que contiene los filtros y la grilla
        const detailContainer = document.getElementById('event-detail-container');
        
        if (hash.startsWith('#/detalle/')) {
            // Si entramos al detalle, ocultamos la grilla
            if (mainView) mainView.style.display = 'none';
            if (detailContainer) {
                detailContainer.style.display = 'block';
                // Extraemos el ID de la URL y buscamos el evento
                const eventId = hash.split('/')[2];
                const events = Store.get('events');
                const event = events.find(e => e.id === eventId);

                if (event) {
                    detailContainer.innerHTML = `
                        <div class="event-detail">
                            <button onclick="window.location.hash='#/'" style="margin-bottom: 20px;" class="btn">&larr; Volver</button>
                            <br>
                            <img src="${event.image}" alt="${event.name}" style="width:100%; max-width:600px;">
                            <h2>${event.name}</h2>
                            <p><strong>Descripción:</strong> ${event.description}</p>
                            <p><strong>Fecha y Hora:</strong> ${event.date} a las ${event.time}</p>
                            <p><strong>Ciudad:</strong> ${event.city}</p>
                            <p><strong>Precio:</strong> $${event.price}</p>
                            <button id="detail-add-cart" class="btn">Agregar al carrito</button>
                        </div>
                    `;
                    document.getElementById('detail-add-cart').addEventListener('click', () => {
                        cart.push({ id: event.id, name: event.name, price: event.price, image: event.image, city: event.city });
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartCount();
                        alert('¡Evento añadido al carrito exitosamente!');
                    });
                } else {
                    detailContainer.innerHTML = '<p>Evento no encontrado.</p>';
                }
            }
        } else {
            // Si no estamos en detalle, mostramos la grilla principal
            if (mainView) mainView.style.display = 'block';
            if (detailContainer) detailContainer.style.display = 'none';
        }
    };

    // Cada vez que cambia el "#" en la URL, se ejecuta el enrutador
    window.addEventListener('hashchange', router);
    router(); // Ejecutar al cargar la página por primera vez
});
