import React, { useEffect, useState, useRef } from 'react';
import { 
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  SafeAreaView,
  ScrollView
} from 'react-native'
import StyledText from '../customComponents/styledText'
import Header from '../customComponents/header'
import { Ionicons, Fontisto } from '@expo/vector-icons'
import cheerio from 'react-native-cheerio'
import he from 'he'

const windowWidth = Dimensions.get('window').width

const Lyrics = ({
  handlePageChange,
  currentSong,
  playing,
  handlePlayerClick
}) => {
  
  const [lyrics, setLyrics] = useState('');
  const [lyricsUrls, setLyricsUrls] = useState([]);
  const [lyricSelected, setLyricSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (url, index) => {
    loadLyrics(url, index);
    setIsOpen(false);
  };

  const elementRef = useRef();

  // WITH GENIUS
  const GENIUS_ACCESS_TOKEN = "ktwb9gULBSUag4D_XvVFjgB3gj8AYMI2lin6LsQoDy_3bFHLT5_bCtlE_Y-dagl7";
  const GENIUS_API_URL = 'https://api.genius.com';
  const headers = {'Authorization': 'Bearer ' + GENIUS_ACCESS_TOKEN}

  const loadLyrics = async (songUrl, index = 0) => {
    try {
      const response = await fetch(songUrl, {
        method: 'GET',
        headers: headers
      });

      const parseResponse = await response.text();
      const $ = cheerio.load(parseResponse)

      const geniusLyrics = $('[data-lyrics-container="true"]').first().html();

      if (geniusLyrics) {
        const geniusLyricsSanitized = geniusLyrics.replace(/<br\s*\/?>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '');

        setLyrics(he.decode(geniusLyricsSanitized))
        setLyricSelected(index)
      }
    }
    catch (error) {
      console.error("error getting song lyrics from Genius", error)
    }
  }

  function normalizeAndRemovePunctuation(str) {
    return str.normalize("NFKD").replace(/[\u0300-\u036F]/g, "").replace(/[^\w\s]/g, "").toLowerCase();
  }
  
  const compareStrings = (string1, string2) => {
    const set1 = new Set(string1);
    const set2 = new Set(string2);
    
    const intersectionSize = [...set1].filter(character => set2.has(character)).length;
    const unionSize = set1.size + set2.size - intersectionSize;
  
    const similarityPercentage = (intersectionSize / unionSize) * 100;
  
    return similarityPercentage;
  };
  
  useEffect(() => {
    const player_artist_name = currentSong.artist;
    const player_song_name = currentSong.title;

    const getArtistInfo = async (page) => {
      if (player_song_name) {
        cleaned_song_name = player_song_name.replace(/^\d+\s*/, '');
      }
      const search_url = `${GENIUS_API_URL}/search?per_page=5&page=${page}&q=${player_artist_name} ${cleaned_song_name}`;

      try {
        const artistResult = await fetch(search_url, {
          method: 'GET',
          headers: headers
        });
        return artistResult;
      }
      catch (error) {
        console.log("Genius search error: ", error);
      }
    }

    requestSongUrl = async () => {
      let page = 1;
      const songs = [];

      setLyrics('');
      setLyricsUrls([]);
      
      try {
        const response = await getArtistInfo(page);
        const jsonResult = await response.json();

        const songInfo = jsonResult['response']['hits'].filter(hit => {
          const geniusArtistName = hit.result.artist_names;
          const geniusSongTitle = hit.result.title;

          if (geniusArtistName && geniusSongTitle && player_artist_name && cleaned_song_name) {
            const geniusArtistNameLower = normalizeAndRemovePunctuation(geniusArtistName);
            const playerArtistNameLower = normalizeAndRemovePunctuation(player_artist_name);
            const geniusSongTitleLower = normalizeAndRemovePunctuation(geniusSongTitle);
            const playerSongNameLower = normalizeAndRemovePunctuation(cleaned_song_name);
            const songTitleSimilarity = compareStrings(geniusSongTitleLower, playerSongNameLower);
        
            return geniusArtistNameLower.includes(playerArtistNameLower) && (geniusSongTitleLower.includes(playerSongNameLower) || songTitleSimilarity > 85);
          }
        
          return false;
        });

        let songsFound = [];

        if (songInfo.length) {
          for (const hit of songInfo) {
            songsFound.push(hit.result.url);
          }
        } else {
          setLyrics("Couldn't find any match");
        }

        if (songsFound.length) {
          //console.log(`found ${songsFound.length} songs`);
          setLyricsUrls(songsFound);

          await loadLyrics(songsFound[0]);
        }
        else {
          console.log("Couldn't find any lyrics");
        }
      }
      catch (error) {
        console.error("error connecting with Genius", error)
      }
    }

    requestSongUrl(currentSong.artist);

  },[currentSong.title]);

  
  return (
    <View style={styles.lyricsPage}>
      <Header
        title="Lyrics"
        handlePageChange={ handlePageChange }
        showHomeButton={ true }
        showExtraButton={lyricsUrls.length > 1 ? (
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View>
              <Ionicons name="document-text" size={20} color="#ebebeb" />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <Ionicons name="document-text" size={20} color="#ebebeb66" />
        )
      }
      />

      <Modal visible={isOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={toggleDropdown}>
        <View style={styles.dropdownMenu}>
          {lyricsUrls.map((url, index) => {
            return <TouchableWithoutFeedback key={index} onPress={() => handleOptionClick(url, index)} style={styles.dropdownItem}>
              <View style={styles.songUrlsContainer}>
                <StyledText big style={(lyricSelected === index) ? {color: '#ebebeb66'} : ''}>Lyrics option {index}</StyledText>
              </View>
            </TouchableWithoutFeedback>
          })}
        </View>
        </TouchableWithoutFeedback>
      </Modal>
      

      <SafeAreaView style={styles.lyricsView}>
        <View style={styles.songInfo}>
          <StyledText style={{fontSize: 18}}>{currentSong.title}</StyledText>
          <StyledText>{currentSong.album} - {currentSong.artist}</StyledText>
        </View>
        <ScrollView>
          <StyledText style={{fontSize: 16}}>
            { lyrics }
          </StyledText>
        </ScrollView>
        <View style={styles.playerControls}>
          <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'previous')}>
            <Fontisto name="backward" size={22} style={styles.playerIcons} />
          </TouchableWithoutFeedback>

          <View style={styles.mainButton}>
            {playing === 'stopped' ? (
              <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'play')}>
                <Ionicons name="play-circle" size={62} style={[styles.playerIcons, styles.playBtn]} />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'pause/toggle')}>
                {playing === 'playing' ? 
                  <Ionicons name="pause-circle" size={62} style={[styles.playerIcons, styles.playBtn]} />
                :
                  <Ionicons name="play-circle" size={62} style={[styles.playerIcons, styles.playBtn]} />
                }
              </TouchableWithoutFeedback>
            )}
          </View>

          <TouchableWithoutFeedback onPress={(event) => handlePlayerClick(event, 'next')}>
            <Fontisto name="forward" size={22} style={styles.playerIcons} />
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = {
  lyricsPage: {
    width: windowWidth - 20,
    maxWidth: windowWidth - 20,
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
  lyricsView: {
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexDirection: 'column',
    flex: 1
  },
  songInfo: {
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    alignItems: 'flex-start'
  },
  playerControls: {
    height: 60,
    maxHeight: 60,
    marginTop: 12,
    minWidth: windowWidth - 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-around'
  },
  mainButton: {
    marginHorizontal: 36,
    justifyContent: 'center',
    width: 62,
    height: 62,
    alignItems: 'center'
  },
  playerIcons: {
    color: '#ebebeb',
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
  songUrlsContainer: {
    maxHeight: Dimensions.get('window').height - 74,
    paddingHorizontal: 12,
  }
};

export default Lyrics;
