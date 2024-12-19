import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateCotisation = () => {
  const { id_cotisation } = useParams();
  const [cotisation, setCotisation] = useState({
    montant: '',
    statut: false,  // Statut initialisé à false
    annee_academique: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID de la cotisation récupéré:", id_cotisation);  // Vérifiez ici si l'ID est correctement récupéré
    const fetchCotisations = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`http://127.0.0.1:8000/members/cotisation/${id_cotisation}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);  // Vérifiez ici les données retournées par l'API
        setCotisation(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des données du membre.");
      }
    };
  
    fetchCotisations();
  }, [id_cotisation]);
  

  const handleChange = (e) => {
    setCotisation({ ...cotisation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://127.0.0.1:8000/members/cotisation/update/${id_cotisation}/`, cotisation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('cotisation mis à jour avec succès.');
      window.location.href = '/cotisation'; // Rediriger vers la liste des membres
    } catch (err) {
      setError("Erreur lors de la mise à jour du membre.");
    }
  };

  return (
    <div className="create-container">
      <h1>Modifier une Cotisation</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Montant"
          value={cotisation.montant}
          onChange={handleChange}
          required
        />
        
        {/* Statut (checkbox) */}
        <label>
          <input
            type="checkbox"
            checked={cotisation.statut}
            onChange={handleChange}
          />
          Statut (Payée)
        </label>

        {/* Année académique */}
        <input
          type="text"
          placeholder="Année académique"
          value={cotisation.annee_academique}
          onChange={handleChange}
          required
        />

        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateCotisation;
