//Navbar escritorio/tablets

const navBarRight = document.querySelector('.navbar-right');
const menuEmail = document.querySelector('.navbar-email');
const menuHamIcon = document.querySelector('.menu');
const menuCarritoIcon = document.querySelector('.navbar-shopping-cart');
const productDetailCloseIcon = document.querySelector('.product-detail-close');
const desktopMenu = document.querySelector('.desktop-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const checkoutButton = document.getElementById('checkoutButton');

//Shopping cart menu/Product details
// const buttonProductDetailaddProductToCart = document.querySelector('.add-to-cart-button');
const asideShoppingCart = document.querySelector('#asideShoppingCart');
const productDetailContainer = document.querySelector('#productDetail');

const arrowAsideClose = document.querySelector('.arrow-close');
const cardsContainer = document.querySelector('.cards-container');
const darken = document.querySelector('.darken');

const mobileMenuLine = document.querySelector('.mobile-menu ul:nth-child(1)');
const totalProduct = document.querySelector('.product-count');
const totalPrice = document.querySelector('.price-count');

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


const productList = [];
let shoppingCart = [];

// Llamamos a esta función cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    fetch('data/articles_v2.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.products)) {
                const filteredProducts = data.products.filter(product => {
                    if (!product.visible) {
                        return false;
                    }

                    if (product.variations && Array.isArray(product.variations)) {
                        product.variations = product.variations.filter(variation => variation.visible);
                        return product.variations.length > 0;
                    }

                    return true;
                });

                // Aplicar descuentos y renderizar productos
                const productsWithDiscounts = applyDiscounts(filteredProducts);
                const sortedProducts = sortAndShuffleProducts(productsWithDiscounts);
                productList.push(...sortedProducts);

                const category = window.location.hash.substring(1) || 'all';
                filterProducts(category);
            } else {
                console.error('La propiedad "products" no existe o no es un array');
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    cargarCarritoDesdeLocalStorage();
    renderactualizarContadorCarrito(countProductsInCart());

    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    checkCartStatus();
});

 // Ordenar los productos según la categoría "audio" y mezclar los demás
function sortAndShuffleProducts(products) {
    // Filtrar los productos que pertenecen a la categoría "audio-profesional"
    const audioProducts = products.filter(product => product.category === 'audio-profesional');
    const otherProducts = products.filter(product => product.category !== 'audio-profesional');

    // Mezclar aleatoriamente los productos que no son de la categoría "audio-profesional"
    const shuffledOtherProducts = otherProducts.sort(() => 0.5 - Math.random());

    // Concatenar los productos "audio-profesional" con los otros productos mezclados
    return audioProducts.concat(shuffledOtherProducts);
}

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


// Manejador de eventos a cada enlace de la barra de navegación. 
document.querySelectorAll('.nav-link').forEach(item => {
    item.addEventListener('click', (e) => {
        mobileMenu.classList.remove('active');
        mobileMenuLine.classList.remove('active');
        e.preventDefault();
        const category = item.getAttribute('data-category');
        filterProducts(category);
        window.history.pushState({ category }, `Category: ${category}`, `#${category}`);
    });
});

window.addEventListener('popstate', (e) => {
    const category = e.state?.category || 'all';
    console.log("entra aqui");
    filterProducts(category);
});

// Declarando funciones para abrir y cerrar los contenedores
const toggleDesktopMenu = () => {
    asideShoppingCart.classList.remove('show');
    desktopMenu.classList.toggle('inactive');
};

const toggleMobileMenu = () => {
    asideShoppingCart.classList.remove('show');
    mobileMenu.classList.toggle('active');
    mobileMenuLine.classList.toggle('active');
    productDetailContainer.classList.remove('show');
    darken.classList.remove('show');
};

const toggleCarritoAside = () => {
    mobileMenu.classList.remove('active');
    mobileMenuLine.classList.remove('active');
    desktopMenu.classList.add('inactive');

    // Si el detalle del producto está abierto, ciérralo pero no alteres 'darken'
    if (productDetailContainer.classList.contains('show')) {
        productDetailContainer.classList.remove('show');
    } else {
        // Si el detalle del producto no está abierto, entonces alterna 'darken'
        darken.classList.toggle('show');
    }

    asideShoppingCart.classList.toggle('show');
    renderCart(shoppingCart);
};

