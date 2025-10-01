import Link from "next/link";
import { FiInstagram, FiFacebook, FiPhone } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="bg-amber-800 text-white mt-auto">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Info */}
                    <div className="text-center md:text-left">
                        <h3 className="font-bold text-lg text-amber-200">Don Octavio</h3>
                        <p className="text-sm text-amber-100/80">Condimentos frescos y de calidad.</p>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-amber-100/80">
                            <FiPhone size={14} />
                            <span>+54 9 385 476-3310</span>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex gap-4">
                        <Link href="#" className="text-amber-200 hover:text-white transition-colors">
                            <FiInstagram size={24} />
                        </Link>
                        <Link href="#" className="text-amber-200 hover:text-white transition-colors">
                            <FiFacebook size={24} />
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-amber-700/50 mt-6 pt-6 text-center text-xs text-amber-100/60">
                    <p>
                        &copy; {new Date().getFullYear()} Don Octavio. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}