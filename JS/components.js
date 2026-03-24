// js/components.js

// Definimos una clase que hereda de HTMLElement para crear nuestra propia etiqueta HTML
// * AQUI SE DEFINE EL COMPONENTE PERSONALIZADO (Web Component) <event-card>
class EventCard extends HTMLElement {
    constructor() {
        super();
        // attachShadow encapsula los estilos y el HTML para que no afecten ni se vean afectados por el resto de la página
        this.attachShadow({ mode: 'open' });
    }

    // Se ejecuta cuando el componente es insertado en el DOM
    connectedCallback() {
        this.render();
    }

    // Le decimos al navegador qué atributos (ej. id, name, price) debe vigilar para detectar cambios
    static get observedAttributes() {
        return ['id', 'name', 'date', 'time', 'price', 'image', 'city'];
    }

    // Si algún atributo cambia, volvemos a dibujar (renderizar) el componente
    attributeChangedCallback() {
        this.render();
    }

    render() {
        // Leemos los valores que pasamos desde el HTML
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const date = this.getAttribute('date');
        const time = this.getAttribute('time');
        const price = this.getAttribute('price');
        const image = this.getAttribute('image');
        const city = this.getAttribute('city');

        // Inyectamos el HTML y CSS exclusivo del componente
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    text-align: center;
                    font-family: sans-serif;
                    background: #fff;
                }
                .card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .card-body { padding: 15px; }
                .price { font-weight: bold; color: #2ecc71; font-size: 1.2em; }
                .btn { 
                    display: inline-block; padding: 10px 15px; margin-top: 10px;
                    background: #3498db; color: white; text-decoration: none; border-radius: 4px; border: none; cursor: pointer;
                }
            </style>
            <div class="card">
                <img src="${image}" alt="${name}">
                <div class="card-body">
                    <h3>${name}</h3>
                    <p>📍 ${city}</p>
                    <p>📅 ${date} - ⏰ ${time}</p>
                    <p class="price">$${price}</p>
                    <a href="#/detalle/${id}" class="btn">Ver Detalle</a>
                    <button class="btn btn-cart" data-id="${id}">Añadir al Carrito</button>
                </div>
            </div>
        `;

        // Buscamos el botón dentro de nuestro componente y le asignamos la función de añadir al carrito
        const btnCart = this.shadowRoot.querySelector('.btn-cart');
        if (btnCart) {
            btnCart.addEventListener('click', () => {
                // Disparamos un evento "personalizado" llamado 'add-to-cart' que será escuchado por client.js
                this.dispatchEvent(new CustomEvent('add-to-cart', {
                    detail: { id, name, price, image },
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }
}

// Registramos oficialmente la nueva etiqueta en el navegador
// * REGISTRO DEL COMPONENTE: Convierte nuestra clase en una etiqueta HTML válida y reutilizable.
customElements.define('event-card', EventCard);
