function drawMatchResult(gameNum, win) {
	var c = document.getElementById('matchHistCanvas');
	var ctx = c.getContext('2d');
	
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;

	console.log('height ' + c.height + ' gamenum: ' + gameNum);
	if (win)
		ctx.fillStyle = '#2fe68e';
	else ctx.fillStyle = '#ff3036';
	
	ctx.fillRect(0, c.height / 10 * gameNum, 10, c.height / 10);
	ctx.moveTo(0, c.height / 10 * (gameNum + 1) + 0.5);
	ctx.lineTo(c.width, c.height / 10 * (gameNum + 1) + 0.5);
	ctx.stroke();
}