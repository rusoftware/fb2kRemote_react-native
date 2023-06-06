import React, { useState, useEffect } from 'react'
import { View, Dimensions, TouchableWithoutFeedback, SectionList, ScrollView } from 'react-native'
import StyledText from '../customComponents/styledText'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

const screentWidth = Dimensions.get('window').width

const Explorer = ({
  handlePageChange,
  currentPath,
  folders,
  setCurrentPath,
  rootMusicPath,
  playlistItemsAdd
}) => {
  const [isRoot, setIsRoot] = useState(true)

  useEffect(() => {
    const isThisRoot = !currentPath || currentPath === rootMusicPath;
    setIsRoot(isThisRoot);
  }, [currentPath, rootMusicPath]);

  const handleFolderClick = (path) => {
    setCurrentPath(path);
  };

  const handleUpClick = () => {
    if (currentPath) {
      //const lastIndex = currentPath.lastIndexOf('/');
      const lastIndex = currentPath.lastIndexOf('\\');
      const upPath = lastIndex !== -1 ? currentPath.substring(0, lastIndex) : '';
      setCurrentPath(upPath);
    }
  };

  const groupFoldersByLetter = (folders) => {
    return folders.reduce((result, folder) => {
      if (folder.type === 'D') {
        const firstLetter = folder.name.charAt(0).toUpperCase();
        if (!result[firstLetter]) {
          result[firstLetter] = [];
        }
        result[firstLetter].push(folder);
      }
      return result;
    }, {});
  };

  const groupedFolders = groupFoldersByLetter(folders);

  return (
    <View style={styles.explorer}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => handlePageChange('player')}>
          <View>
            <MaterialIcons name="chevron-left" size={38} style={styles.back} color="#ebebeb" />
          </View>
        </TouchableWithoutFeedback>
        <StyledText style={styles.textExplorer}>Explorer</StyledText>
      </View>

      <View style={styles.navigationFolders}>
        {isRoot ? (
          <>
            <SectionList
              sections={Object.entries(groupedFolders).map(([letter, data]) => ({
                title: letter,
                data: data
              }))}
              keyExtractor={(item, index) => item.path + index}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => handleFolderClick(item.path)}>
                  <View style={styles.artist}>
                    <StyledText h2 style={styles.artistName}>{item.name}</StyledText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <StyledText big style={styles.letter}>{title}</StyledText>
              )}
            />
          </>
        ) : (
          <>
            <ScrollView style={styles.container}>
              <StyledText big>Albums</StyledText>
              <TouchableWithoutFeedback onPress={handleUpClick}>
                <MaterialIcons name="arrow-back" size={24} style={{marginTop: 1}} color="#ebebeb" />  
              </TouchableWithoutFeedback>

              {folders.map((folder) => (
                <React.Fragment key={folder.path}>
                  {folder.type === 'D' && (
                    <View style={[styles.row, styles.artist]}>
                      <View style={styles.artistName}>
                        <TouchableWithoutFeedback onPress={() => handleFolderClick(folder.path)}>
                          <View>
                            <StyledText>{folder.name}</StyledText>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      <View style={styles.controls}>
                        <TouchableWithoutFeedback onPress={(ev) => playlistItemsAdd(ev, folder.path, true, true)}>
                          <View>
                            <MaterialCommunityIcons name="playlist-play" size={24} color="#ebebeb" />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  )}

                  {folder.type === 'F' && (
                    <View style={[styles.row, styles.artist]}>
                      <View  style={styles.fileName}>
                        <TouchableWithoutFeedback onPress={(ev) => playlistItemsAdd(ev, folder.path, true, true)}>
                          <View>
                            <StyledText>{folder.name}</StyledText>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      <View style={styles.controls}>
                        <TouchableWithoutFeedback onPress={(ev) => playlistItemsAdd(ev, folder.path, false, false)}>
                          <View>
                            <MaterialCommunityIcons name="playlist-plus" size={24} color="#ebebeb" />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 50
  },
  textExplorer: {
    paddingTop: 8
  },
  container: {
    marginTop: 20,
    maxHeight: Dimensions.get('window').height - 100
  },
  navigationFolders: {
    paddingLeft: 12,
    paddingRight: 12
  },
  letter: {
    marginTop: 20,
    marginBottom: 0
  },
  artist: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingVertical: 8,
    minHeight: 48
  },
  row: {
    width: '100%',
    flexDirection: 'row'
  },
  artistName: {
    flexGrow: 1,
    maxWidth: Dimensions.get('window').width - 53
  },
  fileName: {
    flexGrow: 1,
    maxWidth: Dimensions.get('window').width - 53
  },
  controls: {
    alignSelf: 'center',
    textAlign: 'right',
    marginLeft: 8
  },
  title: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: 16,
    fontWeight: 'bold'
  },
  arrowLeft: {
    marginTop: 20
  }
};

export default Explorer;
