import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './pages/login/LoginPage';
import ProductsPage from './pages/products/ProductsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="app">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/products"
                            element={
                                <ProtectedRoute>
                                    <ProductsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigate to="/login" replace />}
                        />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
