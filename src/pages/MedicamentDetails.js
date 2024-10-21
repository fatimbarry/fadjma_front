import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './medicamentDetails.css';

const MedicamentDetails = () => {
    const { id } = useParams();
    const [medicament, setMedicament] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedicament = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/medicaments/show/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setMedicament(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setError('Une erreur est survenue lors du chargement des données.');
            }
        };
        fetchMedicament();
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!medicament) return (
        <div className="page-container">
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

    return (

        <div className="medicament-details">
            <div className="breadcrumb">
                Médicaments &gt; Tous les détails
            </div>
            <div>
                <h1 className="medicament-title">{medicament.nom}</h1>
            </div>

            <div className="content">
            <div className="image-container">

                    <img
                        src={`http://localhost:8000/storage/${medicament.image_path}`}
                        alt=""
                    />

                </div>
                <div className="info">
                    <div className="composition">
                        <h3>Composition</h3>
                        <p>{medicament.composition}</p>

                    </div>
                    <div className="fabricant">
                        <h3>Fabriquant/commerçant</h3>
                        <p>{medicament.fabricant}</p>

                    </div>
                    <div className="type_consommation">
                        <h3>Type de consommation</h3>
                        <p>{medicament.type_consommation}</p>

                    </div>
                    <div className="date_expiration">
                        <h3>Date d'expiration</h3>
                        <p>{medicament.date_expiration}</p>

                    </div>


                </div>
            </div>
            <div className="description">
                <h3>Description :</h3>
                <p>{medicament.description}</p>
            </div>
            <div className="dosage">
                <h3>Dosage :</h3>
                <p>{medicament.dosage}</p>
            </div>
            <div className="posologie">
                <h3>Posologie :</h3>
                <p>{medicament.posologie}</p>
            </div>
            <div className="ingredients_actifs">
                <h3>Ingredients Actifs :</h3>
                <p>{medicament.ingredients_actifs}</p>
            </div>
            <div className="effets_secondaires">
                <h3>Effets secondaires :</h3>
                <p>{medicament.effets_secondaires}</p>
            </div>
            <div className="forme_pharmaceutique">
                <h3>Forme Pharmaceutique :</h3>
                <p>{medicament.forme_pharmaceutique}</p>
            </div>
        </div>
    );
};

export default MedicamentDetails;