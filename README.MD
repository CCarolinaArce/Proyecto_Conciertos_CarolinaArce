# 🎵 Conciertos Conectados - Plataforma de Venta de Entradas

Bienvenido al repositorio de **Conciertos Conectados**, una plataforma web moderna e interactiva (Single Page Application - SPA) diseñada para facilitar la gestión y compra de entradas para eventos en vivo. 

Este proyecto está construido 100% con tecnologías web nativas (Vanilla) y utiliza `localStorage` para simular una base de datos en tiempo real, permitiendo una experiencia fluida entre el portal de clientes y el panel de administración.

---

## 🚀 Características Principales

La aplicación está dividida en dos frentes principales:

### 🎭 1. Portal de Clientes (`cliente.html`)
Diseñado con un enfoque "Mobile-First" y una estética *Neo-Dark* para una experiencia de usuario inmersiva.
* **Catálogo Dinámico:** Visualización de próximos eventos mediante Web Components (`<event-card>`).
* **Búsqueda y Filtros en Tiempo Real:** Filtra conciertos por nombre del artista, ciudad y categoría sin recargar la página.
* **Detalle del Evento:** Información ampliada, recinto y precios.
* **Carrito de Compras:** Sistema de carrito que calcula subtotales, cantidades y total final.
* **Checkout Simulado:** Formulario de compra que genera un "Ticket ID" único y guarda la transacción.
* **Perfil de Usuario:** Historial de compras donde el usuario puede ver sus tickets generados con un código QR simulado.

### 🛡️ 2. Panel de Administración (`admin.html`)
Un *Dashboard* privado para gestionar todo el ecosistema de la plataforma.
* **Autenticación:** Sistema de login seguro usando credenciales y `sessionStorage`.
* **Vista General (KPIs):** Tarjetas de resumen con el total de ventas, eventos activos y categorías.
* **Gestión de Eventos (CRUD):** Creación, edición y eliminación de conciertos. (Restringido a ciudades específicas: Bogotá, Medellín, Barranquilla, Bucaramanga).
* **Gestión de Categorías (CRUD):** Control total sobre los géneros musicales o tipos de eventos.
* **Historial de Ventas:** Tabla detallada con todas las transacciones realizadas por los clientes, ordenadas de la más reciente a la más antigua, con opción a ver el detalle completo de la orden.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica y Single Page Application (SPA).
* **CSS3:** Diseño responsivo (Flexbox/Grid), variables CSS, animaciones nativas y *Glassmorphism*.
* **JavaScript (ES6+):** Lógica de negocio, manipulación del DOM y renderizado dinámico.
* **Web Components:** Creación de etiquetas HTML personalizadas para modularizar la UI (`components.js`).
* **LocalStorage / SessionStorage:** Persistencia de datos en el navegador del usuario para simular una base de datos relacional (Usuarios, Eventos, Categorías, Ventas, Carrito).
* **Material Symbols:** Iconografía moderna proveída por Google Fonts.

---

## 📁 Estructura del Proyecto

```text
📁 Proyecto_Conciertos
├── 📁 admin
│   └── 📄 admin.html        # SPA del Panel de Administración
├── 📁 client
│   └── 📄 cliente.html      # SPA del Portal de Clientes
├── 📁 css
│   ├── 📄 admin.css         # Estilos exclusivos del Dashboard
│   └── 📄 cliente.css       # Estilos exclusivos del portal público
├── 📁 JS
│   ├── 📄 admin.js          # Lógica, navegación y CRUD del administrador
│   ├── 📄 client.js         # Lógica, filtros y carrito del cliente
│   ├── 📄 components.js     # Web Components (<event-card>)
│   └── 📄 storage.js        # Configuración inicial y manejo de localStorage
└── 📄 README.md             # Documentación del proyecto