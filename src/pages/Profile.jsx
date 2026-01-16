// pages/Profile.jsx
import React, { useState, useEffect } from "react";
import {
    FaUser,
    FaEnvelope,
    FaMoneyBillWave,
    FaBell,
    FaSave,
    FaEdit,
} from "react-icons/fa";
import api from "../config/api.js";
import Layout from "../components/Layout.jsx";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        currency: "BRL",
        notifications_enabled: true,
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/users/profile");
            setUser(response.data);
            setFormData({
                name: response.data.name,
                currency: response.data.currency || "BRL",
                notifications_enabled: response.data.notifications_enabled !== false,
            });
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            setErrorMessage("Erro ao carregar perfil. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await api.put("/users/profile", formData);
            setUser(prev => ({ ...prev, ...formData }));
            setIsEditing(false);
            setSuccessMessage("Perfil atualizado com sucesso!");
            
            // Limpar mensagem após 3 segundos
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            setErrorMessage("Erro ao atualizar perfil. Tente novamente.");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            setFormData({
                name: user.name,
                currency: user.currency || "BRL",
                notifications_enabled: user.notifications_enabled !== false,
            });
        }
        setSuccessMessage("");
        setErrorMessage("");
    };

    const currencyOptions = [
        { value: "BRL", label: "Real Brasileiro (R$)" },
        { value: "USD", label: "Dólar Americano ($)" },
        { value: "EUR", label: "Euro (€)" },
        { value: "GBP", label: "Libra Esterlina (£)" },
        { value: "JPY", label: "Iene Japonês (¥)" },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Meu Perfil
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie suas informações pessoais e preferências
                        </p>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 md:mt-0 flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <FaEdit className="w-4 h-4" />
                            <span>Editar Perfil</span>
                        </button>
                    )}
                </div>

                {/* Mensagens de Status */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-600 font-medium">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 font-medium">{errorMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Esquerda - Informações do Perfil */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Informações Pessoais
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Nome */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaUser className="inline mr-2" />
                                            Nome Completo
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                                {user.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email (não editável) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaEnvelope className="inline mr-2" />
                                            Email
                                        </label>
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                            {user.email}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            O email não pode ser alterado
                                        </p>
                                    </div>

                                    {/* Moeda */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaMoneyBillWave className="inline mr-2" />
                                            Moeda Padrão
                                        </label>
                                        {isEditing ? (
                                            <select
                                                name="currency"
                                                value={formData.currency}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {currencyOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                                {currencyOptions.find(c => c.value === user.currency)?.label || user.currency}
                                            </p>
                                        )}
                                    </div>

                                    {/* Notificações */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaBell className="inline mr-2" />
                                            Notificações
                                        </label>
                                        {isEditing ? (
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="notifications_enabled"
                                                    checked={formData.notifications_enabled}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    id="notifications"
                                                />
                                                <label htmlFor="notifications" className="ml-2 text-gray-700">
                                                    Receber notificações sobre cobranças próximas
                                                </label>
                                            </div>
                                        ) : (
                                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                                {user.notifications_enabled !== false ? "Ativadas" : "Desativadas"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Botões (apenas no modo edição) */}
                                    {isEditing && (
                                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                                            >
                                                <FaSave className="w-4 h-4" />
                                                <span>Salvar Alterações</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Coluna Direita - Informações da Conta */}
                    <div className="space-y-6">
                        {/* Informações da Conta */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Informações da Conta
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">ID do Usuário</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Conta criada em</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatDate(user.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ações da Conta */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Ações da Conta
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => alert("Funcionalidade de exportação em desenvolvimento")}
                                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    Exportar meus dados
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
                                            alert("Funcionalidade de exclusão em desenvolvimento");
                                        }
                                    }}
                                    className="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    Excluir minha conta
                                </button>
                            </div>
                        </div>

                        {/* Estatísticas (opcional) */}
                        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Sua Conta no PayTrack
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    Gerencie todas as suas assinaturas em um só lugar
                                </p>
                                <p className="text-sm text-gray-600">
                                    Receba alertas sobre cobranças
                                </p>
                                <p className="text-sm text-gray-600">
                                    Acompanhe seus gastos mensais
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;