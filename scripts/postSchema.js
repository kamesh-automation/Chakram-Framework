var chakram = require('chakram'),
    expect = chakram.expect;
	
yaml = require('yaml-js');
fs = require('fs');

var endpoint = yaml.load(fs.readFileSync('support/endpoints/endpoints.yaml', 'utf8'));
var request = require('../support/request/request');
var data = yaml.load(fs.readFileSync('support/data/data.yaml', 'utf8'));

describe("POST API calls", function() {
    
    var namedPost, initialData, name;
    
    before("should post the call successfully", function () {
        name = 'chakram-test-post-api';
        initialData = request;
        namedPost = chakram.post(endpoint.dweet + "/for/" + name, initialData);
    });
    
    it("should return success http status code", function () {
        return expect(namedPost).to.have.status(200);
    });
    
    it("assert should be success in the response 'this' field", function () {
        return expect(namedPost).to.have.json('this', 'succeeded');
    });
    
    it("should respond with the created request data", function () {
        return expect(namedPost).to.have.json('with.content', initialData);
    });

    it("should assert success for the provided name", function () {
        return expect(namedPost).to.have.json('with.thing', name);
    });
    
    it("should allow retrieval of the last data point", function () {
        var dataRetrieval = chakram.get("https://dweet.io/get/latest/dweet/for/"+name);
        return expect(dataRetrieval).to.have.json('with[0].content', initialData);
    });
    
    it("should respond with data matching the dweet schema", function () {
        var expectedSchema = {
            type: "object",
            properties: {
                this: {type: "string"},
                by: {type: "string"},
                the: {type: "string"},
                with: {
                    type: "object",
                    properties: {
                        thing: {type: "string"},
                        created: {type: "string"},
                        content: {type: "object"}
                    },
                    required: ["thing", "created", "content"]
                }
            },
            required: ["this", "by", "the", "with"]
        };
        return expect(namedPost).to.have.schema(expectedSchema);
    });
    
    describe("miscellaneous post data", function () {
            
        var postThing, miscellaneousPost;

        before(function () {
            miscellaneousPost = chakram.post(endpoint.dweet, initialData);
            return miscellaneousPost.then(function(response) {
                postThing = response.body.with.thing;
            });
        });

        it("should succeed without a specified name and generate a random name", function () {
            expect(miscellaneousPost).to.have.status(200);
            expect(miscellaneousPost).to.have.json('this', 'succeeded');
            return chakram.wait();
        });

        it("should assert data retrieval using the new random name", function () {
            var data = chakram.get("https://dweet.io/get/latest/dweet/for/"+postThing);
            return expect(data).to.have.json('with', function (response) {
                expect(response).to.have.length(1);
                var dweet = response[0];
                expect(dweet.content).to.deep.equal(initialData);
                expect(dweet.thing).to.equal(postThing);
            });
        });
    });
    
    
});