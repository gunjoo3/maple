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

// 상대 경로 이미지를 아이폰(iOS) 규격의 절대 경로로 변환
function getAbsoluteUrl(relativeUrl) {
  try {
    return new URL(encodeURI(relativeUrl), window.location.href).href;
  } catch (e) {
    return relativeUrl;
  }
}

// OS 잠금화면 / 상단바 미디어 세션 동기화
function updateMediaSession(song) {
  if ("mediaSession" in navigator) {
    const fullArtworkUrl = getAbsoluteUrl(song.cover);

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song.artist,
      album: "메이플스토리 BGM",
      artwork: [
        { src: fullArtworkUrl, sizes: "96x96", type: "image/png" },
        { src: fullArtworkUrl, sizes: "128x128", type: "image/png" },
        { src: fullArtworkUrl, sizes: "192x192", type: "image/png" },
        { src: fullArtworkUrl, sizes: "256x256", type: "image/png" },
        { src: fullArtworkUrl, sizes: "384x384", type: "image/png" },
        { src: fullArtworkUrl, sizes: "512x512", type: "image/png" },
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

// OS 상태바 진행 시간 실시간 동기화
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

  // OS 상태바 메타데이터 갱신
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
    // 첫 곡에서 바로 재생 버튼을 눌렀을 때도 현재 선택된 1번 곡을 상태바에 즉시 등록
    const selectedSongEl = document.querySelector(".library-song.selected");
    const targetId = selectedSongEl ? selectedSongEl.id : 1;
    const currentSongData = (typeof songs !== "undefined" && songs.find((s) => s.id == targetId)) || (typeof songs !== "undefined" && songs[0]);
    
    if (currentSongData) {
      updateMediaSession(currentSongData);
    }

    playPauseIcon.className = "fas fa-pause";
    audio.play().then(() => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }
    }).catch((e) => console.log("재생 오류:", e));

    cover.classList.add("playing");
    playStatus = true;
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

document.querySelector(".btn-menu").addEventListener("click", function () {
  this.classList.toggle("active");
});

// 페이지 초기 로드 시 1번 곡 메타데이터 사전 동기화
if (typeof songs !== "undefined" && songs.length > 0) {
  updateMediaSession(songs[0]);
}
