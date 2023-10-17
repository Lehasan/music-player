export const getAudio = async () => {
	try {
		const url = 'json/audio.json',
			response = await fetch(url, { method: 'GET' })

		return await response.json()
	} catch (error) {
		console.error(error)
	}
}

export const loadAudio = async (currentIndex, imageElement, titleElement, authorElement, audioElement) => {
	const music = await getAudio()

	music.forEach((musicItem) => {
		const { id, title, cover, author, audio } = musicItem

		if (currentIndex === id) {
			titleElement.textContent = title
			imageElement.src = cover
			authorElement.textContent = author
			audioElement.src = audio
		}
	})
}