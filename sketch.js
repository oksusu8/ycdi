let buttonX, buttonY; //button 위치 조정 변수

let video;
let menu, flip;
let pic1, pic2, pic3, pic4;

let shutterBtn;
let autoBtn;
let poseBtn;

let isVisible = true; // 밑 탭들이 보이게 안보이게 선택하는 조건


function preload() {
  menu = loadImage("menu.png");
  flip = loadImage("flip.png");
  pic1 = loadImage('poseimg1.JPG');
  pic2 = loadImage('poseimg2.JPG');
  pic3 = loadImage('poseimg3.JPG');
  pic4 = loadImage('poseimg4.JPG');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonX = width / 2;
  buttonY = height / 2;

  video = createCapture(VIDEO);
  video.size(width, height * 0.66); // 0.7  0.65
  video.hide();
  layoutDraw();

  rectMode(CENTER);

  shutterBtn = createButton('');
  shutterBtn.class('shutterBtn');
  shutterBtn.position(buttonX - (height * 0.12) / 2, height * 0.88 - (height * 0.12) / 2);
  shutterBtn.size(height * 0.12, height * 0.12); // 0.09 & 0.91
  captureBtn();

  autoBtn = createButton('AUTO');
  autoBtn.class('autoBtn');
  autoBtn.position(width - (width * 0.75 + height * 0.11), height * 0.88 - (height * 0.09) / 2);
  autoBtn.size(height * 0.11, height * 0.1);

  poseBtn = createButton('POSE');
  poseBtn.class('poseBtn');
  poseBtn.position(width - (width * 0.25), height * 0.88 - (height * 0.09) / 2);
  poseBtn.size(height * 0.11, height * 0.1);

  // pic1 버튼
  pic1Btn = createImg('poseimg1.JPG');
  pic1Btn.position(width * 0.03, height * 0.81);
  pic1Btn.size(height * 0.14, height * 0.15);
  pic1Btn.hide();
  //pic1Btn.mousePressed(click_pic2);
  
  // pic2 버튼으로 만듦
  pic2Btn = createImg('poseimg2.JPG');
  pic2Btn.position(width * 0.28, height * 0.81);
  pic2Btn.size(height * 0.14, height * 0.15);
  pic2Btn.hide();
  pic2Btn.mousePressed(click_pic2);
  
  // pic3 버튼으로 만듦
  pic3Btn = createImg('poseimg3.JPG');
  pic3Btn.position(width * 0.53, height * 0.81);
  pic3Btn.size(height * 0.14, height * 0.15);
  pic3Btn.hide();
  //pic3Btn.mousePressed(click_pic2);
  
  // pic4 버튼으로 만듦
  pic4Btn = createImg('poseimg4.JPG');
  pic4Btn.position(width * 0.78, height * 0.81);
  pic4Btn.size(height * 0.14, height * 0.15);
  pic4Btn.hide();
  //pic3Btn.mousePressed(click_pic2);
  

  

  shutterBtn.mousePressed(capture);
  poseBtn.mousePressed(posetab);
}

function draw() {
  image(video, 0, height * 0.08);
  image(menu, width * 0.03, height * 0.03, width * 0.06, height * 0.04);
  image(flip, width * 0.91, height * 0.03, width * 0.06, height * 0.04);
}

function layoutDraw() {
  // 상단 레이아웃 박스
  fill(255);
  noStroke();
  rect(0, 0, width, height * 0.08);

  fill(0);
  noStroke();
  rect(0, height * 0.73, width, height * 0.27);
}

function captureBtn() {
  fill(255);
  noStroke();
  circle(buttonX, height * 0.88, height * 0.13);
}

function capture() {
  background(255);
}

function posetab() {
  isVisible = !isVisible;
  fill(0);
  noStroke();
  circle(buttonX, height * 0.88, height * 0.14);
  shutterBtn.hide();
  poseBtn.hide();
  autoBtn.hide();

  fill(255, 153, 0);
  textSize(34);
  textAlign(CENTER, CENTER);
  text('POSE', buttonX, height * 0.77);

  // 이미지 엘리먼트를 보여줌
  pic1Btn.show();
  pic2Btn.show();
  pic3Btn.show();
  pic4Btn.show();
  //image(pic1, width * 0.03, height * 0.81, height * 0.14, height * 0.15);
  //image(pic3, width * 0.53, height * 0.81, height * 0.14, height * 0.15);
  //image(pic4, width * 0.78, height * 0.81, height * 0.14, height * 0.15);
}

function click_pic2() {
  console.log('good!');
  pic2Btn.position(width * 0.28, height * 0.81);
  pic2Btn.size(height * 0.16, height * 0.16);
  
  pic2Btn.style('border', '4px solid rgb(255, 153, 0)');
  pic2Btn.style('border-radius', '10%');
  
  pic3Btn.position(width * 0.55, height * 0.81);
  //pic3Btn.size(height * 0.14, height * 0.15);
  pic4Btn.position(width * 0.82, height * 0.81);
  //pic4Btn.size(height * 0.14, height * 0.15);
}



