// pages/Reports.jsx
import React, { useState, useEffect } from "react";
import {
    FaChartBar,
    FaChartPie,
    FaChartLine,
    FaDownload,
    FaCalendarAlt,
    FaFilter,
    FaMoneyBillWave,
} from "react-icons/fa";
import api from "../config/api.js";
import Layout from "../components/Layout.jsx";

const Reports = () => {
    const [reportData, setReportData] = useState({
        monthlySpending: [],
        categoryDistribution: [],
        annualProjection: 0,
        topSubscriptions: [],
        spendingTrend: [],
        totalSpent: 0,
        categoriesCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), 0, 1)
            .toISOString()
            .split("T")[0], // Início do ano
        end: new Date().toISOString().split("T")[0], // Hoje
    });
    const [reportType, setReportType] = useState("monthly");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchReportData();
        fetchCategories();
    }, [dateRange, reportType]);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            setCategories([]);
        }
    };

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (dateRange.start)
                params.append("initial_period", dateRange.start);
            if (dateRange.end) params.append("final_period", dateRange.end);

            // Buscar dados para os relatórios
            const [subscriptionsResponse, chargesResponse] = await Promise.all([
                api.get(`/subscriptions?${params.toString()}`),
                api.get(`/charges?${params.toString()}`),
            ]);

            const subscriptions = subscriptionsResponse.data || [];
            const charges = chargesResponse.data || [];
            const categoriesData = categories;

            // Processar dados para os relatórios
            const processedData = processReportData(
                subscriptions,
                charges,
                categoriesData,
            );
            setReportData(processedData);
        } catch (error) {
            console.error("Erro ao carregar dados do relatório:", error);
            // Em caso de erro, mostrar dados vazios
            setReportData({
                monthlySpending: [],
                categoryDistribution: [],
                annualProjection: 0,
                topSubscriptions: [],
                spendingTrend: [],
                totalSpent: 0,
                categoriesCount: 0,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const processReportData = (subscriptions, charges, categories) => {
        // Calcular gastos mensais (últimos 12 meses)
        const monthlySpending = calculateMonthlySpending(charges);

        // Calcular distribuição por categoria
        const categoryDistribution = calculateCategoryDistribution(
            subscriptions,
            categories,
        );

        // Calcular projeção anual (baseado nas assinaturas ativas)
        const annualProjection = calculateAnnualProjection(subscriptions);

        // Encontrar as principais assinaturas (maiores valores)
        const topSubscriptions = getTopSubscriptions(subscriptions);

        // Calcular tendência de gastos
        const spendingTrend = calculateSpendingTrend(charges, subscriptions);

        // Calcular total gasto no período
        const totalSpent = charges.reduce(
            (sum, charge) => sum + charge.amount,
            0,
        );

        // Contar categorias ativas (com assinaturas)
        const activeCategories = new Set(
            subscriptions.map((sub) => sub.category_id),
        ).size;

        return {
            monthlySpending,
            categoryDistribution,
            annualProjection,
            topSubscriptions,
            spendingTrend,
            totalSpent,
            categoriesCount: activeCategories,
        };
    };

    const calculateMonthlySpending = (charges) => {
        const months = [];
        const today = new Date();

        // Criar array dos últimos 12 meses
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleDateString("pt-BR", {
                month: "short",
            });
            const monthYear = date.getMonth();
            const year = date.getFullYear();

            // Filtrar cobranças deste mês
            const monthCharges = charges.filter((charge) => {
                const chargeDate = new Date(charge.charge_date);
                return (
                    chargeDate.getMonth() === monthYear &&
                    chargeDate.getFullYear() === year &&
                    charge.status === "paid"
                );
            });

            const totalAmount = monthCharges.reduce(
                (sum, charge) => sum + charge.amount,
                0,
            );

            months.push({
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                amount: totalAmount,
            });
        }

        return months;
    };

    const calculateCategoryDistribution = (subscriptions, categories) => {
        const distribution = [];
        const totalMonthly = subscriptions.reduce((sum, sub) => {
            const monthlyAmount =
                sub.billing_cycle === "yearly" ? sub.amount / 12 : sub.amount;
            return sum + monthlyAmount;
        }, 0);

        if (totalMonthly === 0) return [];

        // Agrupar por categoria
        const categoryTotals = {};
        subscriptions.forEach((sub) => {
            const monthlyAmount =
                sub.billing_cycle === "yearly" ? sub.amount / 12 : sub.amount;
            const categoryName =
                categories.find((cat) => cat.id === sub.category_id)?.name ||
                "Sem categoria";

            if (!categoryTotals[categoryName]) {
                categoryTotals[categoryName] = 0;
            }
            categoryTotals[categoryName] += monthlyAmount;
        });

        // Converter para array e calcular porcentagens
        Object.entries(categoryTotals).forEach(([name, amount], index) => {
            const percentage = (amount / totalMonthly) * 100;
            distribution.push({
                name,
                value: Math.round(percentage),
                amount: amount,
            });
        });

        // Ordenar por valor (maior primeiro)
        return distribution.sort((a, b) => b.amount - a.amount);
    };

    const calculateAnnualProjection = (subscriptions) => {
        const activeSubscriptions = subscriptions.filter(
            (sub) => sub.status === "active",
        );
        const totalMonthly = activeSubscriptions.reduce((sum, sub) => {
            const monthlyAmount =
                sub.billing_cycle === "yearly" ? sub.amount / 12 : sub.amount;
            return sum + monthlyAmount;
        }, 0);

        return totalMonthly * 12;
    };

    const getTopSubscriptions = (subscriptions) => {
        // Converter para valor mensal e ordenar
        const subscriptionsWithMonthly = subscriptions
            .map((sub) => ({
                ...sub,
                monthlyAmount:
                    sub.billing_cycle === "yearly"
                        ? sub.amount / 12
                        : sub.amount,
            }))
            .filter((sub) => sub.status === "active")
            .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
            .slice(0, 5); // Top 5

        return subscriptionsWithMonthly.map((sub) => ({
            name: sub.service_name,
            amount: sub.monthlyAmount,
            trend: getSubscriptionTrend(sub), // Você pode implementar uma lógica real de tendência
        }));
    };

    const getSubscriptionTrend = (subscription) => {
        // Esta é uma implementação simples
        // Em um sistema real, você compararia com dados históricos
        const trends = ["up", "stable", "down"];
        return trends[Math.floor(Math.random() * trends.length)];
    };

    const calculateSpendingTrend = (charges, subscriptions) => {
        const trends = [];
        const today = new Date();

        // Últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleDateString("pt-BR", {
                month: "short",
            });
            const monthYear = date.getMonth();
            const year = date.getFullYear();

            // Cobranças deste mês
            const monthCharges = charges.filter((charge) => {
                const chargeDate = new Date(charge.charge_date);
                return (
                    chargeDate.getMonth() === monthYear &&
                    chargeDate.getFullYear() === year &&
                    charge.status === "paid"
                );
            });

            const actual = monthCharges.reduce(
                (sum, charge) => sum + charge.amount,
                0,
            );

            // Calcular média (simplificado - média das assinaturas ativas naquele mês)
            const average = subscriptions.reduce((sum, sub) => {
                if (sub.status === "active") {
                    const monthlyAmount =
                        sub.billing_cycle === "yearly"
                            ? sub.amount / 12
                            : sub.amount;
                    return sum + monthlyAmount;
                }
                return sum;
            }, 0);

            trends.push({
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                actual: actual,
                average: average,
            });
        }

        return trends;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value || 0);
    };

    const handleExport = (format) => {
        // Implementar exportação em diferentes formatos
        alert(`Exportando relatório em formato ${format}...`);
    };

    const handleApplyFilters = () => {
        fetchReportData();
    };

    const getMonthNames = () => {
        return [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
        ];
    };

    // Encontrar o valor máximo para normalizar os gráficos
    const maxMonthlyAmount =
        reportData.monthlySpending.length > 0
            ? Math.max(...reportData.monthlySpending.map((item) => item.amount))
            : 1;

    const maxTrendAmount =
        reportData.spendingTrend.length > 0
            ? Math.max(
                  ...reportData.spendingTrend.map((item) =>
                      Math.max(item.actual, item.average),
                  ),
              )
            : 1;

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Relatórios Financeiros
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Análises detalhadas dos seus gastos com assinaturas
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="relative group">
                            <button className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md">
                                <FaDownload className="w-4 h-4" />
                                <span>Exportar</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 hidden group-hover:block">
                                <button
                                    onClick={() => handleExport("pdf")}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    PDF
                                </button>
                                <button
                                    onClick={() => handleExport("excel")}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Excel
                                </button>
                                <button
                                    onClick={() => handleExport("csv")}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Relatório
                            </label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="monthly">Mensal</option>
                                <option value="quarterly">Trimestral</option>
                                <option value="annual">Anual</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data Inicial
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            start: e.target.value,
                                        })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data Final
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            end: e.target.value,
                                        })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleApplyFilters}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFilter className="w-4 h-4" />
                            <span>
                                {isLoading
                                    ? "Carregando..."
                                    : "Aplicar Filtros"}
                            </span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Cards de Resumo */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-50 rounded-xl">
                                        <FaChartBar className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(reportData.totalSpent)}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Gasto total no período
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-50 rounded-xl">
                                        <FaChartPie className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {reportData.categoriesCount}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Categorias ativas
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <FaChartLine className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(
                                        reportData.annualProjection,
                                    )}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Projeção anual
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-amber-50 rounded-xl">
                                        <FaMoneyBillWave className="w-6 h-6 text-amber-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {reportData.topSubscriptions.length}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Principais assinaturas
                                </p>
                            </div>
                        </div>

                        {/* Gráficos e Tabelas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Gráfico de Gastos Mensais */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">
                                    Gastos Mensais (Últimos 12 meses)
                                </h3>
                                {reportData.monthlySpending.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">
                                        Nenhum dado de gastos disponível para o
                                        período selecionado.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {reportData.monthlySpending.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <div className="w-16">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {item.month}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                                                                style={{
                                                                    width: `${(item.amount / maxMonthlyAmount) * 100}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-24 text-right">
                                                        <span className="font-medium text-gray-900">
                                                            {formatCurrency(
                                                                item.amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Distribuição por Categoria */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">
                                    Distribuição por Categoria
                                </h3>
                                {reportData.categoryDistribution.length ===
                                0 ? (
                                    <p className="text-gray-600 text-center py-8">
                                        Nenhuma categoria com assinaturas
                                        ativas.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {reportData.categoryDistribution.map(
                                            (category, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <div className="w-32">
                                                        <span className="text-sm font-medium text-gray-700 truncate">
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full"
                                                                style={{
                                                                    width: `${category.value}%`,
                                                                    backgroundColor:
                                                                        index ===
                                                                        0
                                                                            ? "#8B5CF6"
                                                                            : index ===
                                                                                1
                                                                              ? "#3B82F6"
                                                                              : index ===
                                                                                  2
                                                                                ? "#10B981"
                                                                                : index ===
                                                                                    3
                                                                                  ? "#6B7280"
                                                                                  : "#EC4899",
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="w-24 text-right">
                                                        <span className="font-medium text-gray-900">
                                                            {formatCurrency(
                                                                category.amount,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabela de Principais Assinaturas */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">
                                    Principais Assinaturas
                                </h3>
                            </div>
                            {reportData.topSubscriptions.length === 0 ? (
                                <div className="p-12 text-center">
                                    <p className="text-gray-600">
                                        Nenhuma assinatura ativa encontrada.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                    Serviço
                                                </th>
                                                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                    Valor Mensal
                                                </th>
                                                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                    Ciclo
                                                </th>
                                                <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                    Impacto Anual
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {reportData.topSubscriptions.map(
                                                (subscription, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-4 px-6">
                                                            <div className="font-medium text-gray-900">
                                                                {
                                                                    subscription.name
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="font-bold text-gray-900">
                                                                {formatCurrency(
                                                                    subscription.amount,
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                Mensal
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-gray-900">
                                                                {formatCurrency(
                                                                    subscription.amount *
                                                                        12,
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Tendência de Gastos */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Tendência de Gastos (Últimos 6 meses)
                            </h3>
                            {reportData.spendingTrend.length === 0 ? (
                                <p className="text-gray-600 text-center py-8">
                                    Nenhum dado de tendência disponível.
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {reportData.spendingTrend.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center"
                                            >
                                                <div className="w-16">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {item.month}
                                                    </span>
                                                </div>
                                                <div className="flex-1 relative h-8">
                                                    <div className="absolute inset-y-0 left-0 flex items-center w-full">
                                                        <div
                                                            className="h-2 bg-blue-200 rounded-full absolute"
                                                            style={{
                                                                width: `${(item.average / maxTrendAmount) * 100}%`,
                                                            }}
                                                        ></div>
                                                        <div
                                                            className="h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full absolute"
                                                            style={{
                                                                width: `${(item.actual / maxTrendAmount) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="w-48 text-right">
                                                    <div className="flex justify-end space-x-4">
                                                        <div>
                                                            <span className="text-sm text-gray-600">
                                                                Real:
                                                            </span>
                                                            <span className="ml-2 font-medium text-gray-900">
                                                                {formatCurrency(
                                                                    item.actual,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-600">
                                                                Proj.:
                                                            </span>
                                                            <span className="ml-2 font-medium text-gray-900">
                                                                {formatCurrency(
                                                                    item.average,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Reports;
