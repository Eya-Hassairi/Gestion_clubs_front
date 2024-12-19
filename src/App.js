//src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';  // Assurez-vous que le chemin est correct
import SignUp from './SignUp';  // Assurez-vous que le chemin est correct
import Evenements from './Evenements';  // La page des événements
import Admin from './Admin';  // La page d'administration
import Create from './Create';//page de creation de l evenement 
import UpdateEvent from './UpdateEvent';//page de creation de l evenement 
import Member from './member';//page de creation de l evenement 
import Members from './members';
import Cotisations from './cotisation';
import UpdateMember from './UpdateMember';
import AddMember from './AddMember';
import UpdateCotisation from './UpdateCotisation';
import AddCotisation from './AddCotisation';



 
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/create" element={<Create />} />
          <Route path="/updateEvent/:id_evenement" element={<UpdateEvent />} />
          <Route path="/member" element={<Member />} />
          <Route path="/members" element={<Members />} />
          <Route path="/cotisation" element={<Cotisations />} />
          <Route path="/updateMember/:id" element={<UpdateMember />} />
          <Route path="/members/add" element={<AddMember />} />
          <Route path="/updateCotisation/:id_cotisation" element={<UpdateCotisation />} />
          <Route path="/cotisations/add" element={<AddCotisation />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
