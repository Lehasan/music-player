'use strict'

import { isMobile } from "./devices.js"
import { fetchAudioData, loadAudio, loadAudioInMenu } from "./audio.js"
import { audioPlayerMenu } from "./menu.js"

const audioPlayer = async (audioIndex) => {
	// audio player elements
	const audioElement = document.querySelector('.music-player__audio'),
		audioImageElement = document.querySelector('.music-player__image img'),
		audioTitleElement = document.querySelector('.music-player__title'),
		audioAuthorElement = document.querySelector('.music-player__author'),
		audioCurrentTimeElement = document.querySelector('.music-player__current-time'),
		audioDurationElement = document.querySelector('.music-player__duration'),
		progressElement = document.querySelector('.music-player__progress input'),
		menuListElement = document.querySelector('.list-menu'),
		switchButtonElements = document.querySelectorAll('.music-player__switch-button')

	// audio player buttons
	const audioPlayButton = document.getElementById('play'),
		audioNextButton = document.getElementById('next'),
		audioPrevButton = document.getElementById('prev'),
		audioLoopButton = document.getElementById('loop'),
		audioRandomButton = document.getElementById('random')

	// get audio elements
	const audioItems = await fetchAudioData()

	// volume setting
	audioElement.volume = 0.8 // 0.5 => 50%

	// random audio index
	const randomAudioIndex = () => {
		let random

		do {
			random = Math.floor(Math.random() * audioItems.length + 1)
		} while (random === audioIndex)

		return audioIndex = random
	}

	// random audio
	const randomAudio = () => {
		randomAudioIndex()
		return updateAudio()
	}

	// play audio
	const audioPlay = () => {
		audioElement.autoplay = true
		audioPlayButton.classList.add('_active')

		return audioElement.play()
	}

	// pause audio
	const audioPause = () => {
		audioElement.autoplay = false
		audioPlayButton.classList.remove('_active')

		return audioElement.pause()
	}

	// play and pause audio
	const toggleAudioPlay = () => {
		audioPlayButton.blur()
		return audioElement.paused ? audioPlay() : audioPause()
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
		const { currentTime, duration } = event.currentTarget,
			progressValue = currentTime / duration * 100

		!progressValue ? progressElement.value = 0 : progressElement.value = progressValue

		return setTimeAudio(audioCurrentTimeElement, currentTime)
	}

	// rewind the audio
	const rewindAudio = event => {
		const target = event.currentTarget

		const fullWidthProgress = target.max,
			currentCordinate = target.value

		audioElement.currentTime = currentCordinate / fullWidthProgress * audioElement.duration

		return target.blur()
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

	// audio reset
	const resetAudio = () => {
		audioDurationElement.textContent = '-:--'
		audioImageElement.classList.remove('_loaded')

		return audioElement.currentTime = null
	}

	// update the audio
	const updateAudio = () => {
		resetAudio()
		setActiveAudio()
		switchButtonState()

		switchButtonElements.forEach(switchButtonItem => switchButtonItem.blur())

		return loadAudio(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)
	}

	// next audio when you click
	const nextAudioOnClick = () => {
		audioIndex++
		return updateAudio()
	}

	// previous audio when you click
	const prevAudioOnClick = () => {
		audioIndex--
		return updateAudio()
	}

	// choice audio when click in menu
	const menuChoiceAudioOnClick = event => {
		const audioTarget = event.target.closest('.list-menu__item')

		if (audioTarget) {
			audioIndex = Number(audioTarget.dataset.value)

			audioPlay()
			setActiveAudio()
			switchButtonState()

			return loadAudio(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)
		}
	}

	// end of audio
	const audioEnd = () => {
		const isRandomActive = audioRandomButton.classList.contains('_active')
		isRandomActive ? randomAudio() : audioPause()

		return audioElement.currentTime = null
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

	// set active state audio
	const setActiveAudio = () => {
		const currentAudio = document.querySelector(`[data-value="${audioIndex}"]`)

		const audioActive = document.querySelector('.list-menu__item._active')
		if (audioActive) audioActive.classList.remove('_active')

		return currentAudio.classList.add('_active')
	}

	// class switching
	const toggleButtonClass = buttonElement => {
		buttonElement.classList.toggle('_active')
		return buttonElement.blur()
	}

	// init functions
	await loadAudioInMenu(menuListElement)
	randomAudioIndex()
	setActiveAudio()
	switchButtonState()

	// load audio
	loadAudio(audioIndex, audioImageElement, audioTitleElement, audioAuthorElement, audioElement)

	// event handlers
	audioElement.addEventListener('loadeddata', () => setTimeAudio(audioDurationElement, audioElement.duration))
	audioImageElement.addEventListener('load', () => audioImageElement.classList.add('_loaded'))
	audioElement.addEventListener('timeupdate', updateAudioProgress)

	progressElement.addEventListener('input', rewindAudio)

	audioPlayButton.addEventListener('click', toggleAudioPlay)
	audioLoopButton.addEventListener('click', toggleAudioLoop)
	audioRandomButton.addEventListener('click', toggleAudioRandom)
	menuListElement.addEventListener('click', menuChoiceAudioOnClick)

	audioElement.addEventListener('ended', audioEnd)

	// disabling keypad control on mobile devices
	if (!isMobile.any()) document.addEventListener('keydown', controlsOnKeydown)
}

// load audio player
window.addEventListener('load', () => {
	audioPlayer()
	audioPlayerMenu()
})