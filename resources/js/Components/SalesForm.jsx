// resources/js/Components/SalesForm.jsx
import { useForm } from '@inertiajs/react';

export default function SalesForm({ productos }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: '',
        cantidad: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/ventas', { onSuccess: () => reset() ,
        onError: (err) => console.log(err) // Esto te ayuda a ver errores de validación
        })
    };

    return (
        <div className="p-6 bg-green-50 shadow sm:rounded-lg">
            <h3 className="text-lg font-bold text-green-800 mb-4">Registrar Venta</h3>
            <form onSubmit={submit} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Producto</label>
                    <select 
                        className="w-full border-gray-300 rounded-md"
                        value={data.product_id}
                        onChange={e => setData('product_id', e.target.value)}
                    >
                        <option value="">Seleccione un producto</option>
                        {productos.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>
                        ))}
                    </select>
                </div>
                <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                    <input 
                        type="number" 
                        className="w-full border-gray-300 rounded-md"
                        value={data.cantidad}
                        onChange={e => setData('cantidad', e.target.value)}
                    />
                </div>
                <button 
                    disabled={processing}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                    Vender
                </button>
            </form>
            {errors.cantidad && <p className="text-red-500 text-xs mt-2">{errors.cantidad}</p>}
        </div>
    );
}