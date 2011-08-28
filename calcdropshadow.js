/**
 * Calculated drop shadow 
 * A canvas demo by Christian Heilmann @codepo8
 * the requestAnimationFrame shim by Paul Irish
 */
var canvas = document.querySelector( 'canvas' ),
    c = canvas.getContext( '2d' ),
    mouseX = 0,
    mouseY = 0,
    width = 300,
    height = 300,
    distx = 0,
    disty = 0,
    hw = width / 2,
    hh = height / 2,
    longest = Math.sqrt( ( hw * hw ) + ( hh * hh ) ),
    factor = 0.4,
    realdistance = 0,
    blur = [ 2, 9 ],
    shadowalpha = [ 3, 8 ],
    blurfactor = blur[1] / longest,
    shadowfactor = shadowalpha[1] / longest,
    output = document.querySelector('output'),
    increase = 0;

canvas.width = width;
canvas.height = height;

function draw() {
  if( !document.querySelector( '#animate' ).checked ) {
    distx = mouseX - hw;
    disty = mouseY - hh;
  } else {
    increase += 0.03;
    var distx = 80 * Math.cos( increase ) + 60 * Math.cos( increase * 2 );
    var disty = 100 * Math.sin( increase * 2 ) + 20 * Math.cos( increase );
  }
  realdistance = Math.sqrt( ( distx * distx ) + ( disty * disty ) );
  var currentblur = parseInt( blurfactor * realdistance, 10 );
  if ( currentblur < blur[ 0 ] ) {currentblur = blur[0];}
  var currentalpha = parseInt( shadowfactor * realdistance, 10 );
  if ( currentalpha < shadowalpha[ 0 ] ) { currentalpha = shadowalpha[0]; }
  c.clearRect( 0, 0, width, height );
  c.save();
  c.translate( hw, hh);

  if( document.querySelector ('#controlline').checked ){
    c.beginPath();
    c.strokeStyle = '#fff';
    c.moveTo( 0, 0 );
    c.lineTo( distx, disty );
    c.closePath();
    c.stroke();
    c.beginPath();
    c.strokeStyle = '#c00';
    c.moveTo( 0, 0 );
    c.lineTo( -distx * factor, -disty * factor );
    c.closePath();
    c.stroke();
  }
  c.beginPath();
  c.shadowOffsetX = -distx * factor;
  c.shadowOffsetY = -disty * factor;
  c.shadowBlur = currentblur;
  c.shadowColor = 'rgba(0,0,0,' + (1 - currentalpha / 10)  + ')';
  c.fillStyle = 'lime';
  var text = 'Text with shadow';
  c.font = "bold 24px sans-serif";
  var len = c.measureText( text );
  c.fillText( text, -len.width / 2, 12 );
  c.closePath();
  var grd = c.createRadialGradient( distx + 10, disty - 10, 3, distx + 10,
                                    disty - 10, 40 );
  grd.addColorStop( 0, 'white' );
  grd.addColorStop( 1, 'orange' );
  c.fillStyle = grd;  
  c.shadowColor = 'rgba(0,0,0,0)';
  c.beginPath();
  c.arc( distx, disty, realdistance / 6 + 10 , 0, Math.PI*2, true );
  c.closePath();
  c.fill();
  c.restore();
  output.innerHTML = '<ul><li>x: ' + dec( distx ) +
                     '</li><li>y: ' + dec( disty ) + 
                     '</li><li>distance: ' + dec( realdistance ) +
                     '</li><li>shadowdx: ' + dec( distx * factor ) +
                     '</li><li>shadowy:  ' + dec( disty * factor ) +
                     '</li><li>blur: ' + currentblur + '</li><li>alpha: ' +
                      dec( 1 - currentalpha / 10 ) +'</li></ul>';

  if( document.querySelector( '#animate' ).checked ) {
    requestAnimationFrame( draw, 10 );
  }
}

function dec(n){
  return Math.round( n * 100 ) / 100;
}

canvas.addEventListener( 'mousemove', function( event ) {
  if( event.offsetX ){
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else {
    mouseX = event.pageX - event.target.offsetLeft;
    mouseY = event.pageY - event.target.offsetTop;
  }
  if( !document.querySelector( '#animate' ).checked ) {
    draw();
  }  
}, false );

document.querySelector( '#animate' ).addEventListener( 'click', draw, false );
window.addEventListener( 'load', draw, false );

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
      window.setTimeout( callback, 1000 / 60 );
    };
  } )();
}