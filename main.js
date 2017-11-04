(function(){
  var canvas  = document.getElementById("canvas");
  var paint   = document.getElementById("paint");
  var pallet  = document.getElementById("pallet");
  var context = canvas.getContext("2d");
  var clickX  = new Array();
  var clickY  = new Array();
  var clickD  = new Array();

  canvas.onmousedown  = handleDown;
  canvas.onmouseup    = handleUp;
  canvas.onmouseleave = handleLeave;
  canvas.onmousemove  = handleMove;

  paint.onclick = togglePaint;

  function parset(v){
    try {
      let k = JSON.parse(v)
      if (typeof(k) === 'object'){
        return k;
      } else {
        return new Array();
      }
    } catch(e){
      return new Array();
    }
  }

  function reloadMasterpiece() {
    let dx = window.localStorage.getItem("x");
    let dy = window.localStorage.getItem("y");
    let dd = window.localStorage.getItem("d");


    if (dx !== undefined && dx.length > 0) {
      clickX = parset(dx)
      clickY = parset(dy)
      clickD = parset(dd)
    }

    redraw()
  }

  function togglePaint() {
    canvas.style.zIndex = "666";
    paint = false;
  }

  function handleDown(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  };

  function handleUp(e){
    paint = false;
  };

  function handleMove(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  };

  function handleLeave(e){
    paint = false;
  };

  function addClick(x, y, d)
  {
    clickX.push(x)
    clickY.push(y)
    clickD.push(d)
    window.localStorage.setItem("x", JSON.stringify(clickX))
    window.localStorage.setItem("y", JSON.stringify(clickY))
    window.localStorage.setItem("d", JSON.stringify(clickD))
  }

  function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.strokeStyle ='#'+Math.floor(Math.random()*16777215).toString(16);
    context.lineJoin = "round";
    context.lineWidth = 15;

    for(var i=0; i < clickX.length; i++) {
      context.beginPath();
      if(clickD[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
       }else{
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.stroke();
    }
  }

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw()
  }

  window.addEventListener('resize', resizeCanvas, false);
  reloadMasterpiece()
  resizeCanvas()
})();