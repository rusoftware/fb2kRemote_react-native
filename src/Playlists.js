import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import placeholderImg from '../assets/img/no-cover.jpeg';

const Playlists = ({
  handlePageChange,
  selectedPlaylist,
  setSelectedPlaylist,
  playlists,
  selectedPlaylistSongs,
  playSong
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coverArtURL, setCoverArtURL] = useState({});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedPlaylist(option);
    setIsOpen(false);
  };

  //useEffect(() => console.log(coverArtURL), [coverArtURL, selectedPlaylistSongs])

  useEffect(() => {
    if (selectedPlaylistSongs) {
      Object.entries(selectedPlaylistSongs).forEach(([artist, albums]) => {
        Object.entries(albums).forEach(([albumKey, albumData]) => {
          albumData.coverArt.then((url) => {
            setCoverArtURL((prev) => ({
              ...prev,
              [albumKey]: url,
            }));
          });
        });
      });
    }
  }, [selectedPlaylistSongs]);

  return (
    <View style={styles.playlistsSection}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handlePageChange('player')}>
          <Text>patra</Text>{/*<Text><Feather name="chevron-left" size={24} style={styles.back} /></Text>*/}
        </TouchableOpacity>
        {/*<MaterialCommunityIcons name="music-note-list" size={32} />*/}
      </View>

      <View style={styles.dropdown}>
        <TouchableOpacity style={styles.dropdownToggle} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>
            {selectedPlaylist
              ? `from: ${playlists.find((currentPlaylist) => currentPlaylist.id === selectedPlaylist)?.title}`
              : 'Seleccionar opción'}
          </Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.dropdownMenu}>
            {playlists.map((pl) => {
              if (pl.id !== selectedPlaylist) {
                return (
                  <TouchableOpacity
                    key={pl.id}
                    style={[
                      styles.dropdownItem,
                      selectedPlaylist === pl.id ? styles.selected : null,
                    ]}
                    onPress={() => handleOptionClick(pl.id)}
                  >
                    <Text>{pl.title}</Text>
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            })}
          </View>
        )}
      </View>

      <View style={styles.playlistsContainer}>
        {Object.entries(selectedPlaylistSongs).map(([artist, albums]) => (
          <View key={artist}>
            {Object.entries(albums).map(([albumKey, albumData]) => {
              return (
                <View key={albumKey}>
                  <View style={styles.albumHeader}>
                    <View style={styles.cover}>
                      <Text>{JSON.stringify(coverArtURL)}</Text>
                      <Image
                        source={coverArtURL[albumKey] ? {uri: coverArtURL[albumKey]} : placeholderImg}
                        style={styles.coverImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.title}>
                      <Text style={styles.artistName}>{artist}</Text>
                      <Text style={styles.albumName}>{albumData.name} ({albumData.year})</Text>
                    </View>
                  </View>

                  <View style={styles.playlists}>
                    {Object.values(albumData.songs).map((song, index) => {
                      const songNumber = Object.values(song)[0];
                      const songName = Object.values(song)[1];
                      return (
                        <View key={index} style={styles.track}>
                          <TouchableOpacity onPress={() => playSong(index)}>
                            <Text style={styles.trackName}>{songNumber} - {songName}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => console.log('remove')}>
                            <Text>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = {
  playlistsSection: {
    //flex: 1,
    // Add your styles for the section container
  },
  header: {
    /*flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,*/
    // Add your styles for the header
  },
  back: {
    // Add your styles for the back icon
  },
  dropdown: {
    // Add your styles for the dropdown container
  },
  dropdownToggle: {
    // Add your styles for the dropdown toggle button
  },
  dropdownText: {
    // Add your styles for the dropdown toggle text
  },
  dropdownMenu: {
    // Add your styles for the dropdown menu
  },
  dropdownItem: {
    // Add your styles for the dropdown item
  },
  selected: {
    // Add your styles for the selected dropdown item
  },
  playlistsContainer: {
    flex: 1,
    // Add your styles for the playlists container
  },
  albumHeader: {
    flexDirection: 'row',
    // Add your styles for the album header
  },
  cover: {
    // Add your styles for the cover container
  },
  coverImage: {
    width: 45,
    height: 45,
    // Add your styles for the cover image
  },
  title: {
    // Add your styles for the title container
  },
  artistName: {
    // Add your styles for the artist name
  },
  albumName: {
    // Add your styles for the album name
  },
  playlists: {
    // Add your styles for the playlists container
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    // Add your styles for each track item
  },
  trackName: {
    flex: 1,
    // Add your styles for the track name
  },
  trackRemove: {
    // Add your styles for the track remove icon
  },
};

export default Playlists;
