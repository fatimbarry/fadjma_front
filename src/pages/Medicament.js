import React, { useState, useEffect, useCallback } from 'react';
import {
    FaShoppingCart,
    FaChartBar,
    FaPills,
    FaSignOutAlt,
    FaSearch,
    FaFilter
} from 'react-icons/fa';
import axios from 'axios';
import './medicament.css';
import MedicamentModal from './MedicamentModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';

const Medicaments = () => {
    const [medicaments, setMedicaments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMedicaments, setTotalMedicaments] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [groups, setGroups] = useState([]);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const medicamentsPerPage = 5;
    const indexOfLastMedicament = currentPage * medicamentsPerPage;
    const indexOfFirstMedicament = indexOfLastMedicament - medicamentsPerPage;

    const currentMedicaments = medicaments.slice(
        indexOfFirstMedicament,
        indexOfLastMedicament
    );

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/getuser', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserData({
                    prenom: response.data.prenom,
                    nom: response.data.nom,
                    role: response.data.role,
                    photoUrl: `http://localhost:8000/storage/${response.data.image_path}`
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error);
            }
        };

        fetchUserData();
    }, []);

    const fetchGroups = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/groupe_medoc', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                setGroups(response.data.data.data);
            } else {
                console.error('Format de données inattendu pour les groupes');
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des groupes:', err);
            setError(err);
        }
    }, []);

    const fetchMedicaments = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/medicaments', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: currentPage,
                    search: searchTerm,
                    group: selectedGroup,
                },
            });

            let medicamentsData = [];
            if (Array.isArray(response.data)) {
                medicamentsData = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                medicamentsData = response.data.data;
            }

            setMedicaments(medicamentsData);
            setTotalMedicaments(response.data.total || medicamentsData.length);
            setError(null);
        } catch (err) {
            console.error('Erreur lors de la récupération des médicaments:', err);
            setError(err);
        }
    }, [currentPage, searchTerm, selectedGroup]);

    useEffect(() => {
        fetchGroups();
        fetchMedicaments();
    }, [fetchGroups, fetchMedicaments]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        fetchMedicaments();
    };

    const handleSuccessAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Médicament ajouté avec succès!',
            timer: 2000,
            showConfirmButton: false,
        });
        fetchMedicaments();
    };

    if (error) {
        return <div>Erreur: {error.message}</div>;
    }

    const onView = (id) => {
        navigate(`/medicamentDetails/${id}`);
    };

    const onEdit = (id) => {
        navigate(`/medicamentedit/${id}`);
    };

    const onDelete = async (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Confirmation',
            text: 'Êtes-vous sûr de vouloir supprimer ce médicament ?',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler',
            customClass: {
                popup: 'delete-confirmation',
                confirmButton: 'confirm-button',
                cancelButton: 'cancel-button',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(
                        `http://localhost:8000/api/medicaments/delete/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    Swal.fire({
                        icon: 'success',
                        title: 'Médicament supprimé avec succès !',
                        showConfirmButton: false,
                        timer: 1500,
                    });

                    fetchMedicaments();
                } catch (error) {
                    console.error('Error deleting medicament:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: "Une erreur s'est produite lors de la suppression du médicament.",
                    });
                }
            }
        });
    };

    function Sidebar({ userData }) {
        if (!userData) return null;
        const { prenom, nom, role, photoUrl } = userData;

        return (
            <div className="sidebar">
                <div className="logo">
                    <FaShoppingCart /> Fadj-Ma
                </div>
                <div className="user-info flex items-center p-4 bg-white rounded-lg shadow">
                    <img src={photoUrl} alt={nom} className="w-16 h-16 rounded-full mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold" style={{color: 'white'}}>{prenom} {nom}</h3>
                        <p className="text-gray-600">{role}</p>
                    </div>
                </div>
                <nav>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                        <FaChartBar /> Tableau de Bord
                    </NavLink>
                    <NavLink to="/medicament" className={({ isActive }) => (isActive ? 'active' : '')}>
                        <FaPills /> Médicaments
                    </NavLink>
                    <NavLink to="/VenteMedicament" className={({ isActive }) => (isActive ? 'active' : '')}>
                        <FaShoppingCart/> VenteMedicament
                    </NavLink>
                    <NavLink to="/ListeVentes" className={({ isActive }) => (isActive ? 'active' : '')}>
                        <FaShoppingCart /> ListeMedicament
                    </NavLink>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                        <FaSignOutAlt /> Déconnexion
                    </NavLink>
                </nav>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar userData={userData} />
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
                <div className="medicaments-header">
                    <div className="title-section">
                        <h1 style={{color: '#2c3e50'}}>médicaments ({totalMedicaments})</h1>
                        <p>Liste des médicaments disponibles à la vente.</p>
                    </div>
                    <button className="new-medicament-btn" onClick={openModal}>
                        + Nouveau médicament
                    </button>
                </div>

                <div className="search-filter-bar">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Rechercher dans l'inventaire des médicaments."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="search-icon"/>
                    </div>
                    <div className="filter-dropdown">
                        <FaFilter/>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <option value="">Sélectionnez un groupe</option>
                            {Array.isArray(groups) ? (
                                groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.nom}
                                    </option>
                                ))
                            ) : (
                                <option value="">Aucun groupe disponible</option>
                            )}
                        </select>
                    </div>
                </div>
                <MedicamentModal isOpen={isModalOpen} onClose={closeModal} onSuccess={handleSuccessAlert}/>

                <table className="medicaments-table">
                    <thead>
                    <tr>
                        <th>Nom du médicament</th>
                        <th>ID du médicament</th>
                        <th>Nom de groupe</th>
                        <th>Stock en quantité</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentMedicaments.length > 0 ? (
                        currentMedicaments.map((med) => (
                            <tr key={med.id}>
                                <td>{med.nom}</td>
                                <td>{med.code_medicament}</td>
                                <td>{med.groupe ? med.groupe.nom : 'N/A'}</td>
                                <td>{med.stock_quantite}</td>
                                <td>
                                    <button
                                        onClick={() => onView(med.id)}
                                        className="icon-button"
                                    >
                                        <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                    <button
                                        onClick={() => onEdit(med.id)}
                                        className="icon-button"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt}/>
                                    </button>
                                    <button
                                        onClick={() => onDelete(med.id)}
                                        className="icon-button"
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Aucun médicament trouvé</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div className="pagination">
                    <p className="item-range">
                        Affichage de {indexOfFirstMedicament + 1} à{' '}
                        {Math.min(indexOfLastMedicament, totalMedicaments)} sur{' '}
                        {totalMedicaments}
                    </p>
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &#8249; {/* Symbole pour une flèche gauche */}
                    </button>

                    <div className="page-dropdown">
                        Page {currentPage.toString().padStart(2, '0')}
                        <select
                            onChange={(e) => setCurrentPage(Number(e.target.value))}
                            value={currentPage}
                        >
                            {Array.from(
                                {length: Math.ceil(totalMedicaments / medicamentsPerPage)},
                                (_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {index + 1}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={indexOfLastMedicament >= totalMedicaments}
                    >
                        &#8250; {/* Symbole pour une flèche droite */}
                    </button>
                </div>


            </div>
        </div>
    );
};

export default Medicaments;
