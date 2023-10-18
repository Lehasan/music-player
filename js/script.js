'use strict'

import { isMobile } from "./devices.js"
import { getAudio, loadAudio } from "./audio.js"

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
	const audioPlayButton = document.getElementById('play'),
		audioNextButton = document.getElementById('next'),
		audioPrevButton = document.getElementById('prev'),
		audioLoopButton = document.getElementById('loop'),
		audioRandomButton = document.getElementById('random')

	// volume setting
	audioElement.volume = 0.8 // 0.5 => 50%

	let audioItems = await getAudio()
	let audioIndex

	//audioItems.forEach(item => console.log(item)) ==================================================

	// random audio index
	const randomAudioIndex = () => {
		let random

		do {
			random = Math.floor(Math.random() * audioItems.length + 1)
		} while (random === audioIndex)

		return audioIndex = random
	}

	randomAudioIndex()

	// load audio
	loadAudio(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)

	// random audio
	const randomAudio = () => {
		randomAudioIndex()

		audioElement.autoplay = true
		setTimeout(() => audioElement.autoplay = false, 300)

		return updateAudio()
	}

	// play and pause audio
	const toggleAudioPlay = () => {
		toggleButtonClass(audioPlayButton)

		if (!audioPlayButton.classList.contains('_active')) return audioElement.pause()

		return audioElement.play()
	}

	// audio loop switching
	const toggleAudioLoop = () => {
		toggleButtonClass(audioLoopButton)
		audioRandomButton.classList.remove('_active')

		return audioElement.loop = audioElement.loop === true ? false : true
	}

	// audio random switching
	const toggleAudioRandom = () => {
		toggleButtonClass(audioRandomButton)
		audioLoopButton.classList.remove('_active')

		return audioElement.loop = false
	}

	// audio progress
	const updateAudioProgress = () => {
		const { currentTime, duration } = audioElement
		setTimeAudio(audioCurrentTimeElement, currentTime)

		const progressValue = currentTime / duration * 100

		return progressElement.style.width = progressValue + '%'
	}

	// rewind the audio
	const rewindAudioOnClick = event => {
		const fullWidthProgress = event.currentTarget.offsetWidth,
			currentCordinateX = event.offsetX

		return audioElement.currentTime = currentCordinateX / fullWidthProgress * audioElement.duration
	}

	// determining and setting the time of audio
	const setTimeAudio = (outputItem, time) => {
		const timeMinutes = Math.floor(time / 60),
			timeSeconds = Math.floor(time % 60)

		const outputSeconds = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds

		return outputItem.textContent = `${timeMinutes}:${outputSeconds}`
	}

	// pause and rewind audio when you press a key
	const controlsOnKeydown = event => {
		switch (event.code) {
			case 'Space':
				return toggleAudioPlay()
			case 'ArrowRight':
				return audioElement.currentTime += 10
			case 'ArrowLeft':
				return audioElement.currentTime -= 10
		}
	}

	// next audio when you click
	const nextAudioOnClick = () => {
		audioIndex++

		return changeAudio()
	}

	// previous audio when you click
	const prevAudioOnClick = () => {
		audioIndex--

		return changeAudio()
	}

	// audio change
	const changeAudio = () => {
		audioPlayButton.classList.remove('_active');
		switchButtonElements.forEach(switchButtonItem => switchButtonItem.blur())

		return updateAudio();
	}

	// audio reset
	const resetAudio = () => {
		audioElement.currentTime = null
		audioDurationElement.textContent = '-:--'
		audioImageElement.classList.remove('_loaded')
	}

	// update the audio
	const updateAudio = () => {
		audioElement.pause()

		resetAudio()
		switchButtonState()

		return loadAudio(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)
	}

	// class switching
	const toggleButtonClass = buttonElement => {
		buttonElement.blur()
		buttonElement.classList.toggle('_active')
	}

	// buttons state
	const switchButtonState = () => {
		if (audioIndex === audioItems.length) {
			audioNextButton.removeEventListener('click', nextAudioOnClick)
			audioNextButton.classList.add('_disabled')
		} else {
			audioNextButton.addEventListener('click', nextAudioOnClick)
			audioNextButton.classList.remove('_disabled')
		}

		if (audioIndex === 1) {
			audioPrevButton.removeEventListener('click', prevAudioOnClick)
			audioPrevButton.classList.add('_disabled')
		} else {
			audioPrevButton.addEventListener('click', prevAudioOnClick)
			audioPrevButton.classList.remove('_disabled')
		}
	}

	switchButtonState()

	// event handlers
	audioElement.addEventListener('timeupdate', updateAudioProgress)
	audioElement.addEventListener('loadeddata', () => setTimeAudio(audioDurationElement, audioElement.duration))
	audioImageElement.addEventListener('load', () => audioImageElement.classList.add('_loaded'))

	audioPlayButton.addEventListener('click', toggleAudioPlay)
	progressElement.parentElement.addEventListener('click', rewindAudioOnClick)
	audioLoopButton.addEventListener('click', toggleAudioLoop)
	audioRandomButton.addEventListener('click', toggleAudioRandom)

	audioElement.addEventListener('ended', () => {
		audioElement.currentTime = null

		if (audioRandomButton.classList.contains('_active')) return randomAudio()

		return toggleAudioPlay()
	})

	if (!isMobile.any()) document.addEventListener('keydown', controlsOnKeydown)
}

// page load
window.addEventListener('load', audioPlayer)