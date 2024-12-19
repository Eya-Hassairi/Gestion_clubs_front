//src/updatemember.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Create.css'; // Assurez-vous d'importer le CSS

const UpdateMember = () => {
  const { id } = useParams(); // Récupère l'ID du membre depuis l'URL
  const [member, setMember] = useState({
    full_name: '',
    email: '',
    departement: '',
    annee_etude: '',
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
      `http://127.0.0.1:8000/members/members/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMember({
      full_name: response.data.full_name || '',
      email: response.data.email || '',
      departement: response.data.departement || '',
      annee_etude: response.data.annee_etude || ''
    });
  } catch (err) {
    setError("Erreur lors du chargement du membre.");
  }
};
fetchEvent();
}, [id, navigate]);
// Soumettre la mise à jour
const handleUpdate = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('access_token');
  try {
    await axios.put(
      `http://127.0.0.1:8000/members/members/update/${id}`,
      member,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("membre mis à jour avec succès !");
    navigate('/members'); // Retour à la page des événements
  } catch (err) {
    setError("Erreur lors de la mise à jour de l'événement.");
  }
};

  return (
    <div className="create-container">
      <h1>Modifier un membre</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="nom complet"
          value={member.full_name}
          onChange={(e) => setMember({ ...member, titre: e.target.value })}
          required
        />
        <input
          type="email"
          value={member.email}
          onChange={(e) => setMember({ ...member, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="departement"
          value={member.departement}
          onChange={(e) => setMember({ ...member, lieu: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="annee_etude"
          value={member.annee_etude}
          onChange={(e) => setMember({ ...member, lieu: e.target.value })}
          required
        />
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default UpdateMember;
