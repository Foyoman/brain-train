import React, { useState } from "react"
import { Container, Card, Button, Alert } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"

export default function Dashboard() {
	const [error, setError] = useState("")
	const { currentUser, logout } = useAuth()
	const navigate = useNavigate()
	
	async function handleLogout() {
		setError('')

		try {
			await logout()
			navigate('/')
		} catch {
			setError('Failed to log out')
		}
	}

	return (
		<Container
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "60vh", marginTop: "1em" }}
		>
			<div className='w-100' style={{ maxWidth: '400px' }}>
				<Card className="mt-4 text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
					<Card.Body>
						<h2 className="text-center mb-4">Profile</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<p><strong>Email:</strong> {currentUser.email}</p>
						<p><strong>Username:</strong> {currentUser.displayName}</p>
						<Link to="/update-profile" className="btn btn-primary w-100 mt-3"> 
							Update Profile
						</Link>
					</Card.Body>
				</Card>
				<div className="w-100 text-center mt-2">
					<Button variant="link" onClick={ handleLogout }>
						Log Out
					</Button>
				</div>
			</div>
		</Container>
	)
}