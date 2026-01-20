import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import SubscriptionForm from "./pages/SubscriptionForm";
import CategoryForm from "./pages/CategoryForm";
import ChargeForm from "./pages/ChargeForm";
import Alerts from "./pages/Alerts";

const App = () => {
    // Componente de rota protegida
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? children : <Navigate to="/login" replace />;
    };

    // Componente de rota para visitantes
    const GuestRoute = ({ children }) => {
        const token = localStorage.getItem("authToken");
        return token ? <Navigate to="/dashboard" replace /> : children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={
                        <GuestRoute>
                            <LandingPage />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/subscriptions"
                    element={
                        <ProtectedRoute>
                            <Subscriptions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <Categories />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/subscriptions/new"
                    element={
                        <ProtectedRoute>
                            <SubscriptionForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/subscriptions/:id/edit"
                    element={
                        <ProtectedRoute>
                            <SubscriptionForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/subscriptions/:id/charge"
                    element={
                        <ProtectedRoute>
                            <ChargeForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories/new"
                    element={
                        <ProtectedRoute>
                            <CategoryForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories/:id/edit"
                    element={
                        <ProtectedRoute>
                            <CategoryForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/alerts"
                    element={
                        <ProtectedRoute>
                            <Alerts />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
