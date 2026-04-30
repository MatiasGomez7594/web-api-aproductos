import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
//import axios from 'axios'; // Para la búsqueda rápida del cliente

export default function RegistroVenta({ productos, mediosPago }) {
    const [carrito, setCarrito] = useState([]);
    const [clienteEncontrado, setClienteEncontrado] = useState(null);
    const [emailBusqueda, setEmailBusqueda] = useState('');
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    // Dentro de tu componente RegistroVenta
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidadElegida, setCantidadElegida] = useState(1);

    const { data, setData, post, processing, reset, errors } = useForm({
        cliente_id: null,
        medio_pago_id: '',
        items: [], // Aquí enviaremos el carrito final
    });


    // --- Lógica del Carrito ---

    // 1. Cuando eligen un producto en el primer select
    const manejarSeleccionProducto = (id) => {
        const producto = productos.find(p => p.id === parseInt(id));
        setProductoSeleccionado(producto);
        setCantidadElegida(1); // Resetear a 1 cada vez que cambia el producto
    };

    // 2. Cuando hacen clic en el botón "Agregar al Carrito"
const confirmarAgregado = () => {
    if (!productoSeleccionado) return;

    // Validar que la cantidad no supere el stock
    if (cantidadElegida > productoSeleccionado.stock) {
        alert(`No hay suficiente stock. Máximo disponible: ${productoSeleccionado.stock}`);
        return;
    }

    const existe = carrito.find(item => item.product_id === productoSeleccionado.id);
    const subtotalNuevo = (Number(cantidadElegida) * Number(productoSeleccionado.precio)).toFixed(2);

    if (existe) {
        setCarrito(carrito.map(item => 
            item.product_id === productoSeleccionado.id 
            ? { 
                ...item, 
                cantidad: item.cantidad + Number(cantidadElegida), 
                subtotal: (Number(item.cantidad + Number(cantidadElegida)) * Number(productoSeleccionado.precio)).toFixed(2)
              } 
            : item
        ));
    } else {
        setCarrito([...carrito, { 
            product_id: productoSeleccionado.id, 
            nombre: productoSeleccionado.nombre, 
            cantidad: Number(cantidadElegida), 
            precio: productoSeleccionado.precio,
            subtotal: subtotalNuevo
        }]);
    }

    // Limpiar selección para el próximo producto
    setProductoSeleccionado(null);
    setCantidadElegida(1);
};

    const quitarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.product_id !== id));
    };

    // --- Búsqueda de Cliente ---
// Usando fetch en lugar de axios
const buscarCliente = async () => {
    if (!emailBusqueda) return;
    setBusquedaRealizada(true); // <--- Marcamos que ya buscamos
    try {
        const response = await fetch(`/buscar-cliente?email=${emailBusqueda}`);
        const data = await response.json();
        
        if (data.role==='cliente') {
            setClienteEncontrado(data);
            setData('cliente_id', data.id);
        } else {
            setClienteEncontrado(null);
            setData('cliente_id', null);
        }
    } catch (err) {
        console.error("Error buscando cliente", err);
        setClienteEncontrado(null);
    }
};
    // --- Envío Final ---
    const finalizarVenta = (e) => {
        e.preventDefault();
        // Cargamos el carrito en los datos del formulario antes de enviar
        router.post('/ventas', {
            ...data,
            items: carrito
        }, {
            onSuccess: () => {
                setCarrito([]);
                setClienteEncontrado(null);
                setEmailBusqueda('');
                setBusquedaRealizada(false);
                setProductoSeleccionado(null);
                setCantidadElegida(1);
                reset();
            }
        });
    };

   const totalVenta = carrito.reduce((acc, item) => {
    return acc + parseFloat(item.subtotal);
}, 0).toFixed(2);
    return (
        
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold border-b pb-2">Nueva Venta</h2>

            {/* Buscador de Cliente */}
           <div className="flex gap-2 items-center">
    <input 
        type="email" 
        placeholder="Email del cliente..."
        className="border rounded p-2 flex-1"
        value={emailBusqueda}
        onChange={e => {
            setEmailBusqueda(e.target.value);
            setBusquedaRealizada(false); // Resetear aviso si el usuario vuelve a escribir
        }}
    />

    <button onClick={buscarCliente} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
        Buscar
    </button>
</div>
<div className="mb-1">
            {/* Caso: Cliente encontrado (Verde) */}
    {clienteEncontrado && (
        <span className="text-green-600 text-sm font-bold animate-pulse">
            Nombre del cliente: {clienteEncontrado.name}
        </span>
    )}

        {/* Caso: No encontrado (Tu nuevo error en Rojo) */}
    {(busquedaRealizada && !clienteEncontrado) && (
        <span className="text-red-600 text-sm font-bold">
            ⚠ Cliente no encontrado
        </span>
    )}
</div>

            {/* Selector de Productos */}
            <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg">
    {/* Selector de Producto */}
    <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold mb-1">Producto</label>
        <select 
            className="w-full border rounded p-2"
            value={productoSeleccionado?.id || ""}
            onChange={(e) => manejarSeleccionProducto(e.target.value)}
        >
            <option value="">Elegir producto...</option>
            {productos.filter(p => p.stock > 0).map(p => (
                <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>
            ))}
        </select>
    </div>

    {/* Selector de Cantidad (Dinámico basado en el stock) */}
    <div className="w-32">
        <label className="block text-xs font-bold mb-1">Cant. (Stock: {productoSeleccionado?.stock || 0})</label>
        <select 
            className="w-full border rounded p-2"
            disabled={!productoSeleccionado}
            value={cantidadElegida}
            onChange={(e) => setCantidadElegida(e.target.value)}
            >
            {/* Creamos opciones del 1 hasta el stock disponible */}
            {productoSeleccionado ? (
                Array.from({ length: productoSeleccionado.stock }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                ))
                ) : (
                <option value="1">1</option>
                )}
            </select>
        </div>

        {/* Botón para confirmar */}
        <button 
        type="button"
        onClick={confirmarAgregado}
        disabled={!productoSeleccionado}
            className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
        >
            + Añadir
        </button>
        </div>

            {/* Detalle del Carrito */}
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Producto</th>
                        <th className="text-center py-2">Cant.</th>
                        <th className="text-right py-2">Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map(item => (
                        <tr key={item.product_id} className="border-b">
                            <td className="py-2">{item.nombre}</td>
                            <td className="text-center">{item.cantidad}</td>
                            <td className="text-right">${item.subtotal}</td>
                            <td className="text-right">
                                <button onClick={() => quitarDelCarrito(item.product_id)} className="text-red-500 font-bold ml-2">×</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="text-right text-lg font-bold text-blue-700">
                Total: ${totalVenta}
            </div>

            {/* Medio de Pago y Confirmación */}
            <div className="flex gap-4 items-end pt-4 border-t">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Medio de Pago</label>
                    <select 
                        className="w-full border rounded p-2"
                        value={data.medio_pago_id}
                        onChange={e => setData('medio_pago_id', e.target.value)}
                    >
                        <option value="">Seleccionar...</option>
                        {mediosPago.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                    {errors.medio_pago_id && <div className="text-red-500 text-xs">{errors.medio_pago_id}</div>}
                </div>
                
                <button 
                    onClick={finalizarVenta}
                    disabled={processing || carrito.length === 0}
                    className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
                
                >
                    Confirmar Venta
                </button>
            </div>
        </div>
    );
}