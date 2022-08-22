import React, { useState, useEffect } from "react"
import { Table, Container, Card, Button, Alert } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from "react-router-dom"
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import _ from "lodash"

export default function Dashboard() {
	const [error, setError] = useState("")
	const { currentUser, logout } = useAuth()
	const navigate = useNavigate()
	const scoresCollectionRef = collection(db, "scores")
	const [aimTrainScore, setAimTrainScore] = useState('Loading...')
	const [protoTypeScore, setProtoTypeScore] = useState('Loading...')
	const [reactionScore, setReactionScore] = useState('Loading...')
	const [simoneScore, setSimoneScore] = useState('Loading...')
	
	useEffect(() => {
		// promise; async
		const getScores = async () => {
			const response = await getDocs(scoresCollectionRef);
			let sorted = _.sortBy((response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))), 'score').reverse();
			let userScores = _.filter(sorted, {user_id: currentUser.uid});
			setAimTrainScore(_.filter(userScores, {game: 'Aim Train'})[0]);
			setProtoTypeScore(_.filter(userScores, {game: 'Proto-Type'})[0]);
			setSimoneScore(_.filter(userScores, {game: 'Simone'})[0]);
			setReactionScore(_.filter(userScores.reverse(), {game: 'Reaction.js'})[0]);
		};
		getScores();
	}, []);

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
			style={{ minHeight: "40vh", marginTop: "1em" }}
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
				<br />

				<h3 className="text-center">Your High Scores</h3>
				<Table className='mt-3 text-center'>
					<thead>
						<tr>
							<th>Game</th>
							<th>Score</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Aim Train</td>
							<td><strong>{ aimTrainScore ? `${aimTrainScore.score},` : '' }</strong> { aimTrainScore ? `${aimTrainScore.average}ms,` : 'N/A' } { aimTrainScore ? `${aimTrainScore.accuracy}%` : '' }</td>
						</tr>
						<tr>
							
							<td>Proto-Type</td>
							<td>{ protoTypeScore ? `${protoTypeScore.score}wpm` : 'N/A' }</td>
						</tr>
						<tr>
							
							<td>Reaction.js</td>
							<td>{ reactionScore ? `${reactionScore.score}ms` : 'N/A' }</td>
						</tr>
						<tr>
							
							<td>Simone</td>
							<td>{ simoneScore ? simoneScore.score : 'N/A' }</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</Container>
	)
}