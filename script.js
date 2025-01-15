class AudioPlayer {
    constructor() {
        this.audio = null;
        this.playButton = document.getElementById('play-button');
        this.progressBar = document.getElementById('progress-bar');
        this.initEventListeners();
    }

    initEventListeners() {
        this.playButton.addEventListener('click', () => this.togglePlayback());
        this.setupProgressBar();
    }

    togglePlayback() {
        if (!this.audio) return;

        if (this.audio.paused) {
            this.audio.play();
            this.playButton.innerText = 'Pause';
        } else {
            this.audio.pause();
            this.playButton.innerText = 'Play';
        }
    }

    setupProgressBar() {
        let isDragging = false;
        let wasPlayingBeforeDrag = false;

        const handleDragStart = () => {
            wasPlayingBeforeDrag = !this.audio.paused;
            if (!this.audio.paused) this.audio.pause();
            isDragging = true;
        };

        const handleDragEnd = () => {
            if (this.audio && !isNaN(this.audio.duration)) {
                const seekTime = (this.progressBar.value / 100) * this.audio.duration;
                // console.log('Seeking to:', seekTime);
                try {
                    this.audio.currentTime = seekTime;
                    if (wasPlayingBeforeDrag) {
                        this.audio.play().catch(error => {
                            console.error('Error resuming playback:', error);
                        });
                    }
                } catch (error) {
                    console.error('Error seeking audio:', error);
                }
            }
            isDragging = false;
            wasPlayingBeforeDrag = false;
        };

        this.progressBar.addEventListener('mousedown', handleDragStart);
        this.progressBar.addEventListener('mouseup', handleDragEnd);
        this.progressBar.addEventListener('input', () => {
            if (isDragging && this.audio && !isNaN(this.audio.duration)) {
                const seekTime = (this.progressBar.value / 100) * this.audio.duration;
                // console.log('Dragging to:', seekTime);
                this.audio.currentTime = seekTime;
            }
        });

        if (this.audio) {
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
        }
    }

    updateProgress() {
        if (this.audio && this.audio.duration) {
            this.progressBar.value = (this.audio.currentTime / this.audio.duration) * 100;
        }
    }

    init(audioUrl) {
        this.audio = new Audio(audioUrl);
        this.audio.addEventListener('canplaythrough', () => {
            this.playButton.innerText = 'Play';
            console.log('Audio ready to play');
        });
        this.audio.addEventListener('ended', () => {
            this.playButton.innerText = 'Play';
            this.progressBar.value = 0;
            console.log('Audio ended');
        });
        this.setupProgressBar();
    }
}

// 初始化音频播放器
const audioPlayer = new AudioPlayer();

class LyricsManager {
    constructor() {
        this.lyricsContent = document.getElementById('lyrics-content');
    }

    async fetch(songId) {
        try {
            const response = await fetch(`/api/lyrics?song_id=${songId}`);
            const data = await response.json();
            this.lyricsContent.innerHTML = `<pre>${data.lyrics}</pre>`;
        } catch (error) {
            console.error('Error fetching lyrics:', error);
            this.lyricsContent.innerHTML = '<pre>Failed to load lyrics</pre>';
        }
    }
}

class SongManager {
    constructor() {
        this.songTitle = document.getElementById('song-title');
        this.lyricsManager = new LyricsManager();
    }

    async fetchDailySong() {
        try {
            const response = await fetch(`/api/daily_song`);
            const data = await response.json();

            // 更新 UI 显示歌曲信息
            this.songTitle.innerText = data.title;
            
            // 获取歌词
            if (data.song_id) {
                await this.lyricsManager.fetch(data.song_id);
            }

            // 初始化音频
            audioPlayer.init(data.audio_url);

        } catch (error) {
            console.error('Error fetching song of the day:', error);
            this.songTitle.innerText = 'Error fetching song';
        }
    }
}

class BackendInfoManager {
    constructor() {
        this.backendInfo = document.getElementById('backend-info');
    }

    async fetch() {
        try {
            const response = await fetch(`/api/host_info`);
            const data = await response.json();
            this.backendInfo.innerText = `HostIP: ${data.host_ip}`;
        } catch (error) {
            console.error('Error fetching backend host info:', error);
            this.backendInfo.innerText = 'Unable to fetch backend information.';
        }
    }
}

// 初始化管理器
const songManager = new SongManager();
const backendInfoManager = new BackendInfoManager();

// 在页面加载时获取每日歌曲和主机信息
window.onload = async () => {
    await songManager.fetchDailySong();
    await backendInfoManager.fetch();
};
