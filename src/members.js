//src/members.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Create.css'; // Importation des styles

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole] = useState('');

  // Récupérer le rôle de l'utilisateur et la liste des membres
  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    const fetchMembers = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/members/members/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          setMembers(response.data);
        } else {
          setError('Aucun membre trouvé.');
        }
      } catch (err) {
        setError('Erreur de chargement des membres.');
      }
    };

    fetchMembers();
  }, []);

  // Rechercher un membre par ID
  const handleSearchById = async () => {
    setError(null);
    if (!searchId) {
      setError('Veuillez entrer un ID.');
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://127.0.0.1:8000/members/members/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers([response.data]); // Mettre à jour avec un seul membre
    } catch (err) {
      setError('Aucun membre trouvé avec cet ID.');
    }
  };
  // Supprimer un membre
const handleDeleteMemberClick = async (id_membre) => {
    const token = localStorage.getItem('access_token');
    const confirmation = window.confirm('Voulez-vous vraiment supprimer ce membre ?');
    if (confirmation) {
      try {
        await axios.delete(`http://127.0.0.1:8000/members/members/delete/${id_membre}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers((prev) => prev.filter((member) => member.id_membre !== id_membre));
        alert('Membre supprimé avec succès.');
      } catch (err) {
        setError("Erreur lors de la suppression du membre.");
      }
    }
  };

  // Rediriger vers la page de modification d'un membre
const handleEditMemberClick = (id_membre) => {
    window.location.href = `/updateMember/${id_membre}`;
  };
  

  // Handlers pour les boutons d'action
  const handleAddMemberClick = () => {
    window.location.href = '/members/add';
  };

  const handleViewCotisationClick = () => {
    window.location.href = '/cotisation';
  };

  return (
    <div>
      <h1>Gestion des Membres</h1>

      {role === 'admin' && (
        <div className="button-container">
          <button className="add-event-btn" onClick={handleAddMemberClick}>
            Ajouter un Membre
          </button>
          <button className="add-event-btn" onClick={handleViewCotisationClick}>
            Voir les Cotisations
          </button>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearchById}>
          Rechercher
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {members.length === 0 ? (
        <p>Aucun membre trouvé.</p>
      ) : (
        <table className="evenements-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom Complet</th>
              <th>Email</th>
              <th>Département</th>
              <th>Année d'Étude</th>
              <th>Statut d'Adhésion</th>
              <th>Date d'Inscription</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id_membre}>
                <td>{member.id_membre}</td>
                <td>{member.full_name}</td>
                <td>{member.email}</td>
                <td>{member.departement}</td>
                <td>{member.annee_etude}</td>
                <td>{member.statut_adhesion ? 'Oui' : 'Non'}</td>
                <td>{new Date(member.date_inscription).toLocaleDateString()}</td>
                {role === 'admin' && (
                  <td>
                    <button onClick={() => handleEditMemberClick(member.id_membre)}>✏️ Modifier</button>
                    <button onClick={() => handleDeleteMemberClick(member.id_membre)}>❌ Supprimer</button>
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

export default Members;
