const Plugin = require("../plugin");
const fs = require("fs");
const path = require("path");
const themesDir = path.join(process.env.injDir, "themes");
let config;
let files = [];
let files2 = [];

function makeThemeToggle(opts = {}) {
    const a = window.ED.classMaps.alignment;
    const sw = window.ED.classMaps.switchItem;
    const cb = window.ED.classMaps.checkbox;

    return `<div id="${opts.title}-wrap" class="${a.vertical} ${a.justifyStart} ${a.alignStretch} ${a.noWrap} ${sw.switchItem}" style="flex: 1 1 auto;">
    <div class="${a.horizontal} ${a.justifyStart} ${a.alignStart} ${a.noWrap}" style="flex: 1 1 auto;">
        <h3 class="${sw.titleDefault}" style="flex: 1 1 auto;">${opts.title}</h3>
        <div id="${opts.title}" class="${cb.switchEnabled} ${getThemeSetting(opts.title) ? cb.valueChecked : cb.valueUnchecked} ${cb.sizeDefault} ${cb.themeDefault}">
            <input type="checkbox" class="${cb.checkboxEnabled}" value="on">
        </div>
    </div>
    <div class="${ED.classMaps.divider} ${sw.dividerDefault}"></div>
</div>`;
}

function loadCSS(file) {
    let data = fs.readFileSync(path.join(themesDir, file));
    let css = document.createElement('style');
    css.id = file + "-style";
    css.innerHTML = data;
    document.head.appendChild(css);
    files.push(file);
}

function unloadCSS(file) {
    let css = document.getElementById(file + "-style");
    if(css) {
        document.head.removeChild(css);
        let index = files.indexOf(file);
        if (index != -1) files.splice(index, 1);
    }
}

function unloadallCSS() {
    files.forEach(file => {
        unloadCSS(file);
    });
}

function toggle(file) {
    const cbM = window.ED.classMaps.checkbox;
    if(!config[file]) {
        config[file] = true;
        document.getElementById(file).className = document.getElementById(file).className.replace(cbM.valueUnchecked, cbM.valueChecked);
        loadCSS(file);
    } else {
        config[file] = false;
        document.getElementById(file).className = document.getElementById(file).className.replace(cbM.valueChecked, cbM.valueUnchecked);
        unloadCSS(file);
    }
    writeConfig();
}

function writeConfig() {
    fs.writeFileSync(path.join(process.env.injDir, "plugins", "theme_settings.json"), JSON.stringify(config));
}

function readConfig() {
    let configp = path.join(process.env.injDir, "plugins", "theme_settings.json");
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(configp)) fs.openSync(configp, "w");
        let data = fs.readFileSync(configp);
        if(data == '') return resolve("{}");
        resolve(data);
    });
}

function getThemeSetting(file) {
    if(config[file]) return config[file];
    return false;
}

const addTab = (header, tabsM) => {
    let themesTab = document.createElement('div');
    themesTab.className = tabsM.itemDefault + ' ed-settings';
    themesTab.id = "ed-ttab";
    themesTab.innerHTML = 'Themes';
    header.parentNode.insertBefore(themesTab, header.nextSibling);
    const contentM = ED.classMaps.headers = findModule('defaultMarginh2');
    const concentCol = findModule('contentColumn');

    themesTab.onclick = function(e) {
        let settingsPane = document.querySelector(`.${concentCol.standardSidebarView} .${concentCol.contentColumn} > div`);
        let otherTab = document.querySelector('.' + tabsM.item + '.' + tabsM.selected);
        if (otherTab) {
            otherTab.className = otherTab.className.replace(tabsM.itemSelected, tabsM.itemDefault);
        }
        //console.log(otherTab);
        this.className = this.className.replace(tabsM.itemDefault, tabsM.itemSelected);

        if (settingsPane) {
            let themebtnstyle = `
                    border-radius: 3px;
                    display: inline-block;
                    margin-left: 15px;
                    margin-bottom: 2px;
                    background: #7289da;
                    color: #ffffff;
                    padding: 2px;
                `;
            
            settingsPane.innerHTML = `<h2 class="${contentM.h2} ${contentM.defaultColor}" style="display: inline;">EnhancedDiscord Themes</h2><button class="ed-themebtn" onclick='require("electron").shell.openItem(require("path").join(process.env.injDir, "themes"))' style="${themebtnstyle}">Open Themes Folder</button><div class="${contentM.marginBottom20}"></div>`;
            let filesd = fs.readdirSync(themesDir).filter(file => file.endsWith('.css'));
            for (const file of filesd) {
                settingsPane.innerHTML += makeThemeToggle({path: path.join(themesDir, file), title: file});
                setTimeout(() => {
                    document.getElementById(file).addEventListener('click', () => {
                        toggle(file);
                    });
                }, 10);
            }
        }
        e.stopPropagation(); // prevent from going to parent click handler
    }
}

module.exports = new Plugin({
    name: "Theme Settings",
    author: "Juby210#2100",
    description: "Adds Themes tab to EnhancedDiscord",
    preload: true,
    color: "#f44336",
    load: () => {
        if(!fs.existsSync(themesDir)) fs.mkdirSync(themesDir);
        readConfig().then(cfg => {
            config = JSON.parse(cfg);

            let files = fs.readdirSync(themesDir).filter(file => file.endsWith('.css'));
            for (const file of files) {
                if(getThemeSetting(file)) {
                    loadCSS(file);
                }
            }

            monkeyPatch(findModule('getUserSettingsSections').default.prototype, 'render', function() {
                if(document.getElementById("ed-ttab")) return arguments[0].callOriginalMethod(arguments[0].methodArguments);
                setTimeout(() => {
                    const tabsM = findModule('itemSelected');
                    let header = document.getElementsByClassName(tabsM.header + ' ed-settings')[0];
                    if(header) {
                        addTab(header, tabsM);
                    } else {
                        setTimeout(() => {addTab(header, tabsM)}, 10);
                    }
                }, 10);
                return arguments[0].callOriginalMethod(arguments[0].methodArguments);
            });
        });
        
        document.onkeyup = key => {
            let lst = (files.length == 0);
            if (key.ctrlKey && key.which == 66) {
                if (lst) {
                    files2.forEach(file => {
                        let index = files2.indexOf(file);
                        if (index != -1) files2.splice(index, 1);
                        loadCSS(file);
                    });
                } else {
                    files.forEach(file => {
                        files2.push(file);
                        unloadCSS(file);
                    });
                }
            }
        }
	},
    unload: () => {
        findModule('getUserSettingsSections').default.prototype.render.unpatch();
        unloadallCSS();
        document.onkeyup = null;
    }
});