const openProductDetailAside = () => {
    mobileMenu.classList.remove('active');
    mobileMenuLine.classList.remove('active');
    desktopMenu.classList.add('inactive');
    asideShoppingCart.classList.remove('show');

    productDetailContainer.classList.toggle('show');
    darken.classList.toggle('show');
};

const closeProductDetailAside = () => {
    productDetailContainer.classList.remove('show');
    
    // Verificar si el carrito está abierto antes de quitar 'darken'
    if (!asideShoppingCart.classList.contains('show')) {
        darken.classList.remove('show');
    }
};

const closeOverlays = () => {
    productDetailContainer.classList.remove('show');
    asideShoppingCart.classList.remove('show');
    darken.classList.remove('show');
};

// llamando eventos para abrir y cerrar los contenedores
menuEmail.addEventListener('click', toggleDesktopMenu);
menuHamIcon.addEventListener('click', toggleMobileMenu);
menuCarritoIcon.addEventListener('click', toggleCarritoAside);
arrowAsideClose.addEventListener('click', toggleCarritoAside);
productDetailCloseIcon.addEventListener('click', closeProductDetailAside);
darken.addEventListener('click', closeOverlays);


const shoppingPriceProducts = [];

function checkCartStatus() {
    if (shoppingCart.length === 0) {
      // Desactiva el botón si el carrito está vacío
      checkoutButton.disabled = true;
      checkoutButton.classList.add('primary-button-disabled');
      checkoutButton.classList.remove('hover-neon-effect'); 
      checkoutButton.classList.remove('primary-button-active');
    } else {
      // Activa el botón si hay elementos en el carrito
      checkoutButton.disabled = false;
      checkoutButton.classList.remove('primary-button-disabled');
      checkoutButton.classList.add('hover-neon-effect');
      checkoutButton.classList.add('primary-button-active'); 
    }
  }

const isFloat = value => Number(value) === value && value % 1 !== 0;

function formatPrice(price) {
    return price.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
}

function handleImageError(imageElement) {
    imageElement.onerror = null; // Eliminar el manejador de error existente para evitar bucles infinitos
    imageElement.src = 'https://placehold.co/600x400'; // Puedes cambiar esta URL por cualquier imagen de respaldo que prefieras
}


