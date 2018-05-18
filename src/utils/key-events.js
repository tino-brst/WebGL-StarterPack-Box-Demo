var activeKeys = new Map()
var actions = []

export function addAction(keys, callback) {
	actions.push({
		keys: keys,
		callback: callback
	})
	// Reordeno acciones de mayor a menor cantidad de teclas
	// (prioridad de "Shift" + "ArrowUp" > "ArrowUp" durante el scan)
	actions.sort((a, b) => { return b.keys.length - a.keys.length })
}

function onKeyChange(event) {
	activeKeys.set(event.code, event.type === "keydown")
	checkActions()
}

function checkActions() {
	for (var i = 0; i < actions.length; i++) {
		var runAction = true
		for (var j = 0; j < actions[i].keys.length; j++) {
			if (!activeKeys.get(actions[i].keys[j])) {
				runAction = false
				break
			}
		}
		if (runAction) {
			actions[i].callback()
			break
		}
	}
}

window.onkeydown = window.onkeyup = onKeyChange

