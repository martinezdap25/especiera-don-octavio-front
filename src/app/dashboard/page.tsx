"use client";

import Dashboard from "@/components/dashboard/Dahsboard";
import Spinner from "@/components/ui/Spinner"; // Asegúrate de que la ruta sea correcta
import { useUser } from "@/context/UserContext";

function DashboardPage() {
    const { isAuthenticated, isLoading } = useUser();

    // 1. Mientras se verifica la sesión, muestra un spinner.
    //    Esto evita un parpadeo del contenido antes de la posible redirección.
    if (isLoading) {
        return <div className="min-h-[calc(100vh-5rem)] flex justify-center items-center"><Spinner /></div>;
    }

    // 2. Si no está autenticado, NextAuth (configurado en [..nextauth]/route.ts)
    //    ya debería haber iniciado la redirección a /login. Mostramos el spinner
    //    o null para cubrir el breve instante antes de que la redirección se complete.
    if (!isAuthenticated) {
        return <div className="min-h-[calc(100vh-5rem)] flex justify-center items-center"><Spinner /></div>;
    }

    // 3. Si está autenticado, renderiza el contenido del Dashboard.
    return (<div className="min-h-[calc(100vh-5rem)] bg-gray-100 flex flex-col items-center p-4 md:p-6 ">
        <Dashboard />
    </div>
    );
}

export default DashboardPage;