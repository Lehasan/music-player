import { getMusic, loadMusic } from "./music.js"

const audioPlayer = async () => {
	// elements
	const audioElement = document.querySelector('.music-player__audio'),
		audioImageElement = document.querySelector('.music-player__img img'),
		audioTitleElement = document.querySelector('.music-player__title'),
		audioAuthorElement = document.querySelector('.music-player__author'),
		audioCurrentTimeElement = document.querySelector('.music-player__current-time'),
		audioDurationElement = document.querySelector('.music-player__duration'),
		progressElement = document.querySelector('.music-player__progress span'),
		switchButtonElements = document.querySelectorAll('.music-player__switch-button')

	// buttons
	const musicPlayButton = document.getElementById('play'),
		musicNextButton = document.getElementById('next'),
		musicPrevButton = document.getElementById('prev')

	// volume setting
	audioElement.volume = 0.5 // 0.5 => 50%

	let audioIndex = 2
	let musicItems = await getMusic()

	//musicItems.forEach(item => console.log(item)) ==================================================

	// load music
	loadMusic(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)

	// play and pause music
	const audioPlayOnClick = () => {
		musicPlayButton.blur()
		musicPlayButton.classList.toggle('music-player__play_active')

		if (!musicPlayButton.classList.contains('music-player__play_active')) {
			return audioElement.pause()
		}

		return audioElement.play()
	}

	// music progress
	const updateAudioProgress = () => {
		const { currentTime, duration } = audioElement
		setTimeAudio(audioCurrentTimeElement, currentTime)

		const progressValue = currentTime / duration * 100

		return progressElement.style.width = progressValue + '%'
	}

	// rewind the music
	const rewindAudioOnClick = event => {
		const fullWidthProgress = event.currentTarget.offsetWidth,
			cordX = event.offsetX

		return audioElement.currentTime = cordX / fullWidthProgress * audioElement.duration
	}

	// determining and setting the time of music
	const setTimeAudio = (outputItem, time) => {
		const timeMinutes = Math.floor(time / 60),
			timeSeconds = Math.floor(time % 60)

		const outputSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds

		return outputItem.textContent = `${timeMinutes}:${outputSeconds}`
	}

	// pause and rewind music when you press a key
	const controlsOnKeydown = event => {
		switch (event.code) {
			case 'Space':
				audioPlayOnClick()
				break
			case 'ArrowRight':
				audioElement.currentTime += 10
				break
			case 'ArrowLeft':
				audioElement.currentTime -= 10
				break
		}
	}

	// next music when you click
	const nextMusicOnClick = () => {
		audioIndex++
		updateMusic()
	}

	// previous music when you click
	const prevMusicOnClick = () => {
		audioIndex--
		updateMusic()
	}

	// update the music
	const updateMusic = () => {
		audioElement.pause()
		audioElement.currentTime = null

		audioImageElement.classList.remove('_loaded')
		musicPlayButton.classList.remove('music-player__play_active')
		switchButtonElements.forEach(switchButtonItem => switchButtonItem.blur())

		switchButtonState()

		return loadMusic(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)
	}

	// buttons state
	const switchButtonState = () => {
		if (audioIndex === musicItems.length) {
			musicNextButton.removeEventListener('click', nextMusicOnClick)
			musicNextButton.classList.add('_disabled')
		} else {
			musicNextButton.addEventListener('click', nextMusicOnClick)
			musicNextButton.classList.remove('_disabled')
		}

		if (audioIndex === 1) {
			musicPrevButton.removeEventListener('click', prevMusicOnClick)
			musicPrevButton.classList.add('_disabled')
		} else {
			musicPrevButton.addEventListener('click', prevMusicOnClick)
			musicPrevButton.classList.remove('_disabled')
		}
	}

	switchButtonState()

	// event handlers
	audioElement.addEventListener('timeupdate', updateAudioProgress)
	audioElement.addEventListener('loadeddata', () => setTimeAudio(audioDurationElement, audioElement.duration))
	audioImageElement.addEventListener('load', () => audioImageElement.classList.add('_loaded'))

	musicPlayButton.addEventListener('click', audioPlayOnClick)
	progressElement.parentElement.addEventListener('click', rewindAudioOnClick)

	document.addEventListener('keydown', controlsOnKeydown)

	audioElement.addEventListener('ended', () => {
		audioElement.currentTime = null
		audioPlayOnClick()
	})
}

// page load
window.addEventListener('load', audioPlayer)