import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Ensure CSRF protection
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

            // Make the login request
            const response = await axios.post(
                'http://localhost:8000/api/login',
                {
                    email,
                    password
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

        if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setError('Connexion échouée. Veuillez vérifier vos identifiants.');
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container">
            <header>
                <h1>Bienvenue chez votre pharmacie</h1>
                <div className="logo">
                    <FaShoppingCart />
                    <span>Fadj-Ma</span>
                </div>
            </header>
            <main>
                <div className="buttons">
                    <button className="active">Connectez-vous</button>
                    <button onClick={() => navigate('/register')}>Inscrivez-vous</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Adresse e-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Link to="/password" className="forgot-password">Mot de passe oublié</Link>

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        Se connecter
                    </button>
                </form>
            </main>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-container">
                        <div className="loading-spinner">
                            <div className="segment blue"></div>
                            <div className="segment green"></div>
                            <div className="segment red"></div>
                        </div>
                        <div className="loading-text">Loading...</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;