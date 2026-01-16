// pages/Categories.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaPalette, FaSearch } from "react-icons/fa";
import api from "../config/api.js";
import Layout from "../components/Layout.jsx";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        color: "#3B82F6",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/categories/${categoryToDelete.id}`);
            fetchCategories();
            setShowDeleteModal(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            alert(
                "Erro ao excluir categoria: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditForm({
            name: category.name,
            color: category.color || "#3B82F6",
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/categories/${editingCategory.id}`, editForm);
            fetchCategories();
            setShowEditModal(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            alert(
                "Erro ao atualizar categoria: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const colorOptions = [
        "#3B82F6", // blue-500
        "#10B981", // green-500
        "#EF4444", // red-500
        "#F59E0B", // amber-500
        "#8B5CF6", // violet-500
        "#EC4899", // pink-500
        "#6366F1", // indigo-500
        "#14B8A6", // teal-500
        "#F97316", // orange-500
        "#6B7280", // gray-500
    ];

    return (
        <Layout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Categorias
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Organize suas assinaturas por categorias
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <Link
                            to="/categories/new"
                            className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span>Nova Categoria</span>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <FaPalette className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {categories.length}
                        </h3>
                        <p className="text-gray-600">Categorias criadas</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <FaPalette className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {filteredCategories.length}
                        </h3>
                        <p className="text-gray-600">Categorias filtradas</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <FaPalette className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            Personalize
                        </h3>
                        <p className="text-gray-600">Cores e organização</p>
                    </div>
                </div>

                {/* Busca */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Grid de Categorias */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-3 p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Carregando categorias...
                            </p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="col-span-3 p-12 text-center">
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? "Nenhuma categoria encontrada."
                                    : "Nenhuma categoria criada ainda."}
                            </p>
                            <Link
                                to="/categories/new"
                                className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                            >
                                <FaPlus className="mr-2" />
                                Criar primeira categoria
                            </Link>
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div
                                    className="h-4"
                                    style={{
                                        backgroundColor:
                                            category.color || "#3B82F6",
                                    }}
                                ></div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Criada em{" "}
                                                {new Date(
                                                    category.created_at
                                                ).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>
                                        <div
                                            className="w-8 h-8 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    category.color || "#3B82F6",
                                            }}
                                        ></div>
                                    </div>

                                    <div className="flex items-center space-x-2 mt-6">
                                        <button
                                            onClick={() =>
                                                handleEditClick(category)
                                            }
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <FaEdit className="w-4 h-4" />
                                            <span>Editar</span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(category)
                                            }
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                            <span>Excluir</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal de Exclusão */}
                {showDeleteModal && categoryToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Excluir Categoria
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Tem certeza que deseja excluir a categoria "
                                    {categoryToDelete.name}"? Esta ação não pode
                                    ser desfeita.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setCategoryToDelete(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Edição */}
                {showEditModal && editingCategory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                            <form onSubmit={handleEditSubmit}>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Editar Categoria
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nome da Categoria
                                            </label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cor da Categoria
                                            </label>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <input
                                                    type="color"
                                                    value={editForm.color}
                                                    onChange={(e) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            color: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-12 h-12 rounded-lg cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {editForm.color}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-5 gap-2">
                                                {colorOptions.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() =>
                                                            setEditForm({
                                                                ...editForm,
                                                                color,
                                                            })
                                                        }
                                                        className={`w-8 h-8 rounded-full ${
                                                            editForm.color ===
                                                            color
                                                                ? "ring-2 ring-offset-2 ring-blue-500"
                                                                : ""
                                                        }`}
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    ></button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setEditingCategory(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                                        >
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Categories;
