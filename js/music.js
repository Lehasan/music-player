export const getMusic = async () => {
	try {
		const url = 'json/music.json',
			response = await fetch(url, { method: 'GET' })

		return await response.json()
	} catch (error) {
		console.error(error)
	}
}

export const loadMusic = async (currentIndex, imageElement, titleElement, authorElement, musicElement) => {
	const music = await getMusic()

	music.forEach((musicItem) => {
		const { id, title, cover, author, music } = musicItem

		if (currentIndex === id) {
			titleElement.textContent = title
			imageElement.src = cover
			authorElement.textContent = author
			musicElement.src = music
		}
	})
}