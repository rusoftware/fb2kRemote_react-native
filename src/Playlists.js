import React, { useEffect, useState } from 'react';
import { View, Modal, Dimensions, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import StyledText from '../customComponents/styledText';
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
        <TouchableWithoutFeedback onPress={() => handlePageChange('player')}>
          <View>
            <MaterialIcons name="chevron-left" size={38} style={styles.back} color="#ebebeb" />
          </View>
        </TouchableWithoutFeedback>
        
        <TouchableWithoutFeedback onPress={toggleDropdown}>
          <View style={styles.dropdownToggle}>
            <StyledText style={styles.dropdownText}>
              {selectedPlaylist
                ? `from: ${playlists.find((currentPlaylist) => currentPlaylist.id === selectedPlaylist)?.title}`
                : 'Seleccionar opción'}
            </StyledText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <Modal visible={isOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback  onPress={toggleDropdown}>
        <View style={styles.dropdownMenu}>
          {playlists.map((pl) => {
            if (pl.id !== selectedPlaylist) {
              return (
                <TouchableWithoutFeedback
                  key={pl.id}
                  style={[
                    styles.dropdownItem,
                    selectedPlaylist === pl.id ? styles.selected : null,
                  ]}
                  onPress={() => handleOptionClick(pl.id)}
                >
                  <View>
                    <StyledText>{pl.title}</StyledText>
                  </View>
                </TouchableWithoutFeedback>
              );
            } else {
              return null;
            }
          })}
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView style={styles.playlistsContainer}>
        {Object.entries(selectedPlaylistSongs).map(([artist, albums]) => (
          <View key={artist}>
            {Object.entries(albums).map(([albumKey, albumData]) => {
              return (
                <View key={albumKey}>
                  <View style={styles.albumHeader}>
                    <View style={styles.cover}>
                      <StyledText>{JSON.stringify(coverArtURL)}</StyledText>
                      <Image
                        source={coverArtURL[albumKey] ? {uri: coverArtURL[albumKey]} : placeholderImg}
                        style={styles.coverImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.title}>
                      <StyledText style={styles.artistName}>{artist}</StyledText>
                      <StyledText style={styles.albumName}>{albumData.name} ({albumData.year})</StyledText>
                    </View>
                  </View>

                  <View style={styles.playlists}>
                    {Object.values(albumData.songs).map((song, index) => {
                      const songNumber = Object.values(song)[0];
                      const songName = Object.values(song)[1];
                      return (
                        <View key={index} style={styles.track}>
                          <TouchableWithoutFeedback onPress={() => playSong(index)}>
                            <View>
                              <StyledText style={styles.trackName}>{songNumber} - {songName}</StyledText>
                            </View>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback onPress={() => console.log('remove')}>
                            <View>
                              <StyledText>Remove</StyledText>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
        
    </View>
  );
};

const styles = {
  playlistsSection: {
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 50,
  },
  back: {
    // Add your styles for the back icon
  },
  dropdown: {
    // Add your styles for the dropdown container
  },
  dropdownToggle: {
    paddingTop: 8,
    paddingRight: 8
  },
  dropdownText: {
    // Add your styles for the dropdown toggle text
  },
  dropdownMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownItem: {
    // Add your styles for the dropdown item
  },
  selected: {
    backgroundColor: '#00000066'
    // Add your styles for the selected dropdown item
  },
  playlistsContainer: {
    maxHeight: Dimensions.get('window').height - 74
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
    //flex: 1,
    // Add your styles for the track name
  },
  trackRemove: {
    // Add your styles for the track remove icon
  },
};

export default Playlists;
