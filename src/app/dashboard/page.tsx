"use client";

import Dashboard from "@/components/dashboard/Dahsboard";
import withAuth from "@/components/auth/withAuth";

function DashboardPage() {
    return (<div className="min-h-[calc(100vh-5rem)] bg-gray-100 flex flex-col items-center p-4 md:p-6 ">
        <Dashboard />
    </div>
    );
}

export default withAuth(DashboardPage);