// Función para poner los datos del producto seleccionado en la ventana de Detalles
let currentButtonListener = null; // Definimos la variable fuera de la función para mantener su valor.
let selectedVariantID = null; // Esta variable mantendrá el ID de la variante seleccionada
const detailsProduct = product => {
    selectedVariantID = null; // Esta variable mantendrá el ID de la variante seleccionada
    console.log("Los datalle del producto son: ", product);
    openProductDetailAside();

    const detailImage = document.querySelector('#productDetail>img');
    const detailPrice = document.querySelector('.product-info p:nth-child(1)');
    const detailName = document.querySelector('.product-info p:nth-child(2)');
    const detailDescription = document.querySelector('.product-description-markdowm');
    const buttonAddToCart = document.querySelector('.add-to-cart-button');
    const imgCategoryLabel = document.querySelector('#img_category_label');
    const spanVariationKey = document.querySelector('#span_variationKey');
    const selectedSpan = document.querySelector('#img_category .selected');
    const optionsList = document.querySelector('#img_category_options');

    detailImage.onerror = () => handleImageError(detailImage);

    // Limpia las opciones anteriores y oculta el selector si no hay variantes
    spanVariationKey.innerText = '';
    selectedSpan.innerText = '';
    optionsList.innerHTML = '';
    imgCategoryLabel.style.display = product.variations && product.variations.length > 0 ? 'block' : 'none';

    // Llenar el selector de variantes si están disponibles
    if (product.variations && product.variations.length > 0) {
        selectedSpan.innerText = 'Selecciona una opción'; // Texto por defecto
        product.variations.forEach(variation => {
            const optionElement = document.createElement('li');
            optionElement.className = 'option';
            optionElement.dataset.value = variation.variantID;
            optionElement.innerText = variation.value;
            optionElement.onclick = function() {
                selectedSpan.innerText = this.innerText;
                selectedSpan.dataset.value = this.dataset.value;
                // Actualiza la imagen y el precio según la variante seleccionada
                detailImage.src = variation.images.length > 0 ? variation.images[0] : 'fallback-image-url.jpg';
                detailImage.onerror = () => handleImageError(detailImage);
                detailPrice.innerText = variation.price ? formatPrice(variation.price) : formatPrice(product.price);
            };
            optionsList.appendChild(optionElement); 
        });
        selectDefaultOption(product.variations[0]);
        selectedVariantID = product.variations[0].variantID;
    } else {
        console.log("El producto no tiene variantes");
    }

    // Mostrar detalles generales del producto
    let textKeyVariation = product.variationKey + ": ";
    spanVariationKey.innerHTML = textKeyVariation.charAt(0).toUpperCase() + textKeyVariation.slice(1);
    detailImage.src = getFirstProductImage(product);
    detailImage.onerror = () => handleImageError(detailImage);
    detailPrice.innerText = formatPrice(getFirstProductPrice(product));
    detailName.innerText = product.name;
    detailDescription.innerHTML = marked.parse(product.description); 
    
    if (currentButtonListener) {
        buttonAddToCart.removeEventListener('click', currentButtonListener);
    }

    currentButtonListener = () => {
        console.log("El valor de la variante es ", selectedVariantID);
        if (product.variations && product.variations.length > 0 && !selectedVariantID) {
            alert("Por favor, selecciona una variante del producto antes de añadir al carrito.");
        } else {
            addProductToCart(product.id, selectedVariantID); // Añade al carrito con o sin variante
            renderCart(shoppingCart);
            renderactualizarContadorCarrito(countProductsInCart());
        }
    };

    buttonAddToCart.addEventListener('click', currentButtonListener);
    
};

function selectDefaultOption(variation) {
    const detailImage = document.querySelector('#productDetail>img');
    const detailPrice = document.querySelector('.product-info p:nth-child(1)');
    const selectedSpan = document.querySelector('#img_category .selected');

    // Actualiza los detalles con la información de la variante por defecto
    selectedSpan.innerText = variation.value;
    selectedSpan.dataset.value = variation.variantID;
    detailImage.src = variation.images.length > 0 ? variation.images[0] : 'fallback-image-url.jpg';
    detailImage.onerror = () => handleImageError(detailImage);
    detailPrice.innerText = variation.price ? formatPrice(variation.price) : '';
}





