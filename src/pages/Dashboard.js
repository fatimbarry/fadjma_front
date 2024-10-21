import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaChartBar, FaPills, FaSignOutAlt } from 'react-icons/fa';
import './dashboard.css';
import { NavLink } from 'react-router-dom';

function Dashboard() {
    // État pour stocker les informations de l'utilisateur
    const [userData, setUserData] = useState({
        prenom: '',
        nom: '',
        role: '',
        photoUrl: ''
    });

    // État pour stocker les données du tableau de bord
    const [dashboardData, setDashboardData] = useState({
        nombreMedicamentsDisponibles: null,
        nombreMedicamentsPenurie: null,
        nombreTotalMedicaments: null,
        nombreTotalGroupesMedicaments: null,
        nombreQuantiteMedicamentsVendus: null,
        nombreFournisseurs: null,
        nombreUtilisateurs: null,
        nombreClients: null,
        articleFrequent: null,
        revenuAnnuel: null,
        nombreFacturesGenerer: null
    });

    // État pour les erreurs potentielles
    const [error, setError] = useState(null);

    // Effet pour récupérer les données lorsque le composant est monté
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const baseUrl = 'http://localhost:8000/api'; // Assurez-vous que c'est la bonne URL

                // Récupération des données utilisateur et du tableau de bord via des appels API simultanés
                const [
                    userResponse,
                    medicamentsDisponiblesRes,
                    medicamentsPenurieRes,
                    totalMedicamentsRes,
                    totalGroupesMedicamentsRes,
                    quantiteMedicamentsVendusRes,
                    fournisseursRes,
                    utilisateursRes,
                    clientsRes,
                    articleFrequentRes,
                    revenuAnnuelRes,
                    facturesGenererRes,
                ] = await Promise.all([
                    axios.get(`${baseUrl}/users/getuser`, config), // Utilisation de l'API getUser
                    axios.get(`${baseUrl}/medicaments-disponibles`, config),
                    axios.get(`${baseUrl}/medicaments-penurie`, config),
                    axios.get(`${baseUrl}/total-medicaments`, config),
                    axios.get(`${baseUrl}/total-groupes-medicaments`, config),
                    axios.get(`${baseUrl}/quantite-medicaments-vendus`, config),
                    axios.get(`${baseUrl}/fournisseurs`, config),
                    axios.get(`${baseUrl}/utilisateurs`, config),
                    axios.get(`${baseUrl}/clients`, config),
                    axios.get(`${baseUrl}/article-frequent`, config),
                    axios.get(`${baseUrl}/revenu-annuel`, config),
                    axios.get(`${baseUrl}/factures-generer`, config),
                ]);

                // Mise à jour de l'état utilisateur avec les données reçues
                setUserData({
                    prenom: userResponse.data.prenom,
                    nom: userResponse.data.nom,
                    role: userResponse.data.role,
                    photoUrl: `http://localhost:8000/storage/${userResponse.data.image_path}`
                });

                // Mise à jour de l'état du tableau de bord avec les données reçues
                setDashboardData({
                    nombreMedicamentsDisponibles: medicamentsDisponiblesRes.data.nombre_medicaments_disponibles,
                    nombreMedicamentsPenurie: medicamentsPenurieRes.data.nombre_medicaments_penurie,
                    nombreTotalMedicaments: totalMedicamentsRes.data.nombre_total_medicaments,
                    nombreTotalGroupesMedicaments: totalGroupesMedicamentsRes.data.nombre_total_groupes_medicaments,
                    nombreQuantiteMedicamentsVendus: quantiteMedicamentsVendusRes.data.nombre_quantite_medicaments_vendus,
                    nombreFournisseurs: fournisseursRes.data.nombre_fournisseurs,
                    nombreUtilisateurs: utilisateursRes.data.nombre_utilisateurs,
                    nombreClients: clientsRes.data.nombre_clients,
                    articleFrequent: articleFrequentRes.data.article_frequent,
                    revenuAnnuel: revenuAnnuelRes.data.revenu_annuel,
                    nombreFacturesGenerer: facturesGenererRes.data.nombre_factures_generer,
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError('Erreur lors du chargement des données. Veuillez réessayer.');
            }
        };

        fetchData();
    }, []);

    // Affichage de l'erreur si elle existe
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard">
            <Sidebar userData={userData} />
            <MainContent dashboardData={dashboardData} />
        </div>
    );
}



