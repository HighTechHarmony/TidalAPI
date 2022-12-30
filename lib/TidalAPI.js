"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TidalAPI = void 0;
const _ = require("lodash");
const node_fetch_1 = require("node-fetch");
const node_fetch_2 = require("node-fetch");
const TidalError_1 = require("./model/TidalError");
const baseURL = 'https://api.tidal.com/v1';
class TidalAPI {
    /**
     * Create TidalAPI instance
     * @Constructor
     * @param login Login information
     */
    constructor(login) {
        /**
         * TIDAL API User ID
         * @type {null|String}
         * @private
         */
        this._userId = null;
        if (typeof login !== 'object') {
            throw new Error('You must pass auth data into the TidalAPI object correctly');
        }
        else {
            if (typeof login.token !== 'string') {
                throw new Error('Token invalid or missing');
            }
            if (typeof login.countryCode !== 'string') {
                throw new Error('Country code invalid or missing');
            }
            if (typeof login.quality !== 'string') {
                throw new Error('Stream quality invalid or missing');
            }
        }
        this.authData = login;
        if (!this.authData) {
            this.authData.quality = "HIGH";
        }
    }

    getMyId() {
        return this._userId;
    }
    /**
     * Global search.
     * @param
     */
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryObj = {};
            if (typeof query === "string") {
                queryObj.query = query;
                queryObj.limit = 100;
            }
            else {
                queryObj = query;
            }
            return yield this._baseRequest('/search', queryObj);
        });
    }
    /**
     * Get artist info.
     * @param artistId
     * @param query
     */
    getArtist(artistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/artists/' + encodeURIComponent(artistId), null);
        });
    }
    /**
     * Get artist top tracks.
     * @param artistId id of artist
     * @param params can be used for paging
     */
    getTopTracks(artistId, params = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/toptracks', params);
        });
    }
    /**
     * Get artist videos.
     * @param artistId
     * @param query
     */
    getArtistVideos(artistId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/videos', query);
        });
    }
    /**
     * Get artist bio.
     * @param artistId
     */
    getArtistBio(artistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/bio', {});
        });
    }
    /**
     * Get similar artists.
     * @param artistId
     * @param query
     */
    getSimilarArtists(artistId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/similar', query);
        });
    }
    /**
     * Get artist albums.
     * @param artistId
     * @param query
     */
    getArtistAlbums(artistId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/albums', query);
        });
    }
    /**
     * Get album info.
     * @param albumId
     * @param query
     */
    getAlbum(albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/albums/' + encodeURIComponent(albumId), null);
        });
    }
    /**
     * Get album tracks.
     * @param albumId
     * @param query
     */
    getAlbumTracks(albumId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/albums/' + encodeURIComponent(albumId) + '/tracks', query);
        });
    }
    /**
     * Get playlist info.
     * @param playlistId
     * @param query
     */
    getPlaylist(playlistId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/playlists/' + encodeURIComponent(playlistId), query);
        });
    }
    /**
     * Get tracks from a playlist.
     * @param playlistId
     * @param query
     */
    getPlaylistTracks(playlistId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/playlists/' + encodeURIComponent(playlistId) + '/tracks', query);
        });
    }
    /**
     * Get track info.
     * @param trackId
     * @param callback
     */
    getTrackInfo(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/tracks/' + encodeURIComponent(trackId), {});
        });
    }
    /**
     * Get track stream URL.
     * @param trackId
     */
    getStreamUrl(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/tracks/' + encodeURIComponent(trackId) + '/streamUrl', {
                soundQuality: this.authData.quality
            });
        });
    }
    getOfflineURL(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/tracks/' + encodeURIComponent(trackId) + '/offlineUrl', {
                soundQuality: this.authData.quality
            });
        });
    }
    /**
     * Get video stream URL.
     * @param trackId
     */
    getVideoStreamUrl(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/videos/' + encodeURIComponent(trackId) + '/streamUrl', {});
        });
    }
    /**
     * Get user info.
     * @param userId
     */
    getUser(userId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/users/' + encodeURIComponent(userId !== null && userId !== void 0 ? userId : this._userId), {});
        });
    }
    /**
     * Get user playlists.
     * @param userId
     * @param query
     */
    getPlaylists(userId = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/users/' + encodeURIComponent(userId !== null && userId !== void 0 ? userId : this._userId) + "/playlists", query);
        });
    }
    getETag(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "/playlists/" + encodeURIComponent(playlistId);
            const result = yield this._baseRequestRaw(url, {}, "GET", null, false);
            return result.responseHeaders.get("etag");
        });
    }
    deletePlaylist(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._baseRequest('/playlists/' + encodeURIComponent(playlistId), null, "DELETE", null, false, true);
        });
    }
    addTracksToPlaylist(songIds, playlistId, onDupes = "FAIL") {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            const url = "/playlists/" + encodeURIComponent(playlistId) + "/items";
            const etag = yield self.getETag(playlistId);
            const params = {
                "trackIds": songIds.join(","),
                "onDupes": onDupes
            };
            const headers = new node_fetch_2.Headers({ "If-None-Match": etag });
            return yield this._baseRequest(url, params, "POST", headers, true);
        });
    }
    /**
     * Checks whether a playlist with a given title is already in the users library
     * @param title {string} Title of the playlist
     * @returns {Promise<null|string>} `null` if no playlist was found, otherwise the UUID of the matching Playlist
     */
    checkIfPlaylistExists(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.findPlaylistsByName(title)).length >= 1;
        });
    }
    ;
    findPlaylistsByName(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const myPlaylists = yield this.getPlaylists(null, {
                limit: 999
            });
            return _.filter(myPlaylists.items, x => x.title === title);
        });
    }
    /**
     * Creates a new playlist in the users library
     * @param title {string} Title of the playlist
     * @param description {string} Description of the playlist
     * @returns {Promise<string>} UUID of the created playlist
     */
    createPlaylist(title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "/users/" + encodeURIComponent(this.getMyId()) + "/playlists" + "?countryCode=" + encodeURIComponent(this.authData.countryCode);
            const params = {
                "title": title,
                "description": description
            };
            const result = yield this._baseRequest(url, params, "POST", null, true);
            return result.uuid;
        });
    }
    /**
     * Creates a new playlist if no other with the given name was found
     * @param title {string} Title of the playlist
     * @param description {string} Description of the playlist
     * @returns {Promise<string>} UUID of the playlist
     */
    createPlaylistIfNotExists(title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.checkIfPlaylistExists(title);
            if (exists)
                return exists;
            return (yield this.createPlaylist(title, description));
        });
    }
    /**
     * Get track stream URL.
     * @param songId
     * @param width
     * @param height
     *
     */
    getArtUrlSync(songId, width = null, height = null) {
        width = width !== null && width !== void 0 ? width : 1280;
        height = height !== null && height !== void 0 ? height : 1280;
        return 'https://resources.tidal.com/images/' + songId.replace(/-/g, '/') + '/' + width + 'x' + height + '.jpg';
    }
    _baseRequestRaw(url, params = null, method, additionalHeaders, paramsAsUrlEncoded, emptyResponse = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!params)
                params = {};
            params.countryCode = params.countryCode ? params.countryCode : this.authData.countryCode;
            let headers = additionalHeaders;
            if (!headers) {
                headers = new node_fetch_2.Headers();
            }
            headers.append('Authorization', 'Bearer ' + this.authData.token);
            let body;
            if (paramsAsUrlEncoded) {
                body = new URLSearchParams();
                for (const key in params) {
                    body.append(key, params[key]);
                }
            }
            else {
                if ((method === null || method === void 0 ? void 0 : method.toUpperCase()) === "GET") {
                    const urlParams = (Object.keys(params).reduce((p, c) => p + `&${c}=${encodeURIComponent(params[c])}`, '')).replace("&", "?");
                    url += urlParams;
                }
                body = null;
            }
            // console.debug(baseURL + url);
            // execute http request
            const result = yield node_fetch_1.default(baseURL + url, {
                method,
                headers,
                body: body
            });
            let data;
            if (!emptyResponse) {
                data = yield result.json();
            }
            if (!result.ok) {
                throw new TidalError_1.TidalError(data);
            }
            return {
                data,
                responseHeaders: result.headers
            };
        });
    }
    /**
     * Base request function.
     */
    _baseRequest(url, params, method = "GET", additionalHeaders = null, paramsAsUrlEncoded = false, expectEmptyResult = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._baseRequestRaw(url, params, method, additionalHeaders, paramsAsUrlEncoded, expectEmptyResult)).data;
        });
    }
}
exports.TidalAPI = TidalAPI;
//# sourceMappingURL=TidalAPI.js.map