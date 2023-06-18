import React, { useState } from "react";
import { 
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import StyledText from "../customComponents/styledText"
import Header from "../customComponents/header";
import { AntDesign, Ionicons, MaterialIcons, Fontisto } from '@expo/vector-icons'

const playerSize = Dimensions.get('window').width - 30
const windowWidth = Dimensions.get('window').width

const Player = ({
  albumCover,
  currentSong,
  songPosition,
  playing,
  selectedPlaylist,
  playlists,
  handlePageChange,
  handlePlayerClick,
  updateSongPosition
}) => {

  const formatTiming = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
  return (
    <View style={styles.playerPage}>
      <Header
        title={
          <TouchableWithoutFeedback onPress={() => handlePageChange('playlists')}>
            <View><StyledText>
              {selectedPlaylist
              ? playlists.find(
                  (currentPlaylist) => currentPlaylist.id === selectedPlaylist
                )?.title
              : 'Seleccionar opción'}
            </StyledText>
            </View>
          </TouchableWithoutFeedback>
        }
        showExtraButton={
          <TouchableWithoutFeedback onPress={() => handlePageChange('explorer')}>
            <MaterialIcons name="folder" size={18} style={styles.playerIcons}/>
          </TouchableWithoutFeedback>
        }
        showHomeButton={ false }
        handlePageChange={handlePageChange}
      />
      
      <View style={styles.player}>
        <View style={styles.currentlyPlaying}>
          <View style={styles.albumCover}>
            <ImageBackground source={ require('../assets/img/album-bg.png') } resizeMode="cover" style={{flex: 1}}>
              <Image
                source={{ uri: albumCover }}
                style={styles.albumCoverImage} />
            </ImageBackground>
          </View>
          <View style={styles.songInfo}>
            <StyledText h1>{ currentSong.title }</StyledText>
            <StyledText h2>{ currentSong.artist }</StyledText>
            <StyledText h2>{ currentSong.album } - { currentSong.year }</StyledText>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
            <Slider
              minimumValue={0}
              maximumValue={currentSong.duration}
              value={songPosition}
              onValueChange={(newValue) => {
                const newPosition = parseInt(newValue, 10);
                updateSongPosition(newPosition);
              }}
              style={styles.rangeInput}
              thumbStyle={styles.thumb}
              trackStyle={styles.track}
              minimumTrackStyle={styles.minimumTrackStyle}
            />
            <View style={styles.timer}>
              <StyledText small>{formatTiming(songPosition)}</StyledText>
              <StyledText small>{formatTiming(currentSong.duration)}</StyledText>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => handlePageChange('volume')}>
            <Ionicons name="md-volume-medium" size={24} style={styles.playerIcons} />
          </TouchableWithoutFeedback></View>

          <View style={styles.playerMenu}>
            <View style={styles.playerButtons}>
              <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'previous')}>
                <Fontisto name="backward" size={22} style={styles.playerIcons} />
              </TouchableWithoutFeedback>

              <View style={styles.mainButton}>
                {playing === 'stopped' ? (
                  <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'play')}>
                    <Ionicons name="md-play" size={40} style={[styles.playerIcons, styles.playBtn]} />
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'pause/toggle')}>
                    {playing === 'playing' ? 
                      <AntDesign name="pause" size={42} style={styles.playerIcons} />
                    :
                      <Ionicons name="md-play" size={40} style={[styles.playerIcons, styles.playBtn]} />
                    }
                  </TouchableWithoutFeedback>
                )}
              </View>

              <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'next')}>
                <Fontisto name="forward" size={22} style={styles.playerIcons} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerPage: {
    width: windowWidth,
    maxWidth: windowWidth,
    overflow: 'hidden',
    alignSelf: 'center',
    flex: 1
  },
  player: {
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  albumCover: {
    marginTop: 30,
    marginBottom: 16,
    width: playerSize,
    height: playerSize,
    alignSelf: 'center',
    backgroundColor: 'black',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20, //20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 4
  },
  albumCoverImage: {
    aspectRatio: 1
  },
  currentlyPlaying: {
  },
  songInfo: {
    maxWidth: playerSize,
    paddingLeft: 3
  },
  progressBarContainer: {
    width: playerSize,
    maxWidth: playerSize,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressBar: {
    marginVertical: 20,
    width: windowWidth - 86
  },
  rangeInput: {
    backgroundColor: '#D66D75',
    borderRadius: 8,
    height: 17,
    outline: 'none',
    transition: 'background 450ms ease-in',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ebebeb',
  },
  track: {
    backgroundColor: '#ebebeb33'
  },
  minimumTrackStyle: {
    backgroundColor: '#ebebeb66'
  },
  timer: {
    marginHorizontal: 'auto',
    marginTop: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3
  },
  playerMenu: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 'auto',
  },
  playerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    marginHorizontal: 26,
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center'
  },
  playerIcons: {
    color: '#ebebeb'
  },
  playBtn: {
    paddingLeft: 5
  }
});

export default Player;
