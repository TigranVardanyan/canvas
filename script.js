var canvas = document.getElementById("bp"),
  context = canvas.getContext("2d"),
  w = canvas.width,
  h = canvas.height;

var mouse = { x:0, y:0};
var draw = false;
var mousePositionArray = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('redraw').addEventListener('click', redraw)
canvas.addEventListener("mousedown", mousedown);
canvas.addEventListener("mousemove", mousemove);
canvas.addEventListener("mouseup", mouseup);

function mousemove(e){
  if(draw==true){

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    mousePositionArray.push([mouse.x, mouse.y]);
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
  }
}

function mouseup(e){
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  context.lineTo(mouse.x, mouse.y);
  mousePositionArray.push([mouse.x, mouse.y]);
  mousePositionArray.push([null,null]);
  context.stroke();
  context.closePath();
  draw = false;
}

function mousedown(e){
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  draw = true;
  context.beginPath();
  context.moveTo(mouse.x, mouse.y);
  mousePositionArray.push([mouse.x, mouse.y]);
}

async function redraw() {
  canvas.removeEventListener('mousedown', mousedown)
  canvas.removeEventListener('mousemove', mousemove)
  canvas.removeEventListener('mouseup', mouseup)
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  let isFirstStep = true;
  for (let i = 0; i < mousePositionArray.length; i++) {
    if (typeof mousePositionArray[i][0] == "number") {
      if (!isFirstStep) {
        context.lineTo(mousePositionArray[i][0], mousePositionArray[i][1]);
        context.stroke();
        await sleep(10)
      } else {
        context.moveTo(mousePositionArray[i][0], mousePositionArray[i][1]);
        await sleep(10)
        draw = true
        isFirstStep = false
      }
    } else {
      isFirstStep = true
      context.stroke();
      context.color = 'red'
      //context.closePath();
      draw = false;
    }
  }

  draw = false;
  context.closePath();
  mousePositionArray = [];
  canvas.addEventListener('mousedown', mousedown)
  canvas.addEventListener('mousemove', mousemove)
  canvas.addEventListener('mouseup', mouseup)
}