// 获取页面元素
const playButton = document.getElementById('play-button');
const progressBar = document.getElementById('progress-bar');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const backendInfo = document.getElementById('backend-info'); // 用于显示后端主机信息

// 初始化音频变量
let audio = null;

// 播放按钮事件处理
playButton.addEventListener('click', () => {
    if (playButton.innerText === 'Play') {
        if (audio) {
            audio.play();
            playButton.innerText = 'Pause';
        }
    } else {
        if (audio) {
            audio.pause();
            playButton.innerText = 'Play';
        }
    }
});

// 更新进度条的值
function updateProgress() {
    if (audio && audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
}

// 从后端获取“每日歌曲”的数据
async function fetchSongOfTheDay() {
    try {
        // 向后端发送 GET 请求，获取每日歌曲信息
        const response = await fetch(`/api/daily_song`);
        const data = await response.json();

        // 更新 UI 显示歌曲信息
        songTitle.innerText = data.title;
        // songArtist.innerText = data.artist;

        // 创建音频对象并设置为返回的音频文件
        audio = new Audio(data.audio_url);

        // 监听音频进度更新
        audio.addEventListener('timeupdate', updateProgress);

        // 当音频准备好后，更新播放按钮文本
        audio.addEventListener('canplaythrough', () => {
            playButton.innerText = 'Play';
        });

        // 设置音频播放完毕时的事件（可选：循环播放或处理音频结束等）
        audio.addEventListener('ended', () => {
            playButton.innerText = 'Play'; // 播放结束后恢复按钮文本
            progressBar.value = 0; // 进度条归零
        });

    } catch (error) {
        console.error('Error fetching song of the day:', error);
        songTitle.innerText = 'Error fetching song';
        // songArtist.innerText = 'Please try again later';
    }
}

// 从后端获取主机信息
async function fetchBackendInfo() {
    try {
        // 向后端发送 GET 请求，获取主机信息
        const response = await fetch(`/api/host_info`);
        const data = await response.json();

        // 更新 UI 显示后端主机信息
        backendInfo.innerText = `HostIP: ${data.host_ip}`;
    } catch (error) {
        console.error('Error fetching backend host info:', error);
        backendInfo.innerText = 'Unable to fetch backend information.';
    }
}

// 在页面加载时获取每日歌曲和主机信息
window.onload = async () => {
    await fetchSongOfTheDay();
    await fetchBackendInfo();
};
