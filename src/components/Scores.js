import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Table, Button, ButtonGroup, Container, Card } from 'react-bootstrap';
import _ from 'lodash';

export default function Scores() {
	const [scores, setScores] = useState([]);
	const [gameScores, setGameScores] = useState([]);
	const [selected, setSelected] = useState('Proto-Type');

	const scoresCollectionRef = collection(db, "scores");

	useEffect(() => {
		// promise; async

		const getScores = async () => {
			const response = await getDocs(scoresCollectionRef);
			let sorted = _.sortBy((response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))), 'score').reverse();
			setScores(sorted);
			setGameScores(_.filter(sorted, { game:'Proto-Type' }));
		};
		// setGameScores(_.filter(scores, {game: 'Proto-Type'}));
		getScores();
		// setGame( scores[0].game )
	}, [])

	const ptScores = () => {
		setGameScores(_.filter(scores, {game: 'Proto-Type'}));
		setSelected('Proto-Type');
	}

	const reactionScores = () => {
		setGameScores(_.filter(scores, {game: 'Reaction.js'}).reverse());
		setSelected('Reaction.js');
	}

	// debugger
	// debugger


	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ minHeight: "20vh", marginTop: "1em" }}
		>
			<div className='w-100' style={{ maxWidth: '600px' }}>
				<Card>
					<Card.Body>
							{/* Filter: <Button onClick={ ptScores }>Proto-Type</Button> <Button onClick={ reactionScores }>Reaction.js</Button> */}
						<ButtonGroup>
							<Button onClick={ ptScores } variant={ selected === "Proto-Type" ? "primary" : "outline-primary" }>Proto-Type</Button> {" "}
							<Button onClick={ reactionScores } variant={ selected === "Reaction.js" ? "primary" : "outline-primary" }>Reaction.js</Button> {" "}
							<Button variant={ selected === "New-Word" ? "primary" : "outline-primary" }>New Word</Button>
						</ButtonGroup>
						<Table className='mt-3'>
							<thead>
								<tr>
									<th>👑</th>
									<th>
										{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? "WPM" : gameScores[0].game === "Reaction.js" ? "Time (ms)" : "" : "" 
										}
									</th>
									{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <th>Timer (s)</th> : "" : "" }
									<th>User</th>
								</tr>
							</thead>
							<tbody>
								{ gameScores.map((score, i) => { 
									return (
										<tr key={ score.id }>
											<td>{ i + 1 }</td>
											<td>{ score.score }</td>
											{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <td>{ score.timer }</td> : "" : "" }
											<td>{ score.user }</td>
										</tr>
									)
								}) }
							</tbody>
						</Table>
					</Card.Body>
				</Card>
			</div>
			<div className="score-card">
						
			</div>
		</Container>
	)
}


// { scores.map((score) => { return 
// 	<td>{ score.game }</td>
// 	<td>{ score.score }</td>
// 	<td>{ score.timer }</td>
// 	<td>{ score.user }</td>
// }) }

// const sortedUID = _(people).sortBy('uid');

// .then(() => {debugger});

// _.filter(scores, {game: 'proto-type'})