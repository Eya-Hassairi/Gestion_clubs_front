//src/Create.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create.css'; // Import du style

const Create = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [lieu, setLieu] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      navigate('/signin');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        'http://127.0.0.1:8000/evenements/create/',
        { titre, description, date, lieu },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Événement ajouté avec succès !');
      navigate('/evenements');
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'ajout de l'événement.");
    }
  };

  return (
    <div className="create-container">
      <h1>Ajouter un Événement</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lieu"
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          required
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default Create;
