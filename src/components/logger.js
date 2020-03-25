const levelsColors = {
    "alert": "#ee4035",
    "error": "#ee4035",
    "warn": "#ff6700",
    "setup": "#7bc043",
    "traffic": "#422c6b",
    
    "red": "#ee4035",
    "orange": "#ff6700",
    "purpule": "#422c6b",
    "green": "#7bc043",
    "blue": "#0392cf"
}

const levelLabelCssBase = {
    "color": "#ffffff",
    "padding": "0px 10px",
    "border-radius": "20px",
    "text-decoration": "none",
    "margin-left": "10px"
}

const labelCssBaseString = Object.keys(levelLabelCssBase).reduce((css, key) => {
    css.push(`${key}:${levelLabelCssBase[key]}`)
    return css;
}, []).join(";");

function labelCss(level) {
    return `${labelCssBaseString};background-color:${levelsColors[level]};`
}

function parseURL(url){
    let _url = new URL(url);
    return `${_url.protocol === "https:" ? '' : '\u2139'}${_url.host.replace(/^www./,"www\u22c5")}`
}

const _log = console.log;
function postMessagesInspectorLog(level, message, ...dataObjects) {
    const args = [
        `%c${level}%c${location.hostname}%c${message}`,
        labelCss(level),
        "margin: 0 10px; font-weight: 700; text-decoration: none; font-style: italic; color:#001f3f; background-color:#eee; padding: 0px 5px; border-radius: 2px",
        "color:black;"
    ]
    args.push();
    args.push();
    console.groupCollapsed.apply(this, args);
    console.group("Window");
    _log(`location: ${window.location.href}`);
    _log(`Is top: ${self===top}`);
    _log(`Number of Child Frames ${window.frames.length}`)
    if (self!==self.parent) _log(`Number of Sibling Frames ${window.frames.length}`)
    console.groupEnd();
    if (dataObjects.length){
        console.group("Data");
        dataObjects.forEach(_log);
        console.groupEnd();
    }
    console.groupEnd();
}

module.exports = postMessagesInspectorLog