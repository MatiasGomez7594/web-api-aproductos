// resources/js/Components/ProductForm.jsx
import { useForm } from '@inertiajs/react';

export default function VendedorForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', role:'vendedor'
    });

    const submit = (e) => {
        console.log(data.name,data.email,data.password,data.role)
        e.preventDefault();
        post('/vendedores', {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="p-6 bg-white shadow sm:rounded-lg">
            <h3 className="text-lg font-medium mb-4">Agregar Nuevo Vendedor</h3>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <input 
                        type="text" placeholder="Nombre"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                </div>
                <div>
                    <input 
                        type="email" placeholder="email@ejemplo.com"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>
                <div>
                    <input 
                        type="password" placeholder="8 caracteres máximo"
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                    {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                </div>
                <button 
                    type="submit" disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Guardando...' : 'Añadir Vendedor'}
                </button>
            </form>
        </div>
    );
}