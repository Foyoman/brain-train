import React, { useState } from "react"
import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

function App() {
  return (
    <div className="App">
      <div className="mt-2 d-flex justify-content-between">
        <h1>🧠 Brain Train 🚂</h1>
      </div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
