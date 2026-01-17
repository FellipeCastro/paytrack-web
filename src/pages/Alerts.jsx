// pages/Alerts.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaBell,
    FaCheck,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTrash,
    FaFilter,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import Layout from "../components/Layout";
import api from "../config/api";

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, read, unread
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [alertToDelete, setAlertToDelete] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAlerts();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [alerts, filter]);

    const fetchAlerts = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await api.get("/alerts");
            setAlerts(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar alertas:", error);
            setError("Erro ao carregar alertas. Tente novamente.");
            setAlerts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        let filtered = [...alerts];

        switch (filter) {
            case "read":
                filtered = filtered.filter((alert) => alert.is_read);
                break;
            case "unread":
                filtered = filtered.filter((alert) => !alert.is_read);
                break;
            default:
                // "all" - mantém todos
                break;
        }

        // Ordenar por data (mais recentes primeiro)
        filtered.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        setFilteredAlerts(filtered);
    };

    const markAsRead = async (alertId) => {
        try {
            await api.patch(`/alerts/${alertId}/read`);
            // Atualizar localmente
            setAlerts((prevAlerts) =>
                prevAlerts.map((alert) =>
                    alert.id === alertId ? { ...alert, is_read: true } : alert,
                ),
            );
        } catch (error) {
            console.error("Erro ao marcar alerta como lido:", error);
            alert("Erro ao marcar alerta como lido. Tente novamente.");
        }
    };

    const markAllAsRead = async () => {
        const unreadAlerts = alerts.filter((alert) => !alert.is_read);

        if (unreadAlerts.length === 0) {
            alert("Todos os alertas já estão marcados como lidos.");
            return;
        }

        try {
            // Marcar todos os não lidos como lidos
            for (const alert of unreadAlerts) {
                await api.patch(`/alerts/${alert.id}/read`);
            }

            // Atualizar localmente
            setAlerts((prevAlerts) =>
                prevAlerts.map((alert) => ({ ...alert, is_read: true })),
            );

            alert("Todos os alertas foram marcados como lidos.");
        } catch (error) {
            console.error("Erro ao marcar todos os alertas como lidos:", error);
            alert("Erro ao marcar alertas como lidos. Tente novamente.");
        }
    };

    const handleDeleteClick = (alert) => {
        setAlertToDelete(alert);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!alertToDelete) return;

        try {
            // A API não tem endpoint para excluir alertas,
            // então vamos marcar como lido (que é o comportamento padrão)
            await api.patch(`/alerts/${alertToDelete.id}/read`);

            // Atualizar localmente
            setAlerts((prevAlerts) =>
                prevAlerts.map((alert) =>
                    alert.id === alertToDelete.id
                        ? { ...alert, is_read: true }
                        : alert,
                ),
            );

            setShowDeleteModal(false);
            setAlertToDelete(null);
        } catch (error) {
            console.error("Erro ao processar alerta:", error);
            alert("Erro ao processar alerta. Tente novamente.");
        }
    };

    const getAlertIcon = (message) => {
        // Determinar ícone baseado no tipo de mensagem
        const lowerMessage = message.toLowerCase();

        if (
            lowerMessage.includes("cobrada") ||
            lowerMessage.includes("pagar") ||
            lowerMessage.includes("pagamento")
        ) {
            return <FaExclamationTriangle className="w-5 h-5 text-red-500" />;
        } else if (
            lowerMessage.includes("próxima") ||
            lowerMessage.includes("vence")
        ) {
            return <FaInfoCircle className="w-5 h-5 text-amber-500" />;
        } else if (
            lowerMessage.includes("sucesso") ||
            lowerMessage.includes("confirmado")
        ) {
            return <FaCheckCircle className="w-5 h-5 text-green-500" />;
        } else {
            return <FaBell className="w-5 h-5 text-blue-500" />;
        }
    };

    const getAlertColor = (isRead) => {
        return isRead ? "bg-gray-50" : "bg-blue-50";
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return `Hoje às ${date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } else if (diffInHours < 48) {
            return `Ontem às ${date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            })}`;
        } else {
            return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const unreadCount = alerts.filter((alert) => !alert.is_read).length;
    const readCount = alerts.filter((alert) => alert.is_read).length;

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Alertas e Notificações
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Acompanhe todas as suas notificações em um só lugar
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <FaCheck className="w-4 h-4" />
                                <span>Marcar todos como lidos</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <FaBell className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                TOTAL
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {alerts.length}
                        </h3>
                        <p className="text-gray-600">Alertas recebidos</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <FaExclamationTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                NÃO LIDOS
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {unreadCount}
                        </h3>
                        <p className="text-gray-600">Alertas pendentes</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <FaCheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                LIDOS
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {readCount}
                        </h3>
                        <p className="text-gray-600">Alertas visualizados</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-bold text-gray-900">
                                Filtrar Alertas
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setFilter("all")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                                    filter === "all"
                                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <FaBell className="w-4 h-4" />
                                <span>Todos ({alerts.length})</span>
                            </button>

                            <button
                                onClick={() => setFilter("unread")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                                    filter === "unread"
                                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <FaExclamationTriangle className="w-4 h-4" />
                                <span>Não lidos ({unreadCount})</span>
                            </button>

                            <button
                                onClick={() => setFilter("read")}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                                    filter === "read"
                                        ? "bg-green-50 text-green-600 border border-green-200"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                <FaCheckCircle className="w-4 h-4" />
                                <span>Lidos ({readCount})</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Alertas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Carregando alertas...
                            </p>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mb-4">
                                <FaBell className="w-16 h-16 text-gray-300 mx-auto" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {filter === "all"
                                    ? "Nenhum alerta encontrado"
                                    : filter === "unread"
                                      ? "Nenhum alerta não lido"
                                      : "Nenhum alerta lido"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {filter === "all"
                                    ? "Você ainda não recebeu nenhum alerta. Eles aparecerão automaticamente quando houver cobranças próximas."
                                    : filter === "unread"
                                      ? "Todos os seus alertas já foram lidos. Novos alertas aparecerão automaticamente."
                                      : "Nenhum alerta foi marcado como lido ainda."}
                            </p>
                            {filter !== "all" && (
                                <button
                                    onClick={() => setFilter("all")}
                                    className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                                >
                                    Ver todos os alertas
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-100">
                                {filteredAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`p-6 transition-colors ${getAlertColor(alert.is_read)} hover:bg-gray-50`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="pt-1">
                                                    {getAlertIcon(
                                                        alert.message,
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p
                                                                className={`font-medium ${alert.is_read ? "text-gray-700" : "text-gray-900"}`}
                                                            >
                                                                {alert.message}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {formatDate(
                                                                    alert.created_at,
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center space-x-2 ml-4">
                                                            {!alert.is_read && (
                                                                <button
                                                                    onClick={() =>
                                                                        markAsRead(
                                                                            alert.id,
                                                                        )
                                                                    }
                                                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                                                    title="Marcar como lido"
                                                                >
                                                                    <FaEye className="w-3 h-3" />
                                                                    <span>
                                                                        Marcar
                                                                    </span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteClick(
                                                                        alert,
                                                                    )
                                                                }
                                                                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                                                title="Remover alerta"
                                                            >
                                                                <FaTrash className="w-3 h-3" />
                                                                <span>
                                                                    Remover
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {!alert.is_read && (
                                                        <div className="mt-3">
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                                <FaExclamationTriangle className="w-3 h-3 mr-1" />
                                                                Não lido
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Resumo */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex flex-col md:flex-row justify-between items-center">
                                    <div className="text-sm text-gray-600 mb-2 md:mb-0">
                                        Mostrando {filteredAlerts.length} de{" "}
                                        {alerts.length} alertas
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-sm">
                                            <span className="font-medium text-amber-600">
                                                {unreadCount} não lidos
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span className="font-medium text-green-600">
                                                {readCount} lidos
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Aviso sobre Alertas Automáticos */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-start">
                        <FaInfoCircle className="w-6 h-6 text-blue-600 mr-3 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-blue-800 mb-2">
                                Como funcionam os alertas?
                            </h4>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li>
                                    • Alertas são gerados automaticamente quando
                                    uma cobrança está próxima do vencimento
                                </li>
                                <li>
                                    • Você receberá alertas 7, 3 e 1 dia antes
                                    do vencimento
                                </li>
                                <li>
                                    • Alertas sobre pagamentos confirmados
                                    também são gerados automaticamente
                                </li>
                                <li>
                                    • Marque alertas como lidos para manter sua
                                    caixa de entrada organizada
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Modal de Confirmação de Exclusão */}
                {showDeleteModal && alertToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Marcar Alerta como Lido
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tem certeza que deseja marcar este alerta
                                    como lido?
                                    <br />
                                    <span className="font-medium mt-2 block">
                                        "{alertToDelete.message}"
                                    </span>
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setAlertToDelete(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                                    >
                                        Marcar como Lido
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Alerts;
