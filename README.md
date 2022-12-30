Eyo I fixed it for now. Since there is no more login, you have to use your own token from now on. 

Donno if the playlist stuff also works, fetching track data, images etc definitely does tho.

# TidalAPI-TS

## About

node.js TIDAL API built with TypeScript. This module is using the TIDAL Web API v1.


Originally created by [Lucas Vasconcelos](https://github.com/lucaslg26) and first forked by [max-huster](https://github.com/max-huster)

**NOTE:** Currently not supporting facebook login.

## How to use
Run the following:
~~
```
npm install https://github.com/ShuriZma/TidalAPI
```
or if you are using yarn instead of npm:
```
yarn add https://github.com/ShuriZma/TidalAPI
```

### Obtaining a token from TIDAL for Windows

 - Install [Fiddler](https://www.telerik.com/download/fiddler) and start it.
 - In Fiddler, click **Tools** > **Options** > **Decrypt HTTPS Traffic**
 - Install TIDAL for Windows and start it
 - In Fiddler, look for requests to `api.tidal.com`. Click a request, then on the right, click **Inspectors** > **Headers**. Underneath **Miscellaneous** you'll see `X-Tidal-Token`. This is a TIDAL Token you can use. 
 
 EDIT: This pretty much still works. Now its just not `X-Tidal-Token` anymore but a Bearer auth key

<img src="https://i.imgur.com/SvBgcIV.png">

## Usage

Simple usage searching and querying a track list

```javascript
import {TidalAPI} from "TidalAPI";

var api = new TidalAPI({
  token: 'your-token-here',
  countryCode: 'your-country-code-here', // countryCode can be sth like 'US' if you don't know your country code just google it.
  // Could also be 'LOSSLESS' but this only supported on premium subscriptions
  quality: 'HIGH'
});
```

### Search

```javascript
const artists = await api.search({query: 'Dream Theater', limit: 1, types: "artists"});
console.log(artists);

const albums = await api.search({types: 'albums', query: 'Dream Theater', limit: 1});
console.log(albums);

const tracks = await api.search({types: 'tracks', query: 'Dream Theater', limit: 1});
console.log(tracks);

const search = await api.search({types: 'tracks,albums,artists', query: 'Dream Theater', limit: 1});
console.log(JSON.stringify(search));
```

### Track info

```javascript

const info = await api.getTrackInfo("22560696");
console.log(info);

```

### Streams

```javascript

const streamUrl = await api.getStreamUrl("22560696");
console.log(streamUrl);

const videoStreamUrl = await api.getStreamUrl("25470315");
console.log(videoStreamUrl);
```

### Album Art

```javascript

const url = api.getArtUrlSync('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280); // use 750 instead of 1280 for arist images :thumbsup:

```

### Videos

```javascript
const artistVideos = await api.getArtistVideos("14670", {limit: 2});
console.log(artistVideos);
```

### Playlist
```javascript
// get general information about the playlist
const playlistInfo = await getPlaylist("7ab5d2b6-93fb-4181-a008-a1d18e2cebfa", "your-user-id");
// get tracks of the playlist
const playlistInfo = await getPlaylistTracks("7ab5d2b6-93fb-4181-a008-a1d18e2cebfa", "your-user-id"); 
// EDIT: since we cant login we also cant get the user id anymore so you will have to get it yourself. Might wanna check fiddle again
```

#### Manipulation
```javascript
const gguid = await createPlaylist("My Playlist", "Description", "your-user-id");
const gguid = await createPlaylistIfNotExists("MyPlaylist", "your-user-id");
```


## Troubleshooting

### 500 error with 'Ooops, an unexpected error occurred'

Your TIDAL token is likely incorrect.

## Testing

~~If you want to run the Unit-Tests you need to specify your Tidal Login Credentials in the ENV parameters like so:~~

Yea well no. Tests are probably broken. I mean they have to be broken since there is no more login stuff. Didn't care about fixing them.
