// main.js - Lógica del e-commerce

// Base de datos de productos (simulada)
const productos = [
    {
        id: 1,
        nombre: "Sable de Luz Edición Especial",
        precio: 299.99,
        descripcion: "Sable de luz con cristal kyber auténtico. Colores disponibles: azul, verde, rojo.",
        imagen: "https://cdn-icons-png.flaticon.com/512/2766/2766595.png",
        categoria: "Armas"
    },
    {
        id: 2,
        nombre: "Drone Intergaláctico X-7",
        precio: 499.99,
        descripcion: "Drone con autonomía de 2 horas y cámara 8K. Ideal para explorar tu galaxia.",
        imagen: "https://cdn-icons-png.flaticon.com/512/904/904131.png",
        categoria: "Tecnología"
    },
    {
        id: 3,
        nombre: "Traductor Universal Babel Fish",
        precio: 89.99,
        descripcion: "Traduce más de 500 idiomas alienígenas en tiempo real. Colócalo en tu oído.",
        imagen: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",
        categoria: "Accesorios"
    },
    {
        id: 4,
        nombre: "Casco VR Immersive 3000",
        precio: 199.99,
        descripcion: "Realidad virtual con experiencia sensorial completa. Siente cada planeta.",
        imagen: "https://cdn-icons-png.flaticon.com/512/2748/2748554.png",
        categoria: "Tecnología"
    }
];

// =============================================
// VARIABLES GLOBALES
// =============================================
let carrito = [];

// =============================================
// FUNCIONES DE INICIALIZACIÓN
// =============================================

// Cargar carrito desde localStorage al iniciar
function cargarCarrito() {
    try {
        const carritoGuardado = localStorage.getItem('galacticCarrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            console.log('Carrito cargado:', carrito);
        } else {
            carrito = [];
        }
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        carrito = [];
    }
    actualizarContador();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    try {
        localStorage.setItem('galacticCarrito', JSON.stringify(carrito));
        console.log('Carrito guardado:', carrito);
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

// =============================================
// FUNCIONES DEL CARRITO
// =============================================

// Actualizar contador en navbar
function actualizarContador() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        contador.textContent = totalItems;
        
        // Cambiar color si hay items
        if (totalItems > 0) {
            contador.classList.remove('bg-primary');
            contador.classList.add('bg-success');
        } else {
            contador.classList.remove('bg-success');
            contador.classList.add('bg-primary');
        }
    }
}

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.id === idProducto);
    
    if (itemExistente) {
        itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarContador();
    mostrarNotificacion(`✅ ${producto.nombre} agregado al carrito`);
    
    // Si estamos en la página de carrito, actualizar la vista
    if (window.location.pathname.includes('carrito.html')) {
        renderizarCarrito();
    }
}

// Eliminar del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarContador();
    renderizarCarrito();
    mostrarNotificacion('🗑️ Producto eliminado del carrito');
}

// Vaciar carrito completo
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContador();
    renderizarCarrito();
    mostrarNotificacion('🔄 Carrito vaciado');
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-success position-fixed top-0 end-0 m-3';
    notificacion.style.zIndex = '9999';
    notificacion.style.animation = 'slideIn 0.3s ease';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 2000);
}

// =============================================
// FUNCIONES DE RENDERIZADO
// =============================================

