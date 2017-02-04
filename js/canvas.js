var chalk = '#BCBDB8'
var textGuide = new Path()
textGuide.strokeColor = chalk
textGuide.strokeWidth = 3

var start
var end


get('item?x=0&y=0&width=' + view.size.width + '&height=' + view.size.height, function(res) {
	json = JSON.parse(res)
	console.log(json)
	console.log(JSON.parse(json[0].item))
	json.forEach(function(onejson) {
		project.activeLayer.importJSON(JSON.parse(onejson.item))
	})
})

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
  xhr.send(JSON.stringify({ bounds: {x: text.bounds.x, y: text.bounds.y, width: text.bounds.width, height: text.bounds.height}, item: text.exportJSON() }))
  xhr.onloadend = function () {
		// done
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
