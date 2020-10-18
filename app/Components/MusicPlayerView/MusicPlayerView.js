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
    this.position = 0;
    this.duration = Number.MAX_SAFE_INTEGER;
    this.playerIsPaused = true;
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
    const SongLabel = this.template.querySelectorAll("#song-label")[0];
    SongLabel.innerHTML = songDescription;
    this.currentSongText = songDescription;
  }

  updateAlbumArt(imageUrl) {
    const albumArt = this.template.querySelectorAll("#album-art-wrapper")[0];
    albumArt.style.backgroundImage = `url('${imageUrl}')`;
  }

  updateSongTime(position) {
    const currentTimeText = this.msToTime(position);
    const currentTime = this.template.querySelectorAll("#time-label")[0];
    currentTime.innerHTML = currentTimeText;
  }

  updateSongDuration(duration) {
    this.duration = duration;
    const durationText = this.msToTime(duration);
    const durationTime = this.template.querySelectorAll("#duration-label")[0];
    durationTime.innerHTML = durationText;
  }

  updatePosition(position, duration) {
    if (position > duration) {
      return;
    }
    this.position = position;
    const MAX_WIDTH = 391;
    const percentageComplete = position / duration;
    const progressBar = this.template.querySelectorAll(
      "#progress-bar-position"
    )[0];
    progressBar.style.width = `${percentageComplete * MAX_WIDTH}px`;
  }

  incrementPosition() {
    if (this.playerIsPaused) {
      console.log(`incrment`, this.playerIsPaused);
      return;
    }
    this.updatePosition(this.position + 1000, this.duration);
    this.updateSongTime(this.position + 1000);
  }

  msToTime(ms) {
    const stringTime = (num) => (num > 9 ? num : `0${num}`);
    const seconds = Math.floor((ms / 1000) % 60);
    const mins = Math.floor(ms / 1000 / 60);
    return `${stringTime(mins)}:${stringTime(seconds)}`;
  }

  render(props) {
    const { songId, playerEvent, position, duration } = props;
    if (songId && this.songId !== songId) {
      this.songId = songId;
      this.formatSongData(songId).then(
        ({ name, artistNames, albumName, imageUrl }) => {
          this.updateSongLabel(name, artistNames);
          this.updateAlbumArt(imageUrl);
          this.updateSongDuration(duration);
        }
      );
    }

    if (playerEvent) {
      this.playerIsPaused = playerEvent === "paused";
      console.log("state changed", this.playerIsPaused);
    }

    if (duration || position) {
      this.updateSongDuration(duration);
      this.updateSongTime(position);
      this.updatePosition(position, duration);
    }
  }
}

module.exports = {
  MusicPlayerView: MusicPlayerView,
};
