import React, { useState, useEffect } from "react";
import {
    FaUser,
    FaFolder,
    FaSyncAlt,
    FaMoneyBillWave,
    FaBell,
    FaChartBar,
    FaStar,
    FaCheck,
    FaEnvelope,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { MdDashboard, MdAttachMoney, MdPeople, MdEmail } from "react-icons/md";

const App = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        // Efeito para smooth scroll
        const handleSmoothScroll = (e) => {
            if (e.target.hash) {
                e.preventDefault();
                const targetId = e.target.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: "smooth",
                    });
                }
            }
        };

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", handleSmoothScroll);
        });

        return () => {
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.removeEventListener("click", handleSmoothScroll);
            });
        };
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email && email.includes("@")) {
            // Simulação de cadastro
            console.log("Email cadastrado:", email);
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail("");
            }, 3000);
        }
    };

    const features = [
        {
            icon: <FaUser className="text-3xl text-blue-600" />,
            title: "Gestão de Usuário",
            description:
                "Cadastro e autenticação segura, definição de moeda padrão e controle de notificações.",
            color: "bg-blue-50 border-blue-300",
            hoverColor: "hover:border-blue-500",
        },
        {
            icon: <FaFolder className="text-3xl text-purple-600" />,
            title: "Categorias Personalizadas",
            description:
                "Crie categorias, organize por cores e associe suas assinaturas para melhor visualização.",
            color: "bg-purple-50 border-purple-300",
            hoverColor: "hover:border-purple-500",
        },
        {
            icon: <FaSyncAlt className="text-3xl text-green-600" />,
            title: "Controle de Assinaturas",
            description:
                "Cadastre serviços, defina valores, ciclos de cobrança e controle o status de cada assinatura.",
            color: "bg-green-50 border-green-300",
            hoverColor: "hover:border-green-500",
        },
        {
            icon: <FaMoneyBillWave className="text-3xl text-amber-600" />,
            title: "Histórico de Cobranças",
            description:
                "Acompanhe todas as cobranças por assinatura com status e valores detalhados.",
            color: "bg-amber-50 border-amber-300",
            hoverColor: "hover:border-amber-500",
        },
        {
            icon: <FaBell className="text-3xl text-red-600" />,
            title: "Sistema de Alertas",
            description:
                "Receba notificações sobre cobranças próximas e marque alertas como lidos.",
            color: "bg-red-50 border-red-300",
            hoverColor: "hover:border-red-500",
        },
        {
            icon: <FaChartBar className="text-3xl text-indigo-600" />,
            title: "Dashboard Financeiro",
            description:
                "Visualize gastos mensais e anuais com gráficos intuitivos e relatórios detalhados.",
            color: "bg-indigo-50 border-indigo-300",
            hoverColor: "hover:border-indigo-500",
        },
    ];

    const steps = [
        {
            number: "1",
            title: "Cadastre-se",
            description: "Crie sua conta gratuitamente em menos de 2 minutos.",
        },
        {
            number: "2",
            title: "Adicione suas assinaturas",
            description:
                "Insira serviços como Netflix, Spotify, Amazon Prime, etc.",
        },
        {
            number: "3",
            title: "Organize por categorias",
            description:
                "Classifique seus gastos por tipo (entretenimento, trabalho, etc.).",
        },
        {
            number: "4",
            title: "Controle seus gastos",
            description:
                "Acompanhe cobranças, receba alertas e evite surpresas.",
        },
    ];

    const testimonials = [
        {
            name: "Carlos Silva",
            role: "Designer Freelancer",
            content:
                "O PayTrack me ajudou a identificar 3 assinaturas que eu nem lembrava mais que tinha. Economizo R$ 75 por mês agora!",
            avatar: "CS",
        },
        {
            name: "Mariana Costa",
            role: "Analista de Marketing",
            content:
                "Finalmente consigo visualizar todos meus gastos recorrentes em um só lugar. Os alertas me poupam de juros por atraso.",
            avatar: "MC",
        },
        {
            name: "Ricardo Almeida",
            role: "Desenvolvedor",
            content:
                "Como dev, aprecio a interface intuitiva e a organização. Uso há 6 meses e nunca mais perdi o controle das minhas assinaturas.",
            avatar: "RA",
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            {/* Header/Navbar */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        PT
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">
                                    PayTrack
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a
                                href="#features"
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Funcionalidades
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Como funciona
                            </a>
                            <a
                                href="#testimonials"
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Depoimentos
                            </a>
                            <a
                                href="#pricing"
                                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                            >
                                Preços
                            </a>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <button className="cursor-pointer hidden md:inline-block px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                Entrar
                            </button>
                            <button className="cursor-pointer px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                                Começar Grátis
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden text-gray-600 hover:text-gray-900"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                {mobileMenuOpen ? (
                                    <FaTimes className="w-6 h-6" />
                                ) : (
                                    <FaBars className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            <div className="flex flex-col space-y-3">
                                <a
                                    href="#features"
                                    className="text-gray-600 hover:text-blue-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Funcionalidades
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="text-gray-600 hover:text-blue-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Como funciona
                                </a>
                                <a
                                    href="#testimonials"
                                    className="text-gray-600 hover:text-blue-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Depoimentos
                                </a>
                                <a
                                    href="#pricing"
                                    className="text-gray-600 hover:text-blue-600 font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Preços
                                </a>
                                <div className="pt-2">
                                    <button className="w-full px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        Entrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-6">
                            <span className="text-sm font-medium text-blue-700">
                                Controle total sobre seus gastos recorrentes
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Não perca o controle das suas
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                                {" "}
                                assinaturas
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            O PayTrack centraliza todas as suas assinaturas em
                            um só lugar, ajuda a evitar cobranças esquecidas e
                            dá clareza sobre seus gastos mensais.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <button className="cursor-pointer px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Começar Gratuitamente
                                <span className="block text-sm font-normal mt-1">
                                    Sem cartão de crédito necessário
                                </span>
                            </button>
                            <button className="cursor-pointer px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all shadow hover:shadow-md">
                                Ver Demonstração
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    +95%
                                </div>
                                <div className="text-gray-600">
                                    Redução em cobranças esquecidas
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    R$ 80/mês
                                </div>
                                <div className="text-gray-600">
                                    Economia média por usuário
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    4.8/5
                                </div>
                                <div className="text-gray-600">
                                    Avaliação dos usuários
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Tudo que você precisa para controlar suas
                            assinaturas
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            O PayTrack oferece um conjunto completo de
                            ferramentas para você gerenciar todos os seus gastos
                            recorrentes em um só lugar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`${feature.color} ${feature.hoverColor} border-2 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`}
                            >
                                <div className="mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Simples, rápido e eficiente
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Em apenas 4 passos você terá controle total sobre
                            todas as suas assinaturas.
                        </p>
                    </div>

                    <div className="w-full mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                                            {step.number}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {step.description}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-3/4 w-full h-0.5 bg-linear-to-r from-blue-300 to-purple-300"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-16 bg-linear-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Dashboard intuitivo e visual
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Visualize todos os seus gastos de forma clara com
                            gráficos e relatórios detalhados.
                        </p>
                    </div>

                    <div className="w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="mx-auto font-medium text-gray-700">
                                <MdDashboard className="inline mr-2" />
                                PayTrack Dashboard
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left side - Summary */}
                                <div className="lg:col-span-2">
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            Resumo Financeiro
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-xl">
                                                <div className="text-2xl font-bold text-blue-700 flex items-center">
                                                    <MdAttachMoney className="mr-1" />
                                                    R$ 289,90
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Gasto mensal
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-xl">
                                                <div className="text-2xl font-bold text-green-700">
                                                    8
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Assinaturas ativas
                                                </div>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-xl">
                                                <div className="text-2xl font-bold text-amber-700">
                                                    2
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Próximas cobranças
                                                </div>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-xl">
                                                <div className="text-2xl font-bold text-purple-700 flex items-center">
                                                    <MdAttachMoney className="mr-1" />
                                                    R$ 45
                                                </div>
                                                <div className="text-gray-600 text-sm">
                                                    Economia este mês
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chart placeholder */}
                                    <div className="h-64 bg-linear-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-700 mb-2">
                                                Gráfico de Gastos por Categoria
                                            </div>
                                            <p className="text-gray-600">
                                                Visualize como seu dinheiro é
                                                distribuído entre diferentes
                                                tipos de assinaturas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Upcoming charges */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Próximas Cobranças
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: "Netflix",
                                                date: "Amanhã",
                                                amount: "R$ 34,90",
                                                color: "bg-red-100",
                                            },
                                            {
                                                name: "Spotify",
                                                date: "Em 3 dias",
                                                amount: "R$ 19,90",
                                                color: "bg-green-100",
                                            },
                                            {
                                                name: "Amazon Prime",
                                                date: "Em 5 dias",
                                                amount: "R$ 14,90",
                                                color: "bg-blue-100",
                                            },
                                            {
                                                name: "iCloud",
                                                date: "Em 10 dias",
                                                amount: "R$ 9,90",
                                                color: "bg-gray-100",
                                            },
                                        ].map((charge, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg ${charge.color} flex items-center justify-center mr-3`}
                                                    >
                                                        <span className="font-bold">
                                                            {charge.name.charAt(
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {charge.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {charge.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="font-bold">
                                                    {charge.amount}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            O que nossos usuários dizem
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Junte-se a milhares de pessoas que já recuperaram o
                            controle sobre seus gastos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className="w-5 h-5 text-amber-400"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Planos que cabem no seu bolso
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comece gratuitamente e atualize quando precisar de
                            mais recursos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                            <div>
                              <div className="mb-6">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                      Grátis
                                  </h3>
                                  <div className="flex items-baseline">
                                      <span className="text-4xl font-bold text-gray-900">
                                          R$ 0
                                      </span>
                                      <span className="text-gray-600 ml-2">
                                          /para sempre
                                      </span>
                                  </div>
                                  <p className="text-gray-600 mt-4">
                                      Perfeito para começar a organizar suas
                                      assinaturas
                                  </p>
                              </div>
                              <ul className="space-y-4 mb-8">
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Até 5 assinaturas</span>
                                  </li>
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Alertas básicos</span>
                                  </li>
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Dashboard simples</span>
                                  </li>
                              </ul>
                            </div>
                            <button className="cursor-pointer w-full py-3 px-4 border-2 border-gray-300 text-gray-800 font-semibold rounded-xl hover:border-blue-500 transition-colors">
                                Começar Gratuitamente
                            </button>
                        </div>

                        {/* Pro Plan - Featured */}
                        <div className="bg-white border-2 border-blue-500 rounded-2xl p-8 shadow-xl transform md:-translate-y-4 ">
                            <div>
                              <div className="mb-6">
                                  <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                                      MAIS POPULAR
                                  </div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                      Pro
                                  </h3>
                                  <div className="flex items-baseline">
                                      <span className="text-4xl font-bold text-gray-900">
                                          R$ 9,90
                                      </span>
                                      <span className="text-gray-600 ml-2">
                                          /mês
                                      </span>
                                  </div>
                                  <p className="text-gray-600 mt-4">
                                      Ideal para quem tem várias assinaturas e
                                      quer controle total
                                  </p>
                              </div>
                              <ul className="space-y-4 mb-8">
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Assinaturas ilimitadas</span>
                                  </li>
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Alertas avançados</span>
                                  </li>
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Dashboard completo</span>
                                  </li>
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Exportação de dados</span>
                                  </li>
                                  <li className="flex items-center">
                                      <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                      <span>Categorias personalizadas</span>
                                  </li>
                              </ul>
                            </div>
                            <button className="cursor-pointer w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                                Experimente 14 dias grátis
                            </button>
                        </div>

                        {/* Team Plan */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Família
                                    </h3>
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-gray-900">
                                            R$ 19,90
                                        </span>
                                        <span className="text-gray-600 ml-2">
                                            /mês
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-4">
                                        Para famílias que querem controlar
                                        gastos em conjunto
                                    </p>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center">
                                        <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Todos os recursos Pro</span>
                                    </li>
                                    <li className="flex items-center">
                                        <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Até 5 membros</span>
                                    </li>
                                    <li className="flex items-center">
                                        <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Contas separadas</span>
                                    </li>
                                    <li className="flex items-center">
                                        <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                                        <span>Relatórios compartilhados</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="cursor-pointer w-full py-3 px-4 border-2 border-gray-300 text-gray-800 font-semibold rounded-xl hover:border-blue-500 transition-colors">
                                Contratar Plano Família
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-full mx-auto bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Receba dicas de controle financeiro
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Inscreva-se para receber conteúdos exclusivos sobre
                            como gerenciar suas assinaturas e otimizar seus
                            gastos.
                        </p>
                        <form
                            onSubmit={handleSubscribe}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative grow">
                                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="seu@email.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="cursor-pointer px-8 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <FaEnvelope />
                                    {subscribed ? "Inscrito!" : "Inscrever-se"}
                                </button>
                            </div>
                            <p className="text-gray-500 text-sm mt-4">
                                Não compartilhamos seu email. Você pode cancelar
                                a qualquer momento.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        PT
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    PayTrack
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Controle total sobre suas assinaturas e gastos
                                recorrentes.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-6">
                                Produto
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#features"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Funcionalidades
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#how-it-works"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Como funciona
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#pricing"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Preços
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-6">
                                Empresa
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Sobre nós
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Carreiras
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg mb-6">
                                Suporte
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Central de Ajuda
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Política de Privacidade
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>
                            © {new Date().getFullYear()} PayTrack. Todos os
                            direitos reservados.
                        </p>
                        <p className="mt-2">
                            Projeto desenvolvido com foco em boas práticas de
                            desenvolvimento fullstack.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
