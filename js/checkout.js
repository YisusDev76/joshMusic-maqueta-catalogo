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
const previewAddress = document.getElementById('preview-address');
const companyInput = document.getElementById('company');
const companyPreview = document.getElementById('preview-company');
var emailInput = document.getElementById('email');
var emailPreview = document.getElementById('preview-email');
const phoneInput = document.getElementById('phone');
const phonePreview = document.querySelector('#preview-phone');
const clientAddressInput = document.querySelector('#clientAddress');
let tooltipTimeout;

const phoneNumberLow = ['523', '521', '207', '479'];
const phoneNumberHigh = ['524', '691', '751', '918'];
const productList = [];
let shoppingCart = [];
let totalCart = 0 ;
let totalToPay = 0;
let selectedShippingProvider = null;
let globalShippingPrice = 0;
let priceShipping;

const discountRules = [
    {
        category: 'audio-profesional',
        customizedDiscount: true,
        percentageDiscount: false,
        discountPercentage: 10 // Solo se utiliza si percentageDiscount es true
    },
    // {
    //     category: 'microfonia',
    //     customizedDiscount: false,
    //     percentageDiscount: true,
    //     discountPercentage: 15
    // }
];


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
                // Aplicar descuentos y renderizar productos
                const productsWithDiscounts = applyDiscounts(data.products);
                productList.push(...productsWithDiscounts);

                 // Inicializar la vista con los productos del carrito
                renderCart(shoppingCart);
                updateInfoUI();
                totalCart = calculateTotalCart(shoppingCart);
                //Funcion para actualizar el precio del carrito en los elementos html que muestren dicho subtotal
                totalToPayElments.forEach(function(elemento) {
                    elemento.textContent =  formatPrice(totalCart);
                });

                startBlinking();
            } else {
                console.error('La propiedad "products" no existe o no es un array');
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));
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


clientAddressInput.addEventListener('input', function () {
    previewAddress.textContent = this.value;
});

function applyDiscounts(products) {
    return products.map(product => {
        discountRules.forEach(rule => {
            if (product.category === rule.category) {
                if (rule.customizedDiscount) {
                    if (product.variations && Array.isArray(product.variations)) {
                        product.variations.forEach(variation => {
                            variation.originalPrice = variation.price;
                            variation.price = variation.discountedPrice;
                        });
                    } else {
                        product.originalPrice = product.price;
                        product.price = product.discountedPrice;
                    }
                } else if (rule.percentageDiscount) {
                    const discount = product.price * (rule.discountPercentage / 100);
                    if (product.variations && Array.isArray(product.variations)) {
                        product.variations.forEach(variation => {
                            variation.originalPrice = variation.price;
                            variation.discountedPrice = variation.price - discount;
                        });
                    } else {
                        product.originalPrice = product.price;
                        product.discountedPrice = product.price - discount;
                    }
                }
            }
        });
        return product;
    });
}

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

        const productDetails = productList.find(productFinder => productFinder.id == producto.id);

        const variantId = producto.variantId ? producto.variantId : '';
        const uniqueId = variantId ? `${producto.id}-${variantId}` : `${producto.id}`;

        // Agregar imagen, detalles y opciones del producto
        productoDiv.innerHTML = `
            <div class="item-image">
                <img src="${getFirstProductImage(productDetails, variantId)}" alt="${productDetails.name}" loading="lazy">
            </div>
            <div class="item-details">
                <div class="nameAndPrice">
                    <h3 class="item-title">${getProductNameWithVariant(productDetails, variantId)}</h3>
                    <p class="item-price" id="price-${uniqueId}">$${getPriceFromCart(producto, productDetails) * producto.quantity}</p>
                </div>
                <div class="item-options">
                    <select class="item-quantity" data-id="${producto.id}" data-variant-id="${variantId}">
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
            console.log("Entra al event de change");
            const newQty = parseInt(event.target.value);
            const id = event.target.getAttribute("data-id");
            console.log("el id del producto del change es ", id);
            const variantId = event.target.getAttribute("data-variant-id");
            console.log("el id del producto del change es ", variantId);

            // Encontrar el producto correcto en el array del carrito
            let productoActualizado;
            if (variantId) {
                productoActualizado = arrayCarrito.find(item => item.id == id && item.variantId == variantId);
            } else {
                productoActualizado = arrayCarrito.find(item => item.id == id && !item.variantId);
            }
            
            if (productoActualizado) {
                productoActualizado.quantity = newQty;

                // Actualizar el precio total del producto en la interfaz
                const updatedPrice = getPriceFromCart(productoActualizado, productDetails) * newQty;
                document.getElementById(`price-${uniqueId}`).textContent = `$${updatedPrice}`;

                totalCart = calculateTotalCart(shoppingCart);
                //Funcion para actualizar el precio del carrito en los elementos html que muestren dicho subtotal
                totalToPayElments.forEach(function(elemento) {
                    elemento.textContent =  formatPrice(totalCart);
                });

                // Actualizar el localStorage
                localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
                
            }
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

function calculateTotalCart(cart) {
    return cart.reduce((total, item) => {
        const product = productList.find(product => product.id === item.id);

        let price;

        // Case 1: The product does not have variants
        if (!product.variations || product.variations.length === 0) {
            price = product.price;
        }
        // Case 2: The product has variants and the price is in each variant
        else if (item.variantId) {
            const variant = product.variations.find(variation => variation.variantID === item.variantId);
            if (variant && variant.price !== undefined) {
                price = variant.price;
            } else {
                // Case 3: The product has variants but the price is in the main product
                price = product.price;
            }
        } else {
            // Default fallback for edge cases
            price = product.price;
        }

        return total + (price * item.quantity);
    }, 0);
}

function updateInfoUI(){
    spanCartResume.innerHTML = contarTotalItems(shoppingCart); 
    totalItems.textContent = contarTotalItems(shoppingCart) + " artículos";
}

document.getElementById('contact-store-btn').addEventListener('click', function() {
    let message = "Estoy interesado en adquirir los siguientes productos:\n\n";
    shoppingCart.forEach(cartItem => {
        const product = productList.find(product => product.id === cartItem.id);
        if (product) {
            if (cartItem.variantId) {
                const variant = product.variations.find(variation => variation.variantID === cartItem.variantId);
                if (variant) {
                    message += `- ${getProductNameWithVariant(product, cartItem.variantId)} Cantidad: ${cartItem.quantity}, Precio: ${variant.price} MXN, ID: ${cartItem.variantId}\n`;
                }
            } else {
                message += `- ${product.name} Cantidad: ${cartItem.quantity}, Precio: ${product.price} MXN, ID: ${cartItem.id}\n`;
            }
        }
    });

    // Obtener la información del formulario
    const fullName = document.getElementById('full-name').value;
    const company = document.getElementById('company').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Agregar la información personal al mensaje si está presente
    if (fullName || company || clientAddress || email || phone) {
        message += "\nEstos son mis datos personales:\n";
        if (fullName) message += `Nombre Completo: ${fullName}\n`;
        if (company) message += `Compañía: ${company}\n`;
        if (clientAddress) message += `Dirección Completa: ${clientAddress}\n`;
        if (email) message += `Correo electrónico: ${email}\n`;
        if (phone) message += `Teléfono: ${phone}\n`;
    }

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Función para unir el número de teléfono
    function joinPhoneNumber(parts) {
        return parts.join('');
    }

    // Selección del número de contacto según el total del carrito
    const phoneNumber = totalCart > 7500 ? joinPhoneNumber(phoneNumberHigh) : joinPhoneNumber(phoneNumberLow);

    // URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');
});

document.getElementById('call-store-btn').addEventListener('click', function() {
    function joinPhoneNumber(parts) {
        return parts.join('');
    }

    const phoneNumber = totalCart > 7500 ? joinPhoneNumber(phoneNumberHigh) : joinPhoneNumber(phoneNumberLow);
    const formattedPhoneNumber = `+${phoneNumber}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = `tel:${formattedPhoneNumber}`;
    } else {
        navigator.clipboard.writeText(formattedPhoneNumber).then(() => {
            alert('Número copiado al portapapeles: ' + formattedPhoneNumber);
        }).catch(err => {
            console.error('Error al copiar el número al portapapeles: ', err);
        });
    }
});

document.getElementById('call-store-btn').addEventListener('mouseenter', function() {
    function joinPhoneNumber(parts) {
        return parts.join('');
    }

    const phoneNumber = totalCart > 7500 ? joinPhoneNumber(phoneNumberHigh) : joinPhoneNumber(phoneNumberLow);
    const formattedPhoneNumber = `+${phoneNumber}`;

    const button = document.getElementById('call-store-btn');
    button.innerHTML = `<img src="./icons/phone-outgoing.svg" alt="Llamar"> Llamar: ${formattedPhoneNumber}`;
});

document.getElementById('call-store-btn').addEventListener('mouseleave', function() {
    const button = document.getElementById('call-store-btn');
    // button.textContent = 'Llamar';
    button.innerHTML = '<img src="./icons/phone-outgoing.svg" alt="Llamar"> Llamar'
});


 // JavaScript para manejar la apertura y cierre del modal
 document.getElementById('openModal').onclick = function() {
    document.getElementById('termsModal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('termsModal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('termsModal')) {
        document.getElementById('termsModal').style.display = 'none';
    }
}

function getRandomTime(min, max) {
    return Math.random() * (max - min) + min;
}

function startBlinking() {
    const contactButton = document.getElementById('contact-store-btn');
    const randomTime = getRandomTime(10000, 60000);

    setTimeout(() => {
        contactButton.classList.add('blinking-btn');

        setTimeout(() => {
            contactButton.classList.remove('blinking-btn');
            startBlinking(); // Reiniciar el ciclo
        }, 2000); // Duración del cambio de color

    }, randomTime);
}