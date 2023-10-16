//var requestURL = "https://api.census.gov/data/2019/acs/acs1?get=NAME&for=place:*&in=state:*&key=f8113deb021e7bfc115affb904d3718c26367e2b";
var citysubmit = $('#citysubmit');
var citysearch = $("#citysearch");
var oldcitylist = $("#oldcitylist");
var weatherbox = $("#weather-box");
var currentbox =$("<div>")
var forecastbox = $("<div>");
var main = $("#main");
var today = dayjs();
var weekday = today.format('dddd[:] MMMM DD[,] YYYY');


function getcities(event){
    event.preventDefault();
    var citystate = [];
    var lat = [];
    var lon =[];
    var city = citysearch.val();
    var forecast = [];
    var weatherAPIkey = "appid=e3c5b25dd932928fc924b1bdac74c070"
    var requestURL = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&"+weatherAPIkey;
   
    function consolecommand (){
      console.log(requestURL);
      console.log(city);
      console.log(citystate);
      console.log(lat);
      console.log(lon);
    };

    function oldcityclick (event){
      console.log('firing')
      cityclicked = $(event.target).html();
      console.log($(event.target).html())
      citysearch.val(''); // Have to clear it first
      citysearch.val(cityclicked);
       // I want the target's HTML to be set as the Search Forms query;
      $(event.target).remove(); 
    };

    function oldcitybutton() {
      var newcity = $("<li>");
        newcity.attr("class", "btn btn-outline-success  m-3 mt-1 citybutton");
      
        for (var i = 0; i < oldcitylist.children.length; i++){
          if (oldcitylist.children().eq(i).html() === citysearch.val()){
            oldcitylist.children().eq(i).remove() // We have to remove duplicates first
          };
        };

        newcity.html(citysearch.val());
        oldcitylist.prepend(newcity); // Now we can add new values
          
        for (var i = 0; i < oldcitylist.children.length; i++){
          oldcitylist.children().eq(i).attr("id","city-"+i); // Add a Moving ID Tag on the cities
          if (i > 4){
            oldcitylist.children().eq(i).remove(); // Kills any Address Past 5
          };
        }
      
        newcity.click(function (event){
          oldcityclick(event);
          getcities(event);
          cardset;
        }); //Here is to hoping for order
      
    };

    function getWeather (){
      var days = 5; 
      var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&cnt="+days+"&"+weatherAPIkey+"&units=imperial";
      var weatherURL =  "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&cnt="+days+"&"+weatherAPIkey+"&units=imperial";

      fetch(weatherURL) // Fetch the Current Weather and Make the Big Card
      .then(function (response) {
        return response.json();
      })
      .then (function (data){
        weather = data;
        // We store, Date, Weather Condition, Temperature, Wind Speed, Humidity. It's not pretty but it works
        var tostoreweather = {"Weather":[weekday,weather.weather[0].main,weather.main.temp,weather.wind.speed,weather.main.humidity]};
        localStorage.setItem("Today's Weather", JSON.stringify(tostoreweather))  
        console.log(weather);
        //localStorage.setItem("Today's Date", today);
        //localStorage.setItem("Today's Weather",weather.weather[0].main);
        //localStorage.setItem("Today's Temperature",weather.main.temp);
        //localStorage.setItem("Today's Wind",weather.wind.speed);
        //localStorage.setItem("Today's Humidity",weather.main.humidity);

        fetch(forecastURL) //Fetch the Future Weather and Make the Little Cards
        .then(function (response) {
          return response.json();
        })
        .then (function (data){
          forecast = data;
          console.log(forecast);
          for (var i = 0; i<5; i ++){
            var anotherday = today.add(i+1,'day');
            var weekday = anotherday.format("MM[/]DD[/]YYYY");
            var tostoreweather = {"Weather":[weekday,forecast.list[i].weather[0].main,forecast.list[i].main.temp,forecast.list[i].wind.speed,forecast.list[i].main.humidity]};
            localStorage.setItem("Day-"+i+"'s Weather", JSON.stringify(tostoreweather))  
            //localStorage.setItem("Day-"+i+" Date", anotherday.format("MM[/]DD[/]YYYY"));
            //localStorage.setItem("Day-"+i+" Weather",forecast.list[i].weather[0].main);
            //localStorage.setItem("Day-"+i+" Temperature",forecast.list[i].main.temp);
            //localStorage.setItem("Day-"+i+" Wind",forecast.list[i].wind.speed);
            //localStorage.setItem("Day-"+i+" Humidity",forecast.list[i].main.humidity);
          }


          cardset(); // We have to set the card inside the promise. Otherwise WE set the cards BEFORE the data gets here.
        });
      });
    };

    function cardset () {

      var parentbox = ["current","forecast"];
      

      currentbox.children().remove();//Gotta remove all the children and start over.
      forecastbox.children().remove();
    
      function makecard(){
        var currentweather = $("<card>");
        var weatherico = $("<i>");
        var cityname = $("<h2>");
        var currentdate = $("<h4>");
        var currentcond = $("<div>")
        var condarr =["Temperature", "Wind Speed", "Humidity"]
    
        function stylize (){
          currentbox.attr({class:"d-flex justify-content-center"});
          forecastbox.attr({class:"d-flex flex-row col-12"});
          currentweather.attr({class:"card align-items-center"});
          currentweather.addClass(bigparent+"-weather");
          if (bigparent==="current"){ 
            currentweather.attr({style:"width:81.5%"})
          };
          //weatherico.attr({class:"card-img-top", src:"...", alt:"Current Weather Today",id:bigparent+"-weather-im"})
          currentcond.attr({class:"card-body", id:bigparent+"-conditions"})
          cityname.attr({class:"card-title"})
        }
      
        function staple (){
         
          if (bigparent==="current"){
            currentbox.append(currentweather);
            currentweather.append(cityname)
          } else if (bigparent === "forecast") { 
            forecastbox.append(currentweather);
          };
    
          currentweather.append([currentdate, weatherico,currentcond]);
        }
    
        function setcondition (){
          
          function setweatherpic (){
            if (weatherpic === "Clouds"){
              weatherico.attr({class:"fas fa-duotone fa-cloud fa-4x", alt:weatherpic,id:bigparent+"-weather-im"});
            };
            if (weatherpic === "Thunderstorm"){
              weatherico.attr({class:"fas fa-solid fa-bolt fa-beat fa-4x", alt:weatherpic,id:bigparent+"-weather-im"});
            };
            if (weatherpic === "Drizzle"){
              weatherico.attr({class:"fas fa-solid fa-cloud-sun-rain fa-beat fa-4x", alt:weatherpic,id:bigparent+"-weather-im"});
            };
            if (weatherpic === "Rain"){
              weatherico.attr({class:"fas fa-solid fa-cloud-showers-heavy fa-beat fa-4x", alt:weatherpic,id:bigparent+"-weather-im"});
            };
            if (weatherpic === "Snow"){
              weatherico.attr({class:"fas fa-solid fa-cloud-meatball fa-beat fa-4x", alt:weatherpic,id:bigparent+"-weather-im"});
            };
            if (weatherpic === "Clear"){
              weatherico.attr({class:"fas fa-solid fa-sun fa-beat fa-4x", alt:weatherpic,id:bigparent+"-weather-im"});
            };
          };



          if (bigparent === "current"){
           var weather = JSON.parse(localStorage.getItem("Today's Weather"));
           var weatherpic = weather.Weather[1];
           setweatherpic();
           currentdate.text(weather.Weather[0]);
           //We have to add 2 because the 0 slot in the weather array is date and 1 is the icon, but also take awway 2 for the title array
            for (var j =2; j <5; j++){ 
              var condition = $("<h6>");
              if (j === 2){
                var unit = "F";
              } else if (j === 3){
                var unit = "MPH"
              } else if (j === 4){
                var unit = "%"
              };
              condition.attr({class:"card-text",id:condarr[j-2]});
              condition.text(condarr[j-2]+": "+weather.Weather[j]+" "+unit);
              currentcond.append(condition);
            }

          } else if (bigparent === "forecast"){
            var weather = JSON.parse(localStorage.getItem("Day-"+k+"'s Weather")); //The only reason I duplicate, right here in the k
            var weatherpic = weather.Weather[1];
            setweatherpic();
            currentdate.text(weather.Weather[0]);
            for (var j =2; j <5; j++){
              var condition = $("<h6>");
              if (j === 2){
                var unit = "F";
              } else if (j === 3){
                var unit = "MPH"
              } else if (j === 4){
                var unit = "%"
              };
              condition.attr({class:"card-text",id:condarr[j-2]+"-"+k})
              condition.text(condarr[j-2]+": "+weather.Weather[j]+" "+unit);
              currentcond.append(condition);
            }


          };
            
        }
      
        cityname.text(citysearch.val());
        setcondition();
        stylize ();
        staple ();
      }
    
      
      for (var i=0; i< 2; i++){
        var bigparent = parentbox[i];
        if (bigparent === "current") {
          makecard();
    
          } else if (bigparent === "forecast") {
            for (var k=0; k <5; k++){
              makecard();
            };
          }
        };
        //weatherbox.append(currentbox);
        //weatherbox.append(forecastbox);
        currentbox.insertAfter($("#todayforecast"));
        forecastbox.insertAfter($("#5dayforecast"));
    };
    
    fetch(requestURL)
  
    .then(function (response) {
      return response.json();
    })

    .then(function (data){
    citystate = data;
    lat = citystate[0].lat;
    lon = citystate[0].lon;
    var citystored = {"properties":[city,lat,lon]};
    
    localStorage.setItem("City",JSON.stringify(citystored));
    getWeather();
    oldcitybutton();
    //consolecommand();


  });
};


function pageinit(){

// Click on page load, then fill in as you go.
//triggers the click function just the first time. If I could make a GEO locater I could trigger off their IP, giving them their local weather

  if(localStorage.getItem("City") == null){
    var startcity = "Madison";
  } else {
    var startcity = JSON.parse(localStorage.getItem("City"));
    startcity = startcity.properties[0];
  }
  
  citysearch.val(startcity);
  $("document").ready(function (){
    setTimeout(function(){citysubmit.trigger("click");}, // This triggers the get cities function. We need to do a fetch on Page Load
    10);
  }); ;

}

pageinit();
citysubmit.click(getcities);
