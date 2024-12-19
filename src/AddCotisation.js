import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create.css'; // Réutilisation du style pour uniformité

const AddCotisation = () => {
  const [membres, setMembres] = useState([]);
  const [selectedMembre, setSelectedMembre] = useState('');
  const [montant, setMontant] = useState('');
  const [anneeAcademique, setAnneeAcademique] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembres = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/members/members', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setMembres(response.data); // Assurez-vous que la réponse est un tableau
        } else {
          setError('Aucun membre trouvé.');
        }
      } catch (err) {
        setError('Erreur de chargement des membres.');
      }
    };

    fetchMembres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('access_token');

    if (!selectedMembre || !montant || !anneeAcademique) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    // **Ajout de console.log ici pour déboguer**
    console.log('ID du membre sélectionné:', selectedMembre);
    try {
      await axios.post(
        'http://127.0.0.1:8000/members/cotisation/register/',
        {
          membre: selectedMembre, // L'ID du membre est envoyé au backend
          montant,
          annee_academique: anneeAcademique,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Cotisation ajoutée avec succès.');
      navigate('/cotisations');
    } catch (err) {
      setError('Erreur lors de l’ajout de la cotisation.');
    }
  };

  return (
    <div className="create-container">
      <h1>Ajouter une Cotisation</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div>
          <label>Membre :</label>
          <select
            value={selectedMembre}
            onChange={(e) => setSelectedMembre(e.target.value)}
            className="select-field"
            required
          >
            <option value="">-- Sélectionnez un membre --</option>
            {membres.length > 0 ? (
              membres.map((membre) => (
                <option key={membre.id_membre} value={membre.id_membre}>
                  {membre.id_membre} - {membre.full_name}
                </option>
              ))
            ) : (
              <option value="">Aucun membre disponible</option>
            )}
          </select>
        </div>

        <div>
          <label>Montant :</label>
          <input
            type="number"
            step="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            placeholder="Entrez le montant"
            required
          />
        </div>

        <div>
          <label>Année Académique :</label>
          <input
            type="text"
            placeholder="Ex : 2023-2024"
            value={anneeAcademique}
            onChange={(e) => setAnneeAcademique(e.target.value)}
            required
          />
        </div>

        <button type="submit">Ajouter la Cotisation</button>
      </form>
    </div>
  );
};

export default AddCotisation;
