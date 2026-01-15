import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    const loadData = () => {
        console.log("Dados carregados!");
    }
    
    // Componente de rota protegida
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? children : <Navigate to="/login" replace />;
    };

    // Componente de rota para visitantes
    const GuestRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? <Navigate to="/home" replace /> : children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        localStorage.getItem("authToken") ? (
                            <Navigate to="/home" replace />
                        ) : (
                            <GuestRoute>
                                <LandingPage />
                            </GuestRoute>
                        )
                    }
                />

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login loadData={loadData} />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register loadData={loadData} />
                        </GuestRoute> 
                    }
                />

                <Route 
                    path="/dashboard"
                    element={
                        <h1>Ola mundo</h1>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
