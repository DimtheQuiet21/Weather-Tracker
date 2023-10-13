var requestURL = "https://api.census.gov/data/2019/acs/acs1?get=NAME&for=place:*&in=state:*&key=f8113deb021e7bfc115affb904d3718c26367e2b";
//var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=e3c5b25dd932928fc924b1bdac74c070";


var census = [];

function getcities (){
    var citystate = [];
    fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
    census = data;
    for (var i =0; i<census.length; i++){
        citystate.push(census[i]); //City - State Key Value
      }
      console.log(citystate);
      console.log(citystate.length)
      return citystate;
    });
};

getcities();
