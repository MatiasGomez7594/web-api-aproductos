// resources/js/Components/ProductForm.jsx
import { useForm } from '@inertiajs/react';

export default function ProductForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '', precio: '', stock: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post('/productos', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="p-6 bg-white shadow sm:rounded-lg">
            <h3 className="text-lg font-medium mb-4">Agregar Nuevo Producto</h3>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <input 
                        type="text" placeholder="Nombre"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.nombre}
                        onChange={e => setData('nombre', e.target.value)}
                    />
                    {errors.nombre && <div className="text-red-500 text-sm">{errors.nombre}</div>}
                </div>
                <div>
                    <input 
                        type="number" placeholder="Precio"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.precio}
                        onChange={e => setData('precio', e.target.value)}
                    />
                    {errors.precio && <div className="text-red-500 text-sm">{errors.precio}</div>}
                </div>
                <div>
                    <input 
                        type="number" placeholder="Stock"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.stock}
                        onChange={e => setData('stock', e.target.value)}
                    />
                    {errors.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}
                </div>
                <button 
                    type="submit" disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Guardando...' : 'Añadir Producto'}
                </button>
            </form>
        </div>
    );
}