var chakram = require('chakram'),
expect = chakram.expect;

yaml = require('yaml-js');
fs = require('fs');

var endpoint = yaml.load(fs.readFileSync('support/endpoints/endpoints.yaml', 'utf8'));
var expectedResponse = require('../support/response/openAPIresponse');

describe("Validate API response details", function () {
	//it("should support auto waiting for tests", function() {
	//var response = chakram.get("http://httpbin.org/200");
	//expect(response).to.have.status(200);
	//});
	it("should assert API response status code", function () {
		//var exists = chakram.get("http://httpbin.org/status/200");
		var exists = chakram.get(endpoint.openAPI + "/status/200");
		var missing = chakram.get(endpoint.openAPI + "/status/404");
		return chakram.waitFor([
				expect(exists).to.have.status(200),
				expect(missing).to.have.status(404)
			]);
		//return chakram.wait(expect(exists).to.have.status(200));
	});
	
	it("should assert HTTP specific response values", function () {
		var response = chakram.get(endpoint.openAPI + "/get");
		expect(response).to.have.json('origin', expectedResponse.origin);
		expect(response).to.have.json('url', function (url) {
			expect(url).to.equal(expectedResponse.url);
		});
		expect(response).to.comprise.of.json({
			url: endpoint.openAPI + "/get",
			headers: {
				Host: expectedResponse.headers.Host,
			}
		});
		return chakram.wait();
	});
	
});
