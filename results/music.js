var chakram = require('chakram'),
expect = chakram.expect;
yaml = require('yaml-js');
fs = require('fs');

var endpoint = yaml.load(fs.readFileSync('support/endpoints/endpoints.yaml', 'utf8'));
var data = yaml.load(fs.readFileSync('support/data/data.yaml', 'utf8'));

describe("Get music", function () {
	it("should assert music track based on artist", function () {

		var artist = data.music.artist;
		var track = data.music.track;

		return chakram.get(endpoint.music + "/v1/search?q=" + artist + "&type=artist")
		.then(function (searchResponse) {
			var bigID = searchResponse.body.artists.items[0].id;
			return chakram.get(endpoint.music + "/v1/artists/" + bigID + "/top-tracks?country=GB");
		})
		.then(function (topTrackResponse) {
			var topTrack = topTrackResponse.body.tracks[0];
			expect(topTrack.name).to.contain(track);
		});
	});
});
