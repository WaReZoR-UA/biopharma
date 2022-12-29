// Оболочка для всей секкции
const scenario = document.querySelector('.buy-imposible')
// Встановлення висоти оболонки
const heightSetings = scenario.getAttribute('data-pined')
// сцена
const scene = scenario.querySelector('.buy-imposible__wrapper')
// Оболонка слайдеру
const wrapper = scene.querySelector('.slider-imposible__body')
// оболонка слайдів
const sliders = wrapper.querySelectorAll('.slider-imposible__item')

// Встановлення висоти для секції
scenario.style.height = `${heightSetings}vh`

// Встановлення подій
document.addEventListener('scroll', scrollEvent)
window.addEventListener('resize', resizeEvent)

// Функція скролу
function scrollEvent() {
    // Основні параметри для сцени
    const scenarioParam = getParam(scenario)
    // Відстань від верху "сценарію" до початку сайту
    const _top = scenario.getBoundingClientRect().top + scrollY
    // Відстань від низу "сценарію" до початку сайту
    const _bottom =
        scenario.getBoundingClientRect().bottom - window.innerHeight + scrollY

    // Встановлення стилів залежно від положення
    // if (scrollY >= _bottom) setAbsolute()
    // if (scrollY >= _bottom) setFixed()
    // else removeFixed()

    // Анімація елементів
    animation(scenarioParam, -33, 100)
}

calcSLiderMesures()
function calcSLiderMesures() {
	let sliderWidth = scenario.querySelector('.slider-imposible').clientWidth
	wrapper.style.width = sliderWidth * sliders.length + 'px'
	sliders.forEach(slide => {
		slide.style.width = sliderWidth + 'px'
	});
}
function resizeEvent() {
	calcSLiderMesures()
}

function animation(scenarioParam, start, end) {
    // Відсоток прокрутки всередині сценарію
    const percentCurrent =
        (scenarioParam.top * -100) / (scenarioParam.height - window.innerHeight)
    // Значення transform відносно прокрутки
    const value = ((percentCurrent + start) / (end + start)) * 100

    if (percentCurrent >= start && percentCurrent <= end) {
        wrapper.style.transform = `translate3d(${-value}%,0,0)`
    } else if (percentCurrent <= start) {
        wrapper.style.transform = `translate3d(0%,0,0)`
    } else if (percentCurrent >= end) {
        wrapper.style.transform = `translate3d($100%,0,0)`
    }
}

// Отримання параметрів для сцени
function getParam(element) {
    return {
        top: element.getBoundingClientRect().top,
        height: element.offsetHeight,
        bottom: element.getBoundingClientRect().bottom - window.innerHeight,
    }
}
// Встановлення ABSOLUTE для scene
function setAbsolute() {
    scene.style.position = 'absolute'
    scene.style.top = ''
    scene.style.left = '0'
    scene.style.bottom = '0'
    scene.style.width = '100%'
}
// Встановлення FIXED для scene
function setFixed() {
    scene.style.position = 'fixed'
    scene.style.top = '0'
    scene.style.left = '0'
    scene.style.width = '100%'
    // scene.style.height = `${height}px`
}
// Видалення FIXED для scene
function removeFixed() {
    scene.style.position = ''
    scene.style.top = ''
    scene.style.left = ''
    scene.style.width = ''
    // scene.style.height = `${height}px`
}
