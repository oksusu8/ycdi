// sketch.js
let video;

function setup() {
    // box2 컨테이너를 선택하고 내부에 캔버스를 생성합니다.
    let videoContainer = select('#video-container');
    let canvas = createCanvas(videoContainer.width, videoContainer.height);
    canvas.parent('video-container');

    // 비디오 캡처를 생성합니다.
    video = createCapture(VIDEO);
    video.size(width, height); // 비디오 크기를 캔버스 크기와 일치하도록 설정합니다.
    video.hide();
}

function draw() {
    // 비디오를 캔버스에 그립니다.
    image(video, 0, 0, width, height);
}
