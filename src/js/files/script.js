window.addEventListener('DOMContentLoaded', () => {
    // Player control
    const playBtns = document.querySelectorAll('.card__play-btn')

    if (playBtns.length) {
        document.addEventListener('click', (e) => {
            const target = e.target

            playBtns.forEach((el) => {
                if (target.closest('.card__play-btn') === el) {
                    const video = el.previousElementSibling

                    if (video.paused) {
                        video.play()
                        el.hidden = true
                    }
                    video.addEventListener('ended', () => {
                        el.hidden = false
                    })
                }
            })
            if (target === target.closest('video')) {
                target.closest('video').pause()
                target.closest('video').nextElementSibling.hidden = false
            }
        })
    }

    //Social sharing

    let fbLink = document.querySelector('#facebook'),
        twLink = document.querySelector('#twitter'),
        copyLink = document.querySelector('#copy-link'),
        url = window.location.href

    if (fbLink) {
        fbLink.href = `https://www.addtoany.com/add_to/facebook?linkurl=${url}`
    }
    if (twLink) {
        twLink.href = `https://www.addtoany.com/add_to/twitter?linkurl=${url}`
    }

    const copyLinkUrl = async () => {
        try {
            if (window.isSecureContext && navigator.clipboard) {
                await navigator.clipboard.writeText(url)
                console.log('Content copied to clipboard')
            }
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }
    if (copyLink) {
        copyLink.addEventListener('click', copyLinkUrl)
    }

    //Дія після успішного надсилання форми
    document.addEventListener('formSent', function (e) {
        // Форма
        const currentForm = e.detail.form
        if (currentForm) {
            window.open('/thankyou.html', '_self')
        }
    })

    //Автоматичне додавання посилання на кнопку Повернення на сайт
    const backToHomeLink = document.querySelector('.footer__link')
    function addHomeUrl(targetLink) {
        if (targetLink) {
            const homeUrl = window.location.hostname
            targetLink.href = '/'
        }
    }
    addHomeUrl(backToHomeLink)
})
