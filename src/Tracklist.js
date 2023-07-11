import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import StyledText from '../customComponents/styledText';

const tracklistWidth = Dimensions.get('window').width - 4;

const Tracklist = ({
  playerPlaylist,
  tracklistsSongs,
  playSong,
  playlistItemsRemove,
  currentSong,
  applicationPlaylist
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontsLoaded] = useFonts({
    'Bronova': require('../assets/fonts/Bronova-Regular.ttf'),
    'Bronova Bold': require('../assets/fonts/Bronova-Bold.ttf'),
    'Roboto Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf')
  });

  const listHeight = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    Animated.timing(listHeight, {
      toValue: isOpen ? 680 : 120, // Valor final de flexBasis
      duration: 300, // Duración de la animación en milisegundos
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  if (!fontsLoaded) {
    return null;
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Animated.View style={[styles.tracklistSection, { height: listHeight }]}>
      <TouchableWithoutFeedback onPress={toggleOpen}>
        <View>
          {(playerPlaylist && playerPlaylist.id !== applicationPlaylist.id) ?
            <StyledText h2 style={styles.playlistTitle}>
              from{' '}
              {playerPlaylist
                ? playerPlaylist?.title
                : 'Seleccionar opción'}
            </StyledText>
            :
            <View style={styles.listDrawer}><View style={styles.drawerLine}></View></View>
          }
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        data={tracklistsSongs}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.trackItem,
              index === currentSong.track &&
              playerPlaylist.id === currentSong.playlistId
                ? styles.selectedTrack
                : null,
            ]}
            key={index}
          >
            {(index === currentSong.track && playerPlaylist.id === currentSong.playlistId) &&
              <View style={styles.trackPlaying}>
                <Ionicons name="md-volume-medium" size={24} color="#ebebeb" />
              </View>
            }
            <TouchableWithoutFeedback onPress={() => playSong(index, playerPlaylist.id)}>
              <View style={styles.trackContent}>
                <Text style={styles.trackName}>
                  {item.columns[3]} - {item.columns[4]}
                </Text>
                <Text style={styles.trackInfo}>
                  {item.columns[0]} - {item.columns[1]} ({item.columns[2]})
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => playlistItemsRemove(index)}>
              <View style={styles.trackRemove}>
                <MaterialCommunityIcons name="trash-can-outline" size={24} color="#ebebeb" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      />
    </Animated.View>
  );
};

const maxListHeight = Dimensions.get('screen').height - 80;

const styles = StyleSheet.create({
  tracklistSection: {
    width: tracklistWidth,
    maxWidth: tracklistWidth,
    maxHeight: maxListHeight,
    backgroundColor: 'rgba(45,45,45,.8)',
    top: 0,
    elevation: 1,
    borderTopStartRadius: 6,
    borderTopEndRadius: 6,
    overflow: 'hidden',
    alignSelf: 'center'
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
  trackContent: {
    flex: 7,
    justifyContent: 'flex-start'
  },
  trackName: {
    color: '#ebebeb',
    fontSize: 16
  },
  trackInfo: {
    color: '#ebebeb',
    fontSize: 12
  },
  trackRemove: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  trackPlaying: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingEnd: 12
  },
  listDrawer: {
    width: '100%',
    height: 12
  },
  drawerLine: {
    alignSelf: 'center',
    height: 6,
    width: 60,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  }
});

export default Tracklist;
