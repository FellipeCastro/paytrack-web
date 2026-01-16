// pages/Subscriptions.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaPlus,
    FaFilter,
    FaSearch,
    FaCalendarAlt,
    FaEdit,
    FaTrash,
    FaSyncAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaSortAmountDown,
    FaSortAmountUp,
} from "react-icons/fa";
import api from "../config/api.js";
import Layout from "../components/Layout.jsx";

const Subscriptions = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "all",
        category_id: "all",
        billing_cycle: "all",
    });
    const [sortConfig, setSortConfig] = useState({
        key: "next_billing_date",
        direction: "asc",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Buscar assinaturas
            const subscriptionsResponse = await api.get("/subscriptions");
            setSubscriptions(subscriptionsResponse.data || []);

            // Buscar categorias
            const categoriesResponse = await api.get("/categories");
            setCategories(categoriesResponse.data || []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta assinatura?")) {
            try {
                await api.patch(`/subscriptions/${id}/cancel`);
                fetchData();
            } catch (error) {
                console.error("Erro ao excluir assinatura:", error);
                alert(
                    "Erro ao excluir assinatura: " +
                        (error.response?.data?.message || error.message)
                );
            }
        }
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Sem categoria";
    };

    const getCategoryColor = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.color || "#6B7280" : "#6B7280";
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    const getMonthlyAmount = (subscription) => {
        if (subscription.billing_cycle === "yearly") {
            return subscription.amount / 12;
        }
        return subscription.amount;
    };

    const filteredAndSortedSubscriptions = () => {
        let filtered = subscriptions;

        // Aplicar filtro de busca
        if (searchTerm) {
            filtered = filtered.filter((sub) =>
                sub.service_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        // Aplicar filtros
        if (filters.status !== "all") {
            filtered = filtered.filter((sub) => sub.status === filters.status);
        }
        if (filters.category_id !== "all") {
            filtered = filtered.filter(
                (sub) => sub.category_id === filters.category_id
            );
        }
        if (filters.billing_cycle !== "all") {
            filtered = filtered.filter(
                (sub) => sub.billing_cycle === filters.billing_cycle
            );
        }

        // Aplicar ordenação
        filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.key === "service_name") {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (
                sortConfig.key === "next_billing_date" ||
                sortConfig.key === "created_at"
            ) {
                return sortConfig.direction === "asc"
                    ? new Date(aValue) - new Date(bValue)
                    : new Date(bValue) - new Date(aValue);
            }

            if (sortConfig.key === "amount") {
                const aAmount = getMonthlyAmount(a);
                const bAmount = getMonthlyAmount(b);
                return sortConfig.direction === "asc"
                    ? aAmount - bAmount
                    : bAmount - aAmount;
            }

            return 0;
        });

        return filtered;
    };

    const totalMonthly = filteredAndSortedSubscriptions().reduce((sum, sub) => {
        return sum + getMonthlyAmount(sub);
    }, 0);

    const activeCount = filteredAndSortedSubscriptions().filter(
        (sub) => sub.status === "active"
    ).length;
    const canceledCount = filteredAndSortedSubscriptions().filter(
        (sub) => sub.status === "canceled"
    ).length;

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Minhas Assinaturas
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie todas as suas assinaturas em um só lugar
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <Link
                            to="/subscriptions/new"
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span>Nova Assinatura</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <FaCheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                ATIVAS
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {activeCount}
                        </h3>
                        <p className="text-gray-600">Assinaturas ativas</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-50 rounded-xl">
                                <FaTimesCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                CANCELADAS
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {canceledCount}
                        </h3>
                        <p className="text-gray-600">Assinaturas canceladas</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <FaSyncAlt className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                TOTAL MENSAL
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {formatCurrency(totalMonthly)}
                        </h3>
                        <p className="text-gray-600">Gasto mensal total</p>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Busca */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar assinatura..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtro Status */}
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    status: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos os status</option>
                            <option value="active">Ativas</option>
                            <option value="canceled">Canceladas</option>
                        </select>

                        {/* Filtro Categoria */}
                        <select
                            value={filters.category_id}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    category_id: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todas categorias</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Filtro Ciclo */}
                        <select
                            value={filters.billing_cycle}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    billing_cycle: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos os ciclos</option>
                            <option value="monthly">Mensal</option>
                            <option value="yearly">Anual</option>
                        </select>
                    </div>
                </div>

                {/* Tabela de Assinaturas */}
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
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            "service_name"
                                                        )
                                                    }
                                                    className="flex items-center hover:text-blue-600"
                                                >
                                                    Serviço
                                                    {sortConfig.key ===
                                                        "service_name" &&
                                                        (sortConfig.direction ===
                                                        "asc" ? (
                                                            <FaSortAmountUp className="ml-1" />
                                                        ) : (
                                                            <FaSortAmountDown className="ml-1" />
                                                        ))}
                                                </button>
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                Categoria
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                <button
                                                    onClick={() =>
                                                        handleSort("amount")
                                                    }
                                                    className="flex items-center hover:text-blue-600"
                                                >
                                                    Valor
                                                    {sortConfig.key ===
                                                        "amount" &&
                                                        (sortConfig.direction ===
                                                        "asc" ? (
                                                            <FaSortAmountUp className="ml-1" />
                                                        ) : (
                                                            <FaSortAmountDown className="ml-1" />
                                                        ))}
                                                </button>
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            "next_billing_date"
                                                        )
                                                    }
                                                    className="flex items-center hover:text-blue-600"
                                                >
                                                    Próxima Cobrança
                                                    {sortConfig.key ===
                                                        "next_billing_date" &&
                                                        (sortConfig.direction ===
                                                        "asc" ? (
                                                            <FaSortAmountUp className="ml-1" />
                                                        ) : (
                                                            <FaSortAmountDown className="ml-1" />
                                                        ))}
                                                </button>
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                Status
                                            </th>
                                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredAndSortedSubscriptions().map(
                                            (subscription) => (
                                                <tr
                                                    key={subscription.id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                                                                style={{
                                                                    backgroundColor:
                                                                        getCategoryColor(
                                                                            subscription.category_id
                                                                        ) +
                                                                        "20",
                                                                }}
                                                            >
                                                                <span
                                                                    className="font-bold text-gray-700"
                                                                    style={{
                                                                        color: getCategoryColor(
                                                                            subscription.category_id
                                                                        ),
                                                                    }}
                                                                >
                                                                    {subscription.service_name
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        subscription.service_name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500 capitalize">
                                                                    {subscription.billing_cycle ===
                                                                    "monthly"
                                                                        ? "Mensal"
                                                                        : "Anual"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                                            style={{
                                                                backgroundColor:
                                                                    getCategoryColor(
                                                                        subscription.category_id
                                                                    ) + "20",
                                                                color: getCategoryColor(
                                                                    subscription.category_id
                                                                ),
                                                            }}
                                                        >
                                                            {getCategoryName(
                                                                subscription.category_id
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
                                                                {formatDate(
                                                                    subscription.next_billing_date
                                                                )}
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
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                to={`/subscriptions/${subscription.id}/edit`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Editar"
                                                            >
                                                                <FaEdit />
                                                            </Link>
                                                            {subscription.status ===
                                                                "active" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            subscription.id
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-800"
                                                                    title="Cancelar"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumo */}
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Mostrando{" "}
                                        {
                                            filteredAndSortedSubscriptions()
                                                .length
                                        }{" "}
                                        de {subscriptions.length} assinaturas
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        Total mensal:{" "}
                                        {formatCurrency(totalMonthly)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Subscriptions;
