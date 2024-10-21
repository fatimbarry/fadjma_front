import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Medicament from './pages/Medicament';
import MedicamentDetails from './pages/MedicamentDetails';
import MedicamentEdit from './pages/MedicamentEdit';
import VenteMedicament from './pages/VenteMedicament';
import ListeVentes from './pages/ListeVentes';
import Password from './pages/Password';

function AppRoutes() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/medicament" element={<Medicament />} />
                <Route path="/medicamentDetails/:id" element={<MedicamentDetails />} />
                <Route path="/VenteMedicament" element={<VenteMedicament />} />
                <Route path="/ListeVentes" element={<ListeVentes />} />
                <Route path="/medicamentedit/:id" element={<MedicamentEdit />} />
                <Route path="/password" element={<Password />} />


            </Routes>
        </Router>
    );
}

export default AppRoutes;
