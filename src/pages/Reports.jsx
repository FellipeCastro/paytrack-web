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
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), 0, 1)
            .toISOString()
            .split("T")[0], // Início do ano
        end: new Date().toISOString().split("T")[0], // Hoje
    });
    const [reportType, setReportType] = useState("monthly");

    useEffect(() => {
        fetchReportData();
    }, [dateRange, reportType]);

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            // Em um sistema real, você teria endpoints específicos para relatórios
            // Aqui estou simulando os dados
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

            // Processar dados para os relatórios
            const processedData = processReportData(subscriptions, charges);
            setReportData(processedData);
        } catch (error) {
            console.error("Erro ao carregar dados do relatório:", error);
            // Dados de exemplo para desenvolvimento
            setReportData(getMockReportData());
        } finally {
            setIsLoading(false);
        }
    };

    const processReportData = (subscriptions, charges) => {
        // Implementar lógica de processamento de dados aqui
        // Esta é uma implementação simplificada
        return getMockReportData();
    };

    const getMockReportData = () => {
        return {
            monthlySpending: [
                { month: "Jan", amount: 289.9 },
                { month: "Fev", amount: 310.5 },
                { month: "Mar", amount: 295.8 },
                { month: "Abr", amount: 302.4 },
                { month: "Mai", amount: 289.9 },
                { month: "Jun", amount: 315.2 },
                { month: "Jul", amount: 328.6 },
                { month: "Ago", amount: 335.1 },
                { month: "Set", amount: 342.8 },
                { month: "Out", amount: 350.5 },
                { month: "Nov", amount: 358.3 },
                { month: "Dez", amount: 366.2 },
            ],
            categoryDistribution: [
                { name: "Entretenimento", value: 35, amount: 105.0 },
                { name: "Trabalho", value: 25, amount: 75.0 },
                { name: "Música", value: 15, amount: 45.0 },
                { name: "Armazenamento", value: 10, amount: 30.0 },
                { name: "Saúde", value: 15, amount: 45.0 },
            ],
            annualProjection: 3987.6,
            topSubscriptions: [
                { name: "Adobe Creative Cloud", amount: 79.9, trend: "up" },
                { name: "Gym", amount: 89.9, trend: "stable" },
                { name: "Netflix", amount: 34.9, trend: "stable" },
                { name: "Microsoft 365", amount: 39.9, trend: "down" },
                { name: "Spotify", amount: 19.9, trend: "stable" },
            ],
            spendingTrend: [
                { month: "Jan", actual: 289.9, average: 275.0 },
                { month: "Fev", actual: 310.5, average: 285.0 },
                { month: "Mar", actual: 295.8, average: 290.0 },
                { month: "Abr", actual: 302.4, average: 295.0 },
                { month: "Mai", actual: 289.9, average: 300.0 },
                { month: "Jun", actual: 315.2, average: 305.0 },
                { month: "Jul", actual: 328.6, average: 310.0 },
            ],
        };
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
                        <div className="relative">
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
                            onClick={fetchReportData}
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                            <FaFilter className="w-4 h-4" />
                            <span>Aplicar Filtros</span>
                        </button>
                    </div>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <FaChartBar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {formatCurrency(
                                reportData.monthlySpending.reduce(
                                    (sum, item) => sum + item.amount,
                                    0
                                )
                            )}
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
                            {reportData.categoryDistribution.length}
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
                            {formatCurrency(reportData.annualProjection)}
                        </h3>
                        <p className="text-gray-600 text-sm">Projeção anual</p>
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
                            Gastos Mensais
                        </h3>
                        <div className="space-y-4">
                            {reportData.monthlySpending.map((item, index) => (
                                <div key={index} className="flex items-center">
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
                                                    width: `${
                                                        (item.amount / 400) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-right">
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(item.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Distribuição por Categoria */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            Distribuição por Categoria
                        </h3>
                        <div className="space-y-4">
                            {reportData.categoryDistribution.map(
                                (category, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <div className="w-32">
                                            <span className="text-sm font-medium text-gray-700">
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
                                                            index === 0
                                                                ? "#8B5CF6"
                                                                : index === 1
                                                                ? "#3B82F6"
                                                                : index === 2
                                                                ? "#10B981"
                                                                : index === 3
                                                                ? "#6B7280"
                                                                : "#EC4899",
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="w-24 text-right">
                                            <span className="font-medium text-gray-900">
                                                {formatCurrency(
                                                    category.amount
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabela de Principais Assinaturas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">
                            Principais Assinaturas
                        </h3>
                    </div>
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
                                        Tendência
                                    </th>
                                    <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                        Impacto Total
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
                                                    {subscription.name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-gray-900">
                                                    {formatCurrency(
                                                        subscription.amount
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        subscription.trend ===
                                                        "up"
                                                            ? "bg-red-100 text-red-800"
                                                            : subscription.trend ===
                                                              "down"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {subscription.trend === "up"
                                                        ? "↑ Aumentando"
                                                        : subscription.trend ===
                                                          "down"
                                                        ? "↓ Diminuindo"
                                                        : "→ Estável"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-900">
                                                    {formatCurrency(
                                                        subscription.amount * 12
                                                    )}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-1">
                                                    /ano
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tendência de Gastos */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Tendência de Gastos vs Média
                    </h3>
                    <div className="space-y-6">
                        {reportData.spendingTrend.map((item, index) => (
                            <div key={index} className="flex items-center">
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
                                                width: `${
                                                    (item.average / 400) * 100
                                                }%`,
                                            }}
                                        ></div>
                                        <div
                                            className="h-2 bg-linear-to-r from-blue-500 to-purple-500 rounded-full absolute"
                                            style={{
                                                width: `${
                                                    (item.actual / 400) * 100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="w-48 text-right">
                                    <div className="flex justify-end space-x-4">
                                        <div>
                                            <span className="text-sm text-gray-600">
                                                Atual:
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {formatCurrency(item.actual)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">
                                                Média:
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {formatCurrency(item.average)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
