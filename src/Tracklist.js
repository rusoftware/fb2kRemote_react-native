import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';

const Tracklist = ({
  selectedPlaylist,
  playlists,
  tracklistsSongs,
  playSong,
  playlistItemsRemove,
  currentSong,
}) => {

  const [fontsLoaded] = useFonts({
    'Bronova': require('../assets/fonts/Bronova-Regular.ttf'),
    'Bronova Bold': require('../assets/fonts/Bronova-Bold.ttf'),
    'Roboto Light': require('../assets/fonts/Roboto-Light.ttf'),
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf')
  });

  if (!fontsLoaded) {
    return;
  }

  return (
    <View style={styles.tracklistSection}>
      <Text style={styles.playlistTitle}>
        from{' '}
        {selectedPlaylist
          ? playlists.find(
              (currentPlaylist) => currentPlaylist.id === selectedPlaylist
            )?.title
          : 'Seleccionar opción'}
      </Text>
      <View>
        <View style={styles.tracklist}>
          {tracklistsSongs.map((track, index) => (
            <TouchableOpacity
              style={[
                styles.trackItem,
                index === currentSong.track &&
                selectedPlaylist === currentSong.playlistId
                  ? styles.selectedTrack
                  : null,
              ]}
              onPress={() => playSong(index)}
              key={index}
            >
              <Text style={styles.trackName}>
                {track.columns[3]} - {track.columns[4]}
              </Text>
              <Text style={styles.trackInfo}>
                {track.columns[0]} - {track.columns[1]} ({track.columns[2]})
              </Text>
              <TouchableOpacity
                style={styles.trackRemove}
                onPress={() => playlistItemsRemove(index)}
              >
                {/*<MaterialIcons name="playlist-remove" size={24} color="black" />*/}
                <Text>remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tracklistSection: {
    width: '100%',
    maxHeight: '100%',
    backgroundColor: 'rgba(45,45,45,.3)',
  },
  playlistTitle: {
    textAlign: 'right',
    //padding: '1em 2em',
    //fontSize: '.8em',
    backgroundColor: 'rgba(0, 0, 0, .2)',
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
    //width: 'calc(100% - 1em)',
    //padding: '.5em .5em .2em',
    borderWidth: '1px 0',
    borderColor: 'rgba(255,255,255,.1)',
    textAlign: 'left',
    lineHeight: '2em',
    justifyContent: 'space-between',
  },
  selectedTrack: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
  },
  trackName: {
    flex: 7,
    //overflow: 'hidden',
    //lineHeight: '1.2em',
    //color: 'black'
  },
  trackInfo: {
    //fontSize: '.7em',
  },
  trackRemove: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default Tracklist;
