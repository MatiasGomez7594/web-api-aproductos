export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">Mi Tienda Online</h1>
                <div className="space-x-4">
                    <button className="font-medium">Catalogo</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Carrito (0)</button>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}