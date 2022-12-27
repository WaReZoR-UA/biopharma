// отримуємо прогрес-бар
const progressBar = document.querySelector('[data-progress_bar]');

//отримуємо атрибути параметрів для обробки
if (progressBar) {
	const startFrom = progressBar.getAttribute('data-start'),
        progressMax = progressBar.getAttribute('data-max'),
        progressRandomPlus = progressBar.getAttribute('data-max_plus'),
        progressTimeout = progressBar.getAttribute('data-timeout'),
        //отримуємо елементи на сторінці
        progressOutput = progressBar.querySelector('.progress__number'),
		progressVisual = progressBar.querySelector('.progress__line')
	
	
	
	
}
