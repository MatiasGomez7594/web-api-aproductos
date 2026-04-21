import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Agregamos router aqui para eliminar

import { useState } from 'react'; // Agrega useState a tus imports




export default function Dashboard({ auth, productos = [] }) {

    // para editar
const [editandoId, setEditandoId] = useState(null);

// En tus hooks:
const { 
    data: editData, 
    setData: setEditData, 
    put, 
    processing: editProcessing, 
    errors: editErrors, // <--- Importante: capturar los errores de edición
    reset: resetEdit 
} = useForm({
    nombre: '', 
    precio: '', 
    stock: ''
});

const iniciarEdicion = (item) => {
    setEditandoId(item.id);
    setEditData({
        nombre: item.nombre,
        precio: item.precio,
        stock: item.stock,
    });
};

const guardarEdicion = (e) => {
    e.preventDefault();
    put(`/productos/${editandoId}`, {
        onSuccess: () => {
            setEditandoId(null);
            resetEdit();
        },
    });
};
    // Configuramos el formulario con Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        precio: '',
        stock: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/productos', {
            onSuccess: () => reset(), // Limpia el formulario al terminar
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Stock</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* --- FORMULARIO DE ALTA --- */}
                    <div className="p-6 bg-white shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Agregar Nuevo Producto</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Nombre"
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                />
                                {errors.nombre && <div className="text-red-500 text-sm">{errors.nombre}</div>}
                            </div>

                            <div>
                                <input 
                                    type="number" 
                                    placeholder="Precio"
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.precio}
                                    onChange={e => setData('precio', e.target.value)}
                                />
                                {errors.precio && <div className="text-red-500 text-sm">{errors.precio}</div>}
                            </div>

                            <div>
                                <input 
                                    type="number" 
                                    placeholder="Stock"
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                />
                                {errors.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Añadir Producto'}
                            </button>
                        </form>
                    </div>

                    {/* --- TABLA DE PRODUCTOS --- */}
                    <div className="p-6 bg-white shadow sm:rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                        {productos.map((item) => (
    <tr key={item.id}>
{editandoId === item.id ? (
    <>
        <td className="px-6 py-4">
            <input 
                className={`w-full border rounded p-1 ${editErrors.nombre ? 'border-red-500' : ''}`}
                value={editData.nombre}
                onChange={e => setEditData('nombre', e.target.value)} 
            />
            {editErrors.nombre && <div className="text-red-500 text-xs mt-1">{editErrors.nombre}</div>}
        </td>
        
        <td className="px-6 py-4">
            <input 
                type="number"
                className={`w-full border rounded p-1 ${editErrors.precio ? 'border-red-500' : ''}`}
                value={editData.precio}
                onChange={e => setEditData('precio', e.target.value)} 
            />
            {editErrors.precio && <div className="text-red-500 text-xs mt-1">{editErrors.precio}</div>}
        </td>

        <td className="px-6 py-4">
            <input 
                type="number"
                className="w-full border rounded p-1"
                value={editData.stock}
                onChange={e => setEditData('stock', e.target.value)} 
            />
            {editErrors.stock && <div className="text-red-500 text-xs mt-1">{editErrors.stock}</div>}
        </td>
        
        <td className="px-6 py-4 space-x-2">
            <button 
                onClick={guardarEdicion} 
                disabled={editProcessing}
                className="text-green-600 font-bold disabled:opacity-50"
            >
                {editProcessing ? '...' : 'Guardar'}
            </button>
            <button onClick={() => setEditandoId(null)} className="text-gray-500">Cancelar</button>
        </td>
    </>
    ) : (
    /* ... vista normal ... */

            // --- VISTA NORMAL ---
            <>
                <td className="px-6 py-4">{item.nombre}</td>
                <td className="px-6 py-4">${item.precio}</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4 space-x-4">
                <button onClick={() => iniciarEdicion(item)} className="text-blue-600 hover:underline">Editar</button>
                <button 
                onClick={() => {
                // El confirm debe envolver la llamada al router.delete
                if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
                    router.delete(`/productos/${item.id}`);
                }
                }}
                className="text-red-600 hover:underline"
                >
                Eliminar
                </button>                
                </td>
            </>
        )}
    </tr>
))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}