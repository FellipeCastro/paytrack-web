// pages/CategoryForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaSave, FaPalette } from "react-icons/fa";
import Layout from "../components/Layout";
import api from "../config/api";

const CategoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    // Estado do formulário
    const [formData, setFormData] = useState({
        name: "",
        color: "#3B82F6", // Cor padrão (blue-500)
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            fetchCategory();
            setIsEditing(true);
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            // Como a API não tem endpoint para buscar categoria específica,
            // vamos buscar todas e filtrar
            const response = await api.get("/categories");
            const category = response.data.find(cat => cat.id === id);
            if (category) {
                setFormData({
                    name: category.name || "",
                    color: category.color || "#3B82F6",
                });
            } else {
                setError("Categoria não encontrada");
            }
        } catch (error) {
            console.error("Erro ao carregar categoria:", error);
            setError("Erro ao carregar categoria. Tente novamente.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleColorSelect = (color) => {
        setFormData(prev => ({
            ...prev,
            color
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = "Nome da categoria é obrigatório";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Nome muito curto";
        }
        
        if (!formData.color) {
            newErrors.color = "Selecione uma cor";
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
            if (isEditing) {
                await api.put(`/categories/${id}`, formData);
                alert("Categoria atualizada com sucesso!");
            } else {
                await api.post("/categories", formData);
                alert("Categoria criada com sucesso!");
            }
            
            navigate("/categories");
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            const errorMessage = error.response?.data?.message || "Erro ao salvar categoria. Tente novamente.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/categories");
    };

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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/categories"
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {isEditing ? "Editar Categoria" : "Nova Categoria"}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditing 
                                    ? "Atualize os dados da sua categoria" 
                                    : "Crie uma nova categoria para organizar suas assinaturas"}
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
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nome da Categoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome da Categoria *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Entretenimento, Trabalho, Música..."
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name 
                                        ? 'border-red-300 focus:border-transparent' 
                                        : 'border-gray-300 focus:border-transparent'
                                }`}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Seletor de Cor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                <FaPalette className="inline mr-2 text-gray-500" />
                                Cor da Categoria *
                            </label>
                            
                            {/* Preview da cor selecionada */}
                            <div className="mb-6">
                                <div 
                                    className="w-20 h-20 rounded-xl mb-3 border border-gray-200"
                                    style={{ backgroundColor: formData.color }}
                                ></div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm text-gray-600 font-mono">
                                        {formData.color}
                                    </span>
                                </div>
                            </div>

                            {/* Paleta de cores pré-definidas */}
                            <div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Ou escolha uma cor pré-definida:
                                </p>
                                <div className="grid grid-cols-5 gap-3">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleColorSelect(color)}
                                            className={`w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                                                formData.color === color 
                                                    ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-white'
                                                    : ''
                                            }`}
                                            style={{ backgroundColor: color }}
                                            disabled={isLoading}
                                            title={color}
                                        >
                                            {formData.color === color && (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {errors.color && (
                                <p className="mt-2 text-sm text-red-600">{errors.color}</p>
                            )}
                        </div>

                        {/* Dicas */}
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <h4 className="font-medium text-gray-900 mb-2">
                                Dicas para categorias:
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Use cores diferentes para categorias diferentes</li>
                                <li>• Crie categorias por tipo de serviço (Streaming, Software, etc.)</li>
                                <li>• Nomes curtos e descritivos são mais fáceis de identificar</li>
                                {isEditing && (
                                    <li>• Ao editar, todas as assinaturas desta categoria serão atualizadas</li>
                                )}
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryForm;