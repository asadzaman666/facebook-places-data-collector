const fs = require('fs');
const request = require('request')
const dotenv = require('dotenv')

dotenv.config()

// https://graph.facebook.com/v3.2/search?type=place&center=40.7304,-73.9921&distance=1000&q=cafe&fields=name,checkins,picture&limit=3&access_token=

const url = process.env.PLACE_URL + process.env.ACCESS_TOKEN
const collectedJSON = []

const createJSONFile = () => {

	fs.writeFile("gym.json", JSON.stringify(collectedJSON, null, 4), function (err) {
		if (err) throw err;
		console.log('File creation complete');
	});
}

const collectData = (nextPaginationUrl) => {

	const p = new Promise((resolve, reject) => {
		return request(nextPaginationUrl, function (error, response, body) {
			if (error)
				reject(new Error(error))
			else
				resolve(JSON.parse(body))
		})
	})

	p.then(result => {

			result.data.forEach(e => {
				collectedJSON.push(e)
			});

			console.log(`pushed ${result.data.length} data ..`);

			if (result.paging && result.paging.next) {
				collectData(result.paging.next)
			} else {
				createJSONFile()
				console.log('Pagination ends')
			}

		})
		.catch(err => console.log('Error: ', err.message))
}

collectData(url)