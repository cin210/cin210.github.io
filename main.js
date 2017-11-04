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

  canvas.ontouchstart   = handleTouchStart;
  canvas.ontouchend     = handleTouchEnd;
  canvas.ontouchcancel  = handleLeave;
  canvas.ontouchmove    = handleTouchMove;
  document.body.ontouchstart = document.body.ontouchend = document.body.ontouchmove = holdStill;

  paint.onclick = togglePaint;

  function resetCanvas() {
    clickX = new Array()
    clickY = new Array()
    clickD = new Array()
    window.localStorage.setItem("x",clickX)
    window.localStorage.setItem("y",clickY)
    window.localStorage.setItem("d",clickD)
    redraw()
  }

  function holdStill(e){
     if (e.target == canvas) {
      e.preventDefault();
    }
  }

  function handleTouchStart(e){
    e.preventDefault()
    var mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    console.log('touchstart done', mouseEvent)
    canvas.dispatchEvent(mouseEvent);
  }

  function handleTouchEnd(e){
    e.preventDefault()
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  }

  function handleTouchMove(e){
    e.preventDefault()
    var touch = e.touches[0];
    console.log('handleTouchMove',touch.clientX,touch.clientY)
    var mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }

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
    console.log("handledown")
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(mouseX, mouseY);
    redraw();
  };

  function handleUp(e){
    paint = false;
  };

  function handleMove(e){
    console.log("move", e)
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
    if(paint){
      addClick(mouseX, mouseY, true);
      redraw();
    }
  };

  function handleLeave(e){
    paint = false;
  };

  function addClick(x, y, d)
  {
    console.log("addclick")
    clickX.push(x)
    clickY.push(y)
    clickD.push(d)
    window.localStorage.setItem("x", JSON.stringify(clickX))
    window.localStorage.setItem("y", JSON.stringify(clickY))
    window.localStorage.setItem("d", JSON.stringify(clickD))
  }

  function getTouchPos(touchEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
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

  if (typeof window.DeviceMotionEvent != 'undefined') {
      //  lower number is more sensitive
      var sensitivity = 20;
      var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
      window.ondevicemotion = function (e) {
          x1 = e.accelerationIncludingGravity.x;
          y1 = e.accelerationIncludingGravity.y;
          z1 = e.accelerationIncludingGravity.z;
      }

      // Periodically check the position and fire
      // if the change is greater than the sensitivity
      setInterval(function () {
          var change = Math.abs(x1-x2+y1-y2+z1-z2);

          if (change > sensitivity) {
              resetCanvas();
          }

          x2 = x1;
          y2 = y1;
          z2 = z1;
      }, 150);
  }
})();