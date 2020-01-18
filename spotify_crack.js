const Plugin = require("../plugin")

module.exports = new Plugin({
    name: "Spotify Crack",
    author: "Juby210#0577",
    description: "Spotify listen along without premium!",
    color: "#0000ff",
    load: () => {
        let f = findModule('ActionTypes')
        monkeyPatch(findModule('getProfile'), 'getProfile', b => {
            return findModule("default").default.dispatch({
                type: f.ActionTypes.SPOTIFY_PROFILE_UPDATE,
                accountId: b.methodArguments[0],
                isPremium: true
            })
        })
        monkeyPatch(findModule('isSpotifyPremium'), 'isSpotifyPremium', () => true)
	},
    unload: () => {
        let m = findModule('getProfile').getProfile
        if(m.__monkeyPatched) m.unpatch()
        m = findModule('isSpotifyPremium').isSpotifyPremium
        if(m.__monkeyPatched) m.unpatch()
    }
})