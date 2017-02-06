var mode = 'move'

var chalk = '#BCBDB8'

var start
var end
var textGuide

var x = 0
var y = 0

mode = 'text'
load()

function onMouseDown(event) {
	if (mode == 'text') {
		start = event.point
	}
}

function onMouseDrag(event) {
	if (mode == 'text') {
		textGuide.removeSegments()
		textGuide.add(start, event.point)
	}
}

function onMouseUp(event) {
	if (mode == 'text') {
		end = event.point
		textGuide.removeSegments()
		var input = prompt('Input text', '')
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
		project.activeLayer.importJSON(item)
		xhr.send(JSON.stringify({ bounds: {x: text.bounds.x + x, y: text.bounds.y + y, width: text.bounds.width, height: text.bounds.height}, item: JSON.stringify(item)  }))
		xhr.onloadend = function () {
			// done
		}
	}
}

function onKeyDown(event) {
	if (event.key == 'up') {
		y -= view.size.height / 4;
		project.activeLayer.position = [x,y]
		load()
	}
	if (event.key == 'down') {
		y += view.size.height / 4;
		project.activeLayer.position = [x,y]
		load()
	}
	if (event.key == 'left') {
		x -= view.size.width / 4;
		project.activeLayer.position = [x,y]
		load()
	}
	if (event.key == 'right') {
		x += view.size.width / 4;
		project.activeLayer.position = [x,y]
		load()
	}
}

function load() {
	project.activeLayer.removeChildren()
	textGuide = new Path()
	textGuide.strokeColor = chalk
	textGuide.strokeWidth = 3
	get('item?x=' + x + '&y=' + y + '&width=' + view.size.width + '&height=' + view.size.height, function(res) {
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
