import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Evenements.css';

const Evenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('user_id');

    if (!storedUserId) {
      alert('Veuillez vous connecter à nouveau.');
      navigate('/login');
      return;
    }

    setRole(userRole);
    setUserId(storedUserId);

    const fetchEvenements = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/evenements/');
        if (Array.isArray(response.data)) {
          setEvenements(response.data);
        } else {
          setError('Aucun événement trouvé.');
        }
      } catch (err) {
        setError('Erreur de chargement des événements.');
      }
    };

    fetchEvenements();
  }, [navigate]);

  const handleAddEventClick = () => navigate('/create');

  const handleDeleteEventClick = async (id_evenement) => {
    const token = localStorage.getItem('access_token');
    const confirmation = window.confirm('Voulez-vous vraiment supprimer cet événement ?');
    if (confirmation) {
      try {
        await axios.delete(`http://127.0.0.1:8000/evenements/delete/${id_evenement}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvenements((prev) => prev.filter((event) => event.id_evenement !== id_evenement));
        alert('Événement supprimé avec succès.');
      } catch (err) {
        setError("Erreur lors de la suppression de l'événement.");
      }
    }
  };

  const handleEditEventClick = (id_evenement) => navigate(`/updateEvent/${id_evenement}`);

  const handleSearchById = async () => {
    setError(null);
    if (!searchId) {
      setError('Veuillez entrer un ID.');
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/evenements/${searchId}`);
      setEvenements([response.data]);
    } catch (err) {
      setError('Aucun événement trouvé avec cet ID.');
    }
  };

  const handleInscription = async (id_evenement) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Veuillez vous reconnecter.");
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/evenements/inscription/',
        { id_membre: userId, id_evenement },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Inscription réussie.");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    }
  };

  const handleDesinscription = async (id_evenement) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Veuillez vous reconnecter.");
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/evenements/annulation-inscription/',
        { id_membre: userId, id_evenement },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Inscription annulée avec succès.');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'annulation.");
    }
  };

  return (
    <div className="container">
      <h1>Gestion des Événements</h1>

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
        <button className="add-event-btn" onClick={handleAddEventClick}>
          Ajouter un Événement
        </button>
      )}
      {error && <p className="error-message">{error}</p>}

      {evenements.length === 0 ? (
        <p>Aucun événement trouvé.</p>
      ) : (
        <table className="evenements-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Participants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {evenements.map((evenement) => (
              <tr key={evenement.id_evenement}>
                <td>{evenement.id_evenement}</td>
                <td>{evenement.titre}</td>
                <td>{evenement.description}</td>
                <td>{evenement.date}</td>
                <td>{evenement.lieu}</td>
                <td>
  {role === 'admin' ? (
    <td>
    {Array.isArray(evenement.participants) ? (
      evenement.participants.length > 0 ? (
        <ul>
          {evenement.participants.map((participant, index) => (
            <li key={index}>
              {participant.id_membre || 'ID inconnu'}
            </li>
          ))}
        </ul>
      ) : (
        <span style={{ color: 'gray' }}>Aucun participant</span>
      )
    ) : (
      <span style={{ color: 'gray' }}>Non spécifié</span>
    )}
  </td>
  
  
  ) : (
    'Non spécifié'
  )}
</td>

                <td>
                  {role === 'member' && (
                    <>
                      <button onClick={() => handleInscription(evenement.id_evenement)}>
                        S'inscrire
                      </button>
                      <button onClick={() => handleDesinscription(evenement.id_evenement)}>
                        Se désinscrire
                      </button>
                    </>
                  )}
                  {role === 'admin' && (
                    <>
                      <button onClick={() => handleEditEventClick(evenement.id_evenement)}>
                        ✏️ Modifier
                      </button>
                      <button onClick={() => handleDeleteEventClick(evenement.id_evenement)}>
                        ❌ Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Evenements;
