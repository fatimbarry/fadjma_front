import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PlusCircle, MinusCircle, ShoppingCart, Loader } from 'lucide-react';

const VenteMedicaments = () => {
    const [formData, setFormData] = useState({
        client_id: '',
        date_vente: new Date().toISOString().split('T')[0],
        medicaments: [{ id: '', quantite: 1 }]
    });
    const [clients, setClients] = useState([]);
    const [medicamentsList, setMedicamentsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getAuthHeader = useCallback(() => ({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }), []);

    const fetchClients = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/clients', getAuthHeader());
            setClients(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching clients:', error);
            setErrorMessage('Erreur lors du chargement des clients.');
        }
    }, [getAuthHeader]);

    const fetchMedicaments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/medicaments', getAuthHeader());
            setMedicamentsList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching medicaments:', error);
            setErrorMessage('Erreur lors du chargement des médicaments.');
        }
    }, [getAuthHeader]);

    useEffect(() => {
        fetchClients();
        fetchMedicaments();
    }, [fetchClients, fetchMedicaments]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMedicamentChange = (index, field, value) => {
        const newMedicaments = [...formData.medicaments];
        newMedicaments[index][field] = value;
        setFormData(prevState => ({
            ...prevState,
            medicaments: newMedicaments
        }));
    };

    const addMedicament = () => {
        setFormData(prevState => ({
            ...prevState,
            medicaments: [...prevState.medicaments, { id: '', quantite: 1 }]
        }));
    };

    const removeMedicament = (index) => {
        setFormData(prevState => ({
            ...prevState,
            medicaments: prevState.medicaments.filter((_, i) => i !== index)
        }));
    };

    const submitVente = async (e) => {
        e.preventDefault();
        if (!formData.client_id || !formData.date_vente || formData.medicaments.some(m => !m.id || m.quantite < 1)) {
            setErrorMessage("Veuillez remplir tous les champs correctement.");
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            console.log('FormData avant envoi:', formData);
            console.log('En-têtes:', getAuthHeader());

            const response = await axios.post('http://localhost:8000/api/ventes/store', formData, getAuthHeader());
            console.log('Vente enregistrée:', response.data);
            setFormData({
                client_id: '',
                date_vente: new Date().toISOString().split('T')[0],
                medicaments: [{ id: '', quantite: 1 }]
            });
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000);
        } catch (error) {
            console.error('Erreur détaillée:', error.response?.data);
            console.error('Statut de l\'erreur:', error.response?.status);
            console.error('En-têtes de la réponse:', error.response?.headers);

            console.error('Error submitting vente:', error);
            setErrorMessage(error.response?.data?.message || 'Erreur lors de l\'enregistrement de la vente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6">Vente de Médicaments</h2>

                    <form onSubmit={submitVente} className="space-y-6">
                        {/* Client selection */}
                        <div  style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700"  style={{ paddingLeft: '10px', paddingRight: '10px' }}>Client</label>
                            <select
                                id="client_id"
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"  style={{ paddingLeft: '10px', paddingRight: '10px' }}
                            >
                                <option value="">Sélectionnez un client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.prenom} {client.nom}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date de vente */}
                        <div  style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                            <label htmlFor="date_vente" className="block text-sm font-medium text-gray-700"  style={{ paddingLeft: '10px', paddingRight: '10px' }}>Date de vente</label>
                            <input
                                type="date"
                                id="date_vente"
                                name="date_vente"
                                value={formData.date_vente}
                                onChange={handleInputChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Médicaments */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4"  style={{ paddingLeft: '10px', paddingRight: '10px' }}>Médicaments</h3>
                            {formData.medicaments.map((medicament, index) => (
                                <div key={index} className="mb-4 flex items-center space-x-2"  style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                                    <select
                                        value={medicament.id}
                                        onChange={(e) => handleMedicamentChange(index, 'id', e.target.value)}
                                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Sélectionnez un médicament</option>
                                        {medicamentsList.map(med => (
                                            <option key={med.id} value={med.id}>{med.nom}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={medicament.quantite}
                                        onChange={(e) => handleMedicamentChange(index, 'quantite', parseInt(e.target.value))}
                                        min="1"
                                        className="block w-20 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeMedicament(index)}
                                        className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        <MinusCircle className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addMedicament}
                                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                                Ajouter un médicament
                            </button>
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                            >
                                {loading ? (
                                    <Loader className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5 mr-2" aria-hidden="true" />
                                        Enregistrer la vente
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Confirmation message */}
                    {showConfirmation && (
                        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">Vente enregistrée avec succès !</span>
                        </div>
                    )}

                    {/* Error message */}
                    {errorMessage && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{errorMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VenteMedicaments;