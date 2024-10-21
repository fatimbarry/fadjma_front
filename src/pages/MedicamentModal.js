import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './medicamentModal.css';
import Swal from 'sweetalert2';

const MedicamentModal = ({ isOpen, onClose, onSuccess }) => {
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
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/groupe_medoc', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response.data); // Verify the structure here
                setGroupes(response.data.data.data); // Ensure response.data.data is an array
            } catch (error) {
                console.error('Erreur lors de la récupération des groupes:', error);
            }
        };

        fetchGroupes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image_path: e.target.files[0] });
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const token = localStorage.getItem('token');
            // eslint-disable-next-line
            const response = await axios.post('http://localhost:8000/api/medicaments/store', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });


            const showToast = (message) => {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: message,
                    showConfirmButton: false,
                    timer: 3000
                });
            };

            showToast('Médicament ajouté avec succès!');
            onClose();

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error.response?.data || error.message);
            Swal.fire({
                title: 'Erreur',
                text: "Une erreur s'est produite lors de l'enregistrement.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{`Étape ${step}`}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="image-upload">
                        <label htmlFor="image-input">
                            <span className="plus-icon">+</span>
                            <h3 style={{ color: '#2c3e50'}}>Ajouter une image</h3>
                        </label>
                        <input
                            id="image-input"
                            type="file"
                            name="image_path"
                            onChange={handleImageChange}
                            accept="image/*"
                            hidden
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Aperçu de l'image" style={{ maxWidth: '100px', marginTop: '5px' }} />
                            </div>
                        )}
                    </div>
                    {step === 1 && (
                        <>
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
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
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="form-row">
                                <select
                                    name="grpemedoc_id"
                                    id="grpemedoc_id"
                                    value={formData.grpemedoc_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Sélectionnez un groupe</option>
                                    {Array.isArray(groupes) && groupes.map((groupe) => (
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
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="type_consommation"
                                    value={formData.type_consommation}
                                    onChange={handleChange}
                                    placeholder="Type de consommation"
                                />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="form-row">
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
                        </>
                    )}

                    <div className="button-group">
                        {step > 1 && (
                            <button type="button" onClick={handlePrev} className="prev-button">
                                Précédent
                            </button>
                        )}
                        {step < 3 && (
                            <button type="button" onClick={handleNext} className="next-button">
                                Suivant
                            </button>
                        )}
                        {step === 3 && (
                            <button type="submit" className="save-button">
                                Enregistrer
                            </button>
                        )}
                        <button type="button" onClick={onClose} className="cancel-button">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicamentModal;
