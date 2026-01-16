// pages/SubscriptionForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaSave,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaTag,
} from "react-icons/fa";
import Layout from "../components/Layout";
import api from "../config/api";

const SubscriptionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Para edição
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    // Estado do formulário
    const [formData, setFormData] = useState({
        category_id: "",
        service_name: "",
        amount: "",
        billing_cycle: "monthly",
        next_billing_date: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategories();

        if (id) {
            fetchSubscription();
            setIsEditing(true);
        }
    }, [id]);

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            setError("Erro ao carregar categorias. Tente novamente.");
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchSubscription = async () => {
        try {
            const response = await api.get(`/subscriptions/${id}`);
            setFormData({
                category_id: response.data.category_id || "",
                service_name: response.data.service_name || "",
                amount: response.data.amount || "",
                billing_cycle: response.data.billing_cycle || "monthly",
                next_billing_date: response.data.next_billing_date
                    ? new Date(response.data.next_billing_date)
                          .toISOString()
                          .split("T")[0]
                    : "",
            });
        } catch (error) {
            console.error("Erro ao carregar assinatura:", error);
            setError("Erro ao carregar assinatura. Tente novamente.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Limpar erro do campo
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.category_id.trim()) {
            newErrors.category_id = "Selecione uma categoria";
        }

        if (!formData.service_name.trim()) {
            newErrors.service_name = "Nome do serviço é obrigatório";
        } else if (formData.service_name.trim().length < 2) {
            newErrors.service_name = "Nome muito curto";
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Valor deve ser maior que zero";
        }

        if (!formData.next_billing_date) {
            newErrors.next_billing_date =
                "Data da próxima cobrança é obrigatória";
        } else {
            const selectedDate = new Date(formData.next_billing_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.next_billing_date = "Data deve ser futura";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            const submitData = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            if (isEditing) {
                await api.put(`/subscriptions/${id}`, submitData);
                alert("Assinatura atualizada com sucesso!");
            } else {
                await api.post("/subscriptions", submitData);
                alert("Assinatura criada com sucesso!");
            }

            navigate("/subscriptions");
        } catch (error) {
            console.error("Erro ao salvar assinatura:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Erro ao salvar assinatura. Tente novamente.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/subscriptions");
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/subscriptions"
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {isEditing
                                    ? "Editar Assinatura"
                                    : "Nova Assinatura"}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditing
                                    ? "Atualize os dados da sua assinatura"
                                    : "Adicione uma nova assinatura ao seu controle"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave className="w-4 h-4" />
                            <span>{isLoading ? "Salvando..." : "Salvar"}</span>
                        </button>
                    </div>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {/* Formulário */}
                {isLoadingCategories ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Categoria */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaTag className="inline mr-2 text-gray-500" />
                                    Categoria *
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.category_id
                                            ? "border-red-300 focus:border-transparent"
                                            : "border-gray-300 focus:border-transparent"
                                    }`}
                                    disabled={
                                        isLoading || categories.length === 0
                                    }
                                >
                                    <option value="">
                                        Selecione uma categoria
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category_id}
                                    </p>
                                )}
                                {categories.length === 0 && (
                                    <p className="mt-1 text-sm text-amber-600">
                                        Nenhuma categoria disponível.{" "}
                                        <Link
                                            to="/categories/new"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Crie uma categoria primeiro
                                        </Link>
                                    </p>
                                )}
                            </div>

                            {/* Nome do Serviço */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Serviço *
                                </label>
                                <input
                                    type="text"
                                    name="service_name"
                                    value={formData.service_name}
                                    onChange={handleChange}
                                    placeholder="Ex: Netflix, Spotify, iCloud..."
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.service_name
                                            ? "border-red-300 focus:border-transparent"
                                            : "border-gray-300 focus:border-transparent"
                                    }`}
                                    disabled={isLoading}
                                />
                                {errors.service_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.service_name}
                                    </p>
                                )}
                            </div>

                            {/* Valor e Ciclo de Cobrança */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Valor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMoneyBillWave className="inline mr-2 text-gray-500" />
                                        Valor *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            R$
                                        </span>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="0,00"
                                            step="0.01"
                                            min="0.01"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.amount
                                                    ? "border-red-300 focus:border-transparent"
                                                    : "border-gray-300 focus:border-transparent"
                                            }`}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                {/* Ciclo de Cobrança */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ciclo de Cobrança *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleChange({
                                                    target: {
                                                        name: "billing_cycle",
                                                        value: "monthly",
                                                    },
                                                })
                                            }
                                            className={`px-4 py-3 border rounded-xl font-medium transition-colors ${
                                                formData.billing_cycle ===
                                                "monthly"
                                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                            disabled={isLoading}
                                        >
                                            Mensal
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleChange({
                                                    target: {
                                                        name: "billing_cycle",
                                                        value: "yearly",
                                                    },
                                                })
                                            }
                                            className={`px-4 py-3 border rounded-xl font-medium transition-colors ${
                                                formData.billing_cycle ===
                                                "yearly"
                                                    ? "border-blue-500 bg-blue-50 text-blue-600"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                            disabled={isLoading}
                                        >
                                            Anual
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Data da Próxima Cobrança */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaCalendarAlt className="inline mr-2 text-gray-500" />
                                    Próxima Cobrança *
                                </label>
                                <input
                                    type="date"
                                    name="next_billing_date"
                                    value={formData.next_billing_date}
                                    onChange={handleChange}
                                    min={today}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.next_billing_date
                                            ? "border-red-300 focus:border-transparent"
                                            : "border-gray-300 focus:border-transparent"
                                    }`}
                                    disabled={isLoading}
                                />
                                {errors.next_billing_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.next_billing_date}
                                    </p>
                                )}
                                {formData.next_billing_date && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        Selecione a data em que será realizada a
                                        próxima cobrança
                                    </p>
                                )}
                            </div>

                            {/* Info adicional para ciclo anual */}
                            {formData.billing_cycle === "yearly" &&
                                formData.amount && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <p className="text-sm text-blue-800">
                                            <span className="font-semibold">
                                                Valor mensal equivalente:{" "}
                                            </span>
                                            R${" "}
                                            {(
                                                parseFloat(formData.amount) / 12
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SubscriptionForm;
