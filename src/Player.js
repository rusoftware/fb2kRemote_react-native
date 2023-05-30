import React from "react";
import { 
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions
} from 'react-native';
import { useFonts } from 'expo-font';
import { Slider } from '@miblanchard/react-native-slider';
import placeholderImg from '../assets/img/no-cover.jpeg';

const playerSize = Dimensions.get('window').width - 140;

const Player = ({
  albumCover,
  currentSong,
  songPosition,
  playing,
  handlePageChange,
  handlePlayerClick,
  updateSongPosition
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

  const formatTiming = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  
  return (
    <View style={styles.playerPage}>
      <View style={styles.player}>
        <View style={styles.currentlyPlaying}>
          <View style={styles.albumCover}>
            <Image 
              source={albumCover ? {uri: albumCover} : placeholderImg} 
              style={{ width: playerSize, height: playerSize }} />
          </View>

          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{ currentSong.title }</Text>
            <Text style={styles.songArtist}>{ currentSong.artist }</Text>
            <Text style={styles.songArtist}>{ currentSong.album } - { currentSong.year }</Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={currentSong.duration}
            value={songPosition}
            onValueChange={(e) => {
              const newPosition = parseInt(e.target.value, 10);
              updateSongPosition(newPosition);
            }}
            style={styles.rangeInput}
          />
          <View style={styles.timer}>
            <Text style={styles.trackBarText}>{formatTiming(songPosition)}</Text>
            <Text style={styles.trackBarText}>{formatTiming(currentSong.duration)}</Text>
          </View>

          <View style={styles.playerMenu}>
            <TouchableWithoutFeedback onPress={() => handlePageChange('playlists')}>
              <Text>Pl</Text>
            </TouchableWithoutFeedback>
            
            <View style={styles.playerButtons}>
              <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'previous')}>
                <Text style={styles.secondary}>prev</Text>
              </TouchableWithoutFeedback>

              {playing === 'stopped' ? (
                <TouchableWithoutFeedback style={styles.mainButton} onPress={(event) => handlePlayerClick(event, 'play')}>
                  <Text>Play</Text>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback style={styles.mainButton} onPress={(event) => handlePlayerClick(event, 'pause/toggle')}>
                  {playing === 'playing' ? <Text>Pause</Text> : <Text>Play</Text>}
                </TouchableWithoutFeedback>
              )}

              <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'next')}>
                <Text style={styles.secondary}>next</Text>
              </TouchableWithoutFeedback>
            </View>

            <TouchableWithoutFeedback onPress={() => handlePageChange('explorer')}>
              <Text>ex</Text>
            </TouchableWithoutFeedback>
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerPage: {
    width: '100%',
    //height: '100%',
  },
  player: {
    //height: 'calc(100% - 120px)',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 30,
    width: '100%',
  },
  currentlyPlaying: {
    width: '66%',
  },
  albumCover: {
    width: playerSize,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 14,
    elevation: 4,
  },
  albumCoverImage: {
    width: playerSize,
    aspectRatio: 1,
  },
  songInfo: {
    display: 'block',
    width: '100%',
    height: 120,
    overflow: 'hidden',
    marginHorizontal: 'auto',
    textAlign: 'left',
    paddingLeft: 3,
  },
  songTitle: {
    fontSize: 18,
    marginVertical: 0,
    fontFamily: 'Bronova',
    //fontFamily: 'Roboto',
    fontWeight: '400',
  },
  songArtist: {
    fontSize: 13,
    marginVertical: 2,
    fontFamily: 'Roboto',
  },
  playerControls: {
    width: '100%',
  },
  playerMenu: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '86%',
    marginHorizontal: 'auto',
  },
  playerButtons: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ebebeb',
    backgroundColor: 'transparent',
    borderRadius: 30,
    marginHorizontal: 32,
  },
  mainButtonIcon: {
    color: '#ebebeb',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  secondaryButtonIcon: {
    color: '#ebebeb',
  },
  progressBar: {
    marginVertical: 30,
  },
  rangeInput: {
    backgroundColor: '#D66D75',
    borderRadius: 8,
    height: 7,
    width: '86%',
    outline: 'none',
    transition: 'background 450ms ease-in',
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    cursor: 'ew-resize',
    backgroundColor: '#D66D75',
  },
  timer: {
    width: '86%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    fontFamily: 'Bronova',
  },
});

export default Player;
