import React, { useState } from 'react';
import './password.css'; // Nous créerons ce fichier CSS plus tard

function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici, vous ajouteriez la logique pour traiter le changement de mot de passe
        console.log('Mot de passe réinitialisé');
    };

    return (
        <div className="change-password-container">
            <h2>Réinitialiser le mot de passe</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">
                    Réinitialiser le mot de passe
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;