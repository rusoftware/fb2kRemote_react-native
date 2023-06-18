import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StyledText from '../customComponents/styledText';

const tracklistWidth = Dimensions.get('window').width - 4;

const Tracklist = ({
  selectedPlaylist,
  playlists,
  playSong,
  playlistItemsRemove,
  currentSong,
  tracklistsSongs
}) => {

  const [isOpen, setIsOpen] = useState(false);
  
  const [fontsLoaded] = useFonts({
    'Bronova': require('../assets/fonts/Bronova-Regular.ttf'),
    'Bronova Bold': require('../assets/fonts/Bronova-Bold.ttf'),
    'Roboto Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf')
  });

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.tracklistSection, isOpen && styles.listOpen]}>
      <TouchableWithoutFeedback onPress={toggleOpen}>
        <View>
          <StyledText h2 style={styles.playlistTitle}>
            from{' '}
            {selectedPlaylist
              ? playlists.find(
                  (currentPlaylist) => currentPlaylist.id === selectedPlaylist
                )?.title
              : 'Seleccionar opción'}
          </StyledText>
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        data={tracklistsSongs}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.trackItem,
              index === currentSong.track &&
              selectedPlaylist === currentSong.playlistId
                ? styles.selectedTrack
                : null,
            ]}
            key={index}
          >
            <TouchableWithoutFeedback onPress={() => playSong(index)}>
              <View>
                <Text style={styles.trackName}>
                  {item.columns[3]} - {item.columns[4]}
                </Text>
                <Text style={styles.trackInfo}>
                  {item.columns[0]} - {item.columns[1]} ({item.columns[2]})
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.trackRemove}
              onPress={() => playlistItemsRemove(index)}
            >
              <MaterialCommunityIcons
                name="playlist-remove"
                size={24}
                color="#ebebeb"
              />
            </TouchableWithoutFeedback>
          </View>
        )}
      />
    </View>
  );
};

const maxListHeight = Dimensions.get('screen').height - 80;

const styles = StyleSheet.create({
  tracklistSection: {
    width: tracklistWidth,
    maxWidth: tracklistWidth,
    maxHeight: maxListHeight,
    height: maxListHeight,
    backgroundColor: 'rgba(45,45,45,.8)',
    flexBasis: 120,
    top: 0,
    elevation: 1,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  listOpen: {
    flexBasis: 680
  },
  playlistTitle: {
    textAlign: 'right',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, .2)'
  },
  tracklist: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  trackItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.1)',
    textAlign: 'left',
    lineHeight: '2em',
    justifyContent: 'space-between'
  },
  selectedTrack: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  trackName: {
    flex: 7,
    color: '#ebebeb',
    fontSize: 16
  },
  trackInfo: {
    color: '#ebebeb',
    fontSize: 12
  },
  trackRemove: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default Tracklist;
