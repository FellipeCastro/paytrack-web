import { Link } from "react-router-dom";

const Layout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        PT
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">
                                    PayTrack
                                </span>
                            </Link>
                        </div>
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            Voltar para home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-gray-600">{subtitle}</p>
                        )}
                    </div>
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} PayTrack. Todos os direitos
                        reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
