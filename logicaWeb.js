// Llama al div con nombre de id "formulario"(Donde se va a imprimir todo en el html)
const form = document.getElementById("formulario");
// Arrays de los productos para el carrito y tienda
let listaTienda = [];
let listaCarrito = [];
// Pedido de la lista de productos desde el json "prod"
fetch("prod.json")
    .then(res => res.json())
    .then(response => {
        listaTienda = response;
    })
    .catch(err => console.error('Error al cargar prod.json:', err));
// Variables para almacenar los datos del comprador al finalizar la compra
let nombre = "";
let apellido = "";
let direccion = "";
// Verifica si el carrito tiene productos
let productosCarrito = false;
function actualizarCarrito() {
    productosCarrito = listaCarrito.length > 0;
}
// Recupera el carrito del localStorage al cargar la página
const cargarCarrito = () => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        listaCarrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
};
// Suma los precios de cada producto del carrito
function sumarPrecios() {
    let total = 0;
    // Itera sobre cada producto en el carrito
    for (let i = 0; i < listaCarrito.length; i++) {
        let productoPrecio = listaCarrito[i].precio;
        let cantidad = listaCarrito[i].cantidad; // Obtiene la cantidad del producto
        // Suma el precio multiplicado por la cantidad al total.
        total += productoPrecio * cantidad; 
    }
    return total;
}
// Agrega productos al carrito
const agregarProducto = (nombreProducto, boton) => {
    const producto = listaTienda.find(p => p.nombre === nombreProducto);
    if (producto) {
        const productoEnCarrito = listaCarrito.find(p => p.nombre === producto.nombre);
        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, solo incrementa la cantidad
            productoEnCarrito.cantidad += 1;
        } else {
            // Si no está, se agrega con cantidad 1
            listaCarrito.push({ ...producto, cantidad: 1 });
        }
        actualizarCarrito();
        localStorage.setItem("carrito", JSON.stringify(listaCarrito));
        
        // Cambiar el texto del botón temporalmente
        const textoOriginal = boton.innerText;
        boton.innerText = "¡Producto agregado!";
        
        // Añade Toastify para los popups de agregar al carrito
        Toastify({
            text: "Entendido, Lo agrego al carrito!!",
            className: "info",
            style: {
                background: "linear-gradient(to top,#ff5348 , #e20e00)",
            },
            offset: {
                x: 18,
                y: 20 
            }
        }).showToast();
        boton.disabled = true;
        setTimeout(() => {
            boton.innerText = textoOriginal;
            boton.disabled = false;
        }, 950);
    }
};
// Quita productos del carrito
const quitaProducto = (nombreProducto) => {
    const index = listaCarrito.findIndex(p => p.nombre === nombreProducto);
    
    // Verifica si el producto está en el carrito
    if (index !== -1) {
        const productoEnCarrito = listaCarrito[index];
        
        // Si hay más de uno, simplemente decrementamos la cantidad
        if (productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad -= 1;
        } else {
            // Si es el último, lo eliminamos del carrito
            listaCarrito.splice(index, 1);
        }
        
        actualizarCarrito();
        localStorage.setItem("carrito", JSON.stringify(listaCarrito));
        menuCarrito();
    }
};
//---Despliegue de los menus---
// Menu principal
const menuPrincipal = function() {
    localStorage.setItem("carrito", JSON.stringify(listaCarrito));
    form.innerHTML = 
    `
    <h1>MENU PRINCIPAL</h1>
    <h2>¡Bienvenido al menu principal de la tienda!</h2>
    <button id="irTienda">Haz clic aquí para ir a la tienda</button>
    <button id="irCarrito">Haz clic aquí para ir al carrito</button>
    `;
    
    // Añade eventos a los botones
    document.getElementById("irTienda").addEventListener("click", menuTienda);
    document.getElementById("irCarrito").addEventListener("click", () => {
        actualizarCarrito();
        menuCarrito();
    });
};
// Menu del carrito de compras
const menuCarrito = function() {
    actualizarCarrito();
    let contenidoHTML = 
    `
    <h1>TU CARRITO</h1>
    <div class="contenedor-productos">
    `;
    
    // Si no hay productos añadidos al carrito
    if (!productosCarrito) {
        contenidoHTML += `
        </div>
        <h2>EL carrito se encuentra vacío</h2>
        <button id="volverMenuPrincipal">Haz clic aquí para ir al menú principal</button>
        `;
    } else {
        // Si hay productos añadidos al carrito
        listaCarrito.forEach((element, index) => {
            contenidoHTML += `
                <div class="producto carrito">
                    <h2 class="nombre-producto">${element.nombre} ${element.cantidad > 1 ? `x${element.cantidad}` : ''}</h2>
                    <p class="precio">$${element.precio} pesos</p>
                    <button id="quitarProducto-${index}">Eliminar Producto</button><br>
                </div>
            `;
        });
        // Se suma el final de la pagina a la variable
        contenidoHTML += 
        `
        </div>
            <h3>Valor total del carrito: $${sumarPrecios()} pesos</h3>    
            <button id="volverMenuPrincipal">Haz clic aquí para ir al menú principal</button>
            <button id="comprar">Comprar Productos del carrito</button>
        `;
    }

    // Asigna el contenido acumulado al div "formulario"
    form.innerHTML = contenidoHTML;

    // Añade eventos a los botones
    document.getElementById("volverMenuPrincipal").addEventListener("click", menuPrincipal);
    
    if (productosCarrito) {
        document.getElementById("comprar").addEventListener("click", menuConfirm);
        
        // Evento para quitar el producto del carrito
        listaCarrito.forEach((element, index) => {
            const button = document.getElementById(`quitarProducto-${index}`);
            if (button) {
                button.addEventListener("click", () => {
                    quitaProducto(element.nombre);
                    menuCarrito(); // Recargar el menú del carrito después de quitar un producto
                });
            }
        });
    }
};
// Menu donde se compran los productos
const menuTienda = function() {
    let contenidoHTML = `
    <h1>CATALOGO DE LA TIENDA</h1>
    <div class="contenedor-productos">
    `; 

    // Itera sobre listaTienda para generar los productos
    listaTienda.forEach((element, index) => {
        contenidoHTML += `
        <div class="producto">
            <h2 class="nombre-producto">${element.nombre}</h2>
            <p class="descripcion">Descripcion: ${element.descripcion}</p>
            <p class="precio">$: ${element.precio} pesos</p>
            <button id="agregarProducto-${index}">Agregar Producto al Carrito</button>
        </div>
        `;
    });
    contenidoHTML += `
    </div>
    <button id="volverMenuPrincipal">Haz clic aquí para ir al menú principal</button>
    <button id="irCarrito">Haz clic aquí para ir al carrito</button>
    `;

    form.innerHTML = contenidoHTML;

    // Añade eventos a los botones
    listaTienda.forEach((element, index) => {
        const button = document.getElementById(`agregarProducto-${index}`);
        if (button) {
            button.addEventListener("click", () => {
                agregarProducto(element.nombre, button);
            });
        }
    });
    document.getElementById("volverMenuPrincipal").addEventListener("click", menuPrincipal);
    document.getElementById("irCarrito").addEventListener("click", () => {
        actualizarCarrito();
        menuCarrito();
    });
};
// Menu de confirmacion antes de la compra
const menuConfirm = function(){
    let contenidoHTML = 
    `
    <h1>!ATENCION USTED ESTA COMPRANDO!</h1>
    <h2>Estos son los productos seleccionados para la compra:</h2>
    <div class="contenedor-productos">
    `
    listaCarrito.forEach((element, index) => {
        contenidoHTML += 
        `
            <div class="producto">
                    <h2 class="nombre-producto">${element.nombre}</h2>
                    <p class="precio">$ ${element.precio} pesos</p>
                    <p class="nombre-producto">Cantidad: ${element.cantidad}</p>
                </div>
            `;
        });
        
        contenidoHTML += 
        `
        </div>
        <h3>TOTAL A PAGAR: $${sumarPrecios()} pesos.</h3>
        <button id="aceptarCompra">COMPRAR</button>
        <button id="cancelarCompra">CANCELAR COMPRA</button>
    `;
    form.innerHTML = contenidoHTML;

    // Añadir eventos a los botones
    document.getElementById("aceptarCompra").addEventListener("click", menuDatos);
    document.getElementById("cancelarCompra").addEventListener("click", menuCarrito);
};
// Menu para la recaudacion de informacion del comprador
const menuDatos = function(){
    form.innerHTML = 
    `
    <h1>Datos del comprador</h1>
    <div class="contenedor-resumen">
    <h2>Para poder continuar con la compra se requieren algunos datos:</h2>
        <label class="label-datos" for="nombre">Su nombre:</label>
        <input type="text" id="nombre" placeholder="Introduzca su nombre aqui"><br><br>
        
        <label class="label-datos" for="apellido">Su apellido:</label>
        <input type="text" id="apellido" placeholder="Introduzca su apellido aqui"><br><br>

        <label class="label-datos" for="direccion">El lugar de entrega:</label>
        <input type="text" id="direccion" placeholder="Introduzca su direccion aqui"><br><br>

        <button id="submitDatos">Enviar Datos</button>
        <button id="cancelarDatos">Cancelar Compra</button>
    </div>
    `;
    
    // Añadir eventos a los botones
    document.getElementById("submitDatos").addEventListener("click", () => {
        // Comprueba que los campos para ingresar los datos no estan vacios, si lo estan lleva al menu de error
        if (document.getElementById("nombre").value === ""|| document.getElementById("apellido").value === "" || document.getElementById("direccion").value  === "") {
            menuError()
        } else {
            nombre = document.getElementById("nombre").value;
            apellido = document.getElementById("apellido").value;
            direccion = document.getElementById("direccion").value;
            menuResumen()
        }
    });
    
    document.getElementById("cancelarDatos").addEventListener("click", () => {
        menuPrincipal();
    });
}
// Menu de error por si los campos donde se ingresan los datos no estan completos
const menuError = function(){
    let contenidoHTML = 
    `
    <h1>LOS DATOS INTRODUCIDOS NO SON LOS SOLICITADOS</h1>
    <button id="reIntroducirDatos">Intentar Otra vez</button>
    `
    form.innerHTML = contenidoHTML;

    document.getElementById("reIntroducirDatos").addEventListener("click", () => {
        menuDatos();
    });
}
// Menu de resumen de compra
const menuResumen = function(){
    let contenidoHTML = 
    `
    <h1>RESUMEN DE COMPRA:</h1>
    <div class="contenedor-resumen">
    <p class="resumen">Los siguientes productos seran enviados a ${direccion}:</p>
    `
    // Itera e imprime la lista del carrito que se compro
    listaCarrito.forEach((element, index) => {
        contenidoHTML += 
        `
            <ul class="producto-resumen">Producto N°${index+1}: ${element.nombre} $${element.precio} pesos. X${element.cantidad}</ul>
        `;
    });
    contenidoHTML +=
    `
    <p class="resumen">Y deberan ser resibidos por ${nombre} ${apellido}, para abonar un total de $${sumarPrecios()} pesos.</p>
    <p class="resumen">!MUCHAS GRACIAS POR SU COMPRA!</p>
    <button id="volverMenu">Volver al menu principal</button>
    </div>
    `
    form.innerHTML = contenidoHTML;

    // Agrgar eventos a los botones
    document.getElementById("volverMenu").addEventListener("click", menuPrincipal);
    // Vacia el carrito y actualiza el localstorage
    listaCarrito = [];
    localStorage.setItem("carrito", JSON.stringify(listaCarrito));
}
// --INICIA EL PROGRAMA--
// Carga el carrito del localstorage al iniciar
cargarCarrito();
// Inicia el MENU de la tienda :)
menuPrincipal();