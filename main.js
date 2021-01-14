//落ちるスピード
const gameSpeed = 300;

//フィールドサイズ
const fieldCol = 10;
const fieldRow = 20;

//ブロック１つのサイズ
const blockSize = 30

//スクリーンサイズ（ピクセル）
const screenW = blockSize * fieldCol;
const screenH = blockSize * fieldRow;

//テトロミノのサイズ（ピクセル）
const tetroSize = 4

let can = document.getElementById("can");
let con = can.getContext("2d");

can.width = screenW;
can.height = screenH;
can.style.border = "4px solid #555";

const tetroColors = [
  "#000000",
  "#ff0000",              
  "#ffa500",                
  "#ffff00",                
  "#008000",                
  "#0000ff",                
  "#800080",                
  "#ffb6c1",                
];

const tetroTypes = [
  [], //0,空
  [                   //1,I
    [ 0, 0, 0, 0],
    [ 1, 1, 1, 1],
    [ 0, 0, 0, 0],
    [ 0, 0, 0, 0]
  ],
  [                   //2.L
    [ 0, 1, 0, 0],
    [ 0, 1, 0, 0],
    [ 0, 1, 1, 0],
    [ 0, 0, 0, 0]
  ],
  [                   //3,J
    [ 0, 0, 1, 0],
    [ 0, 0, 1, 0],
    [ 0, 1, 1, 0],
    [ 0, 0, 0, 0]
  ],
  [                   //4,T
    [ 0, 1, 0, 0],
    [ 0, 1, 1, 0],
    [ 0, 1, 0, 0],
    [ 0, 0, 0, 0]
  ],
  [                   //5,O
    [ 0, 0, 0, 0],
    [ 0, 1, 1, 0],
    [ 0, 1, 1, 0],
    [ 0, 0, 0, 0]
  ],
  [                   //6,Z
    [ 0, 0, 0, 0],
    [ 0, 1, 1, 0],
    [ 1, 1, 0, 0],
    [ 0, 0, 0, 0]
  ],
  [                   //7,S
    [ 0, 0, 0, 0],
    [ 1, 1, 0, 0],
    [ 0, 1, 1, 0],
    [ 0, 0, 0, 0]
  ],
];

const start_x = fieldCol/2 - tetroSize/2;
const start_y = 0;

//テトロミノ本体
let tetro;

//テトロミノの座標
let tetro_x = start_x;
let tetro_y = start_y;

///テトロミノの形
let tetro_t;

//フィールドの中身
let field = [];

//ゲームオーバーフラグ
let over = false;

tetro_t = Math.floor( Math.random()*(tetroTypes.length-1) )+1;
tetro = tetroTypes[ tetro_t ];

init();
draw();

setInterval( dropTetro, gameSpeed);

//初期化
function init()
{
  //フィールドのクリア
  for(let y = 0; y < fieldRow ; y++ )
  {
    field[y] = [];
    for(let x = 0; x < fieldCol ; x++ )
    {
      field[y][x] = 0 ;
    }
  }
}

//ブロック１つを描画する。
function drawBlock(x,y,c)
{
  let px = x * blockSize;
  let py = y * blockSize;
  
  con.fillStyle=tetroColors[c];
  con.fillRect(px,py,blockSize,blockSize);
  con.strokeStyle="black";
  con.strokeRect(px,py,blockSize,blockSize);
}

//全体描画する
function draw()
{
  con.clearRect(0, 0, screenW, screenH);
  
  for(let y=0; y<fieldRow ; y++ )
  {
    for(let x=0; x<fieldCol ; x++ )
    {
      if( field[y][x] )
      {
        drawBlock(x,y, field[y][x] );
      }
    }
  }
  
  for(let y=0; y<tetroSize ; y++ )
  {
    for(let x=0; x<tetroSize ; x++ )
    {
      if( tetro[y][x] )
      {
        drawBlock(tetro_x+x, tetro_y+y, tetro_t );
      }
    }
  }
  
  if(over)
  {
    let s="GAME OVER"
    con.font = "40px 'MS ゴシック'"
    let w = con.measureText(s).width;
    let x = screenW/2 - w/2;
    let y = screenH/2 - 20;
    con.lineWidth = 4;
    con.strokeText(s, x, y);
    con.fillStyle = "white";
    con.fillText(s, x, y);
  }
}

//ブロックの衝突判定
function checkMove( mx, my, ntetro )
{
  if( ntetro == undefined) ntetro = tetro;
  for(let y=0; y<tetroSize ; y++ )
  {
    for(let x=0; x<tetroSize ; x++ )
    {
      if( ntetro[y][x] )
      {
        let nx = tetro_x + mx + x;
        let ny = tetro_y + my + y;
        
        if( ny < 0 ||
            nx < 0 ||
            ny >= fieldRow ||
            nx >= fieldCol ||
            field[ny][nx] )
        {
          return false;
        }
      }
    }
  }
  
  return true;
}

//テトロの回転
function rotate()
{
  let ntetro = [];
  
  for(let y=0; y<tetroSize ; y++)
  {
    ntetro [y] = [];
    for(let x=0; x<tetroSize ; x++ )
    {
      ntetro[y][x] = tetro[tetroSize-x-1][y];
    }
  }
  return ntetro;
}

//テトロを固定する
function fixTetro()
{
  for(let y=0; y<tetroSize ; y++)
  {
    for(let x=0; x<tetroSize ; x++ )
    {
      if(tetro[y][x])
      {
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
    }
  }
}

//ラインが揃ったかチェックして消す
function checkLine ()
{
  let lineC = 0;
  for(let y=0; y<fieldRow ; y++)
  {
    let flag=true;
    for(let x=0; x<fieldCol ; x++ )
    {
      if( !field[y][x] )
      {
        flag=false;
        break;
      }
    }
    if(flag)
    {
      lineC++;
      
      for(let ny = y; ny>0 ; ny-- )
      {
        for(let nx=0;nx<fieldCol ; nx++ )
        {
          field[ny][nx] = field[ny-1][nx];
        }
      }
    }
  }
}

//ブロックの落ちる処理
function dropTetro()
{
  if(over)return;
  
  if( checkMove(0,1))tetro_y++;
  else
  {
    fixTetro();
    checkLine();
    tetro_t = Math.floor( Math.random()*(tetroTypes.length-1) )+1;
    tetro = tetroTypes[ tetro_t ];
    tetro_x = start_x;
    tetro_y = start_y;
    
    if( !checkMove(0, 0) )
    {
      over = true;
    }
  }
  draw();
}

//キーボードが押されたときの処理
document.onkeydown = function(e)
{
  if(over)return;
  
  switch( e.keyCode )
  {
  case 37://左
    if( checkMove(-1,0))tetro_x--;
    break;
  case 38://上
    if( checkMove(0,-1))tetro_y--;
    break;
  case 39://右
    if( checkMove(1,0))tetro_x++;
    break;
  case 40://下
    if( checkMove(0,1))tetro_y++;
    break;
  case 32://スペース
    let ntetro = rotate();
    if ( checkMove(0, 0, ntetro) ) tetro = ntetro;
    break;
  }
  
  draw();
}
