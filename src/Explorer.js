import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, SectionList } from 'react-native';
import StyledText from '../customComponents/styledText';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const Explorer = ({
  handlePageChange,
  currentPath,
  folders,
  setCurrentPath,
  rootMusicPath,
  playlistItemsAdd
}) => {
  const [isRoot, setIsRoot] = useState(true);

  useEffect(() => {
    const isThisRoot = !currentPath || currentPath === rootMusicPath;
    setIsRoot(isThisRoot);
  }, [currentPath, rootMusicPath]);

  const handleFolderClick = (path) => {
    setCurrentPath(path);
  };

  const handleUpClick = () => {
    if (currentPath) {
      console.log(currentPath);
      //const lastIndex = currentPath.lastIndexOf('/');
      const lastIndex = currentPath.lastIndexOf('\\');
      const upPath = lastIndex !== -1 ? currentPath.substring(0, lastIndex) : '';
      console.log(upPath);
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
          <MaterialIcons name="chevron-left" size={38} style={styles.back} color="#ebebeb" />
        </TouchableWithoutFeedback>
        <MaterialIcons name="folder" size={32} color="#ebebeb" />
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
                <TouchableWithoutFeedback
                  onPress={() => handleFolderClick(item.path)}
                  style={styles.artist}
                >
                  <View>
                    <StyledText h2 style={styles.artistName}>{item.name}</StyledText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <StyledText h1 style={styles.letter}>{title}</StyledText>
              )}
            />
          </>
        ) : (
          <>
            <View style={styles.container}>
              <StyledText h2>Albums</StyledText>
              <TouchableWithoutFeedback onPress={handleUpClick}>
                <MaterialIcons name="arrow-back" size={24} style={{marginTop: 1}} color="#ebebeb" />  
              </TouchableWithoutFeedback>

              {folders.map((folder) => (
                <React.Fragment key={folder.path}>
                  {folder.type === 'D' && (
                    <TouchableWithoutFeedback onPress={() => handleFolderClick(folder.path)}>
                      <View>
                        <StyledText style={styles.folderName}>{folder.name}</StyledText>
                        {/*<MdPlaylistPlay size={24} onPress={(ev) => playlistItemsAdd(ev, folder.path, true, true)} />*/}
                      </View>
                    </TouchableWithoutFeedback>
                  )}

                  {folder.type === 'F' && (
                    <>
                      <TouchableWithoutFeedback onPress={(ev) => playlistItemsAdd(ev, folder.path, true, true)}>
                        <View>
                          <StyledText style={styles.fileName}>{folder.name}</StyledText>
                        </View>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback onPress={(ev) => playlistItemsAdd(ev, folder.path, false, false)}>
                        <View>
                          <MaterialCommunityIcons name="playlist-plus" size={24} color="#ebebeb" />
                        </View>
                      </TouchableWithoutFeedback>
                    </>
                  )}
                </React.Fragment>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = {
  /*explorer: {
    flex: 1,
    width: '100%'
  },*/
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  back: {
    color: '#ebebeb',
    //fontSize: 24
  },
  navigationFolders: {
    paddingLeft: 12,
    paddingRight: 12
  },
  letter: {
    marginTop: 14,
    marginBottom: 0
  },
  artistsList: {
    marginTop: 10
  },
  artist: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingVertical: 8,
    height: 48
  },
  artistName: {
    flex: 1,
    overflow: 'hidden',
    //fontSize: 16
  },
  controls: {
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
