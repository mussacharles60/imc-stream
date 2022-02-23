// import io from 'socket.io-client';

declare var io: any;

window.onload = async () => {

    const server_url = 'http://localhost:3000';

    // declare io as a global variable without requiring it
    // https://stackoverflow.com/questions/56907841/how-to-use-socket-io-client-in-typescript
    // tslint:disable-next-line:no-var-requires


    const socket = io(server_url) as any;

    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
            },
        ],
        iceCandidatePoolSize: 10,
    };

    // Global State
    const pc = new RTCPeerConnection(servers);
    const localStream: any = null;
    const remoteStream: any = null;

    const local_video = document.getElementById('local-video');
    const start_btn = document.getElementById('start-btn');

    if (local_video) {
        local_video.style.display = 'none';
    }

    if (start_btn) {
        start_btn.onclick = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('Your browser does not support media devices.');
                    return;
                }
                // get video or audio devices
                navigator.mediaDevices.enumerateDevices().then((devices) => {
                    // iterate each device and display info for user to choose
                    devices.forEach((device) => {
                        console.log('media-device:', device);
                    });
                });
                // get display media | desktop sharing
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });
                console.log('media-display:', stream);

            } catch (err) {
                console.log(err);
            }

        };
    }
}
