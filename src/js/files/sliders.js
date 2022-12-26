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
			autoPlay: 7000,
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

    //========================================================================================================================================================
    //Block stick and slide text
	const stickySwipeSection = document.querySelector('.buy-imposible');
	
    if (stickySwipeSection) {
		const stickySwiperWrapper = stickySwipeSection.querySelector('.buy-imposible__wrapper'),
			  stickySwipeContainer = stickySwipeSection.querySelector('.buy-imposible__container'),
			  stickySwipeBody = stickySwipeSection.querySelector('.slider-imposible__body'),
			  stickySwipeElements = stickySwipeSection.querySelectorAll('.slider-imposible__item')
		let width = window.getComputedStyle(stickySwipeContainer).width,
			animationSpeed = stickySwipeSection.getAttribute('data-slide_speed'),
			throttleDelay = stickySwipeSection.getAttribute('data-throttle_scroll'),
			pinedLenght = stickySwipeSection.getAttribute('data-pined'),
			ScrollTop = 0,
			swiperOffset = 0;

		stickySwipeSection.style.height = `${pinedLenght}vh`
		
		stickySwipeBody.style.width = 100 * stickySwipeElements.length + '%'
		stickySwipeBody.style.transform = `translateX(${width})`
		
		stickySwipeElements.forEach(slide => {
			slide.style.width = width
		})
        //slide position
		function moveSlidesForward() {
			if (swiperOffset <= parseInt(width) * (stickySwipeElements.length - 1)) {
				stickySwipeBody.style.transform = `translateX(-${swiperOffset}px)`
				stickySwipeBody.style.transition = `transform ${animationSpeed / 1000}s ease 0s`
				swiperOffset += parseInt(width)
			}
		}

		function moveSlidesBack() {
			if (swiperOffset != 0) {
                swiperOffset -= parseInt(width)
                stickySwipeBody.style.transform = `translateX(-${swiperOffset}px)`
                stickySwipeBody.style.transition = `transform ${animationSpeed / 1000}s ease 0s`
            }
		}

        function throttle(func, wait) {
            let waiting = false
            return function () {
                if (waiting) {
                    return
                }

                waiting = true
                setTimeout(() => {
                    func.apply(this, arguments)
                    waiting = false
                }, wait)
            }
        }

		const onScroll = throttle(() => {
			const currentScrollTop = document.documentElement.scrollTop
			console.log(ScrollTop > currentScrollTop)
			console.log('Offset', swiperOffset)
			if (stickySwiperWrapper.getBoundingClientRect().top == 0 && (ScrollTop > currentScrollTop) === false) {
				moveSlidesForward()
			}
			if (stickySwiperWrapper.getBoundingClientRect().top == 0 && ScrollTop > currentScrollTop) {
				moveSlidesBack()
			}
			
            ScrollTop = currentScrollTop
        }, throttleDelay)
		
		window.addEventListener('scroll', onScroll)
    }
})
