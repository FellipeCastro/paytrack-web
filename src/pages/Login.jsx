import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaLock,
} from "react-icons/fa";
import api from "../config/api.js";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        if (errors.general) {
            setErrors((prev) => ({
                ...prev,
                general: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!credentials.email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            newErrors.email = "Email inválido";
        }

        if (!credentials.password) {
            newErrors.password = "Senha é obrigatória";
        } else if (credentials.password.length < 6) {
            newErrors.password = "Senha deve ter pelo menos 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await api.post("/auth/login", {
                email: credentials.email,
                password: credentials.password,
            });

            const result = response.data;
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", credentials.email);
            }

            navigate("/dashboard");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Email ou senha incorretos. Tente novamente!";

            setErrors({
                general: errorMessage,
            });
            console.error("Erro ao realizar login: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={handleBack}
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <FaArrowLeft className="mr-2" />
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            PT
                                        </span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        PayTrack
                                    </span>
                                </div>
                            </button>
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
                            Entrar no PayTrack
                        </h1>
                        <p className="text-gray-600">
                            Gerencie suas assinaturas em um só lugar
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-600 text-sm font-medium">
                                    {errors.general}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border ${
                                            errors.email
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                                        placeholder="seu@email.com"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Senha */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Senha
                                    </label>
                                    <Link
                                        to="/recuperar-senha"
                                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-12 py-3 border ${
                                            errors.password
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                                        placeholder="Digite sua senha"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Lembrar de mim */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={isLoading}
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    Lembrar de mim
                                </label>
                            </div>

                            {/* Botão de submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Entrando...
                                    </span>
                                ) : (
                                    "Entrar na conta"
                                )}
                            </button>
                        </form>

                        {/* Link para registro */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-600">
                                Não tem uma conta?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Cadastre-se gratuitamente
                                </Link>
                            </p>
                        </div>
                    </div>
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

export default Login;
