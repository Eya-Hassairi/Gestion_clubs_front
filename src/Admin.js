import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Evenements.css'; // Import du fichier CSS

const Admin = () => {
  const [role, setRole] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    // Récupérer le rôle et les tokens depuis le stockage local
    const userRole = localStorage.getItem('role');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    setRole(userRole);
    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Page d'Administration</h1>
      {role && <p className="admin-role">Rôle de l'utilisateur : {role}</p>}

      {/* Affichage des Tokens */}
      <div className="admin-token">
        <h3>Access Token</h3>
        <div className="token-multiline">{accessToken}</div>

        <h3>Refresh Token</h3>
        <div className="token-multiline">{refreshToken}</div>
      </div>

      {/* Liens sous forme de boutons */}
      <div className="admin-links">
        <h3 className="admin-subtitle">Gestion des membres et cotisations</h3>
        <Link to="/members"><button>Voir les membres</button></Link>
        <Link to="/cotisation"><button>Voir les cotisations</button></Link>
        <Link to="/evenements"><button>Voir les événements</button></Link>
      </div>
    </div>
  );
};

export default Admin;
