# JubyLib
Simple library for EnhancedDiscord plugins.

## JubyLib Class
### .version: Object
**.v**: Double (e.g. 0.1 0.11 0.2)

**.name**: String (e.g. BETA 0.1)

### .load()
Init library

### .unload()
Remove library from discord

### .sendMessage(channelId, content)
Send message to channel

### .sendEmbed(channelId, content, embedTitle, embedDescription, embedColor, embedImage, embedFooter = {text: "", icon_url: ""})
Send embed to channel

### .popup(title = "Awesome Popup", content = "", btnName = "OK", height = "auto", btnClickListener = () => {}, closePopupListener = () => {})
Create popup window like discord changelog.

### .popupCategory(name, content, defaultHidden = true): String(HTML)
Generate category HTML like this:

![preview](https://i.imgur.com/kRbIU2b.gif)

### .setPresence(id, name, details, state, time = true)
Set user rich presence

### .clearPresence()
Clear user rich presence

### .getSelectedChannel(): String
Get selected channel id

### .updatesModule: Object
**.check(jsonUrl, pluginName, pluginVersion, pluginUrl)**: Check plugin update and show popup

## hasJubyLib: Bool
Check if JubyLib is added to discord

## How to use
```js
const Plugin = require("../plugin");
let jlSrc = "https://juby.cf/jl/JubyLib.js";
let jlVer = {min: 0.2, max: 0.29, tested: 0.2}; // min is min version supported; max is max version supported; tested is tested version

function loadJL() {
    let jl = document.createElement("script");
    jl.id = "JubyLib-script";
    jl.src = jlSrc;
    document.head.appendChild(jl);

    jl.onload = () => {
        if(jlVer.max <= JubyLib.version.v || (jlVer.min >= JubyLib.version.v && jlVer.min != JubyLib.version.v)) {
            jlSrc = `https://juby.cf/jl/JubyLib-${jlVer.tested}.js`;
            JubyLib.unload();
            loadJL();
        } else {
            JubyLib.load();
            checkUpdate();
        }
    };
}

function checkUpdate() {
    JubyLib.updatesModule.check("http://localhost/example.json", "Example", 1.0, "http://localhost/example.js");
}
module.exports = new Plugin({
	name: "Example for JubyLib",
	author: "Juby210#5831",
    description: "https://github.com/juby210-PL/EnhancedDiscord-plugins",
	load: () => {
        try {
            if(!hasJubyLib) loadJL(); else checkUpdate();
        } catch(e) {loadJL();}
    }
});
```