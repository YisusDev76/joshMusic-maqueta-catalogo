const menuEmail = document.querySelector('.navbar-email');
const menuHamIcon = document.querySelector('.menu');
const menuCarritoIcon = document.querySelector('.navbar-shopping-cart');
const productDetailCloseIcon = document.querySelector('.product-detail-close');
const desktopMenu = document.querySelector('.desktop-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const shoppingCartContainer = document.querySelector('#shoppingCartContainer');
const productDetailContainer = document.querySelector('#productDetail');
const arrowAsideClose = document.querySelector('.arrow-close');
const cardsContainer = document.querySelector('.cards-container');
const darken = document.querySelector('.darken');

const mobileMenuLine = document.querySelector('.mobile-menu ul:nth-child(1)');

// Declarando funciones para abrir y cerrar los contenedores
const toggleDesktopMenu = () => {
    shoppingCartContainer.classList.remove('show');
    desktopMenu.classList.toggle('inactive');
};

const toggleMobileMenu = () => {
    shoppingCartContainer.classList.remove('show');
    mobileMenu.classList.toggle('active');
    mobileMenuLine.classList.toggle('active');
    productDetailContainer.classList.remove('show');
    darken.classList.remove('show');
};

const toggleCarritoAside = () => {
    mobileMenu.classList.remove('active');
    mobileMenuLine.classList.remove('active');
    desktopMenu.classList.add('inactive');
    productDetailContainer.classList.remove('show');
    darken.classList.remove('show');
    shoppingCartContainer.classList.toggle('show');
};

const openProductDetailAside = () => {
    mobileMenu.classList.remove('active');
    mobileMenuLine.classList.remove('active');
    desktopMenu.classList.add('inactive');
    shoppingCartContainer.classList.remove('show');

    productDetailContainer.classList.toggle('show');
    darken.classList.toggle('show');
};

const closeProductDetailAside = () => {
    productDetailContainer.classList.remove('show');
    darken.classList.remove('show');
};

// llamando eventos para abrir y cerrar los contenedores
menuEmail.addEventListener('click', toggleDesktopMenu);
menuHamIcon.addEventListener('click', toggleMobileMenu);
menuCarritoIcon.addEventListener('click', toggleCarritoAside);
arrowAsideClose.addEventListener('click', toggleCarritoAside);
productDetailCloseIcon.addEventListener('click', closeProductDetailAside);
darken.addEventListener('click', closeProductDetailAside);

// Lista de productos
const productList = [];
productList.push({
    name: 'CurcKua Bolsa de guitarra ajustable para concierto, acústica suave',
    price: 319.11,
    image: 'https://drive.google.com/uc?id=1dABenk4Gqe8KPGr13DijQFapufpTrg7d',
    category:'accesorios',
    description:`Descripción

Bolsas ajustables para guitarra con forro grueso de esponja, la bolsa de guitarra ayuda a proteger tu guitarra de cualquier posible daño. Mayor capacidad, permite que la funda de guitarra se adapte a la guitarra de hasta 41 pulgadas. Alfombrilla de goma antideslizante en la parte inferior que evita que se resbale al estar de pie. Bolsa exterior ideal para guardar accesorios. Ayuda a proteger de golpes y rasguños. Se adapta a todas las marcas y modelos de guitarras acústicas y clásicas de tamaño completo.

Características
Bolsa para guitarra
- Color: negro.
- Material: tela Oxford 600D.
- Tamaño: 41.7 x 16.5 x 5.1 pulgadas.
Dureza: suave.
Añade grosor de algodón: 5 mm.
Aplicar a: guitarra acústica de 40/41 pulgadas.
Peso: 600 g.

El paquete incluye:
1 bolsa para guitarra`,
});
productList.push({
    name: `Juego de 50 picks o púas para Guitarra Eléctrica y Acústica`,
    price: 189.00,
    image: 'https://drive.google.com/uc?id=173i4KAOJypieBm507V963aAShAzf8jyQ',
    category:'accesorios',
    description:`caracteristicas:
    Hecho de material de celuloide de alta calidad, la selección es fuerte y duradera. Mano de obra fina y superficie lisa, cómoda y fácil de usar. Viene con 50 selecciones, para tus necesidades de uso prolongado. Thin one es más adecuado para barrer y Thick one es más adecuado para romper acordes y tocar notas individuales. Adecuado para varias guitarras populares, la calidad del tono es más clara y agradable.
    
    
    Presupuesto:
    
    Condición: 100% a estrenar
    
    Material: celuloide
    
    Peso aproximado. 20-28 g / 0.7-1.0 oz
    
    Color: envío aleatorio
    
    Tamaño: Aprox. 3 * 2.6 cm / 1.2 * 1.0in
    
    Opciones de espesor: 0.46 mm, 0.7 mm
    
    
    
    Lista de paquetes:
    
    50 * Elegir`,
});
productList.push({
    name: 'Ernie Ball Regular Slinky - Cuerdas para bajo de escala corta',
    price: 339.56,
    image: 'https://drive.google.com/uc?id=1569KtUu0udm0QnSHz2KChhynqUsqJAur',
    category:'accesorios',
    description:`Cuerdas de bajo Slinky de escala corta
    Uno de los líderes mundiales en cuerdas de bajo eléctrico. Durante más de 50 años, las cuerdas de guitarra eléctrica Ernie Ball Slinky han sido las favoritas de los músicos de todo el mundo, la receta de la firma de Ernie Ball consta de medidores específicos y proporciones de núcleo para envolver para armónicos ricos y equilibrados y esa sensación de Slinky. Utilizando las materias primas más finas y frescas, cada cuerda se fabrica en el clima seco del sur de California utilizando tecnología de bobinado de última generación y sometiendo a estrictos estándares de control de calidad. Las cuerdas de bajo bajo Slinky están hechas de acero chapado en níquel envuelto alrededor de un núcleo de acero de alto carbono chapado en estaño para un tono equilibrado que complementa todos los tipos de bajos eléctricos y estilos de juego. Cada juego está empaquetado en un ambiente de humedad ultra baja con el embalaje Element Shield de Ernie Ball para garantizar que cada juego esté tan fresco como el día en que se hizo.`,
});
productList.push({
    name: `Ernie Ball Earthwood Extra Light - Cuerdas para guitarra acústica`,
    price: 150.24,
    image: 'https://drive.google.com/uc?id=1rM8K2GgkGMb7UbENxDAw-DmQwl-Ri1P0',
    category:'accesorios',
    description:`Cuerdas para guitarra acústica Earthwood 80/20 Bronze
    Fabricadas con un alambre con 80 % de cobre y 20 % de cinc entorchado sobre un núcleo hexagonal de acero chapado en latón. Las cuerdas para acústica Ernie Ball 80/20 Bronze producen un sonido cristalino y brillante con armónicos agradables. Disponibles en Extra Light (10-50), Light (11-52), Custom Light (11.5-54), Medium Light (12-54), Custom Medium (12.5-56), Medium (13-56), Rock and Blues (10-52),12-String Light (9-46), 12-string Custom Light (10-48) y 12-String Medium (11-28).`,
});
productList.push({
    name: 'Violín acústico',
    price: 1199.00,
    image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    category:'instrumentos',
    description:`Descripción del producto
    【Violín para principiantes】: Este violín es un instrumento de cuerda ideal para cualquier estudiante con sueños musicales y puede satisfacer todas las necesidades de los principiantes que comienzan a aprender. Asegúrese de manipularlos con cuidado para proteger la apariencia y el sonido del violín de su hijo`,
});
productList.push({
    name: `DSP 1260D - Bafle Activo 12" - 600W RMS`,
    price: 6020.00,
    image: 'https://drive.google.com/uc?id=1QqEMO24PkwusT10hjIZyfjpyjP2gDFBb',
    category:'audio-prof',
    description:`La etapa de potencia de toda la serie DSP está basada en amplificaciones clase D, esto garantiza el mayor aprovechamiento de energía, entregando calidad sonora.
    
    CARACTERISTÍCAS
Gabinete multifuncional para uso como monitor de piso o PA principal compacto
Altavoz de 12”
Potencia 600W RMS
Alimentación 120V~60Hz
4 Presets de EQ.
Incluye DSP
    `,
});
productList.push({
    name: 'YAMAHA Guitarra clásica serie C',
    price: 3220.00,
    image: 'https://drive.google.com/uc?id=1s-Y2dd3A-TBk172dNobwWjHJraYzxogP',
    category:'instrumentos',
    description:`Yamaha CM40 Guitarra Clásica Acústica
    Perfecta para principiantes
    
    La CM40 es la versión mate de nuestra clásica de iniciación más famosa, la C40. Una fina capa de laca satinada proporciona un tacto más agradable y suave
    
    Un alto nivel de fabricación artesanal y una gran atención al detalle dan como resultado instrumentos de excelente calidad.
    
    Las guitarras de la serie C son instrumentos con una magnífica relación costo-prestaciones para principiantes y jóvenes estudiantes, y que ofrecen gran comodidad al tocar y un sonido formidable.`,
});
productList.push({
    name: 'YAMAHA GB1KPE Piano de Cola Negro',
    price: 274999.20,
    image: 'https://images.pexels.com/photos/322719/pexels-photo-322719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category:'instrumentos',
    description:`GB1KPE Piano de Cola Yamaha Negro; Con su sonido magníficamente rico y su toque sensible, la serie GB1K evoca la emoción musical de un piano de cola, pero en una escala más compacta. La insistencia inflexible por conseguir un sonido y una resonancia excelentes, pone a nuestra disposición un piano a un precio asequible que se ajusta a tu espacio.

    SKU: 17092141 MODEL: PGB1KPE
    `,
});
productList.push({
    name: 'RIUKOE - Par de luces LED SlimPAR RGBW para DJ',
    price: 3383.22,
    image: 'https://drive.google.com/uc?id=1j24kmnRR2sBGNcFFqRg9FU5S8p5PWeSD',
    category:'iluminacion',
    description:`Fabricado de alta calidad
    Está construido con carcasa de aluminio fundido a presión, duradero y no plástico, y viene con piezas de materias primas de buena calidad como la fuente LED de Taiwán. Lo hace duradero y digno.
    
    Lavado ligero de colores brillantes
    Mientras que como construcción resistente, pequeña y delgada, todavía viene con salida de luz de alto brillo. Los datos Lux muestran que tiene una salida de hasta 8550 lux a 1 m
    
    Funcionamiento silencioso completo
    Adopta un disipador de calor y el diseño de la carcasa del hueco en el exterior para enfriar, por lo que el interior sin ventilador es completamente silencioso cuando trabajas, ilumina tu espacio sin ruido.`,
});
productList.push({
    name: 'TRIXTER Luces De Escenario,',
    price: 459,
    image: 'https://drive.google.com/uc?id=1Szyseu1krqze8nCHdp_JDccnxfRKVbIB',
    category:'iluminacion',
    description:`TRIXTER CAÑON 36*3W
    Lámpara LED para diversión de tus fiestas tipo DJ, con 36leds RGB de 3W cada uno, 6 en 1, funciona automáticamente y con sonido(música), variables colores de luz para intercambiar (rojo, verde y azul), maestro esclavo (es decir controla uno o más procesos), (no incluye cables), botón de menú, botones para cambiar el modo de luz que desee, conectores de entrada y salida, base articulada y cable de luz led integrado, base articulada desarmable, y 2 tornillos.
    
    Los colores cambian de acuerdo al modo del menú que elija.
    
    Este cañón, cuenta con LED´s RGB individuales, es decir, en cada LED, están los tres colores: Rojo, Verde y Azul.
    
    RECOMENDACIONES:
    
    NO EXCEDERSE DEL VOLTAJE RECOMENDADO
    NO VER DIRECTAMENTE LA LUZ LED AL PRENDERLO
    PRECAUCIONES:
    
    NO SE DEJE EXPUESTO AL RAYO DEL SOL DE MANERA PROLONGADA
    NO SE DEJE AL ALCANCE DE NIÑOS MENORES DE 3 AÑOS
    CONTENIDO:
    
    INCLUYE BASE ARTICULADA
    
    NO INCLUYE CABLES DE ENTRADA Y SALIDA DE AUDIO XLR`,
});
productList.push({
    name: 'NT 1000',
    price: 21000,
    image: 'https://drive.google.com/uc?id=1Pqi4yLJKjOhUIPp4TdJUGDSkibEG2_h8',
    category:'audio-prof',
    description:`NT1000 es la respuesta de MELO a los profesionales que trabajan en lugares donde la estética es
    un tema fundamental, que requieren gran potencia en equipos compactos.
    
    CARACTERISTÍCAS
    NT1000
    • Columna activa.
    • Equipado con un amplificador de 1000W RMS.
    • Sonido potente y claro.
    • 129 db SPL pico.

    NT1000 sistema activo de columna con un subwoofer
    de 15” de ferrita, 4 bocinas de 5” en neodimio y
    un driver de 1.75” de neodimio montado en una guía de onda
    plana, el bafle esta fabricado en triplay de 15mm.`,
});
productList.push({
    name: 'Micrófono WM301 - Melo Sound Of Music',
    price: 10500,
    image: 'https://drive.google.com/uc?id=1OBUHa1dD8RAc7TZ0zmZYU5u6ZqZyLfSI',
    category:'mricrofonia',
    description:`El nuevo WM301 brinda un excelente sonido, claridad y seguridad. Sistema inalámbrico dedicado a oradores, cantantes, guitarristas o bajistas que requieren un sistema inalámbrico profesional a un excelente precio. Se conforma por una cápsula lavalier, una diadema, cable TS para instrumento, transmisor y receptor, ¡3 opciones de conexión en un solo equipo!
    CARACTERÍSTICAS
Modo de Modulación:
Banda ancha FM
Rango de Frecuencia:
640 – 690 MHz
Respuesta de Frecuencia de audio:
30-20KHz/±2dB
Relación Señal / Ruido:
96 dB
Distorsión:
≤0.1%
Distancia de Trabajo / Alcance:
Hasta 200 metros.
    `,
});

// Declaración de selectores y array para Shopping Cart
const shoppingContainer = document.querySelector('.shopping-container');
const totalProduct = document.querySelector('.product-count');
const totalPrice = document.querySelector('.price-count');
const shoppingPriceProducts = [];

// Función para sunar el precio de los productos en el carrito
const addPriceProducts = arr => {
    let total = 0;
    arr.forEach(product => (total += product));
    return total;
};

// Agregar producto en 'Shopping Cart'
const addShopping = product => {
    const shoppingCart = document.createElement('div');
    shoppingCart.classList.add('shopping-cart');

    const shoppingFigure = document.createElement('figure');
    const productImg = document.createElement('img');
    productImg.setAttribute('src', product.image);
    productImg.setAttribute('alt', product.name);
    shoppingFigure.appendChild(productImg);

    const productName = document.createElement('p');
    productName.innerText = product.name;
    const productPrice = document.createElement('p');
    productPrice.innerText = product.price;

    const removeIcon = document.createElement('img');
    removeIcon.setAttribute('src', './icons/icon_close.png');
    removeIcon.setAttribute('alt', 'close');
    removeIcon.classList.add('cur-p');
    removeIcon.addEventListener('click', removeShopping);

    shoppingCart.appendChild(shoppingFigure);
    shoppingCart.appendChild(productName);
    shoppingCart.appendChild(productPrice);
    shoppingCart.appendChild(removeIcon);

    shoppingContainer.appendChild(shoppingCart);

    totalProduct.innerText = shoppingContainer.childElementCount;
    totalPrice.innerText =
        parseInt(totalPrice.textContent.substring(1)) + product.price;
    shoppingPriceProducts.push(product.price);

    totalPrice.innerText = `$${addPriceProducts(shoppingPriceProducts)}`;

    // Función para eliminar producto de 'Shopping Cart'
    function removeShopping() {
        shoppingCart.remove();
        totalProduct.innerText = shoppingContainer.childElementCount;

        const totalValue = document.querySelector('.price-count');
        const totalCurrentValue =
            parseInt(totalValue.textContent.substring(1)) - product.price;

        totalValue.innerText = `$${totalCurrentValue}`;
        shoppingPriceProducts.push(product.price - product.price * 2);
    }
};

// Función para poner los datos del producto seleccionado en la ventana de Detalles
const detailsProduct = product => {
    openProductDetailAside();

    const detailImage = document.querySelector('#productDetail>img');
    const detailPrice = document.querySelector('.product-info p:nth-child(1)');
    const detailName = document.querySelector('.product-info p:nth-child(2)');
    const detailDescription = document.querySelector(
        '.product-info p:nth-child(3)'
    );

    detailImage.setAttribute('src', product.image);
    detailPrice.innerText = `$${product.price}`;
    detailName.innerText = product.name;
    detailDescription.innerText = product.description;
};

// Función para agregar los productos en el main
const renderProducts = arr => {
    for (let product of arr) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImg = document.createElement('img');
        productImg.setAttribute('src', product.image);
        productImg.setAttribute('alt', product.name);
        productImg.classList.add('cur-p');
        productImg.addEventListener('click', function () {
            detailsProduct(product);
        });

        const productInfo = document.createElement('div');
        productInfo.classList.add('product-info');

        const productInfoDiv = document.createElement('div');

        const productPrice = document.createElement('p');
        productPrice.innerText = `$${product.price}`;
        const productName = document.createElement('p');
        productName.innerText = `${product.name}`;

        productInfoDiv.appendChild(productPrice);
        productInfoDiv.appendChild(productName);

        const productInfoFigure = document.createElement('figure');
        const productImgCard = document.createElement('img');
        productImgCard.setAttribute('src', './icons/bt_add_to_cart.svg');
        productImgCard.classList.add('cur-p');
        productInfoFigure.addEventListener('click', function () {
            addShopping(product);
        });

        productInfoFigure.appendChild(productImgCard);

        productInfo.appendChild(productInfoDiv);
        productInfo.appendChild(productInfoFigure);

        productCard.appendChild(productImg);
        productCard.appendChild(productInfo);

        cardsContainer.appendChild(productCard);
    }
};


renderProducts(productList);