// Renderizar productos en home
function renderizarProductos() {
    const container = document.getElementById('productos-container');
    if (!container) return;
    
    container.innerHTML = productos.map(producto => `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top p-3" alt="${producto.nombre}" style="height: 200px; object-fit: contain;">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-primary fw-bold fs-4">$${producto.precio}</p>
                    <p class="card-text small">${producto.descripcion.substring(0, 60)}...</p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="verDetalle(${producto.id})">
                            🔍 Ver detalles
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                            🛒 Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Ver detalle de producto
function verDetalle(id) {
    window.location.href = `detalle.html?id=${id}`;
}

// Renderizar detalle de producto
function renderizarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const producto = productos.find(p => p.id === id);
    
    const container = document.getElementById('detalle-producto');
    const nombreBreadcrumb = document.getElementById('producto-nombre');
    
    if (!container) return;
    
    if (!producto) {
        window.location.href = 'index.html';
        return;
    }
    
    if (nombreBreadcrumb) {
        nombreBreadcrumb.textContent = producto.nombre;
    }
    
    container.innerHTML = `
        <div class="col-md-6 mb-4">
            <img src="${producto.imagen}" class="img-fluid rounded shadow" alt="${producto.nombre}" style="max-height: 400px; object-fit: contain;">
        </div>
        <div class="col-md-6">
            <h2 class="mb-3">${producto.nombre}</h2>
            <p class="text-primary h2 mb-4">$${producto.precio}</p>
            <p class="lead mb-4">${producto.descripcion}</p>
            <p><strong>Categoría:</strong> <span class="badge bg-secondary">${producto.categoria}</span></p>
            <div class="d-grid gap-3 mt-4">
                <button class="btn btn-success btn-lg" onclick="agregarAlCarrito(${producto.id})">
                    🛒 Agregar al carrito
                </button>
                <button class="btn btn-outline-primary btn-lg" onclick="window.location.href='index.html'">
                    ← Seguir comprando
                </button>
            </div>
        </div>
    `;
}

// Renderizar carrito
function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    const vacio = document.getElementById('carrito-vacio');
    const resumen = document.querySelector('.col-lg-4 .card');
    
    if (!contenedor) return;
    
    // Actualizar contador primero
    actualizarContador();
    
    if (!carrito || carrito.length === 0) {
        if (vacio) vacio.style.display = 'block';
        contenedor.innerHTML = '';
        actualizarTotales();
        return;
    }
    
    if (vacio) vacio.style.display = 'none';
    
    contenedor.innerHTML = carrito.map(item => `
        <div class="card mb-3">
            <div class="row g-0 align-items-center">
                <div class="col-3 col-md-2">
                    <img src="${item.imagen}" class="img-fluid p-2" alt="${item.nombre}" style="max-height: 80px; object-fit: contain;">
                </div>
                <div class="col-6 col-md-7">
                    <div class="card-body">
                        <h6 class="card-title">${item.nombre}</h6>
                        <p class="card-text mb-0">
                            <span class="text-primary fw-bold">$${item.precio}</span> 
                            <span class="text-muted">x ${item.cantidad || 1}</span>
                        </p>
                        <p class="card-text text-success fw-bold">
                            Subtotal: $${((item.precio) * (item.cantidad || 1)).toFixed(2)}
                        </p>
                    </div>
                </div>
                <div class="col-3 col-md-3 text-center">
                    <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">
                        ❌ Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agregar botón de vaciar carrito si hay items
    if (carrito.length > 0) {
        contenedor.innerHTML += `
            <div class="text-end mt-3">
                <button class="btn btn-warning" onclick="vaciarCarrito()">
                    🗑️ Vaciar carrito
                </button>
            </div>
        `;
    }
    
    actualizarTotales();
}

// Actualizar totales en carrito
function actualizarTotales() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);
    const envio = subtotal > 0 ? 10 : 0;
    const total = subtotal + envio;
    
    const subtotalEl = document.getElementById('subtotal');
    const envioEl = document.getElementById('envio');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (envioEl) envioEl.textContent = envio > 0 ? '$10.00' : '$0.00';
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página cargada, inicializando...');
    
    // 1. Primero cargar el carrito
    cargarCarrito();
    
    // 2. Renderizar según la página actual
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        renderizarProductos();
    } else if (path.includes('detalle.html')) {
        renderizarDetalle();
    } else if (path.includes('carrito.html')) {
        renderizarCarrito();
    }
    
    console.log('✅ Inicialización completa. Carrito:', carrito);
});

// Hacer funciones globales para los onclick
window.agregarAlCarrito = agregarAlCarrito;
window.verDetalle = verDetalle;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;