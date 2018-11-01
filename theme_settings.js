const Plugin = require("../plugin");
const fs = require("fs");
const path = require("path");
const themesDir = path.join(process.env.injDir, "themes");
let config;
let files = [];

function makeThemeToggle(opts = {}) {
    const a = window.ED.classMaps.alignment;
    const sw = window.ED.classMaps.switchItem;
    const cb = window.ED.classMaps.checkbox;
    const b = window.ED.classMaps.buttons;

    return `<div id="${opts.title}-wrap" class="${a.vertical} ${a.justifyStart} ${a.alignStretch} ${a.noWrap} ${sw.switchItem}" style="flex: 1 1 auto;">
    <div class="${a.horizontal} ${a.justifyStart} ${a.alignStart} ${a.noWrap}" style="flex: 1 1 auto;">
        <h3 class="${sw.titleDefault}" style="flex: 1 1 auto;">${opts.title}</h3>
        ${opts.color ? ` <div class="status" style="background-color:${opts.color}; box-shadow:0 0 5px 2px ${opts.color};margin-left: 5px; border-radius: 50%; height: 10px; width: 10px; position: relative; top: 6px; margin-right: 8px;"></div>` : ''}
        <div id="${opts.title}" class="${cb.switchEnabled} ${getThemeSetting(opts.title) ? cb.valueChecked : cb.valueUnchecked} ${cb.sizeDefault} ${cb.themeDefault}">
            <input type="checkbox" class="${cb.checkboxEnabled}" value="on">
        </div>
    </div>
    <div class="${ED.classMaps.divider} ${sw.dividerDefault}"></div>
</div>`;
}

function loadCSS(file) {
    fs.readFile(path.join(themesDir, file), (err, data) => {
        if(err) return;
        var css = document.createElement('style');
        css.id = file + "-style";
        css.innerHTML = data;
        document.head.appendChild(css);
        files.push(file);
    });
}

function unloadCSS(file) {
    var css = document.getElementById(file + "-style");
    if(css) {
        document.head.removeChild(css);
        var index = files.indexOf(file);
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
    fs.writeFile(path.join(process.env.injDir, "plugins", "theme_settings.json"), JSON.stringify(config));
}

function readConfig() {
    var configp = path.join(process.env.injDir, "plugins", "theme_settings.json");
    return new Promise((resolve, reject) => {
        fs.exists(configp, ex => {
            if(!ex) fs.open(configp, 'w', err => {});
            fs.readFile(configp, (err, data) => {
                if(data == '') return resolve("{}");
                resolve(data);
            });
        });
    });
}

function getThemeSetting(file) {
    if(config[file]) return config[file];
    return false;
}

const addTab = (header, tabsM) => {
    let themesTab = document.createElement('div');
    themesTab.className = tabsM.itemDefault + ' ed-settings';
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
            settingsPane.innerHTML = `<h2 class="${contentM.h2} ${contentM.defaultColor}" style="display: inline;">EnhancedDiscord Themes</h2><div class="${contentM.marginBottom20}"></div>`;
            let files = fs.readdirSync(themesDir).filter(file => file.endsWith('.css'));
            for (const file of files) {
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
	author: "Juby210#5831",
	description: "Adds Themes tab to EnhancedDiscord",
	color: "#f44336",
	load: async () => {
        readConfig().then(cfg => {
            config = JSON.parse(cfg);

            let files = fs.readdirSync(themesDir).filter(file => file.endsWith('.css'));
            for (const file of files) {
                if(getThemeSetting(file)) {
                    loadCSS(file);
                }
            }

            monkeyPatch( findModule('getUserSettingsSections').default.prototype, 'render', function() {
                const tabsM = findModule('itemSelected');
                let header = document.getElementsByClassName(tabsM.header + ' ed-settings')[0];
                if(header) {
                    addTab(header, tabsM);
                } else {
                    setTimeout(() => {addTab(header, tabsM)}, 10);
                }
                return arguments[0].callOriginalMethod(arguments[0].methodArguments);
            });
        });
	},
	unload: () => {
        findModule('getUserSettingsSections').default.prototype.render.unpatch();
        unloadallCSS();
    }
});