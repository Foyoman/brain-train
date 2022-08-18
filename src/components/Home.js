import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Table } from 'react-bootstrap'
import '../styles.css'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import _ from 'lodash'

export default function Home() {
	const scoresCollectionRef = collection(db, "scores");
	const [aimTrainScore, setAimTrainScore] = useState('Loading...');
	const [protoTypeScore, setProtoTypeScore] = useState('Loading...');
	const [reactionScore, setReactionScore] = useState('Loading...');
	const [simoneScore, setSimonsScore] = useState('Loading...');
	const [newWordScore, setNewWordScore] = useState('Loading...');

	const [aimTrainUser, setAimTrainUser] = useState('Loading...');
	const [protoTypeUser, setProtoTypeUser] = useState('Loading...');
	const [reactionUser, setReactionUser] = useState('Loading...');
	const [simoneUser, setSimonsUser] = useState('Loading...');
	const [newWordUser, setNewWordUser] = useState('Loading...');
	
 
	useEffect(() => {
		// promise; async

		const getScores = async () => {
			const response = await getDocs(scoresCollectionRef);
			let sorted = _.sortBy((response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))), 'score').reverse();
			let atScore = _.filter(sorted, {game: 'Aim Train'})
			setAimTrainUser(atScore[0].user)
			setAimTrainScore(atScore[0].score)
			let ptScore = _.filter(sorted, {game: 'Proto-Type'})
			setProtoTypeUser(ptScore[0].user)
			setProtoTypeScore(ptScore[0].score)
			let reactScore = _.filter(sorted.reverse(), {game: 'Reaction.js'})
			setReactionUser(reactScore[0].user)
			setReactionScore(reactScore[0].score)
			let smneScore = _.filter(sorted.reverse(), {game: 'Simone'})
			setSimonsUser(smneScore[0].user)
			setSimonsScore(smneScore[0].score)
			let nWScore = _.filter(sorted, {game: "New Word"})
			setNewWordScore(nWScore[0].score)
			setNewWordUser(nWScore[0].user)
		};
		getScores();
	}, [])
	
	// debugger
	
	return (
		<div>
			<header>
				<div id="header">
					<h1>Games!</h1>
					<p style={{ fontSize: '24px' }}>Welcome to Brain Train! The hub for the daily mental exercise every brain needs.</p>
				</div>
			</header>
			<Container className='mt-4 mb-5' style={{ maxWidth: '931px' }}>

				
				<div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'space-between' }}>

					<Link to='/simone'>
						<Button
							id='simone'
							variant='dark'
							className='game square'
						>
							<div className='game-caption square'>
								<h3 style={{ margin: '0' }}><strong>Simone</strong></h3>
								<p className='caption'>Test your memory.</p>
							</div>
						</Button>
					</Link>

					<Link to='/aim-train'>
						<Button
							id='aim-train'
							variant='dark'
							className='game'
						>
							<div className='game-caption'>
								<h3 style={{ margin: '0' }}><strong>Aim Train</strong></h3>
								<p className='caption'>Master your precision and speed.</p>
							</div>
						</Button>
					</Link>

					<Link to='/proto-type'>
						<Button
							id='proto-type'
							variant='dark'
							className='game'
						>
							<div className='game-caption'>
								<h3 style={{ margin: '0' }}><strong>Proto-Type</strong></h3>
								<p className='caption'>Up your words per minute.</p>
							</div>
						</Button>
					</Link>
					
					<Link to='/reaction'>
						<Button 
							id='reaction'
							variant="dark" 
							className='game square' 
						>
							<div className='game-caption square'>
								<h3 style={{ margin: '0' }}><strong>Reaction.js</strong></h3>
								<p className='caption'>Hone your reaction time.</p>
							</div>
						</Button>
					</Link>

					<Link to="/NewWord">
						<Button 
						id='NewWord'
						variant="dark"
						className="game square"
						>
						<div className='game-caption square'>
							<h3 style={{ margin: '0'}}><strong>New Word</strong></h3>
							<p className='caption'>Become quick-witted</p>
						</div>
						</Button>
					</Link>
				</div>
				<br />
				<br />
				<div className='w-100'>
					<Card>
						<Card.Body>
							<h2>All-Time Leaders</h2>
							<Table className='mt-3'>
								<thead>
									<tr>
										<th>👑</th>
										<th>Game</th>
										<th>Score</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{ aimTrainUser }</td>
										<td>Aim Train</td>
										<td>{ aimTrainScore }</td>
									</tr>
									<tr>
										<td>{ protoTypeUser }</td>
										<td>Proto-Type</td>
										<td>{ protoTypeScore }wpm</td>
									</tr>
									<tr>
										<td>{ reactionUser }</td>
										<td>Reaction.js</td>
										<td>{ reactionScore }ms</td>
									</tr>
									<tr>
										<td>{ simoneUser }</td>
										<td>Simone</td>
										<td>{ simoneScore }</td>
									</tr>
									<tr>
										<td>{ newWordUser }</td>
										<td>New Word</td>
										<td>{ newWordScore }words</td>
									</tr>
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</div>
		</Container>
	</div>
	)
}
