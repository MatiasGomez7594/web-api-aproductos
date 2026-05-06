import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head}  from '@inertiajs/react'; // Agregamos router aqui para eliminar

import VendedorForm from '@/Components/VendedorForm'; // <-- IMPORTAMOS EL NUEVO COMPONENTE formproduct

import VendedoresTable from '@/Components/VendedoresTable'; // <-- IMPORTAMOS EL NUEVO COMPONENTE tableproduct
export default function Dashboard({ auth, vendedores}) {
    //verifico si es admin
    const isAdmin = auth.user.role === 'admin';
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Vendedores</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {isAdmin && (<VendedorForm/>)}
                    {/* --- TABLA DE vendedores --- */}
                    <div className="p-6 bg-white shadow sm:rounded-lg">
                    {/* Pasamos los vendedores e isAdmin como PROPS */}
                    <VendedoresTable vendedores={vendedores} isAdmin={isAdmin} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
