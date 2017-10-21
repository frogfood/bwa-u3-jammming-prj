const client_id = '4d90f18fa7e64932a9a7322a44fdd24f';
//const client_secret = '3870f54cd356420abe5f51634d1f8884';
const redirect_uri = 'http://localhost:3000/callback/';
//const redirect_uri = 'http://frogfood.surge.sh';
let accessToken, expiresIn;

const Spotify = {
  getToken(){
    return accessToken
  },
  savePlaylist(playlistName, trackURIs){
    if((playlistName) && (trackURIs)){
        const token = accessToken;
        const headers = {'Content-Type':'application/json','Authorization': `Bearer ${token}`};
        let userId;
        const myProfile = 'https://api.spotify.com/v1/me';
        return fetch(`${myProfile}`,{headers: {Authorization: `Bearer ${token}`}},{method:'GET'})
          .then(response => {
            return response.json();
          }).then(jsonResponse => {
              userId = jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'post',
                body:JSON.stringify({name: playlistName, public: false})
              })
          }).then(response => {
            return response.json();
          }).then(jsonResponse => {
            let newPlayListURIs = {uris: trackURIs.map(a => a.uri)};
            let newPlayListId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${newPlayListId}/tracks`, {
              headers: {'Content-Type':'application/json','Authorization': `Bearer ${accessToken}`},
              method: 'post',
              body: JSON.stringify(newPlayListURIs)
            })
          });
    }
  },
  search(term){
    return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${term}`,{headers: {Authorization: `Bearer ${accessToken}`}},{method:'GET'})
      .then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }
          })
        }
       }
      )
  },

  getAccessToken2(){
    const url = window.location.href;
    accessToken = url.match(/access_token=([^&]*)/);
    expiresIn = url.match(/expires_in=([^&]*)/);
    if ((url.match(/access_token=([^&]*)/)) && (url.match(/expires_in=([^&]*)/))) {
      accessToken = accessToken[1];
      expiresIn = expiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return true;
    }
    if ((!accessToken) && (!url.match(/access_token=([^&]*)/))) {
      window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=playlist-modify-public%20playlist-modify-private%20user-read-private%20user-read-email&response_type=token&state=123`;
    }
  }
}

export default Spotify;
