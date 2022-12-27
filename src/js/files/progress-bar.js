// отримуємо прогрес-бар
const progressBar = document.querySelector('[data-progress_bar]');

//отримуємо атрибути параметрів для обробки
if (progressBar) {
    const startFrom = parseInt(progressBar.getAttribute('data-start')),
        progressMax = parseInt(progressBar.getAttribute('data-max')),
        progressRandomPlus = parseInt(
            progressBar.getAttribute('data-max_plus')
        ),
        progressInterval = parseInt(progressBar.getAttribute('data-timeout')),
        //отримуємо елементи на сторінці
        progressOutput = progressBar.querySelector('.progress__number'),
        progressVisual = progressBar.querySelector('.progress__line')

    //Дані за замовчуванням відображаються в смузі
    progressOutput.textContent = startFrom


    //намалюємо висоту заднього фону бару
    function setBarBg(current = 4000, max = 10000) {
        progressVisual.style.height = `${(current / max) * 100}%`
    }

    //Додаємо отримане випадкове число до поточного значення і намалюємо в браузері
    function plusPoints(num) {
        let res = genRandomNum(num),
            currentNum = progressOutput.textContent

		setBarBg(currentNum, progressMax)

        return (progressOutput.textContent = +currentNum + res)
    }

    //Отримання випадкового числа від 0 до num
    function genRandomNum(num = 2) {
        return Math.floor(Math.random() * (num + 1))
    }

	// Ми починаємо обчислення прогресу
	const intervalBar = setInterval(() => {
		let currentProgress =parseInt(progressOutput.textContent)
		plusPoints(progressRandomPlus)

		// Якщо поточне значення дорівнює максимальному значенню, зупиніть роботу прогресу
		if (currentProgress >= progressMax) {
			clearInterval(intervalBar)
        }
		
	}, progressInterval)
}
