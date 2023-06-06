# Foobar2000 Remote Control App

> The Foobar2000 Remote Control App is a mobile application built with React Native and Expo. It allows users to remotely control their foobar2000 music player from their mobile devices.

## Problem Statement

I often have my computer connected to my hi-fi sound system for music playback, but I don't have a 32ft USB cable. As a result, I have to leave the sofa every time I want to change songs.

## Solution & Features

This application allows me to control Foobar2000 remotely from my cellphone. Not only does it provide remote control functionality, but it also offers a sleek music player experience with the following features:

- Connect to foobar2000 running on your computer via Wi-Fi.
- Song Information: View album covers, track names, albums, artists, and years.
- Media Control: Previous, play, pause, next, and a slider to adjust the track position.
- Browse and search your music library.
- Create and manage playlists.
- Music Library Navigation: Explore folders in your computer's music library, select songs, and add them to a specific playlist.


## Prerequisites

Before getting started, make sure you have the following prerequisites installed:

- Node.js and npm (Node Package Manager)
- Expo CLI: `npm install -g expo-cli`
- Foobar2000 running in a computer connected to your home wifi
- Install Beefweb component for Foobar2000


1. Clone the repository:

  ```shell
  git clone https://github.com/your-username/foobar2000-remote.git
  ```

2. Navigate to the project directory: 
  ```shell
  cd foobar2000-remote
  ```

3. Install the dependencies:
  ```shell
  npm i
  ```

4. Start the development server

  ```shell
  npm start
  ```

5. Follow the instructions from the terminal to run the app on a physical device or emulator using the Expo Client app.

6. Configuration
To connect the app with your foobar2000 music player, follow these steps:


## Foobar2000 setup and configuration:
This app uses the component Beefweb to provide the API: https://www.foobar2000.org/components/view/foo_beefweb

You need to install Beefweb component in your Foobar2000 aplication and then make sure you have set the correct port, in my case I'm using :8880

Please set the correct url in the config.js file: 

```shell
const API = 'http://your-ip-local-address:8880';
```

> You can use your internal address (inet). To know it you can use the command `ifconfig`


## Build:
You can build a `aab` (android pack bundle) file, optimized for Google Play Store distribution using the following command:

```shell
eas build -p android
```

That aab file cannot be installed directly in your mobile, to build an `apk` version, you can do:

```shell
eas build -p android --profile preview
```