// js/storage.js

// Prefijo para evitar que nuestros datos choquen con los de otras páginas en el mismo navegador
const DB_PREFIX = 'conciertos_conectados_';

const Store = {
    // init(): Se ejecuta al cargar la página. Si no existen las listas en localStorage, crea arreglos vacíos "[]"
    init() {
        if (!localStorage.getItem(`${DB_PREFIX}categories`)) {
            localStorage.setItem(`${DB_PREFIX}categories`, JSON.stringify([]));
        }
        if (!localStorage.getItem(`${DB_PREFIX}events`)) {
            localStorage.setItem(`${DB_PREFIX}events`, JSON.stringify([]));
        }
        if (!localStorage.getItem(`${DB_PREFIX}sales`)) {
            localStorage.setItem(`${DB_PREFIX}sales`, JSON.stringify([]));
        }
    },
    
    // get(entity): Busca datos en localStorage y los convierte de texto (JSON) a objetos de JavaScript
    get(entity) {
        return JSON.parse(localStorage.getItem(`${DB_PREFIX}${entity}`)) || [];
    },
    
    // save(entity, data): Convierte objetos de JavaScript a texto (JSON) y los guarda en localStorage
    save(entity, data) {
        localStorage.setItem(`${DB_PREFIX}${entity}`, JSON.stringify(data));
    }
};

Store.init();
