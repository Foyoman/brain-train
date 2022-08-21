import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Table, Button, ButtonGroup, Container, Card } from 'react-bootstrap';
import _ from 'lodash';

export default function Scoreboard() {
	const [scores, setScores] = useState([]);
	const [gameScores, setGameScores] = useState([]);
	const [selected, setSelected] = useState('Aim Train');
	const [selectedWords, setSelectedWords] = useState('all')

	const scoresCollectionRef = collection(db, "scores");

	useEffect(() => {
		// promise; async
		const getScores = async () => {
			const response = await getDocs(scoresCollectionRef);
			let sorted = _.sortBy((response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))), 'score').reverse();
			setScores(sorted);
			setGameScores(_.filter(sorted, { game:'Aim Train' }));
		};
		getScores();
	}, [])

	const ptScores = () => {
		setGameScores(_.filter(scores, {game: 'Proto-Type'}));
		setSelected('Proto-Type');
		setSelectedWords('all')
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

	const allWords = () => {
		setGameScores(_.filter(scores, {game: 'Proto-Type'}));
		setSelectedWords('all');
	}
	
	const twentyFive = () => {
		setGameScores(_.filter(scores, {words: 25}));
		setSelectedWords(25);
	}

	const fifty = () => {
		setGameScores(_.filter(scores, {words: 50}));
		setSelectedWords(50);
	}

	const hundred = () => {
		setGameScores(_.filter(scores, {words: 100}));
		setSelectedWords(100);
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
						<div className='d-flex' style={{ justifyContent: 'space-between' }}>
							<ButtonGroup>
								<Button onClick={ atScores } variant={ selected === "Aim Train" ? "primary" : "outline-primary" } style={{ borderRight: '1px' }} >Aim Train</Button>
								<Button onClick={ ptScores } variant={ selected === "Proto-Type" ? "primary" : "outline-primary" }>Proto-Type</Button>
								<Button onClick={ reactionScores } variant={ selected === "Reaction.js" ? "primary" : "outline-primary" }>Reaction.js</Button>
								<Button onClick={ simoneScores } variant={ selected === "Simone" ? "primary" : "outline-primary" } style={{ borderLeft: '1px' }}>Simone</Button>
								<Button onClick={ newWordScores } variant={ selected === "New Word" ? "primary" : "outline-primary" }>New Word</Button>
							</ButtonGroup>

							{ selected === "Proto-Type" ? 
								<ButtonGroup>
									<Button onClick={ allWords } variant={ selectedWords === 'all' ? "primary" : "outline-primary" } style={{ borderRight: '1px' }} >All</Button>
									<Button onClick={ twentyFive } variant={ selectedWords === 25 ? "primary" : "outline-primary" } style={{ borderRight: '1px' }} >25</Button>
									<Button onClick={ fifty } variant={ selectedWords === 50 ? "primary" : "outline-primary" }>50</Button>
									<Button onClick={ hundred } variant={ selectedWords === 100 ? "primary" : "outline-primary" } style={{ borderLeft: '1px' }}>100</Button>
								</ButtonGroup>
							: "" }
						</div>
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
									{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <th>Accuracy</th> : "" : "" }
									{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <th>Time</th> : "" : "" }
									{ gameScores[0] ? gameScores[0].game === "Proto-Type" ? <th>Words</th> : "" : "" }
									{ gameScores[0] ? gameScores[0].game === "Aim Train" ? <th className='no-display-mobile'>Avg. Speed</th> : "" : "" }
									{ gameScores[0] ? gameScores[0].game === "Aim Train" ? <th  className='no-display-mobile'>Accuracy</th> : "" : "" }
									<th>User</th>
								</tr>
							</thead>
							<tbody>
								{ gameScores.map((score, i) => { 
									return (
										<tr key={ score.id }>
											<td>{ i + 1 }</td>
											<td>
												{ score.score }
												{ gameScores[0] ? gameScores[0].game === "Reaction.js" ? "ms" : "" : "" }
											</td>
											{ gameScores[0] ? 
												gameScores[0].game === "Proto-Type" ? 
												<td>{ score.accuracy }%</td> : 
												"" : "" 
											}
											{ gameScores[0] ? 
												gameScores[0].game === "Proto-Type" ? 
												<td className='no-display-mobile'>{ score.time }s</td> : 
												"" : "" 
											}
											{ gameScores[0] ? 
												gameScores[0].game === "Proto-Type" ? 
												<td className='no-display-mobile'>{ score.words }</td> : 
												"" : "" 
											}
											{ gameScores[0] ? 
												gameScores[0].game === "Aim Train" ? 
												<td className='no-display-mobile'>{ score.average }ms</td> : 
												"" : "" 
											}
											{ gameScores[0] ? 
												gameScores[0].game === "Aim Train" ? 
												<td className='no-display-mobile'>{ score.accuracy }%</td> : 
												"" : "" 
											}
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