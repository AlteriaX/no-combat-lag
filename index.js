const brooch = [19702, 19703, 19705, 19706, 51011, 51028, 51029, 51030, 98404, 98405, 98406]

module.exports = function NoCombatLag(mod) {
	
	let gameId,
		inCombat = false,
		broochActive = false,
		viewInven = false
		
	const players = {}
	
	mod.hook('S_LOGIN', 14, event => { gameId = event.gameId })
	
	mod.hook('S_USER_STATUS', 3, event => {
		if(event.gameId == gameId) {
			if(event.status == 1) {
				inCombat = true
			}
			else inCombat = false
		}
	})
	
	// Thanks Lekki
	mod.hook('S_SPAWN_USER', 15, event => { players[event.gameId] = true })
	mod.hook('S_DESPAWN_USER', 3, event => { delete players[event.gameId] })

	mod.hook('S_EACH_SKILL_RESULT', 14, { order: 101 }, event => {
		if ((players[event.source] || players[event.owner]) && event.target !== gameId) {
			if (players[event.target]) return
			event.target = 0
			event.id = event.type = event.noctEffect = 0
			event.value = 0
			event.crit = event.stackExplode = false
			event.superArmor = false
			event.superArmorId = event.hitCylinderId = 0
			return true
		}
	})
	
	mod.hook('C_SHOW_ITEMLIST', 1, event => {
		viewInven = true
		setTimeout(function(){ viewInven = false }, 1000)
	})
	
	mod.hook('S_ITEMLIST', 3, event => {
		if((inCombat && !viewInven) || (broochActive && !viewInven)) return false
	})
	
	mod.hook('S_INVEN_USERDATA', 2, event => {
		if((inCombat && !viewInven) || (broochActive && !viewInven)) return false
	})
	
	mod.hook('C_USE_ITEM', 3, event => {
		if(brooch.includes(event.id)) {
			broochActive = true
			setTimeout(function(){ broochActive = false }, 5000)
		}
	})	
}