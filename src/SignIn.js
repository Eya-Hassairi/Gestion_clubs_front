import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/members/signin/', credentials);
      const { access_token, refresh_token, role, user } = response.data;

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('role', role);
      localStorage.setItem('member_info', JSON.stringify(user)); // Stocker les informations du membre

     

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'member') {
        navigate('/member');
      } else {
        navigate('/signup');
      }

      alert('Connexion réussie!');
    } catch (err) {
      setError(err.response?.data?.error || 'Nom d’utilisateur ou mot de passe incorrect.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // Redirection vers la page d'inscription
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Se connecter</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Vous n'avez pas de compte ?</p>
        <button onClick={handleSignUpRedirect} style={{ backgroundColor: 'transparent', color: 'blue', border: 'none', cursor: 'pointer' }}>
          S'inscrire
        </button>
      </div>
    </div>
  );
};

export default SignIn;
