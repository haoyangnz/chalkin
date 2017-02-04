var chalk = '#BCBDB8'
var textGuide = new Path()
textGuide.strokeColor = chalk
textGuide.strokeWidth = 3

var start
var end

var x = 0
var y = 0

load()

function load() {
	project.activeLayer.removeChildren()
	get('item?x=' + x + '&y=' + y + '&width=' + view.size.width + '&height=' + view.size.height, function(res) {
		json = JSON.parse(res)
		console.log(json)
		json.forEach(function(onejson) {
			var item = JSON.parse(onejson.item)
			item[1].matrix[4] -= x
			item[1].matrix[5] -= y
			project.activeLayer.importJSON(item)
		})
	})
}

function onMouseDown(event) {
	start = event.point
}

function onMouseDrag(event) {
	textGuide.removeSegments()
	textGuide.add(start, event.point)
}

function onMouseUp(event) {
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
  xhr.send(JSON.stringify({ bounds: {x: text.bounds.x, y: text.bounds.y, width: text.bounds.width, height: text.bounds.height}, item: JSON.stringify(item)  }))
  xhr.onloadend = function () {
		// done
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

function get(url, callback)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.response);
	}
	xmlHttp.open("GET", url, true); // true for asynchronous 
	xmlHttp.send(null);
}
