

class EventCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = this.getAttribute('data-id');
        const title = this.getAttribute('data-title');
        const price = this.getAttribute('data-price');
        const date = this.getAttribute('data-date');
        const city = this.getAttribute('data-city');
        const image = this.getAttribute('data-image');

        this.innerHTML = `
            <style>
                .card { 
                    background: var(--bg-card); 
                    border-radius: 15px; 
                    overflow: hidden; 
                    border: 1px solid var(--border); 
                    transition: 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }
                .card:hover { 
                    border-color: var(--primary); 
                    transform: translateY(-5px); 
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); 
                }
                .card img { width: 100%; height: 180px; object-fit: cover; }
                .card-body { padding: 15px 20px; }
                .card-date { color: var(--primary); font-size: 0.8rem; font-weight: 600; margin-bottom: 5px; display: flex; align-items: center; gap: 5px;}
                .card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 5px; color: var(--text-main);}
                .card-city { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px; display: flex; align-items: center; gap: 5px;}
                .card-footer { display: flex; justify-content: space-between; align-items: center;}
                .price { font-size: 1.3rem; font-weight: 800; color: var(--text-main);}
                .btn-add { 
                    background: var(--primary); color: white; width: 42px; height: 42px; 
                    border-radius: 12px; display: flex; justify-content: center; align-items: center; 
                    cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
                }
                .btn-add:hover { background: var(--primary-hover); transform: scale(1.05); }
                .badge { position: absolute; top: 15px; right: 15px; background: var(--primary); color: white; font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; }
            </style>
            
            <div class="card" onclick="app.showDetail('${id}')">
                <div class="badge">DESTACADO</div>
                <img src="${image}" alt="${title}">
                <div class="card-body">
                    <div class="card-date">
                        <span class="material-symbols-outlined" style="font-size:14px">calendar_today</span>
                        ${date}
                    </div>
                    <div class="card-title">${title}</div>
                    <div class="card-city">
                        <span class="material-symbols-outlined" style="font-size:14px">location_on</span>
                        ${city}
                    </div>
                    <div class="card-footer">
                        <span class="price">$${Number(price).toLocaleString('es-CO')}</span>
                        <div class="btn-add" onclick="event.stopPropagation(); app.addToCart('${id}')" title="Agregar al Carrito">
                            <span class="material-symbols-outlined">add_shopping_cart</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

class KpiCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const label = this.getAttribute('data-label');
        const value = this.getAttribute('data-value');
        const icon = this.getAttribute('data-icon');

        this.innerHTML = `
            <style>
                .kpi-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 25px;
                    transition: 0.3s ease;
                }
                .kpi-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .kpi-icon {
                    background: rgba(168, 85, 247, 0.1);
                    color: var(--primary);
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .kpi-label {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .kpi-value {
                    font-size: 2.2rem;
                    color: var(--text-main);
                }
            </style>
            <div class="kpi-card">
                <div class="kpi-header">
                    <div class="kpi-icon">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                </div>
                <p class="kpi-label">${label}</p>
                <h3 class="kpi-value">${value}</h3>
            </div>
        `;
    }
}

class CartItemCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const image = this.getAttribute('data-image');
        const price = this.getAttribute('data-price');
        const qty = this.getAttribute('data-qty');

        this.innerHTML = `
            <style>
                .cart-item { display: flex; justify-content: space-between; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid var(--border); }
                .cart-item-info { display: flex; gap: 15px; align-items: center; }
                .cart-item img { width: 70px; height: 70px; border-radius: 12px; object-fit: cover; }
                .cart-item h4 { margin: 0; font-size: 1.1rem; margin-bottom: 5px; }
                .cart-item p { margin: 0; font-size: 0.85rem; color: var(--text-muted); }
                .btn-icon { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); padding: 10px; border-radius: 10px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
            </style>
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${image}" alt="${name}">
                    <div>
                        <h4>${name}</h4>
                        <p>Cantidad: <span style="color:var(--text-main); font-weight:bold;">${qty}</span></p>
                        <p style="margin-top: 4px; font-size: 0.9rem; color: var(--primary); font-weight: bold;">$${Number(price).toLocaleString('es-CO')}</p>
                    </div>
                </div>
                <button class="btn-icon" onclick="app.removeFromCart('${id}')" title="Eliminar del carrito">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
    }
}

customElements.define('event-card', EventCard);
customElements.define('kpi-card', KpiCard);
customElements.define('cart-item-card', CartItemCard);