// pages/ChargeForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaCalendarAlt,
    FaMoneyBillWave,
} from "react-icons/fa";
import Layout from "../components/Layout";
import api from "../config/api";

const ChargeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // ID da assinatura
    const [isLoading, setIsLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            fetchSubscription();
        }
    }, [id]);

    const fetchSubscription = async () => {
        try {
            const response = await api.get(`/subscriptions/${id}`);
            setSubscription(response.data);
        } catch (error) {
            console.error("Erro ao carregar assinatura:", error);
            setError("Erro ao carregar assinatura. Tente novamente.");
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");

        try {
            await api.post(`/subscriptions/${id}/charges`);
            alert("Cobrança registrada com sucesso!");
            navigate("/subscriptions");
        } catch (error) {
            console.error("Erro ao criar cobrança:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Erro ao registrar cobrança. Tente novamente.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/subscriptions");
    };

    if (!subscription) {
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
                                Registrar Cobrança
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Registre uma nova cobrança para{" "}
                                {subscription.service_name}
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
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaCheckCircle className="w-4 h-4" />
                            <span>
                                {isLoading
                                    ? "Registrando..."
                                    : "Registrar Cobrança"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mensagens de erro */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {/* Informações da Assinatura */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Informações da Assinatura
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Serviço</p>
                                <p className="font-medium text-gray-900">
                                    {subscription.service_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ciclo</p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {subscription.billing_cycle === "monthly"
                                        ? "Mensal"
                                        : "Anual"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Valor Atual
                                </p>
                                <p className="font-medium text-gray-900">
                                    R${" "}
                                    {parseFloat(subscription.amount).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        subscription.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {subscription.status === "active"
                                        ? "Ativa"
                                        : "Cancelada"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalhes da Cobrança */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            Detalhes da Cobrança
                        </h3>

                        <div className="space-y-6">
                            {/* Valor da Cobrança */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaMoneyBillWave className="inline mr-2 text-gray-500" />
                                    Valor da Cobrança
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        R$
                                    </span>
                                    <input
                                        type="text"
                                        value={parseFloat(
                                            subscription.amount
                                        ).toFixed(2)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
                                        readOnly
                                    />
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                    Valor fixo baseado na assinatura
                                </p>
                            </div>

                            {/* Próxima Data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaCalendarAlt className="inline mr-2 text-gray-500" />
                                    Data da Próxima Cobrança
                                </label>
                                <div className="flex items-center space-x-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={new Date(
                                                subscription.next_billing_date
                                            ).toLocaleDateString("pt-BR")}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
                                            readOnly
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">
                                            Nova data após registro:
                                        </p>
                                        <p className="text-green-600">
                                            {(() => {
                                                const currentDate = new Date(
                                                    subscription.next_billing_date
                                                );
                                                if (
                                                    subscription.billing_cycle ===
                                                    "monthly"
                                                ) {
                                                    currentDate.setMonth(
                                                        currentDate.getMonth() +
                                                            1
                                                    );
                                                } else {
                                                    currentDate.setFullYear(
                                                        currentDate.getFullYear() +
                                                            1
                                                    );
                                                }
                                                return currentDate.toLocaleDateString(
                                                    "pt-BR"
                                                );
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Aviso importante */}
                        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <h4 className="font-medium text-amber-800 mb-2">
                                ⚠️ Atenção
                            </h4>
                            <ul className="space-y-1 text-sm text-amber-700">
                                <li>
                                    • Ao registrar esta cobrança, a próxima data
                                    de cobrança será atualizada automaticamente
                                </li>
                                <li>
                                    • Para ciclos mensais, será adicionado 1 mês
                                    à data atual
                                </li>
                                <li>
                                    • Para ciclos anuais, será adicionado 1 ano
                                    à data atual
                                </li>
                                <li>• Esta ação não pode ser desfeita</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChargeForm;
