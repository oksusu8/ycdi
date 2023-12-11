let buttonX, buttonY;
let video;
let menu, flip;
let pic1, pic2, pic3, pic4;
let sample;
let shutterBtn;
let autoBtn;
let poseBtn;
let isVisible = true;

let poseNet;
let pose;
let poseTrainModel;
let state = 'waiting';
let targetLabel = 'Z';
let currentPoseLabel;

let tempState = 0;
let poseState = 0;

function preload() {
  menu = loadImage("menu.png");
  flip = loadImage("flip.png");
  pic1 = loadImage('poseimg1.JPG');
  pic2 = loadImage('poseimg2.JPG');
  pic3 = loadImage('poseimg3.JPG');
  pic4 = loadImage('poseimg4.JPG');
  sample = loadImage('skeleton.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonX = width / 2;
  buttonY = height / 2;

  video = createCapture(VIDEO);
  //video.size(width, height * 0.66);
  video.hide();
  layoutDraw();

  rectMode(CENTER);

  shutterBtn = createButton('');
  shutterBtn.class('shutterBtn');
  shutterBtn.position(buttonX - (height * 0.12) / 2, height * 0.88 - (height * 0.12) / 2);
  shutterBtn.size(height * 0.12, height * 0.12);
  captureBtn();
  
  autoBtn = createButton('AUTO');
  autoBtn.class('autoBtn');
  autoBtn.position(width/2-(width*0.1/2), height * 0.02);
  autoBtn.size(width*0.1, height * 0.03);

  
  // GalleryBtn (왼쪽 하단)
  gallBtn = createButton('PHOTO');
  gallBtn.class('gallBtn');
  gallBtn.position(width - (width * 0.75 + height * 0.11), height * 0.87 - (height * 0.09) / 2);
  gallBtn.size(height * 0.11, height * 0.1);
  

  poseBtn = createButton('POSE');
  poseBtn.class('poseBtn');
  poseBtn.position(width - (width * 0.25), height * 0.87 - (height * 0.09) / 2);
  poseBtn.size(height * 0.11, height * 0.1);

  // pic1 버튼
  pic1Btn = createImg('poseimg2.JPG');
  pic1Btn.position(width * 0.03, height * 0.81);//height * 0.81 -> height * 0.83
  pic1Btn.size(height * 0.15, height * 0.16);
  //pic1Btn.size(height * 0.14, height * 0.15);
  pic1Btn.style('border-radius', '5%');
  pic1Btn.hide();

  // pic2 버튼
  pic2Btn = createImg('poseimg1.JPG');
  pic2Btn.position(width * 0.33, height * 0.81);
  //pic2Btn.position(buttonX-(height * 0.14 /2), height * 0.83); //height * 0.81 -> height * 0.83
  //pic2Btn.position(width * 0.28, height * 0.81);
  pic2Btn.size(height * 0.15, height * 0.16);
  //pic2Btn.size(height * 0.14, height * 0.15);
  pic2Btn.style('border-radius', '5%');
  pic2Btn.hide();
  pic2Btn.mousePressed(click_pic2);

  // pic3 버튼
  pic3Btn = createImg('poseimg3.JPG');
  pic3Btn.position(width * 0.63, height * 0.81);
  //pic3Btn.position(width * 0.53, height * 0.83);//height * 0.81 -> height * 0.83
  pic3Btn.size(height * 0.15, height * 0.16);
  pic3Btn.style('border-radius', '5%');
  //pic3Btn.size(height * 0.14, height * 0.15);
  pic3Btn.hide();

  // pic4 버튼
  pic4Btn = createImg('poseimg4.JPG');
  pic4Btn.position(width * 0.93, height * 0.81);
  //pic4Btn.position(width * 0.78, height * 0.83);//height * 0.81 -> height * 0.83
  pic4Btn.size(height * 0.15, height * 0.16);
  //pic4Btn.size(height * 0.14, height * 0.15);
  pic4Btn.style('border-radius', '5%');
  pic4Btn.hide();
  
  // 카메라 격자 그리기
  //drawGrid(3,3);
  
  shutterBtn.mousePressed(capture);
  poseBtn.mousePressed(posetab);

  // Initialize poseNet and poseTrainModel
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 3,
    task: 'classification',
    debug: true
  };

  poseTrainModel = ml5.neuralNetwork(options);

  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };

  poseTrainModel.load(modelInfo, poseTrainModelLoaded);
}

