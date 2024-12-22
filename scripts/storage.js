
/*토스트 알림*/
let removeToast;

function toast(string) {
    const toast = document.getElementById("toast");

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 2000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 2000)
    toast.classList.add("reveal"),
        toast.innerText = string
}

let removeToast2;

function toast2(string) {
    const toast2 = document.getElementById("toast2");

    toast2.classList.contains("reveal") ?
        (clearTimeout(removeToast2), removeToast2 = setTimeout(function () {
            document.getElementById("toast2").classList.remove("reveal")
        }, 2000)) :
        removeToast2 = setTimeout(function () {
            document.getElementById("toast2").classList.remove("reveal")
        }, 2000)
    toast2.classList.add("reveal"),
        toast2.innerText = string
}