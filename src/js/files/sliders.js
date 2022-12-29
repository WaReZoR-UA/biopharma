import Flickity from 'flickity'

window.addEventListener('DOMContentLoaded', () => {
    // Перший слайдер тексту в шапці
    //========================================================================================================================================================

    const sliderWrapper = document.querySelector('[data-swiper=text_swipe]')

    if (sliderWrapper) {
        const sliderBody = sliderWrapper.querySelector('ul'),
            slideHeight = sliderBody.clientHeight,
            interval = sliderWrapper.getAttribute('data-interval'),
            pause = sliderWrapper.getAttribute('data-pause')
        let currentSlide = 1,
            sliderElements = sliderBody.querySelectorAll('li')
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

        function hideElements() {
            const contentBlock = document.querySelector('.header__content'),
                contentBlockWidth =
                    contentBlock.clientWidth -
                    parseInt(
                        window.getComputedStyle(contentBlock).paddingLeft
                    ) -
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
    }
    //========================================================================================================================================================

    //========================================================================================================================================================

    // SLider Main
const sliderMain = document.querySelector('#slider-main')

	if (sliderMain) {
		const mainSlider = new Flickity(sliderMain, {
			cellSelector: '.slider-main__item',
			wrapAround: true,
			// autoPlay: 7000,
			cellAlign: 'center',
			pageDots: false,
			prevNextButtons: false,
		})
    }

    //Cards Slider
    let widthAll = () => window.innerWidth
    window.addEventListener('resize', () => widthAll())

    let w = widthAll()
    const card = document.querySelector('#card')
    let position = ''

    if (w <= 834 && w > 425) {
        position = 'center'
    } else {
        position = 'left'
	}
	
	if (card) {
		const cardSlider = new Flickity(card, {
			cellSelector: '.card__wrapper',
			wrapAround: true,
			pageDots: false,
			prevNextButtons: false,
			cellAlign: position,
		})
    }
    //========================================================================================================================================================
})
