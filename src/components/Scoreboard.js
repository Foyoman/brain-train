import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Table, Button, ButtonGroup, Container, Card } from 'react-bootstrap';
import _ from 'lodash';

export default function Scoreboard() {
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

	const atScores = () => {
		setGameScores(_.filter(scores, {game: 'Aim Train'}));
		setSelected('Aim Train');
	}

	const simoneScores = () => {
		setGameScores(_.filter(scores, {game: 'Simone'}));
		setSelected('Simone');
	}

	const newWordScores = () => {
		setGameScores(_.filter(scores, {game: 'New Word'}));
		setSelected('New Word');
	}

	// debugger
	// debugger


	return (
		<Container 
				className="d-flex align-items-center justify-content-center"
				style={{ marginTop: "2em" }}
		>
			<div className='w-100' style={{ maxWidth: '800px' }}>
				<Card>
					<Card.Body>
							{/* Filter: <Button onClick={ ptScores }>Proto-Type</Button> <Button onClick={ reactionScores }>Reaction.js</Button> */}
						<ButtonGroup>
							<Button onClick={ ptScores } variant={ selected === "Proto-Type" ? "primary" : "outline-primary" }>Proto-Type</Button> {" "}
							<Button onClick={ reactionScores } variant={ selected === "Reaction.js" ? "primary" : "outline-primary" }>Reaction.js</Button> {" "}
							<Button onClick={ atScores } variant={ selected === "Aim Train" ? "primary" : "outline-primary" }>Aim Train</Button>
							<Button onClick={ simoneScores } variant={ selected === "Simone" ? "primary" : "outline-primary" }>Simone</Button>
							<Button onClick={ newWordScores } variant={ selected === "New Word" ? "primary" : "outline-primary" }>NewWord</Button>
						</ButtonGroup>
						<Table className='mt-3'>
							<thead>
								<tr>
									<th>👑</th>
									<th>
										{ gameScores[0] ? 
												gameScores[0].game === "Proto-Type" ? 
												"WPM" : 
												gameScores[0].game === "Reaction.js" ? 
												"Time" : 
												gameScores[0].game === "Aim Train" || "Simone" || "New Word" ?
												"Score" : ""
											: "" 
										}
									</th>
									{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <th>Timer (s)</th> : "" : "" }
									{ gameScores[0] ? gameScores[0].game === "Aim Train" ? <th>Avg. Speed</th> : "" : "" }
									{ gameScores[0] ? gameScores[0].game === "Aim Train" ? <th>Accuracy</th> : "" : "" }
									<th>User</th>
								</tr>
							</thead>
							<tbody>
								{ gameScores.map((score, i) => { 
									return (
										<tr key={ score.id }>
											<td>{ i + 1 }</td>
											<td>{ score.score }{ gameScores[0] ? gameScores[0].game === "Reaction.js" ? "ms" : "" : "" }</td>
											{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <td>{ score.timer }s</td> : "" : "" }
											{ gameScores[0] ? gameScores[0].game === "Aim Train" ? <td>{ score.average }ms</td> : "" : "" }
											{ gameScores[0] ? gameScores[0].game === "Aim Train" ? <td>{ score.accuracy }%</td> : "" : "" }
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