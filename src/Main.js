import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, StatusBar, View, ImageBackground } from 'react-native'
import { getAPI } from '../config'
import Player from './Player'
import Tracklist from './Tracklist'
import Explorer from './Explorer'
import Playlists from './Playlists'
import Volume from './Volume'
import AppConfig from './AppConfig'
import RNEventSource from 'react-native-event-source'
import { dbToLinear, linearToDb } from './utils.js'

const Main = () => {
  const [apiUrl, setApiUrl] = useState(null)
  const [page, setPage] = useState('setup')
  const [rootMusicPath, setRootMusicPath] = useState('')
  const [currentPath, setCurrentPath] = useState(null)
  const [folders, setFolders] = useState([])
  const [playing, setPlaying] = useState('foo')
  const [volume, setVolume] = useState({})
  const [currentSong, setCurrentSong] = useState({
    track: -1,
    playlistId: -1,
    title: '',
    album: '',
    year: '',
    artist: '',
    duration: 0
  })
  const [songPosition, setSongPosition] = useState(0)
  const [albumCover, setAlbumCover] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [appPlaylist, setAppPlaylist] = useState('')
  const [tracklistsSongs, setTracklistsSongs] = useState([]);
  const [openPlaylist, setOpenPlaylist] = useState(null)
  const [selectedPlaylistSongs, setSelectedPlaylistSongs] = useState([])
  const [showToast, setShowToast] = useState(false)

  const currentPositionRef = useRef(songPosition)
  const prevAlbumRef = useRef(currentSong.album)

  useEffect(() => {
    const gettingUrl = async () => {
      const storedAPI = await getAPI()
      if (storedAPI) {
        setApiUrl(storedAPI)
        setPage('player')
      }
    }

    gettingUrl()
  }, [apiUrl])

  const params = {
    player: true,
    playlists: true,
    trcolumns: ['%artist%', '%album%', '%title%', '%year%', '%tracknumber%']
  }

  const queryString = new URLSearchParams(params).toString()
  
  const showToastMessage = (message) => {
    setShowToast(message);

    setTimeout(() => {
      setShowToast(false)
    }, 3000);
  };

  const handlePlayerClick = (e, action) => {
    try {
      fetch(`${apiUrl}/api/player/${action}`, {
        method: 'POST'
      })
      .then(() => updatePlayerStatus())
    }
    catch (error) {
      console.error('Error handling click', error)
    }
  }

  const drawSongInfo = async(data) => {
    setSongPosition(data.player.activeItem.position)
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
    
      return prevSong
    })
  }

  const fetchTracks = useCallback(async() => {
    if (openPlaylist) {
      try {
        const response = await fetch(`${apiUrl}/api/playlists/${openPlaylist}/items/0:2000?columns=%25artist%25,%25album%25,%25year%25,%25track%25,%25title%25`)
        const data = await response.json()

        const groupedData = {}
        
        const getMiniArt = async (track) => {
          try {
            const response = await fetch(`${apiUrl}/api/artwork/${openPlaylist}/${track}`)
            if (response.ok) {
              const coverURL = `${response.url}?ts=${Date.now()}`
              return(coverURL)
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }

        data.playlistItems.items.forEach((item, index) => {
          const [artist, album, year, trackNumber, songName] = item.columns
          const albumKey = `${year} - ${album}`

          if (!groupedData[artist]) {
            groupedData[artist] = {}
          }

          if (!groupedData[artist][albumKey]) {
            groupedData[artist][albumKey] = {
              coverArt: getMiniArt( index ),
              name: album,
              year: year,
              songs: []
            }
          }

          groupedData[artist][albumKey]['songs'].push({
            trackNumber,
            songName,
            songIndex: index
          })
        })

        setSelectedPlaylistSongs(groupedData)
      } catch (error) {
        console.log('failed fetching tracks', error)
      }
    }
  }, [apiUrl, openPlaylist])

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
      setVolume(handleVolumeData(playerVolume))
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
      })
    }
    catch (error) {
      console.log("error updating volume", error)
    }
  }

  const updatePlayerStatus = useCallback(async() => {
    try {
      const response = await fetch(`${apiUrl}/api/player?player=true&columns=%25artist%25,%25album%25,%25title%25,%25year%25`, {
        method: 'GET'
      })
      const playerData = await response.json()

      getTracklistSongs()
      setPlaying(playerData.player.playbackState)
      handleVolume(playerData.player.volume)
      drawSongInfo(playerData)
      
      //fetchTracks()
    } catch (e) {
      console.log("failed updating status")
    }
  })

  const updateSongPosition = async (newPosition) => {
    fetch(`${apiUrl}/api/player`, {
      method: 'POST',
      body: JSON.stringify({ position: newPosition }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => setSongPosition(newPosition))
  }

  const playSong = async (songId) => {
    try {
      await fetch(`${apiUrl}/api/player/play/${openPlaylist}/${songId}`, {
        method: 'POST',
      })
      .then(() => updatePlayerStatus())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const getTracklistSongs = async () => {
    if (selectedPlaylist) {
      try {
        const response = await fetch(`${apiUrl}/api/playlists/${selectedPlaylist}/items/0:2000?columns=%25artist%25,%25album%25,%25year%25,%25track%25,%25title%25`);
        const data = await response.json();
        setTracklistsSongs(data.playlistItems.items);
      } catch (error) {
        console.log("Error getting default playlist songs", error);
      }
    }
  };

  const playlistItemsAdd = async (ev, folder, shouldPlay, shouldReplace) => {
    try {
      const selectedList = playlists.find(playlist => playlist.id === selectedPlaylist)
      if (selectedList && selectedList.blocked) {
        showToastMessage('blocked playlist')
      }
      else {
        await fetch(`${apiUrl}/api/playlists/${selectedPlaylist}/items/add`, {
          method: 'POST',
          body: JSON.stringify({items: [folder], play: shouldPlay, replace: shouldReplace}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => updatePlayerStatus())
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const playlistItemsRemove = async (path) => {
    try {
      const selectedList = playlists.find(playlist => playlist.id === selectedPlaylist)
      if (selectedList && selectedList.blocked) {
        showToastMessage('blocked playlist')
      }
      else {
        await fetch(`${apiUrl}/api/playlists/${selectedPlaylist}/items/remove`, {
          method: 'POST',
          body: JSON.stringify({items: [path]}),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => updatePlayerStatus())
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    currentPositionRef.current = songPosition
  }, [songPosition])

  useEffect(() => {
    if (apiUrl) {
      updatePlayerStatus()
    }
  }, [apiUrl])
  
  useEffect(() => {
    const timerInterval = 1000

    const updateProgressBarPosition = () => {
      if (playing !== 'playing') {
        clearInterval(interval)
      }

      const currentPosition = currentPositionRef.current

      if (currentPosition >= currentSong.duration) {
        updatePlayerStatus()
        return
      }

      const newPosition = currentPosition + timerInterval / 1000
      currentPositionRef.current += newPosition
      setSongPosition(newPosition)
    }

    const interval = setInterval(updateProgressBarPosition, timerInterval)

    return () => {
      clearInterval(interval)
    }
  }, [currentSong.track, currentSong.duration, currentSong.position, playing, updatePlayerStatus, apiUrl])

  useEffect(() => {
    fetchTracks()
  }, [fetchTracks, selectedPlaylist, currentSong.track, apiUrl])

  useEffect(() => {
    const fetchRootURL = async () => {
      fetch(`${apiUrl}/api/browser/roots`)
        .then(response => response.json())
        .then(data => setRootMusicPath(data.roots[0].path))
    }
    if (apiUrl) {
      fetchRootURL()
    }
  }, [apiUrl])

  useEffect(() => {
    const getCoverArt = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/artwork/${currentSong.playlistId}/${currentSong.track}`)
        if (response.ok) {
          const coverURL = `${response.url}?ts=${Date.now()}`
          setAlbumCover(coverURL)
        } else {
          console.log('Network response was not ok')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    };
  
    if (apiUrl && currentSong.album && (prevAlbumRef.current !== currentSong.album)) {
      getCoverArt()
      prevAlbumRef.current = currentSong.album
    }
  }, [apiUrl, currentSong.album])

  useEffect(() => {
    const blockedPlaylists = ['Full Albums', 'Search', 'Library Selection']
    const appPlaylistName = 'Rusoftware\'s App'
    
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
          console.log('app playlist creada')
          fetchPlaylists()
        })
      }
      catch (error) {
        console.log("unable to create Default App Playlist")
      }
    }

    const fetchPlaylists = async() => {
      try {
        const response = await fetch(`${apiUrl}/api/playlists`)
        const data = await response.json()

        const appPlaylistExists = data.playlists.find(playlist => playlist.title === appPlaylistName);
        
        if (!appPlaylistExists) {
          return createAppPlaylist()
        }

        const updatedPlaylists = data.playlists.map(playlist => {
          if (blockedPlaylists.includes(playlist.title)) {
            return { ...playlist, blocked: true }
          }
          return playlist
        })

        setPlaylists(updatedPlaylists)

        const currentPlaylist = updatedPlaylists.find(playlist => playlist.title === appPlaylistName);

        setSelectedPlaylist(currentPlaylist.id)
      } catch (error) {
        console.log('failed fetching playlists', error)
      }
    }

    if (apiUrl) {
      fetchPlaylists()
    }
  }, [apiUrl])

  useEffect(() => {
    setOpenPlaylist(selectedPlaylist)
  }, [selectedPlaylist])

  useEffect(() => {
    getTracklistSongs();
  }, [selectedPlaylist]);

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

      const handleUpdatesMessage = update => {
        const updateData = JSON.parse(update.data)
        if (updateData && updateData.player && updateData.player.activeItem) {
          drawSongInfo(updateData)
          handleVolume(updateData.player.volume)
        }
      }

      updatesSource.addEventListener('message', handleUpdatesMessage)

      return () => {
        updatesSource.removeAllListeners()
        updatesSource.close()
      };
    }

    if (apiUrl) {
      creatingEventSources()
    }
  }, [apiUrl])

  const imgBg = ( albumCover ) ? { uri: albumCover } : require('../assets/img/album-bg.png')

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
                  handlePageChange={handlePageChange}
                  handlePlayerClick={handlePlayerClick}
                  updateSongPosition={updateSongPosition}
                />
                <Tracklist
                  selectedPlaylist={selectedPlaylist}
                  playlists={playlists}
                  playSong={playSong}
                  playlistItemsRemove={playlistItemsRemove}
                  currentSong={currentSong}
                  tracklistsSongs={tracklistsSongs}
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
                openPlaylist={openPlaylist}
                setOpenPlaylist={setOpenPlaylist}
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
