//src/updateEvent
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Create.css'; // Réutilisation du style de la page de création

const UpdateEvent = () => {
  const { id_evenement } = useParams();
  const [event, setEvent] = useState({
    titre: '',
    description: '',
    date: '',
    lieu: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification de l'authentification
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      navigate('/signin');
      return;
    }

    // Récupérer les données de l'événement
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/evenements/${id_evenement}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvent({
          titre: response.data.titre || '',
          description: response.data.description || '',
          date: response.data.date || '',
          lieu: response.data.lieu || ''
        });
      } catch (err) {
        setError("Erreur lors du chargement de l'événement.");
      }
    };
    fetchEvent();
  }, [id_evenement, navigate]);

  // Soumettre la mise à jour
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(
        `http://127.0.0.1:8000/evenements/update/${id_evenement}`,
        event,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Événement mis à jour avec succès !");
      navigate('/evenements'); // Retour à la page des événements
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'événement.");
    }
  };

  return (
    <div className="create-container">
      <h1>Modifier un Événement</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Titre"
          value={event.titre}
          onChange={(e) => setEvent({ ...event, titre: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
          required
        />
        <input
          type="date"
          value={event.date}
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Lieu"
          value={event.lieu}
          onChange={(e) => setEvent({ ...event, lieu: e.target.value })}
          required
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateEvent;
