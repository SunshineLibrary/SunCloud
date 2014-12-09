var frisby = require('frisby');
var URL = 'http://localhost:3000/';

frisby.create('User API Test')
    .post(URL + 'auth/signin', {data:{username: 'admin1', password: 'xiaoshu'}, user:{username: 'admin1', password: 'xiaoshu'}}, {json: true})
    .after(function(err, res, body) {
        frisby.create('test2')
            .get(URL + 'users')
            .expectStatus(200)
            .toss();
    }).toss();
