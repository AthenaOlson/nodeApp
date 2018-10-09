// to hide my keys
require("dotenv").config();
// variables
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var liriReturn = process.argv[2];
var name = process.argv[3];
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);
var limitTweets = 20;
console.log(liriReturn);

// spotify-this-song
function spotifyThisSong() {
  console.log("     *** Tune In & Tune Out! ***")
  var searchTrack;
  if(name === undefined) {
    searchTrack = "The Sign, Ace of Base";
    console.log("     *** You didn't enter a song name. You get Ace of Base! ***")
  } else {
    searchTrack = name;
  }
    spotify.search({ type: 'track', query:searchTrack, limit: '1'}, function(err, data) {
      if (err) {
        console.log('Error occured: ' + err);
      } else {
        console.log("\nArtist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2) + "\n");
        console.log("Song Title: " + JSON.stringify(data.tracks.items[0].name) + "\n");
        console.log("Album " + JSON.stringify(data.tracks.items[0].album.name) + "\n");
        console.log("Link: " + JSON.stringify(data.tracks.items[0].album.external_urls));
      }
    });
  };
// my-tweets
function myTweets() {
 
    var params = {screen_name: 'AthenaOlson12', count: 10};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (error) {
        console.log(error);
      } else if (!error) {
        console.log("\nThese are your last " + (tweets.length) + " tweets: \n");
          for (var i = 0; i < tweets.length; i++) {
            console.log("Tweets " + (i+1) + ": " + "\n" + tweets[i].text + 
              "\n" + "Created on: " + tweets[i].created_at);
            console.log("--------------------");
          }
      }
      });
    };

// movie-this
function movieThis() {
    console.log("     *** Popcorn, anyone? ***")
    var movieName;
    if(name === undefined) {
      movieName = "Mr. Nobody";
      console.log("     *** You didn't enter a movie name. Try watching Mr. Nobody! ***")
    } else {
      movieName = name;
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    
    request(queryUrl, function(error, response, body) {
    
    if (!error && response.statusCode === 200) {
    
        var body = JSON.parse(body);
          console.log("\nMovie Title: " + body.Title + "\n ");
          console.log("Year Released: " + body.Released + "\n ");
          console.log("Rating: " + body.Rated + "\n ");
          console.log("Production Country: " + body.Country + "\n ");
          console.log("Language: " + body.Language + "\n ");
          console.log("Plot: " + body.Plot + "\n ");
          console.log("Actors: " + body.Actors + "\n ");
          console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value + "\n ");
          fs.appendFile("log.txt", "\nMovie Title: " + body.Title + "\n ", function(error) {
            if (error) {
              return console.log(error);
            }
          });

      } else {
        console.log(movieName);
      };
    });
    }

// command switches
switch (liriReturn) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;
    
    case "movie-this":
        movieThis();
        break;
    
    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
		console.log("You must pass an action [my-tweets, spotify-this-song, movie-this, do-what-it-says] and a value");
		console.log("Example node liri.js movie-this Jumanji");
		break;   
};

function doWhatItSays() {

  fs.readFile("./random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    else {
      console.log(data);

      //Converst data in text file into array
      var arr = data.split(",");
      value = arr[1];
        // If command name at index[0] matches the string, invoke the function
        if(arr[0] === "movie-this") {
          movieThis(value);
        }
        else if (arr[0] === "spotify-this-song") {
          spotifyThisSong(value);
        }
        else if (arr[0] === "my-tweets") {
          myTweets();
        }
    }
  });  
};