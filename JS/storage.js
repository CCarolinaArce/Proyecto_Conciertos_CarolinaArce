

const DEFAULT_CATEGORIES = [
    { id: 1, name: "Rock & Metal", desc: "Conciertos de puro rock" },
    { id: 2, name: "Electrónica", desc: "EDM, House, Techno" },
    { id: 3, name: "Urbano", desc: "Reggaetón, Trap y más ritmos urbanos." },
    { id: 4, name: "Vallenato", desc: "Lo mejor del folclor vallenato." }
];

const DEFAULT_EVENTS = [
    { id: "EVT-001", name: "Neon Nights Festival", category: "Electrónica", price: 180000, date: "2024-10-24", time: "20:00", city: "Bogotá", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80", desc: "El mejor festival de luces y sonido." },
    { id: "EVT-002", name: "Rock Legends Tour", category: "Rock & Metal", price: 250000, date: "2024-11-12", time: "19:30", city: "Medellín", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80", desc: "Leyendas del rock en un solo escenario." },
    { id: "EVT-003", name: "Cartagena Urban Fest", category: "Urbano", price: 220000, date: "2024-12-05", time: "21:00", city: "Cartagena", image: "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=500&q=80", desc: "Los mejores artistas del género urbano se dan cita en la heróica." },
    { id: "EVT-004", name: "Noche de Acordeones", category: "Vallenato", price: 150000, date: "2024-11-30", time: "19:00", city: "Santa Marta", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80", desc: "Un homenaje a los juglares vallenatos en la bahía más linda de América." },
    { id: "EVT-005", name: "Barranquilla Dance Event", category: "Electrónica", price: 195000, date: "2025-01-18", time: "22:00", city: "Barranquilla", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80", desc: "Siente el beat en la puerta de oro de Colombia con DJs internacionales." },
    { id: "EVT-006", name: "Caribe Rock & Riffs", category: "Rock & Metal", price: 175000, date: "2024-12-14", time: "18:00", city: "Cartagena", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&q=80", desc: "El rock se toma las murallas con las mejores bandas nacionales e invitadas." }
];

function initDB() {
    if (!localStorage.getItem('adminCredentials')) {
        localStorage.setItem('adminCredentials', JSON.stringify({ email: 'admin@mail.com', password: '123456' }));
    }
    if (!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
    if (!localStorage.getItem('events')) localStorage.setItem('events', JSON.stringify(DEFAULT_EVENTS));
    if (!localStorage.getItem('sales')) localStorage.setItem('sales', JSON.stringify([]));
    if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Inicializar al cargar
initDB();