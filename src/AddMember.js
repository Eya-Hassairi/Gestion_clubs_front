import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create.css'; // Réutilisation du style pour uniformité

const AddMember = () => {
  // Déclarations des états pour les champs de formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    departement: '',
    anneeEtude: '',
    statutAdhesion: false,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'authentification via le token au chargement du composant
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Veuillez vous connecter pour accéder à cette page.');
      navigate('/signin');
    }
  }, [navigate]);

  // Gérer les changements des champs de formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Soumettre les données au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Votre session a expiré. Veuillez vous reconnecter.');
      navigate('/signin');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/members/members/add',
        {
          full_name: formData.fullName,
          email: formData.email,
          departement: formData.departement,
          annee_etude: formData.anneeEtude,
          statut_adhesion: formData.statutAdhesion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Membre ajouté avec succès !');
      navigate('/members');
    } catch (err) {
      setError(
        err.response?.data?.detail || "Erreur lors de l'ajout du membre. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="create-container">
      <h1>Ajouter un Membre</h1>
      {/* Afficher une erreur si elle existe */}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Champ Nom Complet */}
        <input
          type="text"
          name="fullName"
          placeholder="Nom Complet"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        {/* Champ Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Champ Département */}
        <input
          type="text"
          name="departement"
          placeholder="Département"
          value={formData.departement}
          onChange={handleChange}
          required
        />

        {/* Champ Année d'Étude */}
        <input
          type="number"
          name="anneeEtude"
          placeholder="Année d'Étude"
          value={formData.anneeEtude}
          onChange={handleChange}
          required
        />

        {/* Checkbox Statut d'Adhésion */}
        <label>
          <input
            type="checkbox"
            name="statutAdhesion"
            checked={formData.statutAdhesion}
            onChange={handleChange}
          />
          Statut d'Adhésion
        </label>

        {/* Bouton de soumission */}
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default AddMember;
