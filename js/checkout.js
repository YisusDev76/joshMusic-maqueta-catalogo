//DATASET
// Lista de productos

const radioOptions = document.querySelectorAll('.radio-option input[type="radio"]');
const spanProviderShipping = document.querySelector('#providerShipping');
const infoIcon = document.getElementById('infoIcon');
const infoTooltip = document.getElementById('infoTooltip');
const fullNameInput = document.getElementById('full-name');
const totalItems = document.querySelector('#total-items');
const inputs = document.querySelectorAll('input:not(#company)');
const spanCartResume = document.querySelector('#resume-items');
const spanTotalToPay = document.querySelector('#resume-totalToPay');
const shippingCostElements = document.querySelectorAll('.shipping-cost');
const totalToPayElments = document.querySelectorAll('.element-total-to-Pay');
const arrowButton = document.querySelector('.button-with-arrow');
const fullNamePreview = document.getElementById('preview-full-name');
const companyInput = document.getElementById('company');
const companyPreview = document.getElementById('preview-company');
var emailInput = document.getElementById('email');
var emailPreview = document.getElementById('preview-email');
const phoneInput = document.getElementById('phone');
const phonePreview = document.querySelector('#preview-phone');
let tooltipTimeout;

const productList = [];
let shoppingCart = [];
let totalCart = 0 ;
let totalToPay = 0;
let selectedShippingProvider = null;
let globalShippingPrice = 0;
let priceShipping;

shoppingCart = JSON.parse(localStorage.getItem('carrito')) || [];
if (shoppingCart.length === 0) {
    // Redirige al usuario a la página de inicio si el carrito está vacío
    window.location.href = '/index.html';
}


document.addEventListener('DOMContentLoaded', function () {
    fetch('data/articles_v2.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.products)) {
                productList.push(...data.products);
                 // Inicializar la vista con los productos del carrito
                renderCart(shoppingCart);
                updateInfoUI();
            } else {
                console.error('La propiedad "products" no existe o no es un array');
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));
    totalCart = calcularTotalCarrito(shoppingCart);

    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        // Evento para comprobar los cambios en el campo
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('input-error');
                var errorMessage = this.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
        });
    });
    
    priceShipping = generarPrecioAleatorio();
    totalToPay = priceShipping + totalCart;

    shippingCostElements.forEach(function(elemento) {
        elemento.textContent =  formatPrice(priceShipping);
    });

    totalToPayElments.forEach(function(elemento) {
        elemento.textContent =  formatPrice(totalToPay);
    });
});

// Evento que se dispara cuando se escribe en el campo de nombre completo
fullNameInput.addEventListener('input', function() {
    fullNamePreview.textContent = this.value;
});

companyInput.addEventListener('input', function() {
    companyPreview.textContent = this.value;
});

emailInput.addEventListener('input', function() {
    emailPreview.textContent = this.value;
});

phoneInput.addEventListener('input', function () {
    phonePreview.textContent = this.value;
});

function checkCartStatus() {
    if (shoppingCart.length === 0) {
        console.log("El carrito esta vacio");
      document.getElementById('total-items').innerText = '0 items';
      document.getElementById('empty-cart-message').classList.remove('inactive');
    } else {
      // Actualizar el botón y otros elementos según sea necesario     // Escucha el evento de clic
    infoIcon.addEventListener('click', toggleTooltip);
    }
  }



function guardarCarritoEnLocalStorage() {
    const jsonCart = JSON.stringify(shoppingCart);
    localStorage.setItem('carrito', jsonCart);
}


    // Función para actualizar la cantidad en el carrito
    function actualizarPrecioProducto(productInCart,product, newQty) {
        // Encuentra el producto en productList por su ID para obtener el precio actualizado
        if (product && productInCart) {
            const precioTotal =  getPriceFromCart(productInCart, product) * newQty;
            document.getElementById(`price-${idProducto}`).innerText = `$${precioTotal.toFixed(2)}`;
            console.log("Estoy viendo la de actualizar el precio de un producto");
    
            // // Actualiza la cantidad en shoppingCart
            // const productoEnCarrito = shoppingCart.find(producto => producto.id === idProducto);
            // if (productoEnCarrito) {
            //     productoEnCarrito.cantidad = nuevaCantidad;
            // }

            // guardarCarritoEnLocalStorage();
        }
    }

  // Función para manejar la visibilidad del tooltip
  function toggleTooltip() {
    var isTooltipVisible = infoTooltip.style.visibility === 'visible';
    clearTimeout(tooltipTimeout);

    if (isTooltipVisible) {
      infoTooltip.style.visibility = 'hidden';
    } else {
      infoTooltip.style.visibility = 'visible';
      tooltipTimeout = setTimeout(function() {
        infoTooltip.style.visibility = 'hidden';
      }, 2400);
    }
  }

