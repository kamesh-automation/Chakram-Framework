var chakram = require('chakram'),
    expect = chakram.expect;

yaml = require('yaml-js');
fs = require('fs');

var endpoint = yaml.load(fs.readFileSync('support/endpoints/endpoints.yaml', 'utf8'));
var data = yaml.load(fs.readFileSync('support/data/data.yaml', 'utf8'));

var postPlaceHolderRequest = require('../support/request/postPlaceHolderRequest');
var putPlaceHolderRequest = require('../support/request/putPlaceHolderRequest');

var getExpectedResponse = require('../support/response/getPlaceHolderResponse');
var postNewResponse = require('../support/response/postNewPlaceHolderResponse');
var putExpectedResponse = require('../support/response/putPlaceHolderResponse');

describe("API Testing for https://github.com/typicode/jsonplaceholder", function() {
   
    it("should return 1 post", function() {

        /*var expectedJson = {
            "userId": 1,
            "id": 1,
            "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
        }*/
        		
        //var post = chakram.get("http://jsonplaceholder.typicode.com/posts/1");
        var post = chakram.get(endpoint.placeHolder + "/posts/1");
        
        expect(post).to.have.json(getExpectedResponse);
        
        return chakram.wait();
    });
    
    it("should return all posts", function() {
        
        //var allPosts = chakram.get("http://jsonplaceholder.typicode.com/posts");
        var allPosts = chakram.get(endpoint.placeHolder + "/posts");
        
        expect(allPosts).to.have.status(200);
        /*//TODO: Figure out how to check the length of a JSON
				
		expect(allPosts).to.have.json('with', function (response) {
                expect(response).to.have.length(1);
		}*/
		
		console.log(allPosts.userId.length)
        
        return chakram.wait();
    });
    
    it("should create 1 post", function() {
        
        /*var postToBeCreated = {
            "data": {
                "title": "foo",
                "body": "bar",
                "userId": 1
            }
        };*/
        
        /*var expectedJson = {
            "data": {
                "title": "foo",
                "body": "bar",
                "userId": 1
            },
                "id": 101
        };*/
        
        //var createdPost = chakram.post("http://jsonplaceholder.typicode.com/posts", postToBeCreated);
        var createdPost = chakram.post(endpoint.placeHolder + "/posts", postPlaceHolderRequest);
        
        return expect(createdPost).to.comprise.of.json(postNewResponse);
    });
    
    it("should update 1 post", function() {
        
        /*var postToBeUpdated = {
            "data": {
                "id": 1,
                "title": "foo",
                "body": "bar",
                "userId": 1
            }
        };*/
        
        /*var expectedJson = {
            "data": {
                "id": 1,
                "title": "foo",
                "body": "bar",
                "userId": 1
            },
                "id": 1
        };*/
        
        var updatedPost = chakram.put(endpoint.placeHolder + "/posts/1", putPlaceHolderRequest);
        
        return expect(updatedPost).to.comprise.of.json(putExpectedResponse);
    });
    
    it("should delete 1 post", function() {
        
        var expectedJson = {};
        
        var deletedPost = chakram.delete(endpoint.placeHolder + "/posts/1");
        
        return expect(deletedPost).to.comprise.of.json(expectedJson);
    })
});