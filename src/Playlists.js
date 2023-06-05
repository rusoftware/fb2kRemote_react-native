import React, { useEffect, useState } from 'react';
import { View, Modal, Dimensions, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedPlaylist(option);
    setIsOpen(false);
  };

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
                  <View style={styles.dropdownItem}>
                    <StyledText big>{pl.title}</StyledText>
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
                      <Image 
                        source={albumData.coverArt._j ? {uri: albumData.coverArt._j} : placeholderImg} 
                        style={styles.coverImage} 
                        resizeMode='cover' />
                    </View>
                    <View style={styles.title}>
                      <StyledText h2 style={styles.artistName}>{artist}</StyledText>
                      <StyledText h1 style={styles.albumName}>{albumData.name} ({albumData.year})</StyledText>
                    </View>
                  </View>

                  <View style={styles.playlists}>
                    {Object.values(albumData.songs).map((song, index) => {
                      const songNumber = Object.values(song)[0];
                      const songName = Object.values(song)[1];
                      const songIndex = Object.values(song)[2];
                      return (
                        <View key={index} style={styles.track}>
                          <TouchableWithoutFeedback onPress={() => playSong(songIndex)}>
                            <View style={styles.trackName}>
                              <StyledText h2>{songNumber} - {songName}</StyledText>
                            </View>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback onPress={() => console.log('remove')}>
                            <View style={styles.trackRemove}>
                              <MaterialCommunityIcons name="playlist-remove" size={24} color="#ebebeb" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 50,
  },
  dropdownToggle: {
    paddingTop: 8,
    paddingRight: 8
  },
  dropdownMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  dropdownItem: {
    marginBottom: 14
  },
  playlistsContainer: {
    maxHeight: Dimensions.get('window').height - 74,
    paddingHorizontal: 12,
  },
  albumHeader: {
    flexDirection: 'row',
    marginTop: 26,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: '#ebebeb',
    alignItems: 'center',
    maxWidth: '100%'
  },
  cover: {
    marginRight: 15,
    marginTop: 4
  },
  coverImage: {
    width: 45,
    height: 45
  },
  title: {
    width: Dimensions.get('window').width - 84 // 45 image + 15 margin image + 24 (paddingHorizontal 12)
  },
  track: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingVertical: 8,
    minHeight: 48,
    justifyContent: 'space-between'
  },
  trackName: {
    flexGrow: 1,
  },
  trackRemove: {
    alignSelf: 'center',
    textAlign: 'right',
    marginLeft: 8
  }
};

export default Playlists;
