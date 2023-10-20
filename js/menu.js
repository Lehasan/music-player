'use strict'

import { getAudio, loadAudio } from "./audio.js"

export const audioPlayerMenu = () => {
	const audioPlayerSelector = document.querySelector('.music-player')

	const audioButtonMenu = document.getElementById('menu-open'),
		audioButtonBack = document.getElementById('menu-back')

	const changeEvents = () => {
		if (audioPlayerSelector.classList.contains('_active')) {
			audioButtonMenu.removeEventListener('click', toggleMenuOnClick)
			audioButtonBack.addEventListener('click', toggleMenuOnClick)

			return
		}

		audioButtonMenu.addEventListener('click', toggleMenuOnClick)
		audioButtonBack.removeEventListener('click', toggleMenuOnClick)
	}

	const toggleMenuOnClick = () => {
		audioPlayerSelector.classList.toggle('_active')

		return changeEvents()
	}

	changeEvents()
}