'use strict'

// get all audio elements
export const fetchAudioData = async () => {
	try {
		const url = 'json/data.json',
			response = await fetch(url, { method: 'GET' }),
			result = await response.json()

		return result

	} catch (error) {
		throw new Error('An error occurred while receiving audio elements')
	}
}

// load audio in player
export const loadAudio = async (currentIndex, imageElement, titleElement, authorElement, audioElement) => {
	const audio = await fetchAudioData()

	const findAudio = (element, index) => {
		if (index + 1 === currentIndex) {
			const { title, cover, author, audio } = element

			imageElement.src = cover
			titleElement.textContent = title
			authorElement.textContent = author
			audioElement.src = audio
		}
	}

	return audio.find(findAudio)
}

// load audio in player menu
export const loadAudioInMenu = async list => {
	const audio = await fetchAudioData()

	return audio.map(audioItem => {
		const { id, cover, title, author } = audioItem

		const audioItemsTemplate = `
		<li class="list-menu__item" data-value="${id}">
			<div class="list-menu__image image">
				<img src="${cover}" alt="Cover" loading="lazy">
			</div>
			<div class="list-menu__box">
				<div class="list-menu__title title title_small">${title}</div>
				<div class="list-menu__author author">${author}</div>
			</div>
		</li>`

		list.insertAdjacentHTML('beforeend', audioItemsTemplate)
	})
}