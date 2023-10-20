'use strict'

import { isMobile } from "./devices.js"
import { getAudio, loadAudio } from "./audio.js"
import { audioPlayerMenu } from "./menu.js"

const audioPlayer = async () => {
	// elements
	const audioElement = document.querySelector('.music-player__audio'),
		audioImageElement = document.querySelector('.music-player__image img'),
		audioTitleElement = document.querySelector('.music-player__title'),
		audioAuthorElement = document.querySelector('.music-player__author'),
		audioCurrentTimeElement = document.querySelector('.music-player__current-time'),
		audioDurationElement = document.querySelector('.music-player__duration'),
		progressElement = document.querySelector('.music-player__progress input'),
		switchButtonElements = document.querySelectorAll('.music-player__switch-button')

	// buttons
	const audioPlayButton = document.getElementById('play'),
		audioNextButton = document.getElementById('next'),
		audioPrevButton = document.getElementById('prev'),
		audioLoopButton = document.getElementById('loop'),
		audioRandomButton = document.getElementById('random')

	// volume setting
	audioElement.volume = 0.8 // 0.5 => 50%

	let audioIndex
	let audioItems = await getAudio()

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
		updateAudio()

		return audioElement.autoplay = true
	}

	// play audio
	const audioPlay = () => {
		audioPlayButton.classList.add('_active')

		return audioElement.play()
	}

	// pause audio
	const audioPause = () => {
		audioPlayButton.classList.remove('_active')

		return audioElement.pause()
	}

	// play and pause audio
	const toggleAudioPlay = () => {
		audioPlayButton.blur()

		if (!audioPlayButton.classList.contains('_active')) return audioPlay()

		return audioPause()
	}

	// audio loop switching
	const toggleAudioLoop = event => {
		toggleButtonClass(event.currentTarget)
		audioRandomButton.classList.remove('_active')

		return audioElement.loop = audioElement.loop === true ? false : true
	}

	// audio random switching
	const toggleAudioRandom = event => {
		toggleButtonClass(event.currentTarget)
		audioLoopButton.classList.remove('_active')

		return audioElement.loop = false
	}

	// audio progress
	const updateAudioProgress = event => {
		const { currentTime, duration } = event.currentTarget
		setTimeAudio(audioCurrentTimeElement, currentTime)

		const progressValue = currentTime / duration * 100

		if (!progressValue) return progressElement.value = 0

		return progressElement.value = progressValue
	}

	// rewind the audio
	const rewindAudio = event => {
		const target = event.currentTarget

		const fullWidthProgress = target.max,
			currentCordinate = target.value

		target.blur()

		return audioElement.currentTime = currentCordinate / fullWidthProgress * audioElement.duration
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
				progressElement.blur()
				return toggleAudioPlay()
			case 'ArrowRight':
				return audioElement.currentTime += 10
			case 'ArrowLeft':
				return audioElement.currentTime -= 10
		}
	}

	// audio change
	const changeAudio = () => {
		audioPlayButton.classList.remove('_active');
		switchButtonElements.forEach(switchButtonItem => switchButtonItem.blur())

		return updateAudio();
	}

	// audio reset
	const resetAudio = () => {
		audioElement.autoplay = false
		audioElement.currentTime = null
		audioDurationElement.textContent = '-:--'
		audioImageElement.classList.remove('_loaded')
	}

	// update the audio
	const updateAudio = () => {
		resetAudio()
		switchButtonState()

		return loadAudio(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)
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

	// class switching
	const toggleButtonClass = buttonElement => {
		buttonElement.blur()
		buttonElement.classList.toggle('_active')
	}

	// end of audio
	const audioEnd = () => {
		audioElement.currentTime = null

		if (audioRandomButton.classList.contains('_active')) return randomAudio()

		return audioPause()
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
	audioElement.addEventListener('loadeddata', () => setTimeAudio(audioDurationElement, audioElement.duration))
	audioImageElement.addEventListener('load', () => audioImageElement.classList.add('_loaded'))
	audioElement.addEventListener('timeupdate', updateAudioProgress)

	progressElement.addEventListener('input', rewindAudio)

	audioPlayButton.addEventListener('click', toggleAudioPlay)
	audioLoopButton.addEventListener('click', toggleAudioLoop)
	audioRandomButton.addEventListener('click', toggleAudioRandom)

	audioElement.addEventListener('ended', audioEnd)

	// disabling keypad control on mobile devices
	if (!isMobile.any()) document.addEventListener('keydown', controlsOnKeydown)
}

// load audio player
window.addEventListener('load', () => {
	audioPlayer()
	audioPlayerMenu()
})