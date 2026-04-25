import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head}  from '@inertiajs/react'; // Agregamos router aqui para eliminar

import ProductForm from '@/Components/ProductForm'; // <-- IMPORTAMOS EL NUEVO COMPONENTE formproduct

import ProductTable from '@/Components/ProductTable'; // <-- IMPORTAMOS EL NUEVO COMPONENTE tableproduct
import SalesForm from '@/Components/SalesForm'; // <-- IMPORTAMOS EL NUEVO COMPONENTE SalesForm


export default function Dashboard({ auth, productos = [] }) {
    //verifico si es admin
    const isAdmin = auth.user.role === 'admin';
    const isVendedor = auth.user.role === 'vendedor';
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Stock</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {isAdmin && (<ProductForm/>)}
                    {(isVendedor) && <SalesForm productos={productos} />}
                    {/* --- TABLA DE PRODUCTOS --- */}
                    <div className="p-6 bg-white shadow sm:rounded-lg">
                    {/* Pasamos los productos e isAdmin como PROPS */}
                    <ProductTable productos={productos} isAdmin={isAdmin} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}