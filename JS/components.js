

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

customElements.define('event-card', EventCard);