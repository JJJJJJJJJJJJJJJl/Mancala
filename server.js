fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking",
{
    method: "POST",
    body: JSON.stringify({"nick": "JJJJJJ", "victories": "10", "games": "10"})
})  
.then(function(res){ console.log("post good"); console.log(res) })
.catch(function(res){ console.log("post error"); console.log(res) })

fetch("http://twserver.alunos.dcc.fc.up.pt:8008/ranking",
{
    method: "GET"
})
.then(function(res){ 
    if(res.ok){
      console.log("get success");
      return res.json();
    }
    return Promise.reject(res);
}).then(function (data) {
  console.log("print data");
	console.log(data);
})
.catch(function(res){ 
  console.log("get error");
  console.log(res);
});

/* fetch('http://twserver.alunos.dcc.fc.up.pt:8008/ranking').then(function (response) {

	// The API call was successful!
	if (response.ok) {
		return response.json();
	}

	// There was an error
	return Promise.reject(response);

}).then(function (data) {
	// This is the JSON from our response
	console.log(data);
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
}); */