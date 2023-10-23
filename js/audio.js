'use strict'

export const getAudio = async () => {
	try {
		const url = 'json/data.json',
			response = await fetch(url, { method: 'GET' }),
			result = await response.json()

		return result

	} catch (error) {
		return console.error(error)
	}
}

export const loadAudio = async (currentIndex, imageElement, titleElement, authorElement, audioElement) => {
	const audio = await getAudio()

	return audio.forEach(audioItem => {
		const { id, title, cover, author, audio } = audioItem

		if (currentIndex === id) {
			titleElement.textContent = title
			imageElement.src = cover
			authorElement.textContent = author
			audioElement.src = audio
		}
	})
}

export const loadAudioInMenu = async list => {
	const audio = await getAudio()

	return audio.forEach(audioItem => {
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