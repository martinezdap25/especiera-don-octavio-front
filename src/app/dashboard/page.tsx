"use client";

import Dashboard from "@/components/dashboard/Dahsboard";
import Spinner from "@/components/ui/Spinner";
import { useUser } from "@/context/UserContext";

function DashboardPage() {
    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <div className="min-h-[calc(100vh-5rem)] flex justify-center items-center bg-gray-100"><Spinner /></div>;
    }

    if (!isAuthenticated) {
        return <div className="min-h-[calc(100vh-5rem)] flex justify-center items-center bg-gray-100"><Spinner /></div>;
    }

    return (<div className="min-h-[calc(100vh-5rem)] bg-gray-100 flex flex-col items-center p-4 md:p-6 ">
        <Dashboard />
    </div>
    );
}

export default DashboardPage;