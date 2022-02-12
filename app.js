/*
1. Render songs
2. Scroll top
3. Play / pause / seek
4. CD rotate
5. Next / prev
6. Random
7. Next / Repeate when end
8. Active song
9. Scroll active song into view
10. Play song when click 
*/

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = document.querySelector('.player')
const heading = document.querySelector('header h1')
const cdThumb = document.querySelector('.cd-thumb')
const audio = document.querySelector('#audio')
const cd = document.querySelector('.cd')
const playBtn = document.querySelector('.btn-toggle-play')
const progress = document.querySelector('#progress')
const nextBtn = document.querySelector('.btn-next')
const backBtn = document.querySelector('.btn-back')
const randomBtn = document.querySelector('.btn-random')
const repeatBtn = document.querySelector('.btn-repeat')
const playlist = document.querySelector('.playlist')

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat :false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
           name: 'Độ Tộc 2',
           singer: 'Phúc Du x Pháo',
           path: './music/Dotoc2.mp3',
           image: './img/Dotoc2.jpg' 
        },
        {
            name: 'Hương',
            singer: 'Văn Mai Hương',
            path: './music/Huong.mp3',
            image: './img/Huong.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: './music/MuonRoiMaSaoCon.mp3',
            image: './img/MuonRoiMaSaoCon.jpg'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: './music/NangTho.mp3',
            image: './img/NangTho.jpg'
        },
        {
            name: 'Có em đời bỗng vui',
            singer: 'Chillies',
            path: './music/CoEmDoiBongVui .mp3',
            image: './img/CoEm.jpg'
        },
        {
            name: 'Chuyện rằng',
            singer: 'Thịnh Suy',
            path: './music/ChuyenRang.mp3',
            image: './img/ChuyenRang.jpg'
        },
        {
            name: 'Phút Ban Đầu',
            singer: 'Vũ',
            path: './music/PhutBanDau.mp3',
            image: './img/PhutBanDau.jpg'
        },
        {
            name: 'Gieo Quẻ',
            singer: 'Hoàng Thùy Linh',
            path: './music/GieoQue.mp3',
            image: './img/GieoQue.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    // Hàm hiển thị song ra màn hình
    render: function(){
        const htmls = this.songs.map(function(song, index){

            return `
            <div class="song ${index == app.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" >
                    <img src="${song.image}" alt="" srcset="">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>
            `              
        })

        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    // Hàm xử lý sự kiện 
    handleEvent: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000, // 10 giây
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to hoặc thu nhỏ CD
        document.onscroll = function(){

            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
 
        }

        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        // Khi song được play  
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.oninput = function(e){
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime
        }

        // Next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Back bài hát 
        backBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.backSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Bật/tắt/Phát bài ngẫu nhiên
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        // Tự động next bài hát khi bài hat kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        // Xử lý phát lại 1 bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Lắng nghe click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')){
                
                //Xử lý khi click vào playlist
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //Xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
            }
        }
    },

    scrollToActiveSong:function(){
        setTimeout(() => {
            document.querySelector('.song.active').scrollIntoView({
                behavior:"smooth",
                block: "end"
            })
        },300)
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    backSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho obj
        this.defineProperties()

        // Liệt kê bài hát ra màn hình
        this.render()

        // Tải thông tin bài hát đầu tin vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Hàm sử lý các sự kiện
        this.handleEvent()

        // Hiển thị trạng thái ban đầu của btn repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()