// Función para agregar los productos en el main
const renderProducts = arr => {
    arr.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        
        const firstImage = getFirstProductImage(product);
             
        const productImg = document.createElement('img');
        productImg.setAttribute('src', firstImage);
        productImg.setAttribute('alt', product.name);
        productImg.setAttribute('loading', 'lazy');
        productImg.classList.add('cur-p');
        productImg.addEventListener('click', function () {
            detailsProduct(product);
        });
        productImg.onerror = function(){
            this.onerror = null;
            this.src = 'https://placehold.co/600x400';
        }

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        const productInfoDiv = document.createElement('div');

        // Determinar el precio del producto
        const price = getFirstProductPrice(product);
        const productPrice = document.createElement('p');
        productPrice.classList.add('price');
        productPrice.innerText = formatPrice(price);


        // Crear el precio original tachado si existe
        if (product.originalPrice) {
            const originalPrice = document.createElement('p');
            originalPrice.innerText = formatPrice(product.originalPrice);
            originalPrice.classList.add('original-price'); // Clase CSS para estilo

            productInfoDiv.appendChild(originalPrice);
        }
        
        // Crear el nombre del producto según las variaciones
        const productName = document.createElement('p');
        if (product.variations && product.variations.length > 0) {
            const firstVariation = product.variations[0];
            productName.innerText = `${product.name} - ${product.variationKey}: ${firstVariation.value}`;
        } else {
            productName.innerText = product.name;
        }

        productInfoDiv.appendChild(productPrice);
        productInfoDiv.appendChild(productName);

        const productInfoFigure = document.createElement('figure');
        const productImgCard = document.createElement('img');
        productImgCard.setAttribute('src', './icons/bt_add_to_cart.svg');
        productImgCard.classList.add('cur-p');


        // productInfoFigure.addEventListener('click', function () {
        //     addProductToCart(product.id);
        //     renderCart(shoppingCart);
        //     renderactualizarContadorCarrito(contarProductosEnCarrito(shoppingCart));
        // });

        // Modificación para controlar el comportamiento del botón de añadir al carrito
        if (!product.variations || product.variations.length === 0) {
            // Si no hay variaciones, permitir añadir al carrito directamente
            productInfoFigure.addEventListener('click', function () {
                addProductToCart(product.id);
                renderCart(shoppingCart);
                renderactualizarContadorCarrito(countProductsInCart());
            });
        } else {
            // Si hay variaciones, redirigir a los detalles del producto
            productInfoFigure.addEventListener('click', function () {
                detailsProduct(product);
            });
        }

        productInfoFigure.appendChild(productImgCard);

        productInfo.appendChild(productInfoDiv);
        productInfo.appendChild(productInfoFigure);

        productCard.appendChild(productImg);
        productCard.appendChild(productInfo);

        cardsContainer.appendChild(productCard);
    });
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

    function getFirstProductPrice(product){
        return product.price ? product.price : 
        (product.variations && product.variations.length > 0 && product.variations[0].price ? product.variations[0].price : 'Precio no disponible');
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



function filterProducts(category) {
    let filteredProducts = [];
    if (category === 'all') {
        filteredProducts = productList;
    } else {
        filteredProducts = productList.filter(product => product.category === category);
    }
    cardsContainer.innerHTML = '';
    renderProducts(filteredProducts);
}

function addProductToCart(productId, variantId = null) {
    const existingProduct = shoppingCart.find(product => 
        product.id === productId && product.variantId === variantId
    );

    if (existingProduct) {
         // Si ya existe, simplemente aumenta la cantidad
        existingProduct.quantity += 1;
    } else {
         // Si no existe, añadir nuevo producto con la variante al carrito
        shoppingCart.push({ 
            id: productId, 
            variantId: variantId, 
            quantity: 1 
        });
    }
      // Guardar el carrito actualizado en localStorage
    syncCartToLocalStorage();

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "left",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} 
    }).showToast();
    
    checkCartStatus();
}

function syncCartToLocalStorage() {
    // Convertir el array del carrito a una cadena JSON
    const carritoJSON = JSON.stringify(shoppingCart);
    localStorage.setItem('carrito', carritoJSON);
}

/*
 * Esta línea actualiza el shoppingCart eliminando el producto especificado.
 * Se utiliza el método .filter para crear un nuevo array que contiene todos los 
 * productos, excepto aquel cuyo ID coincide con idProducto. Esto se logra mediante
 * una función de flecha que compara el ID de cada producto en shoppingCart con 
 * idProducto. Si el ID del producto es diferente de idProducto, el producto se
 * mantiene en el nuevo array. De esta manera, el producto con idProducto es 
 * efectivamente removido del carrito.
 */
