import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/App"
import "bootstrap/dist/css/bootstrap.min.css"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Signup from "./components/Signup"
import Login from "./components/Login"
import PrivateRoute from "./components/PrivateRoute"
import ForgotPassword from "./components/ForgotPassword"
import UpdateProfile from "./components/UpdateProfile"
import Typer from "./components/Typer"
import Home from "./components/Home"
import Scores from "./components/Scores"
import Reaction from "./components/Reaction"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route exact path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/update-profile" 
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/proto-type" element={<Typer />} />
          <Route path="/reaction" element={<Reaction />} />
          <Route path="/scores" element={<Scores />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem "}}>
                <h1>404: page not found</h1>
                <p>Go somewhere else</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)

{/*  

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './components/App';
// import { 
//   BrowserRouter,
//   Routes,
//   Route
// } from "react-router-dom";
// import { AuthProvider } from './contexts/AuthContext';
// import Typer from './components/Typer';
// import Signup from './components/Signup';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import PrivateRoute from './components/PrivateRoute'

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <BrowserRouter>
//     <Routes>
//       <Route exact path="/" element={<App />}>
//       <Route path="/proto-type" element={<Typer />} />
//       <Route path="/signup" element={<AuthProvider><Signup /></AuthProvider>} />
//       <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
//       <Route exact path="/dashboard" 
//         element={
//           <PrivateRoute>
//             <AuthProvider><Dashboard /></AuthProvider>
//           </PrivateRoute>
//         } 
//       />
//       <Route
//         path="*"
//         element={
//           <main style={{ padding: "1rem "}}>
//             <h1>404: page not found</h1>
//             <p>Go somewhere else</p>
//           </main>
//         }
//       />
//     </Route>
//   </Routes>
// </BrowserRouter>
// );

*/}