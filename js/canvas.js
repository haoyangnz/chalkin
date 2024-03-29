var mode = 'move'

var chalk = '#BCBDB8'

var start
var end
var textGuide

var x = 0
var y = 0

//mode = 'text'
load()

function onMouseDown(event) {
	if (mode == 'move' || mode == 'text') {
		start = event.point
	}
	else if (mode == 'erase') {
		// TODO
	}
}

function onMouseDrag(event) {
	if (mode == 'move') {
		var dx = start.x - event.point.x
		var dy = start.y - event.point.y
		x += dx
		y += dy
		project.activeLayer.position -= [dx, dy]
		start = event.point
	}
	else if (mode == 'text') {
		textGuide.removeSegments()
		textGuide.add(start, event.point)
	}
}

function onMouseUp(event) {
	if (mode == 'move') {
		load()
	}
	else if (mode == 'text') {
		end = event.point
		textGuide.removeSegments()
		var input = prompt('Input text', '')
		if (input && input != '') {
			var text = new PointText(start)
			text.content = input
			text.fillColor = chalk
			text.fontSize = 30
			text.fontFamily = 'Comic Sans MS'
			text.rotate(Math.atan((end.y - start.y) / (end. x - start.x)) * 180 / (Math.PI), start)
			
			// Store object
			var xhr = new XMLHttpRequest()
			xhr.open('POST', 'item', true)
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
			var item = JSON.parse(text.exportJSON())
			item[1].matrix[4] += x
			item[1].matrix[5] += y
			xhr.send(JSON.stringify({ bounds: {x: text.bounds.x + x, y: text.bounds.y + y, width: text.bounds.width, height: text.bounds.height}, item: JSON.stringify(item)  }))
			xhr.onloadend = function () {
				// done
			}
		}
	}
}

function onKeyDown(event) {
	if (event.key == 't') {
		mode = 'text'
	}
	else if (event.key == 'm') {
		mode = 'move'
	}
	else if (event.key == 'e') {
		mode = 'erase'
	}
}

function load() {
	//project.activeLayer.removeChildren() XXX Commented out to prevent harsh refresh but is this need to prevent memory leak?
	textGuide = new Path()
	textGuide.strokeColor = chalk
	textGuide.strokeWidth = 3
	get('item?x=' + (x - view.size.width) + '&y=' + (y - view.size.height) + '&width=' + (view.size.width * 3) + '&height=' + (view.size.height * 3), function(res) {
		json = JSON.parse(res)
		json.forEach(function(onejson) {
			var item = JSON.parse(onejson.item)
			item[1].matrix[4] -= x
			item[1].matrix[5] -= y
			project.activeLayer.importJSON(item)
		})
	})
}

function get(url, callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.response);
	}
	xmlHttp.open("GET", url, true); // true for asynchronous 
	xmlHttp.send(null);
}
