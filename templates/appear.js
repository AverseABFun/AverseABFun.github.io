var elements = document.querySelectorAll(".appear")

elements.forEach((el) => {
    el.style.opacity = "0"
})

var index = 0
function runOnElement() {
    var el = elements[index]
    var callThis = () => {
        if (parseFloat(el.style.opacity) >= 1) {
            if (index < elements.length) {
                setTimeout(runOnElement, 500)
            }
            return
        }
        var op = parseFloat(el.style.opacity)
        if (el.style.opacity == "") {
            op = 0
        }
        el.style.opacity = (op + 0.01).toString(10)
        setTimeout(callThis, 10)
    }
    setTimeout(callThis, 10)
    index++
}

runOnElement()