function MainContent({ dashboardData }) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('fr-FR', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentMonth} ${currentYear}`;

    return (
        <div className="main-content">
            <header className="header">
                <input type="text" placeholder="Recherchez n'importe quoi ici..." className="search-input"/>
                <div className="right-section">
                    <div className="language-selection">
                        <span className="language-icon">🌐</span>
                        <span className="language-text">Français (France)</span>
                        <span className="dropdown-icon">▼</span>
                    </div>
                    <div className="greeting">
                        <span className="greeting-dot">●</span> Bonjour
                    </div>
                    <div className="date-time">
                        {new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}
                        • {new Date().toLocaleTimeString('fr-FR')}
                    </div>
                </div>
            </header>

            <div className="subtitle">
                <h1 style={{color: '#2c3e50'}}>Tableau De Bord</h1>
                <p>Un aperçu rapide des données de votre pharmacie</p>
            </div>

            <div className="stats-grid">
                <StatCard icon="✓" title={dashboardData.nombreMedicamentsDisponibles} subtitle="Médicaments disponibles" color="blue"/>
                <StatCard icon="⚠️" title={dashboardData.nombreMedicamentsPenurie} subtitle="Pénurie de médicaments"/>
                <StatCard icon="💰" title={`${dashboardData.revenuAnnuel} FCFA`} subtitle={`Revenu: ${formattedDate}`}
                          color="yellow"/>
                <StatCard icon="📄" title={dashboardData.nombreFacturesGenerer} subtitle="Factures générées"
                />
            </div>

            <div className="info-grid">
                <InfoCard
                    title="Inventaire"
                    data={[
                        {label: 'Nombre total de médicaments: ', value: dashboardData.nombreTotalMedicaments},
                        {label: 'Groupes de médicaments: ', value: dashboardData.nombreTotalGroupesMedicaments},
                    ]}
                />
                <InfoCard
                    title="Rapport rapide"
                    data={[
                        {
                            label: 'Quantité de médicaments vendus: ',
                            value: dashboardData.nombreQuantiteMedicamentsVendus
                        },
                        {label: 'Factures générées: ', value: dashboardData.nombreFacturesGenerer},
                    ]}
                />
            </div>
            <div className="info-grid">
                <InfoCard
                    title="Ma pharmacie"
                    data={[
                        {label: 'Nombre total de fournisseurs: ', value: dashboardData.nombreFournisseurs},
                        {label: "Nombre total d'utilisateurs: ", value: dashboardData.nombreUtilisateurs},
                    ]}
                />
                <InfoCard
                    title="Clients"
                    data={[
                        {label: 'Nombre total de clients: ', value: dashboardData.nombreClients},
                        {
                            label: 'Article le plus fréquent: ',
                            value: dashboardData.articleFrequent
                                ? `ID: ${dashboardData.articleFrequent.medicament_id}, Quantité: ${dashboardData.articleFrequent.total_quantite}`
                                : 'Aucun article trouvé',
                        },
                    ]}
                />
            </div>
        </div>
    );
}
function Sidebar({ userData }) {
    const { prenom, nom, role, photoUrl } = userData;

    return (
        <div className="sidebar">
            <div className="logo">
                <FaShoppingCart className="logo-icon" />
                <span>Fadj-Ma</span>
            </div>
            <div className="user-info">
                <img src={photoUrl} alt={nom} className="user-photo" />

                <div className="user-details">
                    <h3>{prenom} {nom}</h3>
                    <p className="user-role">{role}</p>
                </div>
            </div>
            <nav>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <FaChartBar className="nav-icon" />
                    Tableau de bord
                </NavLink>
                <NavLink to="/medicament" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <FaPills className="nav-icon" />
                    Médicaments
                </NavLink>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                    <FaSignOutAlt className="nav-icon" />
                    Déconnexion
                </NavLink>
            </nav>
            <footer className="footer">
                <p>Propulsé par Fatima © 2024 version 1.0</p>
            </footer>
        </div>
    );
}

function StatCard({icon, title, subtitle, color}) {
    return (
        <div className={`stat-card ${color}`}>
            <div className="icon">{icon}</div>
            <div className="details">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
        </div>
    );
}

function InfoCard({title, data}) {
    return (
        <div className="info-card">
            <h3>{title}</h3>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        <span>{item.label}</span>
                        <span>{item.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
