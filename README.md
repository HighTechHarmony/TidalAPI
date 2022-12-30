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

Obtain the Tidal token needed to use this API
As well as a TIDAL username and password, the Tidal API needs an API token which is unique to your apps. You can get this token by network-sniffing some application that uses TIDAL Playback feature, like Tidal for Windows, Tidal for Android, or CapTune from Sennheiser.

Obtaining a token from TIDAL for Windows
Install Fiddler and start it.
In Fiddler, click Tools > Options > Decrypt HTTPS Traffic
Install TIDAL for Windows and start it
In Fiddler, look for requests to api.tidal.com. Click a request, then on the right, click Inspectors > Headers. Underneath Miscellaneous you'll see X-Tidal-Token. This is a TIDAL Token you can use.

## Usage

Simple usage searching and querying a track list

```javascript
import {TidalAPI} from "TidalAPI";

var api = new TidalAPI({
  username: 'your-username-here',
  password: 'your-password-here',
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

const url = api.getArtUrlSync('24f52ab0-e7d6-414d-a650-20a4c686aa57', 1280);

```

### Videos

```javascript
const artistVideos = await api.getArtistVideos("14670", {limit: 2});
console.log(artistVideos);
```

### Playlist
```javascript
// get general information about the playlist
const playlistInfo = await getPlaylist("7ab5d2b6-93fb-4181-a008-a1d18e2cebfa");
// get tracks of the playlist
const playlistInfo = await getPlaylistTracks("7ab5d2b6-93fb-4181-a008-a1d18e2cebfa");
```

#### Manipulation
```javascript
const gguid = await createPlaylist("My Playlist", "Description");
const gguid = await createPlaylistIfNotExists("MyPlaylist");
```


## Troubleshooting

### 500 error with 'Ooops, an unexpected error occurred'

Your TIDAL token is likely incorrect.

## Testing

~~If you want to run the Unit-Tests you need to specify your Tidal Login Credentials in the ENV parameters like so:~~
Yea well no. Tests are probably broken. I mean they have to be broken since there is no more login stuff. Didn't care about fixing them.