infoIcon.addEventListener('touchstart', function(e) {
    // Previene el evento de clic en dispositivos móviles para evitar que se dispare dos veces
    e.preventDefault();
    toggleTooltip();
});

arrowButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formulario = document.getElementById('formularioInformacion');
    const checkboxTerminos = document.getElementById('termsCheckbox');

    // Comprobar primero la validez del formulario
    if (!formulario.checkValidity()) {
        const camposInvalidos = formulario.querySelectorAll(':invalid');
        camposInvalidos.forEach(campo => {
            campo.classList.add('blinking');
            setTimeout(() => {
                campo.classList.remove('blinking');
            }, 2000);            
        });
        formulario.scrollIntoView(true);
        window.scrollBy(0, -200); // Asume una altura de navbar de 200px
    } else if (!checkboxTerminos.checked) { // Solo se comprueba el checkbox si el formulario es válido
        const shippingWarning = document.querySelector('.shipping-warning'); // Asegúrate de que este selector coincida con tu elemento de advertencia
        shippingWarning.classList.add('blinking');
        setTimeout(() => {
            shippingWarning.classList.remove('blinking');
        }, 2000);        
        checkboxTerminos.scrollIntoView(true);
        window.scrollBy(0, -200); // Ajusta de nuevo por la altura del navbar
    } else {
        // Todo es válido, proceder a la redirección
        window.location.href = '#cartSummary';
    }
});

function renderCart(arrayCarrito) {
    const contenedorProductos = document.querySelector(".my-order-content");
    contenedorProductos.innerHTML = ''; // Limpiar el contenedor existente

    arrayCarrito.forEach(producto => {
        // Crear el div del producto
        const productoDiv = document.createElement("div");
        productoDiv.classList.add("order-item");

        productDetails = productList.find(productFinder => productFinder.id == producto.id);
       
        // console.log("La lista de productos es ", productList);
        // console.log("Producto del carrito es, ", producto.quantity);
        // console.log("El producto encintrado fue ", productDetails);
        // console.log("El price de este producto es: ", getPriceFromCart(producto, productDetails));
       

        // Agregar imagen, detalles y opciones del producto
        productoDiv.innerHTML = `
            <div class="item-image">
                <img src="${getFirstProductImage(productDetails, producto.variantId)}" alt="${productDetails.name}" loading="lazy">
            </div>
            <div class="item-details">
                <div class="nameAndPrice">
                    <h3 class="item-title">${getProductNameWithVariant(productDetails, producto.variantId)}</h3>
                    <p class="item-price" id="price-${producto.id}">$${getPriceFromCart(producto, productDetails)* producto.quantity}</p>
                </div>
                <div class="item-options">
                <select class="item-quantity" data-id="${producto.quantity}">
                    <option value="1">1 pza</option>
                    <option value="2">2 pzas</option>
                    <option value="3">3 pzas</option>
                    <option value="4">4 pzas</option>
                    <option value="5">5 pzas</option>
                    <option value="6">6 pzas</option>
                    <option value="7">7 pzas</option>
                    <option value="8">8 pzas</option>
                    <option value="9">9 pzas</option>
                    <option value="10">10 pzas</option>
                </select>
            </div>
            </div>
        `;

        // Establecer la cantidad seleccionada
        const selectCantidad = productoDiv.querySelector(".item-quantity");
        selectCantidad.value = producto.quantity;
        // Asegurarse de que la opción actual esté disponible
        if (producto.quantity > 10) {
        const option = document.createElement("option");
        option.value = producto.quantity;
        option.textContent = `${producto.quantity} pza${producto.quantity > 1 ? 's' : ''}`;
        option.selected = true; // Marcar como seleccionada
        selectCantidad.appendChild(option);
        } else {
            selectCantidad.value = producto.quantity;
        }

        // Añadir el event listener para cambios en la selección
        selectCantidad.addEventListener("change", function(event) {
            const newQty = parseInt(event.target.value);
            console.log(newQty);
            const precioTotal =  getPriceFromCart(producto, productDetails) * newQty;
            console.log("EL nuevo precio total es ", precioTotal);
            // actualizarPrecioProducto(producto, productDetails, nuevaCantidad);
        });            

        // Agregar el producto al contenedor
        contenedorProductos.appendChild(productoDiv);
    });
}

