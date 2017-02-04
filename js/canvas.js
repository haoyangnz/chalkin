var chalk = '#BCBDB8'
var textGuide = new Path()
textGuide.strokeColor = chalk
textGuide.strokeWidth = 3

var start
var end

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
}
