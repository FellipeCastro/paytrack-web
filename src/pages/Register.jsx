import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaEye,
    FaEyeSlash,
    FaUser,
    FaEnvelope,
    FaLock,
    FaCheck,
} from "react-icons/fa";
import api from "../config/api.js";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
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

        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Nome deve ter pelo menos 2 caracteres";
        }

        if (!formData.email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        if (!formData.password) {
            newErrors.password = "Senha é obrigatória";
        } else if (formData.password.length < 6) {
            newErrors.password = "Senha deve ter pelo menos 6 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirmação de senha é obrigatória";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem";
        }

        if (!acceptTerms) {
            newErrors.terms = "Você deve aceitar os termos e condições";
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
            const response = await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            const result = response.data;
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setSuccess(true);

            // Redireciona para dashboard após 2 segundos
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Erro ao criar conta. Tente novamente!";

            setErrors({
                general: errorMessage,
            });
            console.error("Erro ao realizar cadastro: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    // Requisitos da senha
    const passwordRequirements = [
        {
            label: "Pelo menos 6 caracteres",
            met: formData.password.length >= 6,
        },
    ];

    if (success) {
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
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="w-20 h-20 bg-linear-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCheck className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Conta criada com sucesso!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bem-vindo ao PayTrack. Você será redirecionado
                                para o dashboard.
                            </p>
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                            Criar conta no PayTrack
                        </h1>
                        <p className="text-gray-600">
                            Comece a gerenciar suas assinaturas em minutos
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
                            {/* Nome */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nome completo
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border ${
                                            errors.name
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                                        placeholder="Seu nome completo"
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

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
                                        value={formData.email}
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
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Senha
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-12 py-3 border ${
                                            errors.password
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                                        placeholder="Crie uma senha segura"
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

                                {/* Requisitos da senha */}
                                <div className="mt-3 space-y-2">
                                    {passwordRequirements.map((req, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <div
                                                className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                                                    req.met
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            >
                                                {req.met && (
                                                    <FaCheck className="w-2 h-2 text-white" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-xs ${
                                                    req.met
                                                        ? "text-green-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Confirmar senha
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-12 py-3 border ${
                                            errors.confirmPassword
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                                        placeholder="Digite a senha novamente"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Termos e condições */}
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptTerms}
                                        onChange={(e) =>
                                            setAcceptTerms(e.target.checked)
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                        required
                                        disabled={isLoading}
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        Concordo com os{" "}
                                        <Link
                                            to="/termos"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            Termos de Serviço
                                        </Link>{" "}
                                        e{" "}
                                        <Link
                                            to="/privacidade"
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            Política de Privacidade
                                        </Link>
                                    </label>
                                </div>
                                {errors.terms && (
                                    <p className="text-sm text-red-600">
                                        {errors.terms}
                                    </p>
                                )}
                            </div>

                            {/* Botão de submit */}
                            <button
                                type="submit"
                                disabled={isLoading || !acceptTerms}
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
                                        Criando conta...
                                    </span>
                                ) : (
                                    "Criar conta gratuitamente"
                                )}
                            </button>
                        </form>

                        {/* Link para login */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-600">
                                Já tem uma conta?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Faça login
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

export default Register;
