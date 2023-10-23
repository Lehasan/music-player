'use strict'

export const audioPlayerMenu = () => {
	const audioPlayerSelector = document.querySelector('.music-player'),
		menuElement = document.querySelector('.music-menu'),
		menuTopElement = document.querySelector('.music-menu__top')

	const audioButtonMenu = document.getElementById('menu-open'),
		audioButtonBack = document.getElementById('menu-back')

	const updateEventListeners = () => {
		if (audioPlayerSelector.classList.contains('_active')) {
			audioButtonMenu.removeEventListener('click', toggleMenuOnClick)
			audioButtonBack.addEventListener('click', toggleMenuOnClick)
			menuElement.addEventListener('scroll', toggleClassOnScroll)

			return
		}

		audioButtonMenu.addEventListener('click', toggleMenuOnClick)
		audioButtonBack.removeEventListener('click', toggleMenuOnClick)
		menuElement.removeEventListener('scroll', toggleClassOnScroll)
	}

	const toggleMenuOnClick = () => {
		audioPlayerSelector.classList.toggle('_active')

		return updateEventListeners()
	}

	const toggleClassOnScroll = event => {
		event.currentTarget.scrollTop > 0
			? menuTopElement.classList.add('_active')
			: menuTopElement.classList.remove('_active')
	}

	updateEventListeners()
}