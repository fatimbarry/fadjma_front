import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './medicamentEdit.css';
import Swal from 'sweetalert2';

const MedicamentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        grpemedoc_id: '',
        nom: '',
        description: '',
        dosage: '',
        prix: '',
        image_path: '',
        stock_quantite: '',
        composition: '',
        fabricant: '',
        type_consommation: '',
        date_expiration: '',
        posologie: '',
        ingredients_actifs: '',
        effets_secondaires: '',
        forme_pharmaceutique: ''
    });
    const [groupes, setGroupes] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(true);
    const baseUrl = 'http://localhost:8000/storage';

    useEffect(() => {
        const fetchMedicamentAndGroupes = async () => {
            try {
                const token = localStorage.getItem('token');
                const [medicamentResponse, groupesResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/api/medicaments/show/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:8000/api/groupe_medoc', {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);

                setFormData(medicamentResponse.data.data);
                setCurrentImage(`${baseUrl}/${medicamentResponse.data.data.image_path}`);
                setGroupes(groupesResponse.data.data.data);
                setImagePreview(null);
                setLoading(false); // Set loading to false after data fetch
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                Swal.fire('Erreur', 'Impossible de charger les données du médicament', 'error');
                setLoading(false);
            }
        };

        fetchMedicamentAndGroupes();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData(prevState => ({
                ...prevState,
                image_path: file
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            if (key === 'image_path') {
                if (formData[key] instanceof File) {
                    data.append('image_path', formData[key]);
                }
            } else {
                data.append(key, formData[key]);
            }
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8000/api/medicaments/update/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Médicament modifié avec succès!',
                showConfirmButton: false,
                timer: 3000
            });
            navigate('/medicament');

        } catch (error) {
            console.error('Erreur lors de la modification:', error.response?.data || error.message);
            Swal.fire('Erreur', "Une erreur s'est produite lors de la modification.", 'error');
        }
    };

    // Display loading spinner when loading is true
    if (loading) {
        return (
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
        );
    }

    return (
        <div className="medicament-edit-container">
            <h2>Modifier le médicament</h2>
            <form onSubmit={handleSubmit}>
                <div className="image-upload">
                    {(imagePreview || currentImage) && (
                        <img
                            src={imagePreview || currentImage}
                            alt="Médicament actuel"
                            className="current-image"
                        />
                    )}
                    <label htmlFor="image-input">
                        <span className="plus-icon">+</span>
                        <h3 style={{color: '#2c3e50'}}>Changer l'image</h3>
                    </label>
                    <input
                        id="image-input"
                        type="file"
                        name="image_path"
                        onChange={handleImageChange}
                        accept="image/*"
                        hidden
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom || ''}
                        onChange={handleChange}
                        placeholder="Nom du médicament"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleChange}
                        placeholder="Dosage"
                        required
                    />
                    <input
                        type="number"
                        name="prix"
                        value={formData.prix}
                        onChange={handleChange}
                        placeholder="Prix"
                        required
                    />
                </div>

                <div className="form-row">
                    <select
                        name="grpemedoc_id"
                        value={formData.grpemedoc_id}
                        onChange={handleChange}
                    >
                        <option value="">Sélectionnez un groupe</option>
                        {groupes.map((groupe) => (
                            <option key={groupe.id} value={groupe.id}>
                                {groupe.nom}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="stock_quantite"
                        value={formData.stock_quantite}
                        onChange={handleChange}
                        placeholder="Quantité en stock"
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        name="composition"
                        value={formData.composition}
                        onChange={handleChange}
                        placeholder="Composition"
                    />
                    <input
                        type="text"
                        name="fabricant"
                        value={formData.fabricant}
                        onChange={handleChange}
                        placeholder="Fabricant"
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        name="type_consommation"
                        value={formData.type_consommation}
                        onChange={handleChange}
                        placeholder="Type de consommation"
                    />
                    <input
                        type="date"
                        name="date_expiration"
                        value={formData.date_expiration}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        name="posologie"
                        value={formData.posologie}
                        onChange={handleChange}
                        placeholder="Posologie"
                    />
                    <input
                        type="text"
                        name="ingredients_actifs"
                        value={formData.ingredients_actifs}
                        onChange={handleChange}
                        placeholder="Ingrédients actifs"
                    />
                </div>

                <div className="form-row">
                    <input
                        type="text"
                        name="effets_secondaires"
                        value={formData.effets_secondaires}
                        onChange={handleChange}
                        placeholder="Effets secondaires"
                    />
                    <input
                        type="text"
                        name="forme_pharmaceutique"
                        value={formData.forme_pharmaceutique}
                        onChange={handleChange}
                        placeholder="Forme pharmaceutique"
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="save-button">
                        Enregistrer
                    </button>
                    <button type="button" onClick={() => navigate('/medicaments')} className="cancel-button">
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MedicamentEdit;
