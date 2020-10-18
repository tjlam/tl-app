const { Component } = require("../../utils/Classes/Component");
const { getSongData } = require("../../utils/actions/spotifyActions");
const FILE_TEMPLATE =
  "./app/Components/MusicPlayerView/music-player-template.html";

class MusicPlayerView extends Component {
  constructor(initialProps) {
    super({ templateFileName: FILE_TEMPLATE, initialProps });
    this.currentSongText = "";
    this.currentProgress = null;
    this.songDurationText = "";
    this.songId = null;
  }

  async formatSongData(songId) {
    const { name, artists, album } = await getSongData(songId);
    const artistNames = artists.map((artist) => artist.name);
    const { name: albumName, images } = album;
    const imageUrl = images[0].url;

    return { name, artistNames, albumName, imageUrl };
  }

  updateSongLabel(songText, artistNames) {
    const artistText = artistNames.join(",");
    const songDescription = `${songText} - ${artistText}`;
    const SongLabel = this.template.querySelectorAll("#song-label");
    SongLabel[0].innerHTML = songDescription;
    this.currentSongText = songDescription;
  }

  updateAlbumArt(imageUrl) {
    const albumArt = this.template.querySelectorAll("#album-art-wrapper")[0];
    albumArt.style.backgroundImage = `url('${imageUrl}')`;
  }

  render(props) {
    if (this.songId !== props.songId) {
      this.songId = props.songId;
      this.formatSongData(props.songId).then(
        ({ name, artistNames, albumName, imageUrl }) => {
          this.updateSongLabel(name, artistNames);
          this.updateAlbumArt(imageUrl);
        }
      );
    }
  }
}

module.exports = {
  MusicPlayerView: MusicPlayerView,
};
