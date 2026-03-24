

const DEFAULT_CATEGORIES = [
    { id: 1, name: "Rock & Metal", desc: "Conciertos de puro rock" },
    { id: 2, name: "Electrónica", desc: "EDM, House, Techno" }
];

const DEFAULT_EVENTS = [
    { id: "EVT-001", name: "Neon Nights Festival", category: "Electrónica", price: 180000, date: "2024-10-24", time: "20:00", city: "Bogotá", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80", desc: "El mejor festival de luces y sonido." },
    { id: "EVT-002", name: "Rock Legends Tour", category: "Rock & Metal", price: 250000, date: "2024-11-12", time: "19:30", city: "Medellín", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80", desc: "Leyendas del rock en un solo escenario." }
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