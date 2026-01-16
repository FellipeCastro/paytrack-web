// pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaBell,
    FaCalendarAlt,
    FaFilter,
    FaChartLine,
    FaMoneyBillWave,
    FaCreditCard,
    FaSyncAlt,
    FaArrowUp,
    FaEllipsisH,
    FaSearch,
    FaUser,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";
import { MdAttachMoney, MdTrendingUp } from "react-icons/md";
import api from "../config/api.js";
import Layout from "../components/Layout.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState("month");
    const [summaryData, setSummaryData] = useState({
        total_monthly: 0,
        actives: 0,
        avg_amount: 0,
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [upcomingCharges, setUpcomingCharges] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: "",
        end: "",
    });
    const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

    useEffect(() => {
        fetchDashboardData();
        fetchAlerts();
    }, [timeRange, dateRange]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Buscar os dados do resumo (summary)
            const summaryParams = new URLSearchParams();

            // Adicionar filtros de data se existirem
            if (dateRange.start) {
                summaryParams.append("initial_period", dateRange.start);
            }
            if (dateRange.end) {
                summaryParams.append("final_period", dateRange.end);
            }

            // Chamada para o resumo do dashboard
            const summaryResponse = await api.get(
                `/dashboard/summary?${summaryParams.toString()}`
            );
            setSummaryData(
                summaryResponse.data || {
                    total_monthly: 0,
                    actives: 0,
                    avg_amount: 0,
                }
            );

            // Chamada para listar assinaturas ativas
            const subscriptionsResponse = await api.get(
                "/subscriptions?status=active"
            );
            setSubscriptions(subscriptionsResponse.data || []);

            // Chamada para cobranças próximas (próximos 7 dias)
            const upcomingParams = new URLSearchParams();
            upcomingParams.append(
                "initial_period",
                new Date().toISOString().split("T")[0]
            );
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            upcomingParams.append(
                "final_period",
                nextWeek.toISOString().split("T")[0]
            );

            const upcomingResponse = await api.get(
                `/dashboard/upcoming?${upcomingParams.toString()}`
            );
            setUpcomingCharges(upcomingResponse.data || []);
        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
            // Usar dados mockados em caso de erro (para desenvolvimento)
            setMockData();
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAlerts = async () => {
        try {
            const alertsResponse = await api.get("/alerts");
            setAlerts(alertsResponse.data || []);

            // Contar alertas não lidos
            const unreadCount = (alertsResponse.data || []).filter(
                (alert) => !alert.is_read
            ).length;
            setUnreadAlertsCount(unreadCount);
        } catch (error) {
            console.error("Erro ao carregar alertas:", error);
        }
    };

    const markAlertAsRead = async (alertId) => {
        try {
            await api.patch(`/alerts/${alertId}/read`);
            // Atualizar lista de alertas
            fetchAlerts();
        } catch (error) {
            console.error("Erro ao marcar alerta como lido:", error);
        }
    };

    // Dados mockados para fallback ou desenvolvimento
    const setMockData = () => {
        setSummaryData({
            total_monthly: 289.9,
            actives: 8,
            avg_amount: 36.24,
        });

        setSubscriptions([
            {
                id: "750e8400-e29b-41d4-a716-446655440001",
                user_id: "550e8400-e29b-41d4-a716-446655440000",
                category_id: "650e8400-e29b-41d4-a716-446655440001",
                service_name: "Netflix",
                amount: 34.9,
                billing_cycle: "monthly",
                next_billing_date: "2024-01-15",
                status: "active",
                created_at: "2024-01-15T10:30:00.000Z",
            },
            {
                id: "750e8400-e29b-41d4-a716-446655440002",
                user_id: "550e8400-e29b-41d4-a716-446655440000",
                category_id: "650e8400-e29b-41d4-a716-446655440002",
                service_name: "Spotify",
                amount: 19.9,
                billing_cycle: "monthly",
                next_billing_date: "2024-01-18",
                status: "active",
                created_at: "2024-01-15T10:30:00.000Z",
            },
            {
                id: "750e8400-e29b-41d4-a716-446655440003",
                user_id: "550e8400-e29b-41d4-a716-446655440000",
                category_id: "650e8400-e29b-41d4-a716-446655440001",
                service_name: "Amazon Prime",
                amount: 14.9,
                billing_cycle: "monthly",
                next_billing_date: "2024-01-20",
                status: "active",
                created_at: "2024-01-15T10:30:00.000Z",
            },
            {
                id: "750e8400-e29b-41d4-a716-446655440004",
                user_id: "550e8400-e29b-41d4-a716-446655440000",
                category_id: "650e8400-e29b-41d4-a716-446655440003",
                service_name: "iCloud",
                amount: 9.9,
                billing_cycle: "monthly",
                next_billing_date: "2024-01-25",
                status: "active",
                created_at: "2024-01-15T10:30:00.000Z",
            },
            {
                id: "750e8400-e29b-41d4-a716-446655440005",
                user_id: "550e8400-e29b-41d4-a716-446655440000",
                category_id: "650e8400-e29b-41d4-a716-446655440004",
                service_name: "Adobe Creative Cloud",
                amount: 79.9,
                billing_cycle: "monthly",
                next_billing_date: "2024-02-01",
                status: "active",
                created_at: "2024-01-15T10:30:00.000Z",
            },
            {
                id: "750e8400-e29b-41d4-a716-446655440006",
                user_id: "550e8400-e29b-41d4-a716-446655440000",
                category_id: "650e8400-e29b-41d4-a716-446655440004",
                service_name: "Microsoft 365",
                amount: 39.9,
                billing_cycle: "yearly",
                next_billing_date: "2024-07-15",
                status: "active",
                created_at: "2024-01-15T10:30:00.000Z",
            },
        ]);

        setUpcomingCharges([
            {
                id: "850e8400-e29b-41d4-a716-446655440001",
                subscription_id: "750e8400-e29b-41d4-a716-446655440001",
                charge_date: "2024-01-15",
                amount: 34.9,
                status: "pending",
                created_at: "2024-01-15T10:30:00.000Z",
            },
            {
                id: "850e8400-e29b-41d4-a716-446655440002",
                subscription_id: "750e8400-e29b-41d4-a716-446655440002",
                charge_date: "2024-01-18",
                amount: 19.9,
                status: "pending",
                created_at: "2024-01-15T10:30:00.000Z",
            },
        ]);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value || 0);
    };

    const getMonthlyAmount = (subscription) => {
        if (subscription.billing_cycle === "yearly") {
            // Se for anual, divide por 12 para obter o valor mensal
            return subscription.amount / 12;
        }
        return subscription.amount;
    };

    const getSubscriptionColor = (subscription) => {
        // Mapeia IDs de categoria para cores (você pode personalizar isso)
        // Na prática, você precisaria buscar as cores das categorias
        const colorMap = {
            "650e8400-e29b-41d4-a716-446655440001": "bg-red-100", // Entretenimento
            "650e8400-e29b-41d4-a716-446655440002": "bg-green-100", // Música
            "650e8400-e29b-41d4-a716-446655440003": "bg-gray-100", // Armazenamento
            "650e8400-e29b-41d4-a716-446655440004": "bg-blue-100", // Trabalho
            default: "bg-purple-100",
        };
        return colorMap[subscription.category_id] || colorMap.default;
    };

    const getSubscriptionIcon = (subscription) => {
        // Pega a primeira letra do nome do serviço para o ícone
        return subscription.service_name.charAt(0).toUpperCase();
    };

    const getCategoryName = (subscription) => {
        // Na prática, você precisaria buscar os nomes das categorias
        const categoryMap = {
            "650e8400-e29b-41d4-a716-446655440001": "Entretenimento",
            "650e8400-e29b-41d4-a716-446655440002": "Música",
            "650e8400-e29b-41d4-a716-446655440003": "Armazenamento",
            "650e8400-e29b-41d4-a716-446655440004": "Trabalho",
            default: "Outros",
        };
        return categoryMap[subscription.category_id] || categoryMap.default;
    };

    const getUpcomingSubscriptions = () => {
        // Retorna assinaturas com próxima cobrança nos próximos 30 dias
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        return subscriptions
            .filter((sub) => {
                if (!sub.next_billing_date) return false;
                const billingDate = new Date(sub.next_billing_date);
                return (
                    billingDate >= new Date() &&
                    billingDate <= thirtyDaysFromNow
                );
            })
            .sort(
                (a, b) =>
                    new Date(a.next_billing_date) -
                    new Date(b.next_billing_date)
            )
            .slice(0, 4);
    };

    const handleAddCharge = async (subscriptionId) => {
        try {
            await api.post(`/subscriptions/${subscriptionId}/charges`);
            // Recarregar os dados
            fetchDashboardData();
        } catch (error) {
            console.error("Erro ao adicionar cobrança:", error);
            alert(
                "Erro ao adicionar cobrança: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    const handlePayCharge = async (chargeId) => {
        try {
            await api.patch(`/charges/${chargeId}/pay`);
            // Recarregar os dados
            fetchDashboardData();
        } catch (error) {
            console.error("Erro ao pagar cobrança:", error);
            alert(
                "Erro ao pagar cobrança: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        if (
            window.confirm("Tem certeza que deseja cancelar esta assinatura?")
        ) {
            try {
                await api.patch(`/subscriptions/${subscriptionId}/cancel`);
                // Recarregar os dados
                fetchDashboardData();
            } catch (error) {
                console.error("Erro ao cancelar assinatura:", error);
                alert(
                    "Erro ao cancelar assinatura: " +
                        (error.response?.data?.message || error.message)
                );
            }
        }
    };

    const calculateCategoriesStats = () => {
        // Calcular estatísticas de categorias baseadas nas assinaturas
        const categoryTotals = {};

        subscriptions.forEach((sub) => {
            const categoryName = getCategoryName(sub);
            const monthlyAmount = getMonthlyAmount(sub);

            if (!categoryTotals[categoryName]) {
                categoryTotals[categoryName] = {
                    total: 0,
                    color: getSubscriptionColor(sub),
                };
            }
            categoryTotals[categoryName].total += monthlyAmount;
        });

        // Calcular total geral
        const grandTotal = Object.values(categoryTotals).reduce(
            (sum, cat) => sum + cat.total,
            0
        );

        // Converter para array e calcular porcentagens
        return Object.entries(categoryTotals).map(([name, data]) => ({
            name,
            total_amount: data.total,
            color: data.color,
            percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
        }));
    };

    const totalAnnual = summaryData.total_monthly * 12;
    const categoriesStats = calculateCategoriesStats();

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header do Dashboard */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Dashboard Financeiro
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Controle total das suas assinaturas e gastos
                            recorrentes
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        {/* Filtro de Período */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:border-blue-300 transition-colors"
                            >
                                <FaFilter className="text-gray-500" />
                                <span className="text-sm font-medium">
                                    {timeRange === "month"
                                        ? "Este mês"
                                        : timeRange === "year"
                                        ? "Este ano"
                                        : "Personalizado"}
                                </span>
                            </button>

                            {showFilters && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
                                    <div className="space-y-3">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setTimeRange("month");
                                                    setShowFilters(false);
                                                    setDateRange({
                                                        start: "",
                                                        end: "",
                                                    });
                                                }}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                                                    timeRange === "month"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                Este mês
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setTimeRange("year");
                                                    setShowFilters(false);
                                                    setDateRange({
                                                        start: "",
                                                        end: "",
                                                    });
                                                }}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                                                    timeRange === "year"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                Este ano
                                            </button>
                                        </div>

                                        <div className="pt-2 border-t border-gray-100">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Período personalizado
                                            </label>
                                            <div className="space-y-2">
                                                <input
                                                    type="date"
                                                    value={dateRange.start}
                                                    onChange={(e) =>
                                                        setDateRange({
                                                            ...dateRange,
                                                            start: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <input
                                                    type="date"
                                                    value={dateRange.end}
                                                    onChange={(e) =>
                                                        setDateRange({
                                                            ...dateRange,
                                                            end: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            {(dateRange.start ||
                                                dateRange.end) && (
                                                <button
                                                    onClick={() => {
                                                        setTimeRange("custom");
                                                        setShowFilters(false);
                                                    }}
                                                    className="mt-3 w-full py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                                                >
                                                    Aplicar Filtro
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/subscriptions/new"
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span>Nova Assinatura</span>
                        </Link>
                    </div>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Gasto Mensal */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <MdAttachMoney className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                MENSAL
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLoading
                                ? "..."
                                : formatCurrency(summaryData.total_monthly)}
                        </h3>
                        <p className="text-gray-600">
                            Total em assinaturas ativas
                        </p>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <FaArrowUp className="mr-1" />
                            <span>Calculado com base nos dados atuais</span>
                        </div>
                    </div>

                    {/* Assinaturas Ativas */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <FaCreditCard className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                ATIVAS
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLoading ? "..." : summaryData.actives}
                        </h3>
                        <p className="text-gray-600">
                            Assinaturas ativas no período
                        </p>
                        <div className="mt-4 flex items-center text-sm text-blue-600">
                            <FaSyncAlt className="mr-1 animate-spin" />
                            <span>Atualizado em tempo real</span>
                        </div>
                    </div>

                    {/* Valor Médio */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <FaChartLine className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                MÉDIO
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLoading
                                ? "..."
                                : formatCurrency(summaryData.avg_amount)}
                        </h3>
                        <p className="text-gray-600">
                            Valor médio por assinatura
                        </p>
                        <div className="mt-4 flex items-center text-sm text-amber-600">
                            <MdTrendingUp className="mr-1" />
                            <span>
                                Baseado em {summaryData.actives} assinaturas
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de Assinaturas */}
                    <div className="lg:col-span-2">
                        {/* Header da Lista */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Suas Assinaturas ({subscriptions.length})
                            </h2>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar assinatura..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Lista */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {isLoading ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">
                                        Carregando assinaturas...
                                    </p>
                                </div>
                            ) : subscriptions.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-gray-600 mb-4">
                                        Nenhuma assinatura encontrada.
                                    </p>
                                    <Link
                                        to="/subscriptions/new"
                                        className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                                    >
                                        <FaPlus className="mr-2" />
                                        Adicionar primeira assinatura
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                        Serviço
                                                    </th>
                                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                        Categoria
                                                    </th>
                                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                        Valor
                                                    </th>
                                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                        Próxima Cobrança
                                                    </th>
                                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                        Status
                                                    </th>
                                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {subscriptions.map(
                                                    (subscription) => (
                                                        <tr
                                                            key={
                                                                subscription.id
                                                            }
                                                            className="hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className={`w-10 h-10 rounded-lg ${getSubscriptionColor(
                                                                            subscription
                                                                        )} flex items-center justify-center mr-3`}
                                                                    >
                                                                        <span className="font-bold text-gray-700">
                                                                            {getSubscriptionIcon(
                                                                                subscription
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900">
                                                                            {
                                                                                subscription.service_name
                                                                            }
                                                                        </div>
                                                                        <div className="text-sm text-gray-500 capitalize">
                                                                            {
                                                                                subscription.billing_cycle
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    {getCategoryName(
                                                                        subscription
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="font-bold text-gray-900">
                                                                    {formatCurrency(
                                                                        getMonthlyAmount(
                                                                            subscription
                                                                        )
                                                                    )}
                                                                    <span className="text-xs text-gray-500 font-normal ml-1">
                                                                        /mês
                                                                    </span>
                                                                </div>
                                                                {subscription.billing_cycle ===
                                                                    "yearly" && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {formatCurrency(
                                                                            subscription.amount
                                                                        )}
                                                                        /ano
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center">
                                                                    <FaCalendarAlt className="w-4 h-4 text-gray-400 mr-2" />
                                                                    <span className="text-gray-700">
                                                                        {subscription.next_billing_date
                                                                            ? new Date(
                                                                                  subscription.next_billing_date
                                                                              ).toLocaleDateString(
                                                                                  "pt-BR"
                                                                              )
                                                                            : "Não definida"}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <span
                                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                                        subscription.status ===
                                                                        "active"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {subscription.status ===
                                                                    "active"
                                                                        ? "Ativa"
                                                                        : "Cancelada"}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            handleAddCharge(
                                                                                subscription.id
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                                        title="Registrar cobrança"
                                                                    >
                                                                        Registrar
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleCancelSubscription(
                                                                                subscription.id
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                                        title="Cancelar assinatura"
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="px-6 py-4 border-t border-gray-100">
                                        <Link
                                            to="/subscriptions"
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            Ver todas as assinaturas →
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Gráfico de Gastos por Categoria */}
                        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Gastos por Categoria
                            </h2>
                            {categoriesStats.length === 0 ? (
                                <p className="text-gray-600 text-center py-8">
                                    Nenhuma categoria com gastos no período.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {categoriesStats.map((category) => (
                                        <div
                                            key={category.name}
                                            className="flex items-center"
                                        >
                                            <div className="w-32 flex items-center">
                                                <div
                                                    className={`w-3 h-3 ${category.color} rounded-full mr-3`}
                                                ></div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {category.name}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${category.color}`}
                                                        style={{
                                                            width: `${category.percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="w-24 text-right">
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(
                                                        category.total_amount
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Próximas Cobranças */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <FaCalendarAlt className="mr-2 text-blue-600" />
                                Próximas Cobranças
                            </h2>
                            {upcomingCharges.length === 0 ? (
                                <p className="text-gray-600 text-center py-4">
                                    Nenhuma cobrança pendente para os próximos
                                    dias.
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {upcomingCharges
                                            .slice(0, 4)
                                            .map((charge) => {
                                                const subscription =
                                                    subscriptions.find(
                                                        (sub) =>
                                                            sub.id ===
                                                            charge.subscription_id
                                                    );
                                                return (
                                                    <div
                                                        key={charge.id}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                                                    >
                                                        <div className="flex items-center">
                                                            <div
                                                                className={`w-10 h-10 rounded-lg ${
                                                                    subscription
                                                                        ? getSubscriptionColor(
                                                                              subscription
                                                                          )
                                                                        : "bg-gray-100"
                                                                } flex items-center justify-center mr-3`}
                                                            >
                                                                <span className="font-bold">
                                                                    {subscription
                                                                        ? getSubscriptionIcon(
                                                                              subscription
                                                                          )
                                                                        : "?"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {subscription
                                                                        ? subscription.service_name
                                                                        : "Assinatura desconhecida"}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {new Date(
                                                                        charge.charge_date
                                                                    ).toLocaleDateString(
                                                                        "pt-BR"
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold">
                                                                {formatCurrency(
                                                                    charge.amount
                                                                )}
                                                            </span>
                                                            {charge.status ===
                                                                "pending" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handlePayCharge(
                                                                            charge.id
                                                                        )
                                                                    }
                                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                                >
                                                                    Pagar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    <Link
                                        to="/charges"
                                        className="mt-6 block text-center py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
                                    >
                                        Ver todas as cobranças
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Resumo Anual */}
                        <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Projeção Anual
                            </h2>
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    {formatCurrency(totalAnnual)}
                                </div>
                                <p className="text-gray-600">
                                    Total estimado para 12 meses
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Valor mensal:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(
                                            summaryData.total_monthly
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Assinaturas ativas:
                                    </span>
                                    <span className="font-medium text-amber-600">
                                        {summaryData.actives} serviços
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Valor médio:
                                    </span>
                                    <span className="font-medium text-blue-600">
                                        {formatCurrency(summaryData.avg_amount)}
                                        /cada
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/reports")}
                                className="mt-6 w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                            >
                                Ver relatório completo
                            </button>
                        </div>

                        {/* Alertas Recentes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Alertas Recentes
                            </h2>
                            {alerts.length === 0 ? (
                                <p className="text-gray-600 text-center py-4">
                                    Nenhum alerta recente.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {alerts.slice(0, 3).map((alert) => (
                                        <div
                                            key={alert.id}
                                            className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-0 ${
                                                !alert.is_read
                                                    ? "bg-blue-50 rounded-lg px-3"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">
                                                    {alert.message}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(
                                                        alert.created_at
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )}
                                                </div>
                                            </div>
                                            {!alert.is_read && (
                                                <button
                                                    onClick={() =>
                                                        markAlertAsRead(
                                                            alert.id
                                                        )
                                                    }
                                                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Marcar
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <Link
                                        to="/alerts"
                                        className="block text-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4"
                                    >
                                        Ver todos os alertas
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
