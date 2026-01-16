// components/Layout.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaBars,
    FaTimes,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaHome,
    FaCreditCard,
    FaFolder,
    FaChartBar,
    FaBell,
} from "react-icons/fa";

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50";
    };

    const navItems = [
        { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
        {
            path: "/subscriptions",
            icon: <FaCreditCard />,
            label: "Assinaturas",
        },
        { path: "/categories", icon: <FaFolder />, label: "Categorias" },
        { path: "/reports", icon: <FaChartBar />, label: "Relatórios" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header/Navbar */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <button
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="mr-4 text-gray-600 hover:text-blue-600 md:hidden"
                            >
                                {mobileMenuOpen ? (
                                    <FaTimes className="w-6 h-6" />
                                ) : (
                                    <FaBars className="w-6 h-6" />
                                )}
                            </button>
                            <Link
                                to="/dashboard"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        PT
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">
                                    PayTrack
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${isActive(
                                        item.path
                                    )}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/alerts"
                                className="relative p-2 text-gray-600 hover:text-blue-600"
                            >
                                <FaBell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <FaUser className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium">
                                        Usuário
                                    </span>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <Link
                                            to="/users/profile"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                        >
                                            <FaUser className="mr-2" />
                                            Perfil
                                        </Link>
                                        <Link
                                            to="/users/settings"
                                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() =>
                                                setUserMenuOpen(false)
                                            }
                                        >
                                            <FaCog className="mr-2" />
                                            Configurações
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <FaSignOutAlt className="mr-2" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100">
                        <div className="container mx-auto px-4 py-4">
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive(
                                            item.path
                                        )}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        PT
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    PayTrack
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Controle total sobre suas assinaturas e gastos
                                recorrentes.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-6">
                                Recursos
                            </h4>
                            <ul className="space-y-3">
                                {navItems.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-6">
                                Configurações
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/users/profile"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Perfil
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/alerts"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Notificações
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/users/settings"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Preferências
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-6">
                                Ajuda
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/help"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Central de Ajuda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/contact"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Contato
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/privacy"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Privacidade
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>
                            © {new Date().getFullYear()} PayTrack. Todos os
                            direitos reservados.
                        </p>
                        <p className="mt-2">
                            Sistema desenvolvido com foco em controle financeiro
                            pessoal.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
