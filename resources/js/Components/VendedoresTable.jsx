import { useForm, router } from '@inertiajs/react';//agregamos router para eliminar
import { useState } from 'react';

// Recibimos vendedores e isAdmin como "props" desde el Dashboard
export default function vendedoresTable({ vendedores, isAdmin }) {
    const [editandoId, setEditandoId] = useState(null);

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        nombre: '', email: '', contrasena:''
    });

    const iniciarEdicion = (vendedor) => {
        setEditandoId(vendedor.id);
        setEditData({ name: vendedor.name, email: vendedor.email, contrasena: vendedor.contrasena });
    };

    const guardarEdicion = (e) => {
        e.preventDefault();
        put(`/vendedores/${editandoId}`, {
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrasena</th>
                    {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {vendedores.map((vendedor) => (
                    <tr key={vendedor.id}>
                        {editandoId === vendedor.id ? (
                            <>
                                <td className="px-6 py-4">
                                    <input className="w-full border rounded p-1" value={editData.name} onChange={e => setEditData('name', e.target.value)} />
                                    {editErrors.name && <div className="text-red-500 text-xs">{editErrors.name}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <input type="email" className="w-full border rounded p-1" value={editData.email} onChange={e => setEditData('email', e.target.value)} />
                                    {editErrors.email && <div className="text-red-500 text-xs">{editErrors.email}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <input type="password" className="w-full border rounded p-1" value={editData.contrasena} onChange={e => setEditData('contrasena', e.target.value)} />
                                    {editErrors.contrasena && <div className="text-red-500 text-xs">{editErrors.contrasena}</div>}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button onClick={guardarEdicion} disabled={editProcessing} className="text-green-600 font-bold">Guardar</button>
                                    <button onClick={() => setEditandoId(null)} className="text-gray-500">Cancelar</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td className="px-6 py-4">{vendedor.name}</td>
                                <td className="px-6 py-4">{vendedor.email}</td>
                                <td className="px-6 py-4">********</td>
                                {isAdmin && (
                                    <td className="px-6 py-4 space-x-4">
                                        <button onClick={() => iniciarEdicion(vendedor)} className="text-blue-600 hover:underline">Editar</button>
                                        <button onClick={() => confirm('¿Borrar?') && router.delete(`/vendedores/${vendedor.id}`)} className="text-red-600 hover:underline">Eliminar</button>
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