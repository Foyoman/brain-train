import React, { useRef, useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
	const emailRef = useRef()
	const passwordRef = useRef()
	const { login } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	async function handleSubmit(e) {
		e.preventDefault()

		try {
			setError('')
			setLoading(true)
			await login(emailRef.current.value, passwordRef.current.value) 
			navigate('/dashboard')
		}	catch {
			setError('Failed to sign in')
		}

		setLoading(false)
	}

	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ minHeight: "60vh", marginTop: "1em" }}
		>
			<div className='w-100' style={{ maxWidth: '400px' }}>
				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">Log In</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<Form onSubmit={handleSubmit}>
							<Form.Group id="email">
								<Form.Control type="email" ref={emailRef} required placeholder='Email' />
							</Form.Group>
							<br />
							<Form.Group id="password">
								<Form.Control type="password" ref={passwordRef} required placeholder='Password' />
							</Form.Group>
							<br />
							<Button disabled={loading} className="w-100" type="submit">Log In</Button>
						</Form>
						<div className='w-100 text-center mt-3'>
							<Link to="/forgot-password">Forgot Password?</Link>
						</div>
					</Card.Body>
				</Card>
				<div className="w-100 text-center mt-2">
				Need an account? <Link to="/signup">Sign Up</Link>
				</div>
			</div>
		</Container>
	)
}