import React from "react"
import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

function App() {
  return (
    <div className="App">
      <Container style={{ maxWidth: "960px" }}>
        <h1>Brain Train 🧠🚂</h1>
        <Navbar />
        <Outlet />
      </Container>
    </div>
  )
}

export default App

// import React from "react"
// import { Container } from 'react-bootstrap';
// import { Outlet, Link } from 'react-router-dom';

// function App() {
//   return (
//     <Container style={{ maxWidth: "960px" }}>
//       <div className="App">
//         <h1>Werds</h1>
//         <nav
//           style={{
//             borderBottom: "solid 1px",
//             paddingBottom: "1rem",
//           }}
//         >
//           <Link to="/">Home</Link> |{" "}
//           <Link to="/dashboard">Dashboard</Link> |{" "}
//           <Link to="/signup">Sign Up</Link> |{" "}
//           <Link to="/login">Log In</Link> |{" "}
//           <Link to="/proto-type">proto-type</Link>
//         </nav>
//         <Outlet />
//       </div>
//     </Container>
//   );
// }

// export default App;
