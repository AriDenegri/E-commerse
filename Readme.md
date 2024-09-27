# Documentación del archivo `logicaWeb.js`

## ¿Qué hace el código?
El código propuesto simula un sistema básico de e-commerce que permite al usuario interactuar con una tienda virtual, agregar productos a un carrito de compras, visualizar el carrito, eliminar productos y finalizar una compra proporcionando datos de envío.

## Estructura del programa

1. **Inicialización del programa:**
   - Al inicio, se crea la plantilla de los productos para posteriormente pasarle los datos de cada uno y que se cree de manera automatica, ademas, se define el estado del carrito como vacío (`productosCarrito = false`), ya que no se ha agregado ningún producto aún. Las dos listas creadas son : una con productos disponibles para la compra desde la tienda (`listaTienda`) y otra para los que esten en el carrito (`listaCarrito`).

2. **Menús del programa:**
   - El programa tiene varios menús que permiten al usuario navegar y realizar acciones en la tienda:
     - **Menú principal (`menuPrincipal`)**: Permite al usuario elegir entre ver el carrito o ver la tienda.
     - **Menú del carrito (`menuCarrito`)**: Si los hay, muestra los productos en el carrito, el total a pagar, y ofrece opciones eliminar productos o finalizar la compra.
     - **Menú de la tienda (`menuTienda`)**: Muestra la lista de productos disponibles y permite al usuario agregar productos al carrito.
     - **Menú de confirmación de compra (`menuConfirm`)**: Muestra un resumen de los productos en el carrito, el total, y pide confirmación para proceder con la compra.
     - **Obtención de datos para el envío (`menuDatos`)**: Solicita al usuario su nombre,apellido y el lugar de entrega para completar la compra. Una vez proporcionados los datos, el programa muestra un resumen de la compra ya concretada.

3. **Validación y control de errores:**
   - Si los datos de envío no son proporcionados correctamente (nombre, apellido y dirección), se ofrece la oportunidad de volver a ingresarlos. (Se concidera que un dato es erroneo cuando el campo esta vacio.)

4. **Cálculo del total:**
   - El total a pagar se calcula sumando los precios de los productos que el usuario ha agregado al carrito. Esto se realiza en la función `sumarPrecios`, que recorre el carrito y suma los precios de cada producto.

5. **Estado del carrito:**
   - El estado del carrito (si está vacío o no) se actualiza constantemente mediante la función `actualizarCarrito`, que verifica si hay productos en el carrito y ajusta la variable `productosCarrito` en consecuencia.

## Funcionalidades clave actuales
- Mejora de interfas por DOM en referencia a la vercion pasada de la app, que se interaccionaba por notificaciones.
- Perduracion de carrito de compras. (localStorage)
- Habilitar productos en la tienda de manera automatica.
- Visualizar el carrito con el listado de productos y el total a pagar.
- Eliminar productos del carrito.
- Confirmar la compra proporcionando datos personales (nombre y dirección de entrega).
- Reseteo automático del carrito una vez completada la compra.

## Posibles funcionalidades futuras
- Productos a la medida, elegir diseño, color etc (dentro de un catalogo de opciones)
- Eliminacion de duplicados y remplazo por la cantidad del producto añadido EJ:  *Ahora: Libro, libro // Depues: Libro X2.*
- Eleccion de abonar con metodo combeniente y validacion de targeta de credito real.
- Mejoras en el apartado visual(imagenes,animaciones,colores) y sintaxis de toda la pagina.
- Sistema de Login y Registro. (Perdurable en el tiempo).
- Sistema de productos recomendados (Numero aleatorio de likes cada que se recarga la pagina y puesta en principal)
- Modo noche.
