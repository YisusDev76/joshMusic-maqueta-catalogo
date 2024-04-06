//Navbar escritorio/tablets
const navBarRight = document.querySelector('.navbar-right');

const menuEmail = document.querySelector('.navbar-email');
const menuHamIcon = document.querySelector('.menu');
const menuCarritoIcon = document.querySelector('.navbar-shopping-cart');
const productDetailCloseIcon = document.querySelector('.product-detail-close');
const desktopMenu = document.querySelector('.desktop-menu');
const mobileMenu = document.querySelector('.mobile-menu');

//Shopping cart menu/Product details
const buttonProductDetailaddProductToCart = document.querySelector('.add-to-cart-button');
const asideShoppingCart = document.querySelector('#asideShoppingCart');
const productDetailContainer = document.querySelector('#productDetail');

const arrowAsideClose = document.querySelector('.arrow-close');
const cardsContainer = document.querySelector('.cards-container');
const darken = document.querySelector('.darken');

const mobileMenuLine = document.querySelector('.mobile-menu ul:nth-child(1)');

const testProducts = [{id: 1, name: 'Producto Test', price: 100, variations: [{ images: ['https://placehold.co/600x400'] }]}];
const productList = [];
let carritoGlobal = [];
let checkoutButton;
// Llamamos a esta función cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    fetch('../data/articles_v2.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data.products)) {
                productList.push(...data.products);
                renderProducts(productList);
            } else {
                console.error('La propiedad "products" no existe o no es un array');
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));
    cargarCarritoDesdeLocalStorage(),
    renderactualizarContadorCarrito(contarProductosEnCarrito(carritoGlobal));

    //Para que al dar click ocurra el filtrado por categorias:
    const category = window.location.hash.substring(1) || 'all';
    filterProducts(category);
});

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
    filterProducts(category);
});

