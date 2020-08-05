const id = "61ec9004b22d0ffd45b0";
const sec = "4e49f4d24906798e812295d459a9f92db67488b6";
const params = `?client_id=${id}&client_secret=${sec}`;

function getErrorMsg(message, username) {
	if (message === "Not found") {
		return `${username} not found`;
	}

	return message;
}

function getProfile(username) {
	/*
	`https://api.github.com/${username}${params}`

	
	*/
	return fetch(`https://api.github.com/users/${username}${params}`)
		.then((res) => res.json())
		.then((profile) => {
			if (profile.message) {
				throw new Error(getErrorMsg(profile.message, username));
			}

			return profile;
		});
}

function getRepos(username) {
	/*
	`https://api.github.com/users/${username}/repos${params}&per_page=100`

	
	*/
	return fetch(
		`https://api.github.com/users/${username}/repos${params}&per_page=100`
	)
		.then((res) => res.json())
		.then((repos) => {
			if (repos.message) {
				throw new Error(getErrorMsg(rpeos.message, username));
			}

			return repos;
		});
}

function getStarCount(repos) {
	return repos.reduce(
		(stars, { stargazers_count }) => stars + stargazers_count,
		0
	);
}

function calculateScore(followers, repos) {
	return followers * 3 + getStarCount(repos);
}

function getUserData(player) {
	// Promise.all allows to pass to it array of promises
	return Promise.all([getProfile(player), getRepos(player)]).then(
		([profile, repos]) => ({
			profile,
			score: calculateScore(profile.followers, repos),
		})
	);
}

function sortPlayers(players) {
	return players.sort((a, b) => b.score - a.score);
}

export function battle(players) {
	return Promise.all([
		getUserData(players[0]),
		getUserData(players[1]),
	]).then((results) => sortPlayers(results));
}

export function fetchPopularRepos(Language) {
	const endpoint = window.encodeURI(
		`https://api.github.com/search/repositories?q=stars:>1+language:${Language}&sort=stars&order=desc&type=Repositories`
	);

	return fetch(endpoint)
		.then((response) => response.json())
		.then((data) => {
			// If the data cannot be fetched then throw error
			if (!data.items) {
				throw new Error(data.message);
			}
			// If there was not any error then  we are just going to return the data
			return data.items;
		});

	// We are not using catching the here because we cannot do anything here, so rather instead of catching error here we are throwing the error from here and when we invoke the function we are going to catch the error.

	// If theres a problem then we are in the UI layer, now we can update th UI based on that problem
}
