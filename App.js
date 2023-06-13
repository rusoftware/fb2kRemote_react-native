import Main from './src/Main';

// TODO:
// - parse *.cue files if possible in explorer view
// - Add settings screen to add Foobar2000 ip address
// - Check how to connect via wifi without the need to add the IP
// - setSelectedPlaylist(updateData.player.activeItem.playlistId) -->> lo que sucede es que no se puede trabajar con la selected playlist, pero de lo contrario, no se actualiza la lista de reproducción actual en home... Que hacemos?

export default function App() {
  return <Main />
}
