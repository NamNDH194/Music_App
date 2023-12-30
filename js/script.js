const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
repeatBtn = wrapper.querySelector("#repeat-plist"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close"),
ulTag = wrapper.querySelector("ul"),
playPauseBtn = wrapper.querySelector(".play-pause");

let musicIndex = Math.floor(Math.random() * allMusic.length) + 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb -1 ].name;
    musicArtist.innerText = allMusic[indexNumb -1 ].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
};

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerHTML = "pause";
    mainAudio.play();
};

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerHTML = "play_arrow";
    mainAudio.pause();
};

function nextMusic(){
    musicIndex++;
    if (musicIndex > allMusic.length) {
        musicIndex = 1;
    }
    loadMusic(musicIndex);
    playMusic();
};

function prevMusic(){
    musicIndex--;
    if (musicIndex < 1) {
        musicIndex = allMusic.length;
    }
    loadMusic(musicIndex);
    playMusic();
};

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
    playingNow();
}); 

prevBtn.addEventListener("click", () => {
    prevMusic();
    playingNow();
});

mainAudio.addEventListener("timeupdate", (e) => {
    console.log(e);
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    mainAudio.addEventListener("loadeddata", (e) => {
        let musicDuration = wrapper.querySelector(".duration");
        let audioDuration = e.target.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    let musicCurrentTime = wrapper.querySelector(".current");
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
    if (e.target.currentTime == e.target.duration) {
        let getText = repeatBtn.innerText;
        switch (getText) {
            case "repeat":
                nextMusic();
                playingNow();
                break;
            case "repeat_one":
                playMusic();
                break;
            default:
                //random
                let oldMusicIndex = musicIndex;
                musicIndex = Math.floor(Math.random() * allMusic.length) + 1;
                while (oldMusicIndex == musicIndex) {
                    musicIndex = Math.floor(Math.random() * allMusic.length) + 1;
                }
                console.log(musicIndex);
                loadMusic(musicIndex);
                playMusic();
                playingNow();
                break;
        }
    }
});

progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration =mainAudio.duration;
    mainAudio.currentTime = (clickedOffSetX * songDuration) / progressWidthVal;
    playMusic();
});

repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            break;
        default:
            repeatBtn.innerText = "repeat";
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

for (let index = 0; index < allMusic.length; index++) {

    let liTag = `<li li-index = "${index + 1}"> 
                     <div class="row">
                         <span>${allMusic[index].name}</span>
                         <p>${allMusic[index].artist}</p>
                    </div>
                    <audio class="${allMusic[index].src}" src="songs/${allMusic[index].src}.mp3"></audio>
                    <span id="${allMusic[index].src}" class="audio-duration"></span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[index].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[index].src}`);
    
    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
        console.log(liAudioDuration);
    });
}

const allLiTags = ulTag.querySelectorAll("li");

function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            audioTag.innerText = audioTag.getAttribute("t-duration");
        }
    
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function test(){
    wrapper.classList.toggle("toogle");
}