document.addEventListener('DOMContentLoaded', () => {
    checkoutButton = document.getElementById('checkoutButton');
  
    checkoutButton.addEventListener('click', () => {
      window.location.href = 'checkout.html'; // Cambia esto por la URL de tu página de contacto
    });

    checkCartStatus();
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
    renderCart(carritoGlobal);
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

// Declaración de selectores y array para Shopping Cart
// const shoppingContainer = document.querySelector('.shopping-container');
const totalProduct = document.querySelector('.product-count');
const totalPrice = document.querySelector('.price-count');
const shoppingPriceProducts = [];

function checkCartStatus() {
    console.log("entra a checkar el status");
    if (carritoGlobal.length === 0) {
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

// Función para poner los datos del producto seleccionado en la ventana de Detalles
let currentButtonListener = null; // Definimos la variable fuera de la función para mantener su valor.
const detailsProduct = product => {
    openProductDetailAside();

    const detailImage = document.querySelector('#productDetail>img');
    const detailPrice = document.querySelector('.product-info p:nth-child(1)');
    const detailName = document.querySelector('.product-info p:nth-child(2)');
    const detailDescription = document.querySelector('.product-info p:nth-child(3)');
    const buttonAddToCart = document.querySelector('.add-to-cart-button');

    //Actualizar la info del producto
    detailImage.setAttribute('src', product.image);
    detailPrice.innerText = `$${product.price}`;
    detailName.innerText = product.name;
    detailDescription.innerText = product.description;

    if (currentButtonListener) {
        //Eliminar cualquier oyente de eventos anteior al boton
        buttonAddToCart.removeEventListener('click', currentButtonListener);
    }

    //Crear una Nueva funcion de oyente de eventos
    currentButtonListener = () => {
        // console.log("Se esta ejecunatando el listener");
        addProductToCart(product.id);
        renderCart(carritoGlobal);
        renderactualizarContadorCarrito(contarProductosEnCarrito(carritoGlobal));
    }

    //Agregar el nuevi oyente de eventos al boton
    buttonAddToCart.addEventListener('click', currentButtonListener);
};

// Función para agregar los productos en el main
const renderProducts = arr => {
    arr.forEach(product => {
        console.log(product);
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Determinar la imagen principal del producto
        const firstImage = product.images ? product.images[0] : 
                           (product.variations && product.variations.length > 0 ? product.variations[0].images[0] : 'https://placehold.co/600x400');                   
        
        const productImg = document.createElement('img');
        productImg.setAttribute('src', firstImage);
        productImg.setAttribute('alt', product.name);
        productImg.classList.add('cur-p');
        productImg.addEventListener('click', function () {
            detailsProduct(product);
        });

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        const productInfoDiv = document.createElement('div');

        // Determinar el precio del producto
        const price = product.price ? product.price : 
                      (product.variations && product.variations.length > 0 && product.variations[0].price ? product.variations[0].price : 'Precio no disponible');

        const productPrice = document.createElement('p');
        productPrice.innerText = formatPrice(price);

        const productName = document.createElement('p');
        productName.innerText = product.name;

        productInfoDiv.appendChild(productPrice);
        productInfoDiv.appendChild(productName);

        const productInfoFigure = document.createElement('figure');
        const productImgCard = document.createElement('img');
        productImgCard.setAttribute('src', './icons/bt_add_to_cart.svg');
        productImgCard.classList.add('cur-p');
        productInfoFigure.addEventListener('click', function () {
            addProductToCart(product.id);
            renderCart(carritoGlobal);
            renderactualizarContadorCarrito(contarProductosEnCarrito(carritoGlobal));
        });

        productInfoFigure.appendChild(productImgCard);

        productInfo.appendChild(productInfoDiv);
        productInfo.appendChild(productInfoFigure);

        productCard.appendChild(productImg);
        productCard.appendChild(productInfo);

        cardsContainer.appendChild(productCard);
    });
};


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

function addProductToCart(idProducto) {
    const productoExistente = carritoGlobal.find(producto => producto.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carritoGlobal.push({ id: idProducto, cantidad: 1 });
    }
    guardarCarritoEnLocalStorage();
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      checkCartStatus();
}

/*
 * Esta línea actualiza el carritoGlobal eliminando el producto especificado.
 * Se utiliza el método .filter para crear un nuevo array que contiene todos los 
 * productos, excepto aquel cuyo ID coincide con idProducto. Esto se logra mediante
 * una función de flecha que compara el ID de cada producto en carritoGlobal con 
 * idProducto. Si el ID del producto es diferente de idProducto, el producto se
 * mantiene en el nuevo array. De esta manera, el producto con idProducto es 
 * efectivamente removido del carrito.
 */
function removeFromCart(idProducto) {
    carritoGlobal = carritoGlobal.filter(producto => producto.id !== idProducto);
    guardarCarritoEnLocalStorage();
    checkCartStatus();
}


// Función para buscar el precio de un producto por su ID
function buscarPrecioPorId(id) {
    const producto = productList.find(p => p.id === id);
    return producto ? producto.price : 0;
}

// Función para calcular el total del carrito
function calcularTotalCarrito(carrito) {
    return carrito.reduce((total, item) => {
        const precio = buscarPrecioPorId(item.id);
        return total + (precio * item.cantidad);
    }, 0);
}

function guardarCarritoEnLocalStorage() {
    // Convertir el array del carrito a una cadena JSON
    const carritoJSON = JSON.stringify(carritoGlobal);
    localStorage.setItem('carrito', carritoJSON);
}

function cargarCarritoDesdeLocalStorage() {
    const carritoJSON = localStorage.getItem('carrito');

    // Si hay datos, convertirlos de nuevo a un array y establecer el estado del carrito
    if (carritoJSON) {
        carritoGlobal = JSON.parse(carritoJSON);
    }
}

function contarProductosEnCarrito(carrito) {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
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
        numberOfSameProduct.innerText = product.cantidad;

        //Genero el contenedor del producto
        const productCartContainer = document.createElement('div');
        productCartContainer.classList.add('shopping-cart');

        productDetails = productList.find(producto => producto.id === product.id);

        //Genero la imagen del producto y la agrego un figure 
        const productImg = document.createElement('img');
        productImg.setAttribute('src', productDetails.image);
        productImg.setAttribute('alt', productDetails.name);
        productImg.classList.add('hover-neon-effect');
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

        //Agrego el precio y nombre del producto
        const productPrice = document.createElement('p');
        const productName = document.createElement('p');
        productPrice.innerText = formatPrice(productDetails.price);
        productName.innerText = productDetails.name;

        //Agrego la imagen para quitar el producto del carrito junto con el evento para eliminarlo y hacer un update de precios
        const productDeleteButton = document.createElement('img');
        productDeleteButton.setAttribute('src', './icons/icon_close.png');
        productDeleteButton.setAttribute('alt', 'close');
        productDeleteButton.addEventListener('click', function () {
            removeFromCart(product.id);
            renderCart(carritoGlobal);
            renderactualizarContadorCarrito(contarProductosEnCarrito(carritoGlobal));

            const totalCarrito = calcularTotalCarrito(carritoGlobal);
            totalPriceContainer.innerText = formatPrice(totalCarrito);
        });

        //Integro todos los componentes
        productCartContainer.append(productFigure, productName, productPrice, productDeleteButton);
        shoppingContainer.appendChild(productCartContainer);

        const totalCarrito = calcularTotalCarrito(carritoGlobal);
        totalPriceContainer.innerText = formatPrice(totalCarrito);
    }
}