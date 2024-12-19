import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    departement: '',
    annee_etude: ''
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/members/signup/', formData);
      alert(response.data.message);
      navigate('/'); // Redirige vers Sign In après l'inscription
    } catch (err) {
      setError(err.response?.data || 'Une erreur est survenue.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
      <input type="text" name="full_name" placeholder="Nom complet" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="departement" placeholder="Département" onChange={handleChange} required />
      <input type="number" name="annee_etude" placeholder="Année d'étude" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default SignUp;
