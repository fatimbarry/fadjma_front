import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Register() {
    const [activeTab, setActiveTab] = useState('register');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        sexe: 'Homme',
        prenom: '',
        nom: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: 2 // Assurez-vous d'utiliser l'ID correct pour le rôle utilisateur
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const userData = {
                sexe: formData.sexe,
                prenom: formData.prenom,
                nom: formData.nom,
                date_de_naissance: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`, // Format YYYY-MM-DD
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword, // Pour la validation "confirmed"
                role_id: formData.role_id
            };

            const response = await axios.post('http://localhost:8000/api/register', userData);
            console.log(response.data);

            if (response.status === 201) {
                navigate('/');
            } else {
                setError('Une erreur s\'est produite lors de l\'inscription.');
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            setError("Une erreur s'est produite lors de l'inscription.");
        }finally {
            setIsLoading(false);
        }
    };

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
                    <button onClick={() => navigate('/')}>Connectez-vous</button>
                    <button
                        className={activeTab === 'register' ? 'active' : ''}
                        onClick={() => setActiveTab('register')}
                    >
                        Inscrivez-vous
                    </button>
                </div>
                {activeTab === 'register' && (
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <label>Vos coordonnées</label>
                            <div className="gender-selection">
                                <input
                                    type="radio"
                                    id="homme"
                                    name="sexe"
                                    value="Homme"
                                    checked={formData.sexe === 'Homme'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="homme">Homme</label>

                                <input
                                    type="radio"
                                    id="femme"
                                    name="sexe"
                                    value="Femme"
                                    checked={formData.sexe === 'Femme'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="femme">Femme</label>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="prenom">Prénom</label>
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nom">Nom</label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Date de naissance</label>
                            <div className="date-inputs">
                                <select
                                    name="birthDay"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                >
                                    <option value="" disabled>JJ</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i} value={i + 1}>
                                            {String(i + 1).padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="birthMonth"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                >
                                    <option value="" disabled>MM</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i} value={i + 1}>
                                            {String(i + 1).padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="birthYear"
                                    onChange={handleInputChange}
                                    defaultValue=""
                                >
                                    <option value="" disabled>AAAA</option>
                                    {[...Array(100)].map((_, i) => (
                                        <option key={i} value={2024 - i}>
                                            {2024 - i}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Mot de passe</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmer</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            S'inscrire
                        </button>
                    </form>
                )}
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

export default Register;
