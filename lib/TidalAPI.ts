import {LoginInfo} from "./model/LoginInfo";
import {SearchParams} from "./model/SearchParams";
import {RawResult} from "./model/RawResult";
import * as _ from "lodash";
import fetch from "node-fetch";
import {Headers} from "node-fetch";
import {TidalArrayResult} from "./model/TidalArrayResult";
import {TidalSearchResult} from "./model/TidalSearchResult";
import {TidalTrack} from "./model/TidalTrack";
import {TidalStreamInfo} from "./model/TidalStreamInfo";
import {TidalError} from "./model/TidalError";
import {TidalArtistInfoFull} from "./model/TidalArtistInfoFull";
import {TidalVideo} from "./model/TidalVideo";
import {TidalBio} from "./model/TidalBio";
import {TidalSimilarArtist} from "./model/TidalSimilarArtist";
import {TidalAlbum} from "./model/TidalAlbum";

const baseURL = 'https://api.tidalhifi.com/v1';

export class TidalAPI {
    /**
     * TIDAL API Session ID
     * @type {null|String}
     * @private
     */
    private _sessionId: string | null = null;

    /**
     * authData
     * @type {Object}
     */
    private readonly authData: LoginInfo;

    /**
     * Create TidalAPI instance
     * @Constructor
     * @param login Login information
     */
    constructor(login: LoginInfo) {
        if (typeof login !== 'object') {
            throw new Error('You must pass auth data into the TidalAPI object correctly');
        } else {
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

    /**
     * Global search.
     * @param query
     */
    public async search(query: SearchParams | string): Promise<TidalSearchResult> {
        let queryObj: SearchParams = {};
        if (typeof query === "string") {
            queryObj.query = query;
            queryObj.limit = 100;
        } else {
            queryObj = query;
        }
        return await this._baseRequest('/search', queryObj);
    }

    /**
     * Get artist info.
     * @param artistId
     */
    public async getArtist(artistId: string): Promise<TidalArtistInfoFull> {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId), null);
    }

    /**
     * Get artist top tracks.
     * @param artistId id of artist
     * @param params can be used for paging
     */
    public async getTopTracks(artistId: string, params: SearchParams = null): Promise<TidalArrayResult<TidalTrack>> {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/toptracks', params);
    }

    /**
     * Get artist videos.
     * @param artistId
     * @param query
     */
    public async getArtistVideos(artistId: string, query: SearchParams = null): Promise<TidalArrayResult<TidalVideo>> {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/videos', query);
    }

    /**
     * Get artist bio.
     * @param artistId
     */
    public async getArtistBio(artistId: string): Promise<TidalBio> {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/bio', {});
    }

    /**
     * Get similar artists.
     * @param artistId
     * @param query
     */
    public async getSimilarArtists(artistId: string, query: SearchParams = null): Promise<TidalArrayResult<TidalSimilarArtist>> {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/similar', query);
    }

    /**
     * Get artist albums.
     * @param artistId
     * @param query
     */

    public async getArtistAlbums(artistId: string, query: SearchParams = null): Promise<TidalArrayResult<TidalAlbum>> {
        return await this._baseRequest('/artists/' + encodeURIComponent(artistId) + '/albums', query);
    }

    /**
     * Get album info.
     * @param albumId
     */
    public async getAlbum(albumId: string): Promise<TidalAlbum> {
        return await this._baseRequest('/albums/' + encodeURIComponent(albumId), null);
    }

    /**
     * Get album tracks.
     * @param albumId
     * @param query
     */

    public async getAlbumTracks(albumId: string, query: SearchParams = null): Promise<TidalArrayResult<TidalTrack>> {
        return await this._baseRequest('/albums/' + encodeURIComponent(albumId) + '/tracks', query);
    }

    /**
     * Get playlist info.
     * @param playlistId
     * @param query
     */
    public async getPlaylist(playlistId: string, query: SearchParams = null) {
        return await this._baseRequest('/playlists/' + encodeURIComponent(playlistId), query);
    }

    /**
     * Get tracks from a playlist.
     * @param playlistId
     * @param query
     */
    public async getPlaylistTracks(playlistId: string, query: SearchParams = null) {
        return await this._baseRequest('/playlists/' + encodeURIComponent(playlistId) + '/tracks', query);
    }

    /**
     * Get track info.
     * @param trackId
     */
    public async getTrackInfo(trackId: string): Promise<TidalTrack> {
        return await this._baseRequest('/tracks/' + encodeURIComponent(trackId), {});
    }

    /**
     * Get track stream URL.
     * @param trackId
     */
    public async getStreamUrl(trackId: string): Promise<TidalStreamInfo> {
        return await this._baseRequest('/tracks/' + encodeURIComponent(trackId) + '/streamUrl', {
            soundQuality: this.authData.quality
        });
    }

    public async getOfflineURL(trackId: string) {
        return await this._baseRequest('/tracks/' + encodeURIComponent(trackId) + '/offlineUrl', {
            soundQuality: this.authData.quality
        });
    }

    /**
     * Get video stream URL.
     * @param trackId
     */
    public async getVideoStreamUrl(trackId: string) {
        return await this._baseRequest('/videos/' + encodeURIComponent(trackId) + '/streamUrl', {});
    }

