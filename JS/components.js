

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
                .card { background: var(--bg-card); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); transition: 0.3s;}
                .card img { width: 100%; height: 180px; object-fit: cover; }
                .card-body { padding: 15px; }
                .card-date { color: var(--primary); font-size: 0.8rem; font-weight: 600; margin-bottom: 5px; display: flex; align-items:center; gap: 5px;}
                .card-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 5px;}
                .card-city { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;}
                .card-footer { display: flex; justify-content: space-between; align-items: center;}
                .price { font-size: 1.2rem; font-weight: 800;}
                .btn-add { background: var(--primary); width: 40px; height: 40px; border-radius: 10px; display: flex; justify-content: center; align-items: center; cursor: pointer;}
            </style>
            <div class="card" onclick="app.showDetail('${id}')">
                <img src="${image}" alt="${title}">
                <div class="card-body">
                    <div class="card-date"><span class="material-symbols-outlined" style="font-size:14px">calendar_today</span>${date}</div>
                    <div class="card-title">${title}</div>
                    <div class="card-city"><span class="material-symbols-outlined" style="font-size:14px">location_on</span>${city}</div>
                    <div class="card-footer">
                        <span class="price">$${Number(price).toLocaleString('es-CO')}</span>
                        <div class="btn-add" onclick="event.stopPropagation(); app.addToCart('${id}')">
                            <span class="material-symbols-outlined">shopping_cart</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('event-card', EventCard);