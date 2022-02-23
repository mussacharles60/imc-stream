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

    // const btn_observer = new MutationObserver((mutations) => {
    //     mutations.forEach((mutation: MutationRecord) => {
    //         console.log('mutation:', mutation);
    //         if (mutation.type === 'attributes') {
    //             const element_id: string = (mutation.target as any).attributes.id.nodeValue;
    //             console.log('element_id:', element_id);
    //             const element = document.getElementById(element_id);
    //             if (!element) return;
    //             console.log('element:before', element);
    //             if (mutation.attributeName === 'disabled') {
    //                 element.style.display = (element as any).disabled ? 'none' : 'block';
    //             }
    //             console.log('element:after', element);
    //         }
    //     });
    // });

    const enableBtn = (btn: HTMLElement | undefined, enable: boolean) => {
        if (!btn) return;
        (btn as any).disabled = !enable;
        btn.style.display = enable ? 'block' : 'none';
    };

    enableBtn(start_btn, false);
    enableBtn(voice_btn, false);
    enableBtn(video_btn, false);
    enableBtn(stop_btn, false);

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
                console.log('loadVideoDevices-result', devices);
                // // iterate on all devices and if is a video device, get the deviceId
                // const video_device_id = devices.find((device: MediaDeviceInfo) => device.kind === 'videoinput').deviceId;
                // iterate on all devices and log the deviceId
                devices.forEach((device: MediaDeviceInfo) => {
                    // check if device is a video device
                    if (device.kind === 'videoinput') {
                        console.log('video-input', device.deviceId);
                    }
                });
            }

        } catch (err) {
            console.log('loadVideoDevices-error:', err);
        }
    }

    async function loadMediaScreen() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // alert('Your browser does not support media devices.');
                return;
            }
            // get display media | desktop sharing
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            if (!stream) return;
            console.log('loadMediaScreen-result:', stream);
        } catch (err) {
            console.log('loadMediaScreen-error:', err);
        }
    }







}
