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

    const local_video: HTMLElement | undefined = document.getElementById('local-video');
    const start_btn: HTMLElement | undefined = document.getElementById('start-btn');
    const stop_btn = document.getElementById('stop-btn');
    const voice_btn = document.getElementById('voice-btn');
    const video_btn = document.getElementById('video-btn');

    const btn_observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            console.log('mutation:', mutation);
            if (mutation.type === 'attributes') {
                // if (mutation.target.classList.contains('disabled')) {
                //     console.log('disabled');
                // } else {
                //     console.log('enabled');
                // }
                if (mutation.attributeName === 'disabled') {
                    console.log('disabled');
                } else {
                    console.log('enabled');
                }
            }
        });
    });

    if (start_btn) btn_observer.observe(start_btn, { attributes: true, });
    if (voice_btn) btn_observer.observe(voice_btn, { attributes: true, });
    if (video_btn) btn_observer.observe(video_btn, { attributes: true, });
    if (stop_btn) btn_observer.observe(stop_btn, { attributes: true, });

    if (local_video) {
        local_video.style.display = 'none';
    }

    if (start_btn) {
        // alternate enabling and disabling the start button with time interval for 1 second with set attribute
        setInterval(() => {
            if (start_btn) {
                if (start_btn.getAttribute('disabled')) {
                    start_btn.removeAttribute('disabled');
                } else {
                    start_btn.setAttribute('disabled', 'true');
                }
            }
        }, 1000);
        
    }

    if (start_btn) {
        start_btn.onclick = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    alert('Your browser does not support media devices.');
                    return;
                }
                // get video or audio devices | camera hardware
                const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

                // // check if there is a camera
                // const video_device = devices.find((device: MediaDeviceInfo) => device.kind === 'videoinput');
                // // ceck if there is a microphone
                // const audio_device = devices.find((device: MediaDeviceInfo) => device.kind === 'audioinput');

                // check if there are any devices
                if (devices.length === 0) {


                } else {
                    // // iterate on all devices and if is a video device, get the deviceId
                    // const video_device_id = devices.find((device: MediaDeviceInfo) => device.kind === 'videoinput').deviceId;
                    // iterate on all devices and log the deviceId
                    devices.forEach((device: MediaDeviceInfo) => {
                        // check if device is a video device
                        if (device.kind === 'videoinput') {
                            console.log(device.deviceId);
                        }
                    });
                }

                // get display media | desktop sharing
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                }).catch((err) => {
                    console.log('media-display-error:', err);
                });
                if (!stream) return;

                console.log('media-display:', stream);
            } catch (err) {
                console.log('get-media-error:', err);
            }
        };
    }

    async function loadVideoDevices() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // alert('Your browser does not support media devices.');
                return;
            }
            // get video or audio devices | camera hardware
            const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

            // // check if there is a camera
            // const video_device = devices.find((device: MediaDeviceInfo) => device.kind === 'videoinput');
            // // ceck if there is a microphone
            // const audio_device = devices.find((device: MediaDeviceInfo) => device.kind === 'audioinput');

            // check if there are any devices
            if (devices.length === 0) {


            } else {
                // // iterate on all devices and if is a video device, get the deviceId
                // const video_device_id = devices.find((device: MediaDeviceInfo) => device.kind === 'videoinput').deviceId;
                // iterate on all devices and log the deviceId
                devices.forEach((device: MediaDeviceInfo) => {
                    // check if device is a video device
                    if (device.kind === 'videoinput') {
                        console.log(device.deviceId);
                    }
                });
            }

            // get display media | desktop sharing
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            }).catch((err) => {
                console.log('media-display-error:', err);
            });
            if (!stream) return;

            console.log('media-display:', stream);
        } catch (err) {
            console.log('get-media-error:', err);
        }
    }

    

    

}
