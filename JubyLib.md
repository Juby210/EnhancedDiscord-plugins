# JubyLib
**Example:**
```js
const Plugin = require("../plugin");
let jlSrc = "https://juby.cf/jl/JubyLib.js";
let jlVer = {min: 0.22, max: 0.29, tested: 0.22}; // min is min version supported; max is max version supported; tested is tested version

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

* * *

## Class: Embed
**title**: `string` , Embed title

**description**: `string` , Embed description

**color**: `string` , Embed color hex without #

**image**: `string` , Image url

**thumbnail**: `string` , Thumbnail url

**footer**: `object` 

**author**: `object` 

**fields**: `array` , Array of objects

### JubyLib.Embed.setFooter(text, iconUrl) 

Set embed footer

**Parameters**

**text**: `string`, Text

**iconUrl**: `string`, Icon url


### JubyLib.Embed.setAuthor(text, iconUrl) 

Set embed author

**Parameters**

**text**: `string`, Text

**iconUrl**: `string`, Icon url


### JubyLib.Embed.addField(name, value, inline) 

Add field

**Parameters**

**name**: `string`, Field name

**value**: `string`, Field value

**inline**: `boolean`, Field inline

* * *
# JubyLib


### JubyLib.load() 

Init library



### JubyLib.unload() 

Remove library from discord



### JubyLib.getSelectedChannel() 

Get selected channel id

**Returns**: `string`


### JubyLib.sendMessage(channelId, content) 

Send message to channel

**Parameters**

**channelId**: `string`, Channel id to send message

**content**: `string`, Message content



### JubyLib.sendEmbed(channelId, content, embed) 

Send embed to channel

**Parameters**

**channelId**: `string`, Channel id to send message

**content**: `string`, Message content

**embed**: `JubyLib.Embed`, Embed class



### JubyLib.popup(title, content, btnName, height, btnClickListener, closePopupListener) 

Create popup window like discord changelog.

**Parameters**

**title**: `string`, Popup title

**content**: `string`, Popup content: HTML/text

**btnName**: `string`, Button name

**height**: `string`, Popup height

**btnClickListener**: `function`, Button click listener

**closePopupListener**: `function`, Close popup listener



### JubyLib.popupCategory(name, content, defaultHidden) 

Generate category HTML like this: 

![preview](https://i.imgur.com/kRbIU2b.gif)

**Parameters**

**name**: `string`, Category name

**content**: `string`, Content HTML

**defaultHidden**: `boolean`, defaultHidden category? | default: true



### JubyLib.setPresence() 

Set user rich presence

(id, name, details, state, time = true)



### JubyLib.clearPresence() 

Clear user rich presence



## Class: updatesModule


### JubyLib.updatesModule.getPluginsDir() 

Get plugins install dir


### JubyLib.updatesModule.check(jsonUrl, pluginName, pluginVersion, pluginUrl) 

Check plugin update and show popup

**Parameters**

**jsonUrl**: `string`, Plugins versions json url

**pluginName**: `string`, Plugin name

**pluginVersion**: `double`, Plugin version

**pluginUrl**: `string`, Plugin update url



## Class: version
**v**: `double` , JubyLib version number (e.g. 0.1 0.11 0.2)

**name**: `string` , JubyLib version name (e.g. BETA 0.1)


# hasJubyLib
Check if JubyLib is added to discord


* * *

*© Juby210 2018*

**Author:** Juby210

**License:** Apache2 

**Version:** 0.22
