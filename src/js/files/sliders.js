import Flickity from 'flickity'
import { bodyLock } from './functions.js'
import { bodyUnlock } from './functions.js'

window.addEventListener('DOMContentLoaded', () => {
    // Перший слайдер тексту в шапці

    const sliderWrapper = document.querySelector('[data-swiper=text_swipe]'),
        sliderBody = sliderWrapper.querySelector('ul'),
        slideHeight = sliderBody.clientHeight
    let currentSlide = 1,
        sliderElements = sliderBody.querySelectorAll('li')

    const interval = sliderWrapper.getAttribute('data-interval'),
        pause = sliderWrapper.getAttribute('data-pause')

    if (sliderWrapper) {
        hideElements()
        totalSLidesHeight()

        function mySlideUp() {
            sliderElements = sliderBody.querySelectorAll('li')
            if (currentSlide === sliderElements.length) {
                sliderBody.style.transition = 'unset'
                sliderBody.style.transform = `translateY(100%)`
                currentSlide = 0
                setTimeout(mySlideUp, 1)
                return
            }
            sliderBody.style.transition = 'transform .3s ease'
            sliderBody.style.transform = `translateY(-${
                slideHeight * currentSlide
            }px)`
            currentSlide++
            setTimeout(mySlideUp, +interval + +pause)

            hideElements()
            totalSLidesHeight()
            return
        }

        setTimeout(mySlideUp, interval)
    }

    function hideElements() {
        const contentBlock = document.querySelector('.header__content'),
            contentBlockWidth =
                contentBlock.clientWidth -
                parseInt(window.getComputedStyle(contentBlock).paddingLeft) -
                5
        sliderElements.forEach((el) => {
            const slideElementWidth = parseInt(
                window.getComputedStyle(el).width
            )
            if (slideElementWidth >= contentBlockWidth) {
                el.remove()
            }
        })
        return
    }

    function totalSLidesHeight() {
        sliderBody.style.height =
            `${slideHeight * sliderElements.length}` + 'px'
    }

    // SLider Main
    const mainSlider = new Flickity('.slider-main', {
        cellSelector: '.slider-main__item',
        wrapAround: true,
        autoPlay: 7000,
        cellAlign: 'center',
        pageDots: false,
        prevNextButtons: false,
    })

    //Cards Slider
    let widthAll = () => window.innerWidth
    window.addEventListener('resize', () => widthAll())

    let w = widthAll()
    const card = document.querySelector('.card')
    let position = ''

    if (w <= 834 && w > 425) {
        position = 'center'
    } else {
        position = 'left'
    }

    const cardSlider = new Flickity(card, {
        cellSelector: '.card__wrapper',
        wrapAround: true,
        pageDots: false,
        prevNextButtons: false,
        cellAlign: position,
    })

    //Block stick and slide text
    /*
скролим страницу
слушем сколько проскролилось
если уровень крола совпал с уровнем нужного блока, вешаем клас блокирующий скрол страницы
пилим слайдер
когда слайдер доходит до последнего слайда, убираем блокирующий класс


*/
    const elementToPin = document.querySelector('[data-animate_block]')
	const sccreenDivider = elementToPin.getAttribute('data-screen_divider')
	const page = document.querySelector('.page')

	const pinBlock = (element) => {
		if (element.offsetTop <= window.scrollY) {
			element.classList.add('fixed')
		} else {
			element.classList.remove('fixed')
		}
    }

    window.addEventListener('scroll', () => {
        pinBlock(elementToPin, sccreenDivider)
    })
})
