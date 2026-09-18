const audio = document.querySelector("audio");
const cover = document.querySelector(".song-info img");
const library = document.querySelector(".library");

const libraryLink = document.getElementById("library-link");
let librarySongs = Array.from(document.querySelectorAll(".library-song"));
let playStatus = false;

// 앨범 아트 슬라이드 타이머 핸들러
let slideTimeout1 = null;
let slideTimeout2 = null;

// 로컬 스토리지 키
const STORAGE_KEY = "maple_last_song_id";

// IndexedDB 설정
const DB_NAME = "MapleAudioCacheDB";
const DB_VERSION = 1;
const STORE_NAME = "audioStore";
let currentBlobUrl = null;

// 토스트 메시지 출력 함수
function showToast(msg) {
  const toastEl = document.getElementById("toast");
  if (!toastEl) return;
  toastEl.innerText = msg;
  toastEl.classList.add("reveal");
  setTimeout(() => {
    toastEl.classList.remove("reveal");
  }, 2000);
}
window.toast = window.toast || showToast;

// IndexedDB 연결
function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// IndexedDB에서 캐시된 음원 가져오기
async function getCachedAudio(id) {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result ? request.result.blob : null);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

// 백그라운드에서 음원을 다운로드하여 IndexedDB에 저장
async function cacheAudio(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const blob = await response.blob();
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: id, blob: blob });
  } catch (e) {
    console.log("음원 로컬 캐싱 실패:", e);
  }
}

// 음원 소스 세팅
async function setAudioSource(song) {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  const cachedBlob = await getCachedAudio(song.id);
  if (cachedBlob) {
    currentBlobUrl = URL.createObjectURL(cachedBlob);
    audio.src = currentBlobUrl;
  } else {
    audio.src = song.audio;
    cacheAudio(song.id, song.audio);
  }
}

// 최초 1회 회전 애니메이션 종료 후 재실행 방지
cover.addEventListener("animationend", () => {
  cover.classList.add("loaded");
}, { once: true });

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
    song.classList.add("selected");
    
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

// 상대 경로 이미지를 절대 경로로 변환
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

async function playSong(song, direction = null) {
  name.innerText = song.name;
  artist.innerText = song.artist;
  number.innerText = song.number;

  cover.classList.add("loaded");
  localStorage.setItem(STORAGE_KEY, song.id);

  // 앨범 아트 슬라이드 애니메이션 처리
  if (direction === "forward" || direction === "backward") {
    if (slideTimeout1) clearTimeout(slideTimeout1);
    if (slideTimeout2) clearTimeout(slideTimeout2);

    cover.classList.remove("slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
    void cover.offsetWidth;

    const outClass = direction === "forward" ? "slide-out-left" : "slide-out-right";
    const inClass = direction === "forward" ? "slide-in-right" : "slide-in-left";

    cover.classList.add(outClass);

    slideTimeout1 = setTimeout(() => {
      cover.setAttribute("src", song.cover);
      cover.classList.remove(outClass);
      cover.classList.add(inClass);

      slideTimeout2 = setTimeout(() => {
        cover.classList.remove(inClass);
      }, 220);
    }, 180);
  } else {
    cover.classList.remove("slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
    cover.setAttribute("src", song.cover);
  }

  // 음원 소스 로드 (IndexedDB 캐시 우선 적용)
  await setAudioSource(song);

  updateMediaSession(song);

  playStatus = false;
  playPause();
}

//*player control actions
const playPauseIcon = document.getElementById("play-pause");

playPauseIcon.addEventListener("click", () => {
  playPause();
});

function playPause() {
  if (playStatus === false) {
    const selectedSongEl = document.querySelector(".library-song.selected");
    const targetId = selectedSongEl ? selectedSongEl.id : (songs[0] && songs[0].id);
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
  const selectedSongIndex = librarySongs.indexOf(selectedSong);

  selectedSong.classList.remove("selected");

  // 셔플 활성화 상태에서 '다음 곡' 또는 '곡 자동 종료' 시 랜덤 재생
  if (direction === "forward" && isShuffle && typeof songs !== "undefined" && songs.length > 1) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * librarySongs.length);
    } while (randomIndex === selectedSongIndex);

    const randomSongEl = librarySongs[randomIndex];
    randomSongEl.classList.add("selected");

    const targetSong = songs.find((s) => s.id == randomSongEl.id);
    if (targetSong) {
      playSong(targetSong, "forward");
    }
    return;
  }

  // 순차 재생
  if (direction === "backward") {
    let previousSong = librarySongs[selectedSongIndex - 1];
    if (librarySongs.indexOf(previousSong) === -1) {
      previousSong = librarySongs[librarySongs.length - 1];
    }
    previousSong.classList.add("selected");
    songs.filter((song) => {
      if (song.id == previousSong.id) {
        playSong(song, "backward");
      }
    });
  } else if (direction === "forward") {
    let nextSong = librarySongs[selectedSongIndex + 1];
    if (librarySongs.indexOf(nextSong) === -1) {
      nextSong = librarySongs[0];
    }
    nextSong.classList.add("selected");
    songs.filter((song) => {
      if (song.id == nextSong.id) {
        playSong(song, "forward");
      }
    });
  }
}

//* 셔플(랜덤 재생) 설정
let isShuffle = false;
const shuffleBtn = document.getElementById("shuffle-btn");

if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
    showToast(isShuffle ? "셔플 재생 ON" : "셔플 재생 OFF");
  });
}

//* 실행 타이머 설정 (15분 -> 30분 -> 60분 -> 해제 순환)
let timerIndex = 0;
const timerOptions = [0, 15, 30, 60];
let timerTimeout = null;
const timerBtn = document.getElementById("timer-btn");

if (timerBtn) {
  timerBtn.addEventListener("click", () => {
    timerIndex = (timerIndex + 1) % timerOptions.length;
    const minutes = timerOptions[timerIndex];

    if (timerTimeout) {
      clearTimeout(timerTimeout);
      timerTimeout = null;
    }

    if (minutes > 0) {
      timerBtn.classList.add("active");
      showToast(`타이머: ${minutes}분 후 자동 종료`);

      timerTimeout = setTimeout(() => {
        if (playStatus) {
          playPause();
        }
        timerIndex = 0;
        timerBtn.classList.remove("active");
        showToast("타이머가 완료되어 재생을 정지합니다");
      }, minutes * 60 * 1000);
    } else {
      timerBtn.classList.remove("active");
      showToast("타이머 해제");
    }
  });
}

document.querySelector(".btn-menu").addEventListener("click", function () {
  this.classList.toggle("active");
});

// 마지막 재생 곡 복원 함수
async function restoreLastPlayedSong() {
  if (typeof songs === "undefined" || songs.length === 0) return;

  const savedSongId = localStorage.getItem(STORAGE_KEY);
  const targetSong = (savedSongId && songs.find((s) => s.id == savedSongId)) || songs[0];

  cover.setAttribute("src", targetSong.cover);
  name.innerText = targetSong.name;
  artist.innerText = targetSong.artist;
  number.innerText = targetSong.number;

  await setAudioSource(targetSong);

  librarySongs.forEach((songEl) => {
    songEl.classList.remove("selected");
    if (songEl.id == targetSong.id) {
      songEl.classList.add("selected");
    }
  });

  updateMediaSession(targetSong);
}

// 페이지 진입 시 마지막 곡 즉시 복원
restoreLastPlayedSong();
