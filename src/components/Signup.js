import React, { useRef, useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import userEvent from '@testing-library/user-event'

export default function Signup() {
	const displayNameRef = useRef()
	const emailRef = useRef()
	const passwordRef = useRef()
	const passwordConfirmRef = useRef()
	const { signup } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	async function handleSubmit(e) {
		e.preventDefault()

		const usernameRegex = /^[a-zA-Z0-9-_]+$/;
		if (!(displayNameRef.current.value).match(usernameRegex)) {
			return setError(`Invalid username`)
		}

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError(`Passwords do not match`)
		}

		try {
			setError('')
			setLoading(true)
			await signup(displayNameRef.current.value, emailRef.current.value, passwordRef.current.value)
			navigate('/dashboard')
		}	catch {
			setError('Failed to create an account')
		}

		setLoading(false)
	}

	return (
		<Container 
			className="d-flex align-items-center justify-content-center"
			style={{ minHeight: "60vh", marginTop: "1em" }}
		>
			<>
				<div className='w-100' style={{ maxWidth: '400px '}}>
					<Card>
						<Card.Body>
							<h2 className="text-center mb-4">Sign Up</h2>
							{error && <Alert variant="danger">{error}</Alert>}
							<Form onSubmit={handleSubmit}>
								<Form.Group id="displayname">
									<Form.Control ref={displayNameRef} required placeholder='Username' />
								</Form.Group>
								<br />
								<Form.Group id="email">
									<Form.Control type="email" ref={emailRef} required placeholder='Email' />
								</Form.Group>
								<br />
								<Form.Group id="password">
									<Form.Control type="password" ref={passwordRef} required placeholder='Password' />
								</Form.Group>
								<br />
								<Form.Group id="password-confirm">
									<Form.Control type="password" ref={passwordConfirmRef} required placeholder='Password confirmation' />
								</Form.Group>
								<br />
								<Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
							</Form>
						</Card.Body>
					</Card>
					<div className="w-100 text-center mt-2">
					Already have an account? <Link to="/login">Log In</Link>
					</div>
				</div>
			</>
		</Container>
	)
}