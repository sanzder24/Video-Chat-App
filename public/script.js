const socket = io('/');
const videoGrid= document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted=true;
const customGenerationFunction = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443',
    //port: '3030',
    generateClientId: customGenerationFunction
}) 
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on('call', call =>  {
        call.answer(stream) // Answer the call with an A/V stream.
        const video = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
        scrollToBottom()
    })
    let text = $("input");
    $('html').keydown(function (e) {
      if (e.which == 13 && text.val().length !== 0) {
          console.log(text.val());
        socket.emit('message', text.val() );
        text.val('')
      }
    });
    socket.on("createMessage", (message, userId) => {
        console.log(message);
      $('.messages').append(`<li class="message"><b>User: </b>${message}</li>`);
    
    })
    
})
 myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
 })




const connectToNewUser = (userId, stream) => {
    console.log(userId);
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  }
  const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener ('loadedmetadata', () => {
        video.play();
    })
    console.log("sss");
    videoGrid.append(video);
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }


  const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}


const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}