import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Member.css'; // Assurez-vous d'importer le CSS ici

const Member = () => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [role, setRole] = useState('');
  const [memberInfo, setMemberInfo] = useState([]);
  const [cotisations, setCotisations] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    setRole(storedRole);
    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);

    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/members/members/', {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });
        setMemberInfo(response.data);
      } catch (error) {
        console.error('Erreur récupération membre :', error);
      }
    };
    
    const fetchCotisations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/members/cotisation/', {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });
        setCotisations(response.data);
      } catch (error) {
        console.error('Erreur récupération cotisations :', error);
      }
    };

    fetchMemberInfo();
    fetchCotisations();
  }, []);

  

  return (
    <div className="member-container">
      <h1>Page du Membre</h1>

      {/* Informations sur le membre */}
      <div className="card">
        <h2>Mes infos</h2>
        {memberInfo.length > 0 ? (
          <table className="evenements-table">
            <thead>
              <tr>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Département</th>
                <th>Année d'Étude</th>
                <th>Statut d'Adhésion</th>
                <th>Date d'Inscription</th>
              </tr>
            </thead>
            <tbody>
              {memberInfo.map((member) => (
                <tr key={member.id_membre}>
                  <td>{member.full_name}</td>
                  <td>{member.email}</td>
                  <td>{member.departement}</td>
                  <td>{member.annee_etude}</td>
                  <td>{member.statut_adhesion ? 'Adhérent' : 'Non-Adhérent'}</td>
                  <td>{member.date_inscription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="error-message">Informations du membre non disponibles.</p>
        )}
      </div>

      {/* Cotisations */}
      <div className="card">
        <h2>Mes Cotisations</h2>
        {cotisations.length > 0 ? (
          <table className="evenements-table">
            <thead>
              <tr>
                <th>Montant</th>
                <th>Statut</th>
                <th>Année Académique</th>
              </tr>
            </thead>
            <tbody>
              {cotisations.map((cotisation) => (
                <tr key={cotisation.id_cotisation}>
                  <td>{cotisation.montant} DT</td>
                  <td>
                    {cotisation.statut ? (
                      <span className="badge success">Payé</span>
                    ) : (
                      <span className="badge warning">En attente</span>
                    )}
                  </td>
                  <td>{cotisation.annee_academique}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="error-message">Aucune cotisation trouvée.</p>
        )}
      </div>

      {/* Tokens */}
      <div className="card">
        <h2>Mes Tokens</h2>
        <table className="evenements-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Token</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Access Token</td>
              <pre className="token-display">{accessToken}</pre>
              </tr>
            <tr>
              <td>Refresh Token</td>
    <pre className="token-display">{refreshToken}</pre>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Lien vers les événements */}
      <div className="link-container">
        <Link to="/evenements">
          <button>Voir les Événements</button>
        </Link>
      </div>
    </div>
  );
};

export default Member;
