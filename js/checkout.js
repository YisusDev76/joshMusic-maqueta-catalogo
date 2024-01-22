console.log("Entramos al checkout");

document.addEventListener('DOMContentLoaded', () => {
    let carritoGlobal = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carritoGlobal.length === 0) {
        // Redirige al usuario a la página de inicio si el carrito está vacío
        window.location.href = '/index.html'; // Cambia esto por la URL de tu página de inicio
    }

    // El resto de tu lógica de la página de checkout
});
