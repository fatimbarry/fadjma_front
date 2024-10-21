import React, { useState, useEffect } from 'react';
import { ShoppingCart, Calendar, User } from 'lucide-react';
import axios from "axios";

const ListeVentes = () => {
    const [ventes, setVentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVentes();
    }, []);

    const fetchVentes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/ventes', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setVentes(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de la récupération des ventes');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-8">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <ShoppingCart className="mr-2 h-6 w-6 text-indigo-600" />
                        Liste des Ventes
                    </h2>
                </div>
                <div className="px-6 py-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Vente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médicaments</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {ventes.map((vente) => (
                            <tr key={vente.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vente.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4 text-gray-500" />
                                        <div className="text-sm font-medium text-gray-900">{vente.client_nom}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                        <div className="text-sm text-gray-900">{new Date(vente.date_vente).toLocaleDateString()}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-normal">
                                    <ul className="text-sm text-gray-900">
                                        {vente.medicaments && vente.medicaments.map((med, index) => (
                                            <li key={index}>
                                                {med.nom} (x{med.quantite})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {vente.total !== undefined ? `${vente.total.toFixed(2)} €` : 'N/A'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListeVentes;


// import React, { useState, useEffect } from 'react';
// import { ShoppingCart, Calendar, User, Plus, Search } from 'lucide-react';
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import axios from "axios";
//
// const ListecVentes = () => {
//     const [ventes, setVentes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     useEffect(() => {
//         fetchVentes();
//     }, []);
//
//     const fetchVentes = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get('http://localhost:8000/api/ventes', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             });
//             setVentes(response.data);
//             setLoading(false);
//         } catch (error) {
//             setError(error.response?.data?.message || 'Erreur lors de la récupération des ventes');
//             setLoading(false);
//         }
//     };
//
//     if (loading) {
//         return <div className="flex justify-center items-center h-screen">
//             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//         </div>;
//     }
//
//     if (error) {
//         return <div className="text-center mt-8 text-red-600">{error}</div>;
//     }
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//             <Card className="w-full max-w-6xl mx-auto">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-2xl font-bold">Liste des Ventes</CardTitle>
//                     <Button className="bg-green-500 hover:bg-green-600">
//                         <Plus className="mr-2 h-4 w-4" /> Nouvelle Vente
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center space-x-2 mb-4">
//                         <Input
//                             placeholder="Rechercher une vente..."
//                             className="max-w-sm"
//                         />
//                         <Button variant="secondary">
//                             <Search className="h-4 w-4 mr-2" /> Rechercher
//                         </Button>
//                     </div>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead className="w-[100px]">ID</TableHead>
//                                 <TableHead>Client</TableHead>
//                                 <TableHead>Date de Vente</TableHead>
//                                 <TableHead>Médicaments</TableHead>
//                                 <TableHead className="text-right">Total</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {ventes.map((vente) => (
//                                 <TableRow key={vente.id}>
//                                     <TableCell className="font-medium">{vente.id}</TableCell>
//                                     <TableCell>
//                                         <div className="flex items-center">
//                                             <User className="mr-2 h-4 w-4 text-gray-500" />
//                                             <span>{vente.client_nom}</span>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <div className="flex items-center">
//                                             <Calendar className="mr-2 h-4 w-4 text-gray-500" />
//                                             <span>{new Date(vente.date_vente).toLocaleDateString()}</span>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <ul className="list-disc list-inside">
//                                             {vente.medicaments && vente.medicaments.map((med, index) => (
//                                                 <li key={index}>
//                                                     {med.nom} (x{med.quantite})
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </TableCell>
//                                     <TableCell className="text-right">
//                                         {vente.total !== undefined ? `${vente.total.toFixed(2)} €` : 'N/A'}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };
//
// export default ListeVentes;