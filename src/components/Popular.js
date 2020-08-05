import React from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import {
	FaUser,
	FaStar,
	FaCodeBranch,
	FaExclamationTriangle,
} from "react-icons/fa";
import { RiGitRepositoryLine } from "react-icons/ri";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";

// Functional component for Navbar

// This function is taking two different props from the parent
//{ selected, onUpdateLanguage }
function LanguagesNav(props) {
	const Languages = [
		"All",
		"JavaScript",
		"Java",
		"Python",
		"C++",
		"Ruby",
		"CSS",
	];
	return (
		<ul className="flex-center">
			{Languages.map((Language) => (
				<li key={Language}>
					<button
						className="btn-clear nav-link"
						onClick={() => props.onUpdateLanguage(Language)}
						// Change the color of the button when that button is selected
						style={
							Language === props.selected
								? {
										color: "red",
								  }
								: null
						}
					>
						{Language}
					</button>
				</li>
			))}
		</ul>
	);
}

function ReposGrid({ repos }) {
	return (
		//{JSON.stringify(repos, null, 2)}
		<ul className="grid space-around">
			{repos.map((repo, index) => {
				const {
					name,
					owner,
					html_url,
					stargazers_count,
					forks,
					open_issues,
				} = repo;
				const { login, avatar_url } = owner;

				return (
					<li key={html_url}>
						<Card
							header={`#${index + 1}`}
							avatar={avatar_url}
							href={html_url}
							name={login}
						>
							<ul className="card-list">
								{/* <li>
								<FaUser color="rgb(255,199,116)" size={22} />
								<a href={`https://github.com/${login}`}>
									{login}
								</a>
							</li> */}
								<li>
									<Tooltip text="Github repo">
										<div>
											<RiGitRepositoryLine color="rgb(4, 131, 250)" />
											<a
												href={`https://github.com/${login}/${name}`}
												style={{
													textDecoration: "none",
												}}
												target={"blank"}
											>
												{name}
											</a>
										</div>
									</Tooltip>
								</li>
								<li>
									<FaStar color="rgb(255,215,0)" size={22} />
									{stargazers_count.toLocaleString()} stars
								</li>
								<li>
									<FaCodeBranch
										color="rgb(129,195,245)"
										size={22}
									/>
									{forks.toLocaleString()} Forks
								</li>
								<li>
									<FaExclamationTriangle
										color="rgb(241,138,147)"
										size={22}
									/>
									{open_issues.toLocaleString()} Open issues
								</li>
							</ul>
						</Card>
					</li>
				);
			})}
		</ul>
	);
}

ReposGrid.propTypes = {
	repos: PropTypes.array.isRequired,
};

// Now we will add propTypes to the Language, propTypes provides type safety for our component be it functional or class components

// So anytime when the props which are mentioned here does not follows the rules we will get a warning

LanguagesNav.propTypes = {
	// isRequired states to that this property is required, "func" is used instead of "function" because "function" is a reserved keyword in JS
	selected: PropTypes.string.isRequired,
	onUpdateLanguage: PropTypes.func.isRequired,
};

export default class Popular extends React.Component {
	state = {
		selectedLanguage: "All",
		repos: {},
		error: null,
	};
	// constructor(props) {
	// 	super(props);

	// 	this.state = {
	// 		selectedLanguage: "All",
	// 		repos: {},
	// 		error: null,
	// 	};

	// 	//* whenever you make a method, bind the method to correct "this" keyword
	// 	this.updateLanguage = this.updateLanguage.bind(this);
	// 	this.isLoading = this.isLoading.bind(this);
	// }

	// When the component first getting updated instead of loading pass in "all" languages in updateLanguage method and render the data on the DOM
	componentDidMount() {
		this.updateLanguage(this.state.selectedLanguage);
	}

	updateLanguage = (selectedLanguage) => {
		this.setState(
			{
				// this will set the selected language to the selected language inside the state
				// We are setting the repos and error to null until the repos are fetching
				selectedLanguage,

				// We are commenting repos because we dont want to fetch them again and again, instead og that we are storing the fetched repo info inside an object
				// repos: null,
				error: null,
			},

			// For checking if the selected language is correct
			() => console.log(this.state.selectedLanguage)
		);

		// We don't want to fetch the repository every time we clicked on it instead of that we are going to fetch rpeos only if its not present in the object
		if (!this.state.repos[selectedLanguage]) {
			fetchPopularRepos(selectedLanguage)
				.then((data) => {
					// Instead of adding the data to the state , we will add it to the as property on repos object

					// We are going to update the state of our component based on the previous state

					// We aer not going to get rid of previous repo we will keep track of the property to the repos object

					// Here we will call setState but instead of passing it as an object we will pass it  a function, and react is going to invoke this function passing it the current state

					// What we return from this function will be merged with the current state
					this.setState(({ repos }) => ({
						repos: {
							...repos,
							[selectedLanguage]: data,
						},
					}));
				})
				.catch(() => {
					console.warn(`Error fetching repos `);

					this.setState({
						error: "There was an error fetching repositories",
					});
				});
		}
	};

	isLoading = () => {
		const { selectedLanguage, repos, error } = this.state;
		return !repos[selectedLanguage] && error === null;
	};

	render() {
		// This will take the current selected language from the state
		const { selectedLanguage, repos, error } = this.state;

		//* Here we are passing the current state and updateLanguage function inside our LanguagesNav Component as a function

		//* We can either pass them as props or we can pass them as the variables inside the expressions

		return (
			<React.Fragment>
				<LanguagesNav
					selected={selectedLanguage}
					// onUpdateLanguages will refer to the updateLanguage function
					onUpdateLanguage={this.updateLanguage}
				/>

				{/* If isLoading is truthy then LOADING will evaluate true */}
				{this.isLoading() && <Loading text={"Fetching repos"} />}

				{error && <p className="center-text error">{error}</p>}

				{repos[selectedLanguage] && (
					<ReposGrid repos={repos[selectedLanguage]} />
				)}
			</React.Fragment>
		);
	}
}
