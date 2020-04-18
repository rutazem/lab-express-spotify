require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();




const router = express.Router()

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes to other pages go here:

app.get('/', (req, res) => {
    res.render('index')
});

// res.render sends in text to another window thru the path app.get
// render - expects render
// send looks for just pure text

//// Iteration3

app.get('/artist-search', (req, res) => {

    console.log("info from form", req.query.artist)


    spotifyApi
        //below is how you request data from query:
        // req.query - always console.log itn
        .searchArtists(req.query.artist)
        // so above we asked for data from api
        //when we retrieve it, then we....
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);

            // res.send(data.body) allows you to view all the retrieved data from the API
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'


            res.render('artist-search-results', { artists: data.body.artists.items })


        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

/////Iteration4

// app.get('/album/:id', function (req, res) {
//     spotifyApi.getArtistAlbums(req.params.id)
//   })


//:id is paramater that is read in req.params.id 

app.get('/albums/:id', (req, res, next) => {
    // .getArtistAlbums() code goes here
    //res.send(data.body)
    spotifyApi.getArtistAlbums(req.params.id)
        .then(function (data) {

            console.log('Artist albums', data.body.artists.items);
        }, function (err) {

            console.error(err);
        });
    res.render('albums', { album: data.body.artists.items })
    //above we render to albums, and data that we pass is data.body

});







// //// this requires connection with parser

// app.post('/login', (req, res) => {

//     req.body.email
//     req.body.password

//     // re-directing user
//     // res.redirect('/')
//     // 99% ends with redirect user elsewhere


// })



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
