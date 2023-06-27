import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, StatusBar, View, ImageBackground, Alert } from 'react-native';
import { getAPI } from '../config';
import Player from './Player';
import Tracklist from './Tracklist';
import Explorer from './Explorer';
import Playlists from './Playlists';
import Volume from './Volume';
import AppConfig from './AppConfig';
import RNEventSource from 'react-native-event-source';
import { dbToLinear, linearToDb } from './utils.js';

const Main = () => {
  const [apiUrl, setApiUrl] = useState(null);
  const [page, setPage] = useState('setup');
  const [rootMusicPath, setRootMusicPath] = useState('');
  const [currentPath, setCurrentPath] = useState(null);
  const [folders, setFolders] = useState([]);
  const [playing, setPlaying] = useState('foo');
  const [volume, setVolume] = useState({});
  const [currentSong, setCurrentSong] = useState({
    track: -1,
    playlistId: -1,
    title: '',
    album: '',
    year: '',
    artist: '',
    duration: 0
  });
  const [songPosition, setSongPosition] = useState(0);
  const [albumCover, setAlbumCover] = useState(null);
  const [appPlaylist, setAppPlaylist] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playerPlaylist, setPlayerPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState([]);
  const [tracklistsSongs, setTracklistsSongs] = useState([]);

  const currentPositionRef = useRef(songPosition);
  const prevAlbumRef = useRef(currentSong.album);

  useEffect(() => {
    const gettingUrl = async () => {
      const storedAPI = await getAPI();
      if (storedAPI) {
        setApiUrl(storedAPI);
        setPage('player');
      }
    }

    gettingUrl()
  }, [apiUrl]);

  const params = {
    player: true,
    playlists: true,
    trcolumns: ['%artist%', '%album%', '%title%', '%year%', '%tracknumber%']
  }

  const queryString = new URLSearchParams(params).toString();
  
  const alertMessage = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('Cancel pressed'), style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const handlePlayerClick = (e, action) => {
    try {
      fetch(`${apiUrl}/api/player/${action}`, {
        method: 'POST'
      })
      .then(() => updatePlayerStatus());
    }
    catch (error) {
      console.error('Error handling click', error);
    }
  }

  const drawSongInfo = async (data) => {
    setSongPosition(data.player.activeItem.position);
    setCurrentSong(prevSong => {
      if (
        prevSong.track !== data.player.activeItem.index ||
        prevSong.playlistId !== data.player.activeItem.playlistId
      ) {
        return {
          ...prevSong,
          track: data.player.activeItem.index,
          playlistId: data.player.activeItem.playlistId,
          title: data.player.activeItem.columns[2],
          album: data.player.activeItem.columns[1],
          year: data.player.activeItem.columns[3],
          artist: data.player.activeItem.columns[0],
          duration: data.player.activeItem.duration
        }
      }
    
      return prevSong;
    });
  }

  const fetchTracklistTracks = async () => {
    if (playerPlaylist) {
      const response = await fetch(`${apiUrl}/api/playlists/${playerPlaylist.id}/items/0:2000?columns=%25artist%25,%25album%25,%25year%25,%25track%25,%25title%25`);
      const data = await response.json();
      setTracklistsSongs(data.playlistItems.items);
    }
  };

  const fetchTracks = useCallback(async () => {
    if (selectedPlaylist) {
      try {
        const response = await fetch(`${apiUrl}/api/playlists/${selectedPlaylist.id}/items/0:2000?columns=%25artist%25,%25album%25,%25year%25,%25track%25,%25title%25`);
        const data = await response.json();

        const groupedData = {};
        
        const getMiniArt = async (track) => {
          try {
            const response = await fetch(`${apiUrl}/api/artwork/${selectedPlaylist.id}/${track}`);
            if (response.ok) {
              const coverURL = `${response.url}?ts=${Date.now()}`;
              return(coverURL);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }

        data.playlistItems.items.forEach((item, index) => {
          const [artist, album, year, trackNumber, songName] = item.columns;
          const albumKey = `${year} - ${album}`;

          if (!groupedData[artist]) {
            groupedData[artist] = {};
          }

          if (!groupedData[artist][albumKey]) {
            groupedData[artist][albumKey] = {
              coverArt: getMiniArt( index ),
              name: album,
              year: year,
              songs: []
            };
          }

          groupedData[artist][albumKey]['songs'].push({
            trackNumber,
            songName,
            songIndex: index
          });
        });

        setSelectedPlaylistSongs(groupedData);
      } catch (error) {
        console.log('failed fetching tracks', error);
      }
    }
  }, [apiUrl, selectedPlaylist]);

  const handleVolume = (playerVolume) => {

    const handleVolumeData = (volumeData) => {
      if ( volumeData.type !== 'db') {
        return {
          type: volumeData.type,
          min: volumeData.min,
          max: volumeData.max,
          value: volumeData.value,
          hintText: volumeData.value.toFixed(0),
          isMuted: volumeData.isMuted
        }
      }

      return {
        type: 'db',
        min: 0.0,
        max: 100,
        value: dbToLinear(volumeData.value)*100.0,
        hintText: Math.max(volumeData.value, volumeData.min).toFixed(0) + ' dB',
        isMuted: volumeData.isMuted
      }
    }

    if (playerVolume.value !== volume.value) {
      setVolume(handleVolumeData(playerVolume));
    }
  }

  const updateVolume = (val) => {
    try {
      fetch(`${apiUrl}/api/player`, {
        method: 'POST',
        body: JSON.stringify({ volume: linearToDb(val / 100.0) }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    catch (error) {
      console.log("error updating volume", error);
    }
  }

  const updatePlayerStatus = useCallback(async() => {
    try {
      const response = await fetch(`${apiUrl}/api/player?player=true&columns=%25artist%25,%25album%25,%25title%25,%25year%25`, {
        method: 'GET'
      });
      const playerData = await response.json();

      setPlaying(playerData.player.playbackState);
      handleVolume(playerData.player.volume);
      drawSongInfo(playerData);
      fetchTracks();

    } catch (e) {
      console.log("failed updating status");
    }
  }, [fetchTracks]);

  const updateSongPosition = async (newPosition) => {
    fetch(`${apiUrl}/api/player`, {
      method: 'POST',
      body: JSON.stringify({ position: newPosition }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => setSongPosition(newPosition));
  }

  const playSong = async (songId, listId) => {
    try {
      await fetch(`${apiUrl}/api/player/play/${listId}/${songId}`, {
        method: 'POST',
      })
      .then(() => updatePlayerStatus());
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  }

  const playlistItemsAdd = async (ev, folder, shouldPlay, shouldReplace) => {
    try {
      if (selectedPlaylist.blocked) {
        alertMessage('wait...', 'blocked playlist');
      }
      else {
        await fetch(`${apiUrl}/api/playlists/${appPlaylist.id}/items/add`, {
          method: 'POST',
          body: JSON.stringify({items: [folder], play: shouldPlay, replace: shouldReplace}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => setPlayerPlaylist(appPlaylist))
        .then(() => updatePlayerStatus());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const playlistItemsRemove = async (path) => {
    try {
      if (selectedPlaylist.blocked) {
        alertMessage('wait...', 'blocked playlist')
      }
      else {
        await fetch(`${apiUrl}/api/playlists/${selectedPlaylist.id}/items/remove`, {
          method: 'POST',
          body: JSON.stringify({items: [path]}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => updatePlayerStatus());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const settingPlayerPlaylist = (id) => {
    if (currentSong.playlistId !== -1 && playlists.length) {
      if (!playerPlaylist) {
        const playlerPl = playlists.find(pl => pl.id === currentSong.playlistId);
        setPlayerPlaylist(playlerPl);
        fetchTracklistTracks();
      }
      if (playerPlaylist && currentSong.playlistId && playerPlaylist.id !== currentSong.playlistId) {
        const playlerPl = playlists.find(pl => pl.id === currentSong.playlistId);
        setPlayerPlaylist(playlerPl);
        fetchTracklistTracks();
      }
    }
  }

  useEffect(() => {
    settingPlayerPlaylist();
  }, [playlists, currentSong]);

  useEffect(() => {
    fetchTracklistTracks();
  }, [apiUrl, playerPlaylist]);

  useEffect(() => {
    currentPositionRef.current = songPosition;
  }, [songPosition]);

  useEffect(() => {
    if (apiUrl) {
      updatePlayerStatus();
    }
  }, [updatePlayerStatus, apiUrl]);
  
  useEffect(() => {
    const timerInterval = 1000;

    const updateProgressBarPosition = () => {
      if (playing !== 'playing') {
        clearInterval(interval);
      }

      const currentPosition = currentPositionRef.current;
      const newPosition = currentPosition + timerInterval / 1000;
      currentPositionRef.current += newPosition;
      setSongPosition(newPosition);
    }

    const interval = setInterval(updateProgressBarPosition, timerInterval);

    return () => {
      clearInterval(interval);
    }
  }, [currentSong.track, playing, updatePlayerStatus, apiUrl]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks, selectedPlaylist, currentSong.track, apiUrl]);

  useEffect(() => {
    const fetchRootURL = async () => {
      fetch(`${apiUrl}/api/browser/roots`)
        .then(response => response.json())
        .then(data => setRootMusicPath(data.roots[0].path));
    }
    if (apiUrl) {
      fetchRootURL();
    }
  }, [apiUrl]);

  useEffect(() => {
    const getCoverArt = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/artwork/${currentSong.playlistId}/${currentSong.track}`);
        if (response.ok) {
          const coverURL = `${response.url}?ts=${Date.now()}`;
          setAlbumCover(coverURL);
        } else {
          console.log('Network response was not ok');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    if (apiUrl && currentSong.album && (prevAlbumRef.current !== currentSong.album)) {
      getCoverArt();
      prevAlbumRef.current = currentSong.album;
    }
  }, [apiUrl, currentSong.album]);

  useEffect(() => {
    const blockedPlaylists = ['Full Albums', 'Search', 'Library Selection'];
    const appPlaylistName = 'Rusoftware\'s App';

    const createAppPlaylist = async () => {
      try {
        await fetch(`${apiUrl}/api/playlists/add`, {
          method: 'POST',
          body: JSON.stringify({title: appPlaylistName}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          // default playlist created
          fetchPlaylists();
        });
      }
      catch (error) {
        console.log("unable to create Default App Playlist");
      }
    }

    const fetchPlaylists = async() => {
      try {
        const response = await fetch(`${apiUrl}/api/playlists`);
        const data = await response.json();

        const appPlaylistExists = data.playlists.find(playlist => playlist?.title === appPlaylistName);

        if (!appPlaylistExists) {
          return createAppPlaylist()
        };

        const updatedPlaylists = data.playlists.map(playlist => {
          if (blockedPlaylists.includes(playlist.title)) {
            return { ...playlist, blocked: true }
          }
          return playlist
        });

        setPlaylists(updatedPlaylists);

        const selectedPl = updatedPlaylists.find(playlist => playlist?.isCurrent || playlist?.title === appPlaylistName);
        setSelectedPlaylist(selectedPl);

        const appPl = updatedPlaylists.find(playlist =>  playlist?.title === appPlaylistName);
        setAppPlaylist(appPl);

      } catch (error) {
        console.log('failed fetching playlists', error)
      }
    };

    if (apiUrl) {
      fetchPlaylists()
    };
  }, [apiUrl])

  useEffect(() => {
    const fetchFolders = async () => {
      const excludedFolders = ['MusicBee']
      const includedExtensions = ['mp3', 'flac']
      if (currentPath || rootMusicPath)
      try {
        const response = await fetch(`${apiUrl}/api/browser/entries?path=${currentPath || rootMusicPath}`)
        const data = await response.json()
        const folders = data.entries.filter(entry => {
          const isExcluded = excludedFolders.includes(entry.name)
          const isDirectory = entry.type === 'D'
          const isFile = entry.type === 'F'

          if (isExcluded) {
            return false
          }

          if (isDirectory) {
            return true
          }

          if (isFile) {
            const fileExtension = entry.name.split('.').pop().toLowerCase()
            return includedExtensions.includes(fileExtension)
          }

          return false
        })

        if (apiUrl) {
          setFolders(folders)
        }
      } catch (error) {
        console.error('failed fetching folders', error)
      }
    }

    fetchFolders()
  }, [apiUrl, currentPath, rootMusicPath])

  useEffect(() => {
    const creatingEventSources = async () => {
      const updatesSource = new RNEventSource(`${apiUrl}/api/query/updates?${queryString}`)

      // api/query/events is the other endpoint to create eventSource, but there's no documentation at all
      // const eventSource = new RNEventSource(`${apiUrl}/api/query/events?${queryString}`)

      const handleUpdatesMessage = async (update) => {
        const updateData = await JSON.parse(update.data);
        if (updateData && updateData.player && updateData.player.activeItem) {
          drawSongInfo(updateData);
          handleVolume(updateData.player.volume);

          if (updateData.player.playbackState !== playing) {
            setPlaying(updateData.player.playbackState);
          }
        }
      }

      updatesSource.addEventListener('message', handleUpdatesMessage);

      return () => {
        updatesSource.removeAllListeners();
        updatesSource.close();
      };
    }

    if (apiUrl) {
      creatingEventSources();
    }
  }, [apiUrl])

  const imgBg = ( albumCover ) ? { uri: albumCover } : require('../assets/img/album-bg.png');

  return (
    <ImageBackground source={ imgBg } resizeMode="cover" blurRadius={20} style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#10101066'}}>
        <StatusBar 
          animated={true}
          backgroundColor='#00000000'
          barStyle='light-content'
          translucent={true}
        />
        <View style={styles.scrollView}>
          <View style={{flex: 1}}>
            {page === 'player' && (
              <>
                <Player
                  albumCover={albumCover}
                  currentSong={currentSong}
                  songPosition={songPosition}
                  playing={playing}
                  selectedPlaylist={selectedPlaylist}
                  handlePageChange={handlePageChange}
                  handlePlayerClick={handlePlayerClick}
                  updateSongPosition={updateSongPosition}
                  alertMessage={alertMessage}
                />
                <Tracklist
                  playerPlaylist={playerPlaylist}
                  tracklistsSongs={tracklistsSongs}
                  playSong={playSong}
                  playlistItemsRemove={playlistItemsRemove}
                  currentSong={currentSong}
                />
              </>
            )}
            {page === 'explorer' && (
              <Explorer
                folders={folders}
                setCurrentPath={setCurrentPath}
                currentPath={currentPath}
                handlePageChange={handlePageChange}
                rootMusicPath={rootMusicPath}
                playlistItemsAdd={playlistItemsAdd}
              />
            )}
            {page === 'playlists' && (
              <Playlists
                handlePageChange={handlePageChange}
                selectedPlaylist={selectedPlaylist}
                setSelectedPlaylist={setSelectedPlaylist}
                playlists={playlists}
                selectedPlaylistSongs={selectedPlaylistSongs}
                playSong={playSong}
              />
            )}
            {page === 'volume' && (
              <Volume
                volume={volume}
                setVolume={setVolume}
                handlePageChange={handlePageChange}
                updateVolume={updateVolume}
              />
            )}
            {(page === 'setup') && (
              <AppConfig
                handlePageChange={handlePageChange}
                setApiUrl={setApiUrl}
              />
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 12,
    flex: 1
  },
});

export default Main;