document.getElementById('termsCheckbox').addEventListener('change', function() {
    if (this.checked) {
    //   alert('Has aceptado los términos y condiciones.');
    } else {
    //   alert('No has aceptado los términos y condiciones.');
    }
  });  

// Esta bloque aun no se bien para que sirve xd
document.querySelectorAll(".input-container .login-input").forEach(function(element) {
    if (element.value !== "") {
        element.closest('.input-container').classList.add("animation");
    }
});

document.querySelectorAll(".input-container .login-input").forEach(function(element) {
    element.addEventListener('focus', function() {
        this.closest('.input-container').classList.add("animation", "animation-color");
    });
});

document.querySelectorAll(".input-container .login-input").forEach(function(element) {
    element.addEventListener('focusout', function() {
        if (this.value === "") {
            this.closest('.input-container').classList.remove("animation");
        }
        this.closest('.input-container').classList.remove("animation-color");
    });
});

function validateInput(input) {
    var errorMessage = input.parentElement.querySelector('.error-message');
    if (input.value.trim() === '') {
        input.classList.add('input-error');
        if (errorMessage) {
            errorMessage.style.display = 'block';
        }
    } else {
        input.classList.remove('input-error');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }
}

function formatPrice(price) {
    return price.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
}

function contarTotalItems() {
    return shoppingCart.reduce((total, item) => total + item.quantity, 0);
}

// Determinar la imagen principal del producto considerando la variante seleccionada
function getFirstProductImage(product, variantId) {
    if (variantId) {
        const selectedVariant = product.variations.find(variation => variation.variantID === variantId);
        if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
            return selectedVariant.images[0];
        }
    }
    return (product.images && product.images.length > 0) ? product.images[0] :
        (product.variations && product.variations.length > 0 && product.variations[0].images && product.variations[0].images.length > 0) ? product.variations[0].images[0] :
        'https://placehold.co/600x400';
}

function getProductNameWithVariant(product, variantId) {
    if (variantId && product.variations && product.variations.length > 0) {
        const selectedVariant = product.variations.find(variation => variation.variantID === variantId);
        if (selectedVariant) {
            return `${product.name} - ${product.variationKey}: ${selectedVariant.value}`;
        }
    }
    return product.name;
}

function getPriceFromCart(cartItem, product) {
    console.log("Entra a obtener el price");
    console.log(product);
    if (cartItem.variantId) {
        // Buscar la variante específica usando el variantId
        const variant = product.variations.find(variant => variant.variantID === cartItem.variantId);

        // Si encontramos la variante y tiene un precio definido, retornamos ese precio
        if (variant && variant.price) {
            return variant.price;
        }
    }
    
    // Si el variantId es null o la variante no tiene un precio definido, usamos el precio del producto
    // También cubre el caso donde el producto tiene variantes pero sin precios individuales
    return product.price;
}


// Función para buscar el precio de un producto por su ID
function buscarPrecioPorId(id) {
    const producto = productList.find(p => p.id === id);
    return producto ? producto.price : 0;
}

function calcularTotalCarrito(carrito) {
    return carrito.reduce((total, item) => {
        const precio = buscarPrecioPorId(item.id);
        return total + (precio * item.cantidad);
    }, 0);
}

function updateInfoUI(){
    spanCartResume.innerHTML = contarTotalItems(shoppingCart); 
    totalItems.textContent = contarTotalItems(shoppingCart) + " artículos";
}

//Solo en lo que existe una forma de caluclar el precio que se acerce a lo que pidio josh
function generarPrecioAleatorio() {
    // Generar número aleatorio entre 400 y 100000
    const min = 400;
    const max = 15000;
    const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroAleatorio;
}


// function updateShippingCostUI(shippingProvider, shippingCost) {
//     if (shippingCost !== undefined) {
//         const formattedProvider = shippingProvider.charAt(0).toUpperCase() + shippingProvider.slice(1);
//         document.getElementById(`price${formattedProvider}`).innerText = ` $${shippingCost}`;
//     }
// }
