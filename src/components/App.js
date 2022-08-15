import React, { useState } from "react"
import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

function App() {
  return (
    <div className="App">
      <Container style={{ maxWidth: "960px" }}>
        <div className="mt-2 d-flex justify-content-between">
          <h1>🧠 Brain Train 🚂</h1>
        </div>
        <Navbar />
        <Outlet />
      </Container>
    </div>
  )
}

export default App
