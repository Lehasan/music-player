'use strict'

export const audioPlayerMenu = () => {
	// audio player element
	const audioPlayerSelector = document.querySelector('.music-player')

	// menu elements
	const menuElement = document.querySelector('.music-menu'),
		menuTopElement = document.querySelector('.music-menu__top')

	// menu buttons
	const audioButtonMenu = document.getElementById('menu-open'),
		audioButtonBack = document.getElementById('menu-back')

	// add and remove handlers when is active or not-active menu
	const updateEventListeners = () => {
		const isActive = audioPlayerSelector.classList.contains('_active')

		if (isActive) {
			audioButtonMenu.removeEventListener('click', toggleMenuOnClick)
			audioButtonBack.addEventListener('click', toggleMenuOnClick)
			menuElement.addEventListener('scroll', toggleClassOnScroll)

			return
		}

		audioButtonMenu.addEventListener('click', toggleMenuOnClick)
		audioButtonBack.removeEventListener('click', toggleMenuOnClick)
		menuElement.removeEventListener('scroll', toggleClassOnScroll)
	}

	// toggle class in menu when on click
	const toggleMenuOnClick = () => {
		audioPlayerSelector.classList.toggle('_active')
		return updateEventListeners()
	}

	// add and remove class in menu when on scroll
	const toggleClassOnScroll = event => {
		event.currentTarget.scrollTop > 0
			? menuTopElement.classList.add('_scroll')
			: menuTopElement.classList.remove('_scroll')
	}

	// init menu
	updateEventListeners()
}