function removeFromCart(idProducto, variantId) {
    shoppingCart = shoppingCart.filter(producto => producto.id !== idProducto || producto.variantId !== variantId);
    syncCartToLocalStorage();
    checkCartStatus();
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

function cargarCarritoDesdeLocalStorage() {
    const carritoJSON = localStorage.getItem('carrito');

    // Si hay datos, convertirlos de nuevo a un array y establecer el estado del carrito
    if (carritoJSON) {
        shoppingCart = JSON.parse(carritoJSON);
    }
}

function renderactualizarContadorCarrito(totalProductos) {
    const contadorCarrito = document.querySelector('.product-count');
    if (contadorCarrito) {
        contadorCarrito.textContent = totalProductos;
    }
}

function renderCart(arrayCarrito) {
    const totalPriceContainer = asideShoppingCart.querySelector('#TotalPrice');
    const shoppingContainer = document.querySelector('.shopping-container');
    shoppingContainer.innerHTML = '';

    for (let product of arrayCarrito) {
        //Div que contiene el numero de veces que un producto esta repetido en el carrito
        const numberOfSameProduct = document.createElement('div');
        numberOfSameProduct.innerText = product.quantity;

        //Genero el contenedor del producto
        const productCartContainer = document.createElement('div');
        productCartContainer.classList.add('shopping-cart');
        
        productDetails = productList.find(producto => producto.id === product.id);

        //Genero la imagen del producto y la agrego un figure 
        const productImg = document.createElement('img');
        productImg.setAttribute('src', getFirstProductImage(productDetails, product.variantId));
        productImg.setAttribute('alt', productDetails.name);
        productImg.setAttribute('loading', 'lazy');
        productImg.classList.add('hover-neon-effect');

        const productPrice = document.createElement('p');
        const productName = document.createElement('p');
        productPrice.innerText = formatPrice(getPriceFromCart(product, productDetails));
        productName.innerText = getProductNameWithVariant(productDetails, product.variantId);
        /*
        * Este bloque de código utiliza una IIFE (Immediately Invoked Function Expression) para manejar
        * los event listeners dentro de un bucle for. Cada iteración del bucle sobrescribe 'productDetails',
        * por lo que sin esta técnica, todos los listeners referirían al último producto en el bucle.
        *
        * La IIFE captura el estado actual de 'productDetails' para cada producto y lo pasa a la función
        * del event listener. Esto asegura que cada listener tenga una copia independiente de los detalles
        * del producto, permitiendo que al hacer clic en una imagen, se muestren los detalles correctos.
        *
        * Este método puede parecer menos directo, pero es crucial para evitar errores comunes en el manejo
        * de variables dentro de bucles. Garantiza una experiencia de usuario coherente y precisa en la
        * visualización de detalles del producto.
 */
        productImg.addEventListener('click', ((details)=>{
            return () =>{
                detailsProduct(details);
            };
        })(productDetails));

        const productFigure = document.createElement('figure');
        productFigure.classList.add('cart-product-figure');
        productFigure.append(productImg, numberOfSameProduct);

        const productDeleteButton = document.createElement('img');
        productDeleteButton.setAttribute('src', './icons/icon_close.png');
        productDeleteButton.setAttribute('alt', 'close');
        productDeleteButton.addEventListener('click', function () {
            removeFromCart(product.id, product.variantId);
            renderCart(shoppingCart);
            renderactualizarContadorCarrito(countProductsInCart());

            const totalCarrito = calculateTotalCart(shoppingCart);
            totalPriceContainer.innerText = formatPrice(totalCarrito);
        });

        //Integro todos los componentes
        productCartContainer.append(productFigure, productName, productPrice, productDeleteButton);
        shoppingContainer.appendChild(productCartContainer);

        const totalCarrito = calculateTotalCart(shoppingCart);
        totalPriceContainer.innerText = formatPrice(totalCarrito);
    }
}

function getPriceFromCart(cartItem, product) {
    // Verificar si el cartItem tiene un variantId
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

function countProductsInCart() {
    return shoppingCart.reduce((total, item) => total + item.quantity, 0);
}


   ////////////////////////////////////
  // prerequisite utility functions //
 // the real stuff starts below    //
////////////////////////////////////
var util = {
	f: {
		addStyle: function (elem, prop, val, vendors) {
			var i, ii, property, value
			if (!util.f.isElem(elem)) {
				elem = document.getElementById(elem)
			}
			if (!util.f.isArray(prop)) {
				prop = [prop]
				val = [val]
			}
			for (i = 0; i < prop.length; i += 1) {
				var thisProp = String(prop[i]),
					thisVal = String(val[i])
				if (typeof vendors !== "undefined") {
					if (!util.f.isArray(vendors)) {
						vendors.toLowerCase() == "all" ? vendors = ["webkit", "moz", "ms", "o"] : vendors = [vendors]
					}
					for (ii = 0; ii < vendors.length; ii += 1) {
						elem.style[vendors[i] + thisProp] = thisVal
					}
				}
				thisProp = thisProp.charAt(0).toLowerCase() + thisProp.slice(1)
				elem.style[thisProp] = thisVal
			}
		},
		cssLoaded: function (event) {
			var child = util.f.getTrg(event)
			child.setAttribute("media", "all")
		},
		events: {
			cancel: function (event) {
				util.f.events.prevent(event)
				util.f.events.stop(event)
			},
			prevent: function (event) {
				event = event || window.event
				event.preventDefault()
			},
			stop: function (event) {
				event = event || window.event
				event.stopPropagation()
			}
		},
		getSize: function (elem, prop) {
			return parseInt(elem.getBoundingClientRect()[prop], 10)
		},
		getTrg: function (event) {
			event = event || window.event
			if (event.srcElement) {
				return event.srcElement
			} else {
				return event.target
			}
		},
		isElem: function (elem) {
			return (util.f.isNode(elem) && elem.nodeType == 1)
		},
		isArray: function(v) {
			return (v.constructor === Array)
		},
		isNode: function(elem) {
			return (typeof Node === "object" ? elem instanceof Node : elem && typeof elem === "object" && typeof elem.nodeType === "number" && typeof elem.nodeName==="string" && elem.nodeType !== 3)
		},
		isObj: function (v) {
			return (typeof v == "object")
		},
		replaceAt: function(str, index, char) {
			return str.substr(0, index) + char + str.substr(index + char.length);
		}
	}
},
   //////////////////////////////////////
  // ok that's all the utilities      //
 // onto the select box / form stuff //
//////////////////////////////////////
form = {
f: {
	init: {
		register: function () {
			// console.clear()// just cuz codepen
			var child, children = document.getElementsByClassName("field"), i
			for (i = 0; i < children.length; i += 1) {
				child = children[i]
				util.f.addStyle(child, "Opacity", 1)
			}
			children = document.getElementsByClassName("psuedo_select")
			for (i = 0; i < children.length; i += 1) {
				child = children[i]
				child.addEventListener("click", form.f.select.toggle)
			}
		},
		unregister: function () {
			//just here as a formallity
			//call this to stop all ongoing timeouts are ready the page for some sort of json re-route
		}
	},
	select: {
		blur: function (field) {
			field.classList.remove("focused")
			var child, children = field.childNodes, i, ii, nested_child, nested_children
			for (i = 0; i < children.length; i += 1) {
				child = children[i]
				if (util.f.isElem(child)) {
					if (child.classList.contains("deselect")) {
						child.parentNode.removeChild(child)
					} else if (child.tagName == "SPAN") {
						if (!field.dataset.value) {
							util.f.addStyle(child, ["FontSize", "Top"], ["16px", "32px"])
						}
					} else if (child.classList.contains("psuedo_select")) {
						nested_children = child.childNodes
						for (ii = 0; ii < nested_children.length; ii += 1) {
							nested_child = nested_children[ii]
							if (util.f.isElem(nested_child)) {
								if (nested_child.tagName == "SPAN") {
									if (!field.dataset.value) {
										util.f.addStyle(nested_child, ["Opacity", "Transform"], [0, "translateY(24px)"])
									}
								} else if (nested_child.tagName == "UL") {
										util.f.addStyle(nested_child, ["Height", "Opacity"], [0, 0])
								}
							}
						}
					}
				}
			}
		},
		focus: function (field) {
			field.classList.add("focused")
			var bool = false, child, children = field.childNodes, i, ii, iii, nested_child, nested_children, nested_nested_child, nested_nested_children, size = 0
			for (i = 0; i < children.length; i += 1) {
				child = children[i]
				util.f.isElem(child) && child.classList.contains("deselect") ? bool = true : null
			}
			if (!bool) {
				child = document.createElement("div")
				child.className = "deselect"
				child.addEventListener("click", form.f.select.toggle)
				field.insertBefore(child, children[0])
			}
			for (i = 0; i < children.length; i += 1) {
				child = children[i]
				if (util.f.isElem(child) && child.classList.contains("psuedo_select")) {
					nested_children = child.childNodes
					for (ii = 0; ii < nested_children.length; ii += 1) {
						nested_child = nested_children[ii]
						if (util.f.isElem(nested_child) && nested_child.tagName == "UL") {
							size = 0
							nested_nested_children = nested_child.childNodes
							for (iii = 0; iii < nested_nested_children.length; iii += 1) {
								nested_nested_child = nested_nested_children[iii]
								if (util.f.isElem(nested_nested_child) && nested_nested_child.tagName == "LI") {
									size += util.f.getSize(nested_nested_child, "height")
									console.log("size: " + size)
								}
							}
							util.f.addStyle(nested_child, ["Height", "Opacity"], [size + "px", 1])
						}
					}
				}
			}
		},
        selection: function (child, parent) {
            // Variables para manejar la selección y estilos
            var children = parent.childNodes, i, ii, nested_child, nested_children, time = 0, value;
            
            // Si 'child' y 'parent' son elementos válidos
            if (util.f.isElem(child) && util.f.isElem(parent)) {
                // Establece el valor lógico de 'parent' al valor de 'data-value' de 'child'
                parent.dataset.value = child.dataset.value;
                // Captura el texto de 'child'
                value = child.textContent || child.innerText;
            }
            
            // Buscar el span de selección y actualizarlo
            var selectedSpan = parent.querySelector('.selected');
            if (selectedSpan) {
                selectedSpan.textContent = value;
            }
        
            // Ahora debes actualizar el estilo de los elementos según corresponda
            // y cerrar el menú desplegable si está abierto.
            for (i = 0; i < children.length; i += 1) {
                child = children[i];
                if (util.f.isElem(child) && child.classList.contains("psuedo_select")) {
                    nested_children = child.childNodes;
                    for (ii = 0; ii < nested_children.length; ii += 1) {
                        nested_child = nested_children[ii];
                        if (util.f.isElem(nested_child) && nested_child.classList.contains("selected")) {
                            // Aquí se maneja la animación de desaparición del span seleccionado.
                            if (nested_child.innerHTML) {
                                time = 100;
                                util.f.addStyle(nested_child, ["Opacity", "Transform"], [0, "translateY(24px)"], "all");
                            }
                            // Actualiza el span seleccionado después de la animación.
                            setTimeout((function (c, v) {
                                return function () {
                                    c.innerHTML = v;
                                    util.f.addStyle(c, ["Opacity", "Transform", "TransitionDuration"], [1, "translateY(0px)", ".1s"], "all");
                                };
                            })(nested_child, value), time);
                        }
                    }
                } else if (child.tagName == "SPAN" && child !== selectedSpan) {
                    // Aquí se actualiza el estilo del span si no es el seleccionado.
                    util.f.addStyle(child, ["FontSize", "Top"], ["12px", "8px"]);
                }
            }
            
            // Log para depurar
            selectedVariantID = parent.dataset.value;
            // console.log('Valor seleccionado:', parent.dataset.value);
        },
        
		toggle: function (event) {
			util.f.events.stop(event)
			var child = util.f.getTrg(event), children, i, parent
			switch (true) {
				case (child.classList.contains("psuedo_select")):
				case (child.classList.contains("deselect")):
					parent = child.parentNode
					break
				case (child.classList.contains("options")):
					parent = child.parentNode.parentNode
					break
				case (child.classList.contains("option")):
					parent = child.parentNode.parentNode.parentNode
					form.f.select.selection(child, parent)
					break
			}
			parent.classList.contains("focused") ? form.f.select.blur(parent) : form.f.select.focus(parent)
		}
	}
}}
window.onload = function () {
    // Inicialización del formulario
    form.f.init.register();

    // Establecer la selección por defecto
    var defaultOption = document.querySelector("#img_category_options .option[data-value='opt_1']");
    if (defaultOption) {
        form.f.select.selection(defaultOption, defaultOption.closest(".field"));
    }
    
    // // Loguear el valor seleccionado por defecto
    // var pseudoSelectDiv = document.getElementById('img_category');
    // console.log('El valor seleccionado por defecto es:', pseudoSelectDiv.dataset.value);
};

