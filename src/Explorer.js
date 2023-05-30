import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

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
      const lastIndex = currentPath.lastIndexOf('/');
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
        <TouchableOpacity onPress={() => handlePageChange('player')}>
          <MaterialIcons name="chevron-left" size={24} style={styles.back} />
        </TouchableOpacity>
        <MaterialIcons name="folder" size={32} />
      </View>

      <View style={styles.navigationFolders}>
        {isRoot ? (
          <>
            {Object.keys(groupedFolders).map((letter) => (
              <View key={letter}>
                <Text style={styles.letter}>{letter}</Text>
                <View style={styles.artistsList}>
                  {groupedFolders[letter].map((folder) => (
                    <TouchableOpacity
                      key={folder.path}
                      onPress={() => handleFolderClick(folder.path)}
                      style={styles.artist}
                    >
                      <Text style={styles.artistName}>{folder.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.title}>Albums</Text>
            <TouchableOpacity onPress={handleUpClick}>
              <FontAwesome name="arrow-left" size={24} style={styles.arrowLeft} />
            </TouchableOpacity>

            <View style={styles.artistsList}>
              {folders.map((folder) => (
                <React.Fragment key={folder.path}>
                  {folder.type === 'D' && (
                    <TouchableOpacity
                      onPress={() => handleFolderClick(folder.path)}
                      style={styles.artist}
                    >
                      <Text style={styles.artistName}>{folder.name}</Text>
                      <TouchableOpacity onPress={(ev) => playlistItemsAdd(ev, folder.path, true, true)}>
                        <MaterialCommunityIcons name="playlist-play" size={24} style={styles.controls} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}

                  {folder.type === 'F' && (
                    <TouchableOpacity onPress={(ev) => playlistItemsAdd(ev, folder.path, true, true)} style={styles.artist}>
                      <Text style={styles.artistName}>{folder.name}</Text>
                      <TouchableOpacity onPress={(ev) => playlistItemsAdd(ev, folder.path, false, false)}>
                        <MaterialIcons name="playlist-add" size={24} style={styles.controls} />
                      </TouchableOpacity>
                    </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  back: {
    color: '#000',
    fontSize: 24
  },
  navigationFolders: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  },
  letter: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: 16,
    fontWeight: 'bold'
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
    fontSize: 16
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
  }*/
};

export default Explorer;
