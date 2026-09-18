const audio = document.querySelector("audio");
const cover = document.querySelector(".song-info img");
const library = document.querySelector(".library");

const libraryLink = document.getElementById("library-link");
let librarySongs = Array.from(document.querySelectorAll(".library-song"));
let playStatus = false;

libraryLink.addEventListener("click", openLibrary);

function openLibrary() {
  if (library.classList.contains("library-opened")) {
    library.classList.remove("library-opened");
    libraryLink.classList.remove("library-opened-link");
  } else {
    library.classList.add("library-opened");
    libraryLink.classList.add("library-opened-link");
  }
}

librarySongs.forEach((song) => {
  song.addEventListener("click", (e) => {
    librarySongs.forEach((otherSong) => {
      otherSong.classList.remove("selected");
    });
    e.target.classList.add("selected");
    songId = song.id;
    songs.filter((selectedSong) => {
      if (selectedSong.id == song.id) {
        playSong(selectedSong);
      }
    });
  });
});

const name = document.querySelector(".song-info h2");
const artist = document.querySelector(".song-info h3");
const number = document.querySelector(".song-info h5");
const durationInput = document.querySelector(".player input");
const currentTime = document.querySelector(".player span");

// OS 잠금화면 / 상단바 미디어 세션 동기화 함수
function updateMediaSession(song) {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song.artist,
      album: "메이플스토리 BGM",
      artwork: [
        { src: song.cover, sizes: "96x96", type: "image/png" },
        { src: song.cover, sizes: "128x128", type: "image/png" },
        { src: song.cover, sizes: "192x192", type: "image/png" },
        { src: song.cover, sizes: "256x256", type: "image/png" },
        { src: song.cover, sizes: "384x384", type: "image/png" },
        { src: song.cover, sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      if (!playStatus) playPause();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      if (playStatus) playPause();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => skipSong("backward"));
    navigator.mediaSession.setActionHandler("nexttrack", () => skipSong("forward"));
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) {
        audio.currentTime = details.seekTime;
        updatePositionState();
      }
    });
  }
}

// OS 상태바 진행 시간 동기화
function updatePositionState() {
  if ("mediaSession" in navigator && "setPositionState" in navigator.mediaSession) {
    if (audio.duration && !isNaN(audio.duration)) {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    }
  }
}

function playSong(song) {
  cover.setAttribute("src", song.cover);
  name.innerText = song.name;
  artist.innerText = song.artist;
  number.innerText = song.number;
  audio.setAttribute("src", song.audio);
  
  // 진행 상태바 핸들(Thumb)에 현재 곡 앨범 아트 적용
  durationInput.style.setProperty("--thumb-img", `url("${encodeURI(song.cover)}")`);
  
  // OS 미디어 상태바 연동
  updateMediaSession(song);

  playStatus = false;
  playPause();
}

//*player control actions
//play||pause action
const playPauseIcon = document.getElementById("play-pause");

playPauseIcon.addEventListener("click", () => {
  playPause();
});

function playPause() {
  if (playStatus === false) {
    playPauseIcon.className = "fas fa-pause";
    audio.play();
    cover.classList.add("playing");
    playStatus = true;
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "playing";
    }
  } else {
    playPauseIcon.className = "fa fa-play-circle";
    audio.pause();
    cover.classList.remove("playing");
    playStatus = false;
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "paused";
    }
  }
}

//* sound volume control
const volume = document.querySelector(".sound-control input");
volume.addEventListener("input", () => {
  audio.volume = volume.value / 100;
});
volume.addEventListener("change", () => {
  audio.volume = volume.value / 100;
});

//*defining audio and song info
//format current/duration time
function timeFormat(time) {
  return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);
}

audio.addEventListener("loadedmetadata", () => {
  const endTime = document.querySelector(".player span:last-child");
  durationInput.value = audio.currentTime;
  durationInput.setAttribute("max", audio.duration);
  currentTime.innerText = `${timeFormat(audio.currentTime)}`;
  endTime.innerText = `${timeFormat(audio.duration)}`;
  updatePositionState();
});

audio.addEventListener("timeupdate", () => {
  durationInput.value = audio.currentTime;
  currentTime.innerText = `${timeFormat(audio.currentTime)}`;
  
  const gauge = document.querySelector(".player div div");
  if (gauge && audio.duration) {
    gauge.style.left = `${(audio.currentTime / audio.duration) * 100}%`;
  }
  
  updatePositionState();
});

// 진행바 드래그 및 터치 즉각 반영
durationInput.addEventListener("input", () => {
  audio.currentTime = durationInput.value;
  currentTime.innerText = `${timeFormat(durationInput.value)}`;
  updatePositionState();
});

durationInput.addEventListener("change", () => {
  audio.currentTime = durationInput.value;
  updatePositionState();
});

//*skipping back/forward
const back = document.getElementById("backward");
const forward = document.getElementById("forward");
back.addEventListener("click", () => skipSong("backward"));
forward.addEventListener("click", () => skipSong("forward"));

audio.addEventListener("ended", () => skipSong("forward"));

function skipSong(direction) {
  const selectedSong = document.querySelector(".selected");
  selectedSongIndex = librarySongs.indexOf(selectedSong);

  selectedSong.classList.remove("selected");
  if (direction === "backward") {
    previousSong = librarySongs[selectedSongIndex - 1];
    if (librarySongs.indexOf(previousSong) === -1) {
      previousSong = librarySongs[librarySongs.length - 1];
    }
    previousSong.classList.add("selected");
    songs.filter((song) => {
      if (song.id == previousSong.id) {
        playSong(song);
      }
    });
  } else if (direction === "forward") {
    nextSong = librarySongs[selectedSongIndex + 1];

    if (librarySongs.indexOf(nextSong) === -1) {
      nextSong = librarySongs[0];
    }
    nextSong.classList.add("selected");
    songs.filter((song) => {
      if (song.id == nextSong.id) {
        playSong(song);
      }
    });
  }
}

document.querySelector('.btn-menu').addEventListener('click', function(){
    this.classList.toggle('active');
});

// 첫 곡(1번) 앨범 커버 진행바 및 상태바 초기화
if (typeof songs !== "undefined" && songs.length > 0) {
  durationInput.style.setProperty("--thumb-img", `url("${encodeURI(songs[0].cover)}")`);
}
