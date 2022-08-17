import React, { useState } from "react"
import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Nav from "./NavBar"

function App() {
  return (
    <div className="App">
      <Nav />
      <Outlet />
    </div>
  )
}

export default App
