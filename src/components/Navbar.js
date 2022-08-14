import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
	const { currentUser } = useAuth()

	return (
		<nav
			style={{
				borderBottom: "solid 1px",
				paddingBottom: "1rem",
			}}
		>
			<Link to="/">Home</Link> |{" "}
			<Link to="/dashboard">Dashboard</Link> |{" "}
			<Link to="/signup">Sign Up</Link> |{" "}
			<Link to="/login">Log In</Link> |{" "}
			<Link to="/proto-type">proto-type</Link> |{" "}
			<Link to="/reaction">reaction.js</Link> |{" "}
			<Link to="/scores">scores</Link> |{" "}
			{currentUser && currentUser.displayName}
		</nav>
	)
}

// TODO: make this better

// !currentUser acts like if @current_user.empty?