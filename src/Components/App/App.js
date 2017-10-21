import React, { Component } from 'react';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      searchPhrase: ''
    };
    this.addTrack = this.addTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }
  removeTrack(track){
    let obj = this.state.playlistTracks.find(o => o.id === track.id);
    if(obj){
      let updatedPlaylist = this.state.playlistTracks.filter(track2delete=>track2delete.id !== track.id);
      this.setState({ playlistTracks: updatedPlaylist });
    }
  }
  addTrack(track){
    let obj = this.state.playlistTracks.find(o => o.id === track.id);
    if(!obj){
      let updatedPlaylist = this.state.playlistTracks.concat(track);
      this.setState({ playlistTracks: updatedPlaylist });
    }
  }
  updatePlaylistName(newPlaylistName){
    this.setState({ playlistName: newPlaylistName});
  }
  savePlaylist(){
    Spotify.savePlaylist(this.state.playlistName,this.state.playlistTracks);
    this.setState({ playlistName: 'New Playlist', searchResults: [] });
  }
  search(term){
    Spotify.search(term).then(searchResults=>{
      this.setState({
        searchResults: searchResults,
        searchPhrase: term
      });
    });
  }
  render() {
    if(!Spotify.getToken()){
      Spotify.getAccessToken2();
    }
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
//
