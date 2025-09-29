import Image from "next/image";

function Spinner() {
    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <div className="relative flex justify-center items-center h-20 w-20">
                {/* Círculo giratorio */}
                <div className="absolute animate-spin rounded-full h-full w-full border-4 border-amber-200 border-t-amber-600"></div>
                
                {/* Logo estático en el centro */}
                <Image
                    src="https://res.cloudinary.com/dsugc0qfa/image/upload/v1757541902/Logo-Don-Octavio_aal0rw.png"
                    alt="Cargando"
                    width={40}
                    height={40}
                    className="opacity-80"
                />
            </div>
            <p className="text-amber-800 font-semibold animate-pulse">Cargando...</p>
        </div>
    );
}

export default Spinner;
