import React, { useRef, useEffect, useState } from 'react';
import { 
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native'
import { Slider } from '@miblanchard/react-native-slider'
import StyledText from '../customComponents/styledText'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'


const windowWidth = Dimensions.get('window').width

const Volume = ({
  volume,
  handlePageChange,
  updateVolume
}) => {

  const elementRef = useRef()
  const [volumeText, setVolumeText] = useState(volume.value)

  useEffect(() => {
    setVolumeText(Math.round(volume.value))
  }, [volume.value])

  return (
    <View style={styles.volumePage}>
      <View style={styles.header} ref={elementRef}>
        <TouchableWithoutFeedback onPress={() => handlePageChange('player')}>
          <View>
            <MaterialIcons name="chevron-left" size={38} style={styles.back} color="#ebebeb" />
          </View>
        </TouchableWithoutFeedback>
        <StyledText style={styles.textHeader}>Volume control</StyledText>
      </View>

      <SafeAreaView style={styles.volumeControl}>
        <View style={styles.volumeMain}>
        <TouchableWithoutFeedback onPress={() => {
          if (volume.value < volume.max) {
            updateVolume(volume.value + 1)
          }
        }
        }>
          <View>
            <MaterialCommunityIcons name="plus-thick" size={60} style={styles.controlIcons} />
          </View>
        </TouchableWithoutFeedback>
        <StyledText style={{fontSize: 100}}>
         { Math.round(volumeText) }
        </StyledText>
        <TouchableWithoutFeedback onPress={() => {
          if (volume.value > volume.min) {
            updateVolume(volume.value - 1)
          }
        }
        }>
          <View>
            <MaterialCommunityIcons name="minus-thick" size={60} style={styles.controlIcons} />
          </View>
        </TouchableWithoutFeedback>
        </View>
        
        <View style={styles.volumeSlider}>
          <Slider
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={ Math.round(volume.value) }
            onValueChange={(newValue) => setVolumeText(Math.round(newValue))}
            onSlidingComplete={(newValue) => {
              if ( newValue >= volume.min && newValue <= volume.max) {
                updateVolume(newValue)
              }
            }}
            style={styles.rangeInput}
            thumbStyle={styles.thumb}
            trackStyle={styles.track}
            minimumTrackStyle={styles.minimumTrackStyle}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = {
  volumePage: {
    width: windowWidth,
    maxWidth: windowWidth,
    overflow: 'hidden',
    alignSelf: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 50,
  },
  textHeader: {
    paddingTop: 8,
    paddingHorizontal: 8
  },
  volumeControl: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    flex: 1
  },
  controlIcons: {
    color: '#ebebeb',
    paddingTop: 40,
    paddingBottom: 40
  },
  volumeMain: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  volumeSlider: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: 'auto',
    width: windowWidth - 60,
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
    cursor: 'ew-resize',
    backgroundColor: '#ebebeb',
  },
  track: {
    backgroundColor: '#ebebeb33'
  },
  minimumTrackStyle: {
    backgroundColor: '#ebebeb66'
  }
};

export default Volume;