    /**
     * Get user playlists.
     * @param userId
     * @param query
     */
    public async getPlaylists(userId: string, query: SearchParams = null): Promise<TidalArrayResult<any>> {
        return await this._baseRequest('/users/' + encodeURIComponent(userId) + "/playlists", query);
    }

    public async getETag(playlistId) {
        const url = "/playlists/" + encodeURIComponent(playlistId);
        const result = await this._baseRequestRaw(url, {}, "GET", null, false);
        return result.responseHeaders.get("etag");
    }

    public async deletePlaylist(playlistId: string) {
        return await this._baseRequest('/playlists/' + encodeURIComponent(playlistId), null, "DELETE", null, false, true);
    }

    public async addTracksToPlaylist(songIds: string[], playlistId: string, onDupes:"FAIL"|"SKIP"|"ADD" = "FAIL") {
        const self = this;
        const url = "/playlists/" + encodeURIComponent(playlistId) + "/items";
        const etag = await self.getETag(playlistId);
        const params = {
            "trackIds": songIds.join(","),
            "onDupes": onDupes
        };
        const headers = new Headers({"If-None-Match": etag});
        return await this._baseRequest(url, params, "POST", headers, true);
    }

    /**
     * Checks whether a playlist with a given title is already in the users library
     * @param title {string} Title of the playlist
     * @returns {Promise<null|string>} `null` if no playlist was found, otherwise the UUID of the matching Playlist
     */
    public async checkIfPlaylistExists(title: string): Promise<boolean> {
        return (await this.findPlaylistsByName(title)).length >= 1;
    };

    public async findPlaylistsByName(title: string): Promise<any[]> {
        const myPlaylists: TidalArrayResult<any> = await this.getPlaylists(null, {
            limit: 999
        });

        return _.filter(myPlaylists.items, x => x.title === title);
    }

    /**
     * Creates a new playlist in the users library
     * @param title {string} Title of the playlist
     * @param description {string} Description of the playlist
     * @param userId {string} UserId to create the playlist for
     * @returns {Promise<string>} UUID of the created playlist
     */

    public async createPlaylist(title: string, description: string, userId: string): Promise<string> {
        const url = "/users/" + encodeURIComponent(userId) + "/playlists" + "?countryCode=" + encodeURIComponent(this.authData.countryCode);
        const params = {
            "title": title,
            "description": description
        };
        const result = await this._baseRequest(url, params, "POST", null, true)
        return result.uuid;
    }

    /**
     * Creates a new playlist if no other with the given name was found
     * @param title {string} Title of the playlist
     * @param description {string} Description of the playlist
     * @param userId {string} UserId to create the playlist for
     * @returns {Promise<string>} UUID of the playlist
     */

    public async createPlaylistIfNotExists(title, description, userId) {
        const exists = await this.checkIfPlaylistExists(title);
        if (exists)
            return exists;
        return (await this.createPlaylist(title, description, userId));
    }

    /**
     * Get track stream URL.
     * @param songId
     * @param width
     * @param height
     *
     */
    public getArtUrlSync(songId: string, width: number = null, height: number = null): string {
        width = width ?? 1280;
        height = height ?? 1280;
        return 'https://resources.tidal.com/images/' + songId.replace(/-/g, '/') + '/' + width + 'x' + height + '.jpg';
    }

    private async _baseRequestRaw(url: string, params = null, method: string, additionalHeaders: Headers, paramsAsUrlEncoded, emptyResponse = false): Promise<RawResult> {
        if (!params)
            params = {};
        params.countryCode = params.countryCode ? params.countryCode : this.authData.countryCode;
        params.sessionId = params.sessionId ?? this._sessionId;

        let headers = additionalHeaders;
        if (!headers) {
            headers = new Headers();
        }
        headers.append('Origin', 'https://desktop.tidal.com');
        headers.append('X-Tidal-SessionId', this._sessionId);

        let body: string | URLSearchParams;

        if (paramsAsUrlEncoded) {
            body = new URLSearchParams();
            for (const key in params) {
                body.append(key, params[key]);
            }
        } else {
            if (method?.toUpperCase() === "GET") {
                const urlParams = (Object.keys(params).reduce((p, c) => p + `&${c}=${encodeURIComponent(params[c])}`, '')).replace("&", "?")

                url += urlParams;
            }
            body = null;
        }
        // console.debug(baseURL + url);

        // execute http request
        const result = await fetch(baseURL + url, {
            method,
            headers,
            body: body
        });
        let data: any;
        if (!emptyResponse) {
            data = await result.json();
        }
        if (!result.ok) {
            throw new TidalError(data);
        }
        return {
            data,
            responseHeaders: result.headers
        } as RawResult;
    }

    /**
     * Base request function.
     */
    private async _baseRequest(url: string, params, method: string = "GET", additionalHeaders: Headers = null, paramsAsUrlEncoded: boolean = false, expectEmptyResult = false): Promise<any[] | any> {
        return (await this._baseRequestRaw(url, params, method, additionalHeaders, paramsAsUrlEncoded, expectEmptyResult)).data;
    }
}
