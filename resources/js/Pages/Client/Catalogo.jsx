import React, { useState, useEffect } from 'react';



export default function Catalogo({ productos }) {
    // Inicializar carrito desde el almacenamiento del navegador
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem('carrito_cliente');
        return guardado ? JSON.parse(guardado) : [];
    });

    // Guardar automáticamente en el navegador cada vez que el carrito cambie
    useEffect(() => {
        localStorage.setItem('carrito_cliente', JSON.stringify(carrito));
    }, [carrito]);
const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    const cantidadActual = existe ? existe.cantidad : 0;

    // Validamos contra el stock que vino de la base de datos
    if (cantidadActual + 1 > producto.stock) {
        alert(`Lo sentimos, solo quedan ${producto.stock} unidades de ${producto.nombre}`);
        return;
    }

    if (existe) {
        setCarrito(carrito.map(item => 
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        ));
    } else {
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
};

/*
    const finalizarCompra = async () => {
    if (carrito.length === 0) return alert("Tu carrito está vacío");

    const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    try {
        const response = await fetch('/api/confirmar-pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Si usas CSRF en Laravel para API, aquí iría el token
            },
            body: JSON.stringify({
                cliente_id: 1, // Temporalmente hardcodeado
                medio_pago_id: 1,
                total: totalVenta,
                items: carrito
            })
        });

        const resData = await response.json();

        if (response.ok) {
            alert(resData.message);
            setCarrito([]); // Limpiar carrito local
            localStorage.removeItem('carrito_cliente'); // Limpiar almacenamiento
        }
    } catch (error) {
        console.error("Error al enviar el pedido:", error);
    }
};
*/
const finalizarCompra = async () => {
    console.log("1. Botón presionado. Carrito actual:", carrito);

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    try {
        console.log("2. Enviando petición a la API...");
        const response = await fetch('/api/confirmar-pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // Ayuda a Laravel a entender que es una API
            },
            body: JSON.stringify({
                cliente_id: 1, 
                medio_pago_id: 1,
                total: totalVenta,
                items: carrito
            })
        });

        console.log("3. Respuesta recibida. Status:", response.status);

        const resData = await response.json();
        console.log("4. Datos del servidor:", resData);

        if (response.ok) {
            alert("¡Venta guardada con éxito!");
            setCarrito([]);
            localStorage.removeItem('carrito_cliente');
        } else {
            alert("Error del servidor: " + (resData.message || "Desconocido"));
        }
    } catch (error) {
        console.error("5. ERROR FATAL:", error);
    }
};


    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header con el contador del Carrito */}
            <header className="flex justify-between items-center mb-10 bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Nuestra Tienda</h1>
                <div className="relative cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full">
                    🛒 Carrito ({totalItems})
                </div>
            </header>

            {/* Listado de Productos tipo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {productos.map(p => {
    const itemEnCarrito = carrito.find(item => item.id === p.id);
    const sinStock = itemEnCarrito && itemEnCarrito.cantidad >= p.stock;

    return (
        <div key={p.id} className="border p-4 rounded">
            <div className="bg-gray-200 h-40 w-full rounded-lg mb-4 flex items-center justify-center text-gray-400">
                [Imagen del producto]
            </div>
            <h2 className="text-lg font-bold text-gray-700">{p.nombre}</h2>
            <p className="text-sm text-gray-500 mb-2">Disponible: {p.stock}</p>
            <div className="mt-4">
                <p className="text-xl font-black text-blue-600 mb-3">${p.precio}</p>

            <button 
                disabled={sinStock || p.stock === 0}
                onClick={() => agregarAlCarrito(p)}
                className={`px-4 py-2 rounded ${sinStock ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
            >
                {sinStock ? 'Sin stock disponible' : 'Añadir'}
            </button>
            </div>

        </div>
    );
})}

              
            </div>
        
        {/* ... resto del código del catálogo ... */}

{/* Barra de Finalizar Compra (Solo se ve si hay items) */}
{carrito.length > 0 && (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500 uppercase font-bold">Total a pagar</p>
                <p className="text-2xl font-black text-blue-700">
                    ${carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">{carrito.length} productos seleccionados</p>
            </div>
            
            <div className="flex gap-4">
                <button 
                    onClick={() => { setCarrito([]); localStorage.removeItem('carrito_cliente'); }}
                    className="text-red-500 font-bold px-4 py-2 hover:bg-red-50"
                >
                    Vaciar
                </button>
                
                <button 
                    onClick={finalizarCompra}
                    className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold px-10 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                    Finalizar Compra
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
}