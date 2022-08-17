import React from 'react'
import { Container, Button } from 'react-bootstrap'
import '../styles.css'
import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
	const navigate = useNavigate()

	return (
		<div>
			<header>
				<h1>Games!</h1>
				<p style={{ fontSize: '24px' }}>Welcome to Brain Train! The hub for the daily mental exercise every brain needs.</p>
			</header>
			<Container className='mt-4 mb-5' style={{ maxWidth: '931px' }}>
				<div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center' }}>

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
				</div>
		</Container>
	</div>
	)
}
