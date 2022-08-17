import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css'

export default function NavBar() {
	const { currentUser, logout } = useAuth()
	const navigate = useNavigate()

	async function handleLogout() {
		await logout()
		navigate('/')
	}
	
	return (
		<Navbar
			bg="dark"
			variant="dark"
			sticky='top'
			expand='lg'
			style={{ padding: '0.3em 1em' }}
		>
			<Link to='/' style={{ textDecoration: 'none' }}>
				<Navbar.Brand>
					🧠 Brain Train 🚂
				</Navbar.Brand>
			</Link>

			<Navbar.Toggle />

			<Navbar.Collapse>
				<Nav
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-end'
					}}
				>
					<NavDropdown title="Games">
						<NavDropdown.Item href="/aim-train">Aim Train</NavDropdown.Item>
						<NavDropdown.Item href="/proto-type">Proto-Type</NavDropdown.Item>
						<NavDropdown.Item href="/reaction">Reaction.js</NavDropdown.Item>
						<NavDropdown.Item href="/simone">Simone</NavDropdown.Item>
					</NavDropdown>
					<Nav.Link href='/scoreboard'>Scoreboard</Nav.Link>
					{ !currentUser && <Nav.Link href="/signup">Sign Up</Nav.Link> }
					{ !currentUser && <Nav.Link href="/login">Log In</Nav.Link> }
					{ currentUser && <Nav.Link href="/dashboard">{ currentUser.displayName }</Nav.Link> }
					{ currentUser && <Nav.Link onClick={ handleLogout }>Log Out</Nav.Link> }
				</Nav>
			</Navbar.Collapse>


		</Navbar>
	)
}


{/* <div className="mt-2 d-flex justify-content-between">
<h1>🧠 Brain Train 🚂</h1>
</div> */}


// TODO: make this better

// !currentUser acts like if @current_user.empty?

// <nav
// 	style={{
// 		borderBottom: "solid 1px",
// 		paddingBottom: "1rem",
// 	}}
// >
// 	<Link to="/">Home</Link> |{" "}
// 	<Link to="/dashboard">Dashboard</Link> |{" "}
// 	{ !currentUser && 
// 		<span>
// 			<Link to="/signup">Sign Up</Link> |{" "}
// 			<Link to="/login">Log In</Link> |{" "}
// 		</span>
// 	}
// 	<Link to="/new-word">New Word</Link> |{" "}
// 	<Link to="/proto-type">Proto-Type</Link> |{" "}
// 	<Link to="/reaction">Reaction.js</Link> |{" "}
// 	<Link to="/aim-train">Aim Train</Link> |{" "}
// 	<Link to="/simone">Simone</Link> |{" "}
// 	<Link to="/scores">Scoreboard</Link> |{" "}
// 	{ currentUser ? currentUser.displayName : "" } {" "}
// 	{ currentUser && <Button onClick={ handleLogout } style={{ padding: '2px 4px' }}>Log Out</Button> }
// </nav>