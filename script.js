const inputArea = document.getElementById("input-area")
const markdownOut = document.getElementById("md-out")
const loadFileButton = document.getElementById("loadfile-button");
const saveFileDbButton = document.getElementById("savefile-db-button");
const saveFilePcButton = document.getElementById("savefile-pc-button");
const filename = document.getElementById("filename")
const darkmodeButton = document.getElementById("darkmode-button");
const darkmodeIcon = document.getElementById("darkmode-icon");


let darkModeEnabled = localStorage.getItem("md-dark-mode-enabled") ?? true;
setColorMode();
const shortcuts = {
    "Ctrl+B": "Bold selected text",
    "Ctrl+I": "Make selected text italic",
    "Ctrl+U": "Underline selected text",
    "Ctrl+3": "Make current line a header",
    "Ctrl+.": "Make current line a blockquote",
    "Ctrl+S": "Save current markdown",
    "Ctrl+/ or Ctrl+H": "Markdown cheatsheet"
}

function getShortcuts(separator = "\n") {
    let res = "";
    for (const shortcut in shortcuts) {
        res += `${shortcut} - ${shortcuts[shortcut]}${separator}`
    }
    return res;
}
inputArea.addEventListener('input', () => {
    markdownOut.innerHTML = marked.parse(inputArea.value);
})

loadFileButton.addEventListener('click', importFile)
saveFilePcButton.addEventListener('click', () => download(inputArea.value, `${filename.value}.md`))
darkmodeButton.addEventListener('click', toggleDarkMode);

document.addEventListener('keydown', (e) => {
    const selection = window.getSelection().toString();

    if (ctrlPlus('b', e) && selection) {

        inputArea.value = inputArea.value.replace(selection, `**${selection}**`)
    } else if (ctrlPlus('i', e) && selection) {
        e.preventDefault();
        inputArea.value = inputArea.value.replace(selection, `*${selection}*`)
    } else if (ctrlPlus('u', e)) {
        e.preventDefault();
        if (selection) inputArea.value = inputArea.value.replace(selection, `<u>${selection}</u>`)
    } else if (ctrlPlus("3", e)) {
        e.preventDefault();
        console.log(getLineNumber(inputArea))
        let lines = inputArea.value.split("\n")
        let line = lines[getLineNumber(inputArea) - 1];
        if (line.startsWith("######")) line = line.replace("######", "")
        lines[getLineNumber(inputArea) - 1] = (line.startsWith("#") ? "#" : "# ") + line;
        lines = lines.join("\n");
        inputArea.value = lines;
    } else if (ctrlPlus(".", e)) {
        e.preventDefault();
        let lines = inputArea.value.split("\n")
        const line = lines[getLineNumber(inputArea) - 1];
        lines[getLineNumber(inputArea) - 1] = "> " + (line ?? "");
        lines = lines.join("\n");
        inputArea.value = lines;
    } else if (ctrlPlus("s", e)) {
        e.preventDefault();
        if (inputArea.value.length > 0) download(inputArea.value, `${filename.value}.md`)
    } else if (ctrlPlus("/", e) || ctrlPlus("h", e)) {
        e.preventDefault();
        window.open("https://www.markdownguide.org/cheat-sheet/")
    } else if (ctrlPlus("F1", e)) {
        e.preventDefault();
        alert(`Shortcuts:\n\n${getShortcuts()}`)
    }
    // console.log(e.key)

    markdownOut.innerHTML = marked.parse(inputArea.value);
}, true)

function ctrlPlus(key, e) {
    return e.key == key && e.ctrlKey
}
function getLineNumber(textarea) {
    return textarea.value.substr(0, textarea.selectionStart) // get the substring of the textarea's value up to the cursor position
        .split("\n") // split on explicit line breaks
        .map((line) => 1 + Math.floor(line.length / 10000)) // count the number of line wraps for each split and add 1 for the explicit line break
        .reduce((a, b) => a + b, 0); // add all of these together
};

function importFile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = ".md,.txt,.html"
    input.onchange = async () => {
        let files = Array.from(input.files);
        const text = await files[0].text();
        const name = files[0].name.split('.')[0];
        console.log(name)
        filename.value = name;
        inputArea.value = text;
        markdownOut.innerHTML = marked.parse(inputArea.value);

    };
    input.click();

}

function download(data, filename) {
    var file = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    localStorage.setItem("md-dark-mode-enabled", darkModeEnabled)
    setColorMode();
}

function setColorMode() {
    console.log(darkModeEnabled)
    if (darkModeEnabled) {

        document.body.style.setProperty("--highlighted-text-bg", "rgb(203, 203, 203)")
        document.body.style.setProperty("--bg-color", "#e0e0e0")
        document.body.style.setProperty("--text-color-1", "#000")
        document.body.style.setProperty("--button-bg-color", "rgb(181,181,181)")
        document.body.style.setProperty("--button-hover-bg-color", "rgb(158, 158, 158)")
        document.body.style.setProperty("--input-area-bg-color", "#cbcbcb")
        document.body.style.setProperty("--text-color", "#000")
        document.body.style.setProperty("--filename-color", "#777")
        document.body.style.setProperty("--md-out-bg-color", "#fff")
        document.body.style.setProperty("--scrollbar-bg", "rgb(178,178,178)")
        document.body.style.setProperty("--scrollbar-thumb-bg", "rgb(141,141,141)")

        darkmodeIcon.className = "fa-solid fa-moon";
    } else {

        document.body.style.setProperty("--highlighted-text-bg", "rgb(24, 24, 24)")
        document.body.style.setProperty("--bg-color", "#333")
        document.body.style.setProperty("--text-color-1", "#999")
        document.body.style.setProperty("--button-bg-color", "rgb(39,39,39)")
        document.body.style.setProperty("--button-hover-bg-color", "rgb(30, 30, 30)")
        document.body.style.setProperty("--input-area-bg-color", "#111")
        document.body.style.setProperty("--text-color", "#fff")
        document.body.style.setProperty("--filename-color", "#888")
        document.body.style.setProperty("--md-out-bg-color", "#1f1f1f")
        document.body.style.setProperty("--scrollbar-bg", "rgb(23,23,23)")
        document.body.style.setProperty("--scrollbar-thumb-bg", "rgb(15,15,15)")

        darkmodeIcon.className = "fa-solid fa-sun";
    }
}