function draw() {
  image(video, 0, height * 0.07, width, height * 0.66); //height * 0.08 -> 0.07
  image(menu, width * 0.03, height * 0.02, width * 0.06, height * 0.03);
  image(flip, width * 0.91, height * 0.02, width * 0.06, height * 0.03);
  drawGrid(3,3);
  
  if(tempState == 0){
    fill(255, 0, 0); 
    textSize(30);
    textAlign(CENTER);
  
    if (currentPoseLabel === 'X') { 
      text('X포즈입니다', width / 2, height * 0.5);
    }
    if (currentPoseLabel === 'Z' && poseState == 1){ 
      tint(255, 128); // RGB 색상과 투명도 (127은 투명도를 나타냄)
      image(sample, 0, height * 0.07, width, height * 0.66);
      noTint();
      noStroke();
      
      //capture(); // 촬영 효과
      
      
      //text('Z포즈입니다. ', width / 2, height * 0.5);
    }
    if (currentPoseLabel === 'C'){ 
      text('C포즈입니다', width / 2, height * 0.5);
    }
  }

}

function layoutDraw() {
  // 상단 레이아웃 박스
  fill(255);
  noStroke();
  rect(0, 0, width, height * 0.07);

  fill(0);
  noStroke();
  rect(0, height * 0.73, width, height * 0.27);
}

function captureBtn() {
  fill(255);
  noStroke();
  circle(buttonX, height * 0.88, height * 0.13);
}

//촬영 효과 함수
function capture() {
  //background(255);
  fill(200);
  noStroke();
  //rect(0, height * 0.07, width, height * 0.66);
  rect(0, 0, width, height * 0.66);
  
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
  textSize(41);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text('SPOT', buttonX, height * 0.77);
  
  fill(204, 195, 182);
  textSize(33);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text('POSE', width*0.63, height * 0.77) 
  text('SELFIE', width*0.76, height * 0.77)
  
  

  // image element
  pic1Btn.show();
  pic2Btn.show();
  pic3Btn.show();
  pic4Btn.show();

}

function click_pic2() {
  //console.log('good!');
  pic2Btn.position(buttonX-(height * 0.17 /2), height * 0.8); //83 -> 82
  //pic2Btn.position(width * 0.28, height * 0.81);
  pic2Btn.size(height * 0.17, height * 0.18);

  pic2Btn.style('border', '4px solid rgb(255, 153, 0)');
  pic2Btn.style('border-radius', '10%');
  
  pic3Btn.position(2*buttonX-width*0.03-height*0.14, height * 0.81);
  //pic3Btn.position(width * 0.57, height * 0.83);
  pic4Btn.hide();
  
  
  // click_pic2() 버튼이 실행된 후 targetlabel이 Z에 해당할 경우
  // state를 설정하는 버튼이 따로 있어야할 것 같음. 
  poseState = 1;
  
  
}

function drawGrid(rows, cols) {
  stroke(255,255,255,130);
  strokeWeight(1);
  line(width*0.3, height*0.07, width*0.3, height*0.73);
  line(width*0.6, height*0.07, width*0.6, height*0.73);
  line(0, height*0.29, width, height*0.29);
  line(0, height*0.51, width, height*0.51);
}



function keyPressed() {
  if (key == 's') {
    poseTrainModel.saveData();
  } else {
    targetLabel = 'c';
    console.log(targetLabel);
    setTimeout(function () {
      console.log('collecting');
      state = 'collecting';
      setTimeout(function () {
        console.log('not collecting');
        state = 'waiting';
      }, 30000);
    }, 5000);
  }
}

function poseTrainModelLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    poseTrainModel.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    currentPoseLabel = results[0].label.toUpperCase();
    console.log(currentPoseLabel);

    if (currentPoseLabel === targetLabel) {
      //console.log('촬영이 시작됩니다.');
      /* 생략
      fill(0);
      textSize(30);
      textAlign(CENTER);
      text('자세를 맞춰주세요', width / 2, height * 0.03);*/
  
    } 
    else if (currentPoseLabel === 'X') {
      console.log('X포즈입니다');
    } else if (currentPoseLabel === 'C') {
      console.log('CCCCCCC포즈입니다');
    } else {
      console.log('NOO');
    }
  }
  classifyPose();
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      poseTrainModel.addData(inputs, target);
    }
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

