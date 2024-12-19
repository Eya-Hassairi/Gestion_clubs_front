import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cotisations = () => {
  const [cotisations, setCotisations] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    const fetchCotisations = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Vous devez être connecté pour accéder à cette page.');
        navigate('/signin');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/members/cotisation/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCotisations(response.data);
      } catch (err) {
        setError('Erreur de chargement des cotisations.');
      }
    };

    fetchCotisations();
  }, [navigate]);

  const handleSearchById = async () => {
    setError(null);
    if (!searchId) {
      setError('Veuillez entrer un ID.');
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/members/cotisation/${searchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCotisations([response.data]);
    } catch (err) {
      setError('Aucune cotisation trouvée avec cet ID.');
    }
  };

  const handleDeleteCotisation = async (id_cotisation) => {
    const token = localStorage.getItem('access_token');
    const confirmation = window.confirm('Voulez-vous vraiment supprimer cette cotisation ?');
    if (confirmation) {
      try {
        await axios.delete(`http://127.0.0.1:8000/members/cotisation/delete/${id_cotisation}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCotisations((prev) => prev.filter((cotisation) => cotisation.id_cotisation !== id_cotisation));
        alert('Cotisation supprimée avec succès.');
      } catch (err) {
        setError('Erreur lors de la suppression de la cotisation.');
      }
    }
  };

  const handleEditCotisation = (id_cotisation) => {
    navigate(`/updateCotisation/${id_cotisation}`);
  };

  return (
    <div>
      <h1>Gestion des Cotisations</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearchById}>Rechercher</button>
      </div>

      {role === 'admin' && (
        <div>
          <button onClick={() => navigate('/cotisations/add')}>Ajouter une Cotisation</button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {cotisations.length === 0 ? (
        <p>Aucune cotisation trouvée.</p>
      ) : (
        <table className="evenements-table">
          <thead>
            <tr>
              <th>ID Cotisation</th>
              <th>ID Membre</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Année Académique</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {cotisations.map((cotisation) => (
              <tr key={cotisation.id_cotisation}>
                <td>{cotisation.id_cotisation}</td>
                <td>{cotisation.membre?.id_membre || 'N/A'}</td> {/* Affichage de l'ID du membre */}
                <td>{cotisation.montant} dt</td>
                <td>{cotisation.statut ? 'Payée' : 'En Attente'}</td>
                <td>{cotisation.annee_academique}</td>
                {role === 'admin' && (
                  <td>
                    <button onClick={() => handleEditCotisation(cotisation.id_cotisation)}>✏️ Modifier</button>
                    <button onClick={() => handleDeleteCotisation(cotisation.id_cotisation)}>❌ Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cotisations;
