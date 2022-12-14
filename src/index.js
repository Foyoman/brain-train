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
import ProtoType from "./components/ProtoType"
import Home from "./components/Home"
import Scoreboard from "./components/Scoreboard"
import Reaction from "./components/Reaction"
import NewWord from "./components/NewWord"
import AimTrain from "./components/AimTrain"
import Simone from "./components/Simone"


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
          <Route path="/proto-type" element={<ProtoType />} />
          <Route path="/new-word" element={<NewWord />} />
          <Route path="/reaction" element={<Reaction />} />
          <Route path="/aim-train" element={<AimTrain />} />
          <Route path="/simone" element={<Simone />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
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
