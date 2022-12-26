//Phone input and validate
export function validatePhone() {
    let phoneInputs = document.querySelectorAll('input[data-tel]')

    if (phoneInputs.length) {
        let getInputNumberOnly = function (input) {
            return input.value.replace(/\D/g, '')
        }
        const onPhoneInput = function (e) {
            const input = e.target
            const inputNumbersValue = getInputNumberOnly(input)
            let formattedInputValue = ''
            let selectionStart = input.selectionStart
            if (!inputNumbersValue) return (input.value = '')

            if (input.value.length != selectionStart) {
                if (e.data && /\D/g.test(e.data))
                    input.value = inputNumbersValue
                return
            }

			formattedInputValue = '+3 80 ' + inputNumbersValue.substring(3, 5)
			if (inputNumbersValue.length > 5) {
				formattedInputValue += ' ' + inputNumbersValue.substring(5, 8)
			}
			if (inputNumbersValue.length > 8) {
				formattedInputValue += ' ' + inputNumbersValue.substring(8, 10)
			}
			if (inputNumbersValue.length > 10) {
				formattedInputValue += ' ' + inputNumbersValue.substring(10, 12)
			}

            input.value = formattedInputValue
        }
        const onPhoneKeyDown = function (e) {
            const input = e.target
            if (8 == e.keyCode && 3 == getInputNumberOnly(input).length)
                input.value = ''
        }
        const onPhonePaste = function (e) {
            let pasted = e.clipboardData || window.clipboardData
            let input = e.target
            let inputNumberValue = getInputNumberOnly(input)
            if (pasted) {
                let pastedText = pasted.getData('Text')
                if (/\D/g.test(pastedText)) input.value = inputNumberValue
            }
        }

        phoneInputs.forEach((input) => {
            input.addEventListener('input', onPhoneInput)
            input.addEventListener('keydown', onPhoneKeyDown)
            input.addEventListener('paste', onPhonePaste)
        })
    }
}
