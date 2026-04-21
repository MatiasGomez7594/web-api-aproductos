import { useForm, router } from '@inertiajs/react';//agregamos router para eliminar
import { useState } from 'react';

// Recibimos productos e isAdmin como "props" desde el Dashboard
export default function ProductTable({ productos, isAdmin }) {
    const [editandoId, setEditandoId] = useState(null);

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        nombre: '', precio: '', stock: ''
    });

    const iniciarEdicion = (item) => {
        setEditandoId(item.id);
        setEditData({ nombre: item.nombre, precio: item.precio, stock: item.stock });
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

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((item) => (
                    <tr key={item.id}>
                        {editandoId === item.id ? (
                            <>
                                <td className="px-6 py-4">
                                    <input className="w-full border rounded p-1" value={editData.nombre} onChange={e => setEditData('nombre', e.target.value)} />
                                    {editErrors.nombre && <div className="text-red-500 text-xs">{editErrors.nombre}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <input type="number" className="w-full border rounded p-1" value={editData.precio} onChange={e => setEditData('precio', e.target.value)} />
                                    {editErrors.precio && <div className="text-red-500 text-xs">{editErrors.precio}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <input type="number" className="w-full border rounded p-1" value={editData.stock} onChange={e => setEditData('stock', e.target.value)} />
                                    {editErrors.stock && <div className="text-red-500 text-xs">{editErrors.stock}</div>}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button onClick={guardarEdicion} disabled={editProcessing} className="text-green-600 font-bold">Guardar</button>
                                    <button onClick={() => setEditandoId(null)} className="text-gray-500">Cancelar</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td className="px-6 py-4">{item.nombre}</td>
                                <td className="px-6 py-4">${item.precio}</td>
                                <td className="px-6 py-4">{item.stock}</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 space-x-4">
                                        <button onClick={() => iniciarEdicion(item)} className="text-blue-600 hover:underline">Editar</button>
                                        <button onClick={() => confirm('¿Borrar?') && router.delete(`/productos/${item.id}`)} className="text-red-600 hover:underline">Eliminar</button>
                                    </td>
                                )}
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}