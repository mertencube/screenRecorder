const videoElement = document.querySelector('video');

const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;


const { desktopCapturer, remote } = require('electron');

const { dialog, Menu } = require('@electron/remote');

const { writeFile } = require('fs');

const startBtn = document.getElementById('startBtn');

startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('btn-danger');
  startBtn.innerText = 'Recording...';
};

const stopBtn = document.getElementById('stopBtn');

stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('btn-danger');
  startBtn.innerText = 'Start';
};

const pauseBtn = document.getElementById('pauseBtn')

pauseBtn.onclick = e => {
    mediaRecorder.pause();
    pauseBtn.classList.add('btn-danger');
    pauseBtn.innerText = 'paused';
    resumeBtn.innerText = 'resume...'; 
}

const resumeBtn = document.getElementById('resumeBtn')

resumeBtn.onclick = e => {
    mediaRecorder.resume();
    pauseBtn.classList.remove('btn-danger');
    pauseBtn.innerText = 'pause';
}

// Get the available video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );
    
    videoOptionsMenu.popup();
}

let mediaRecorder;
const recordedChunks = [];

//change the videoSource window to record
async function selectSource(source) {
    videoSelectBtn.innerText = source.name;

    const constraintsVideo = {
        audio: false,
        video: {
            mandatory: {
               chromeMediaSource: 'desktop',
               chromeMediaSourceId: source.id
            }
        }
    };
    const constraintsAudio = {audio: true}


    //create a Stream
    const audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio)
    const videoStream = await navigator.mediaDevices.getUserMedia(constraintsVideo);
    
    // combine the streams 
    const combinedStream = new MediaStream([...videoStream.getVideoTracks(), ...audioStream.getAudioTracks()])

    //preview the source in a video element
    videoElement.srcObject = combinedStream;
    videoElement.muted = true;
    videoElement.play();

    // Create media Recorder
    const options = { mimeType: 'video/webm; codecs=vp9'};
    mediaRecorder = new MediaRecorder(combinedStream, options);

    //register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

}

//Captures all recorded chunks
function handleDataAvailable(e) {
    console.log('video data available');
    recordedChunks.push(e.data);
}


//Saves the video file on stop
async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    
    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`
    });
    
    if (filePath){
        writeFile(filePath, buffer, () => console.log('video saved succesfully'));
    }
    
}