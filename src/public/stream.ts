// import io from 'socket.io-client';

declare var io: any;

window.onload = async () => {

    const server_url = 'http://192.168.0.110:3000';

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
    let localStream: MediaStream | null = null;

    const media_devices: MediaDeviceInfo[] = [];

    const local_video: HTMLElement | undefined = document.getElementById('local-video');
    const select_camera_btn = document.getElementById('select-camera-btn');
    const select_screen_btn = document.getElementById('select-screen-btn');

    const open_setting_btn = document.getElementById('open-setting-btn');
    const start_stream_btn = document.getElementById('start-stream-btn');
    const voice_on_btn = document.getElementById('voice-on-btn');
    const voice_off_btn = document.getElementById('voice-off-btn');
    const video_on_btn = document.getElementById('video-on-btn');
    const video_off_btn = document.getElementById('video-off-btn');
    const stop_stream_btn = document.getElementById('stop-stream-btn');


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

    if (open_setting_btn) {
        open_setting_btn.addEventListener('click', () => {
            console.log('open_setting_btn:click');
            const media_top_lay = document.getElementById('media-top-lay');
            const filter_container = document.getElementById('filter-container');
            if (!media_top_lay || !filter_container) return;
            if (media_top_lay.style.display === 'none') {
                media_top_lay.style.display = 'flex';
                filter_container.style.display = 'flex';
                open_setting_btn.title = 'Close Setting';
            } else {
                media_top_lay.style.display = 'none';
                filter_container.style.display = 'none';
                open_setting_btn.title = 'Open Setting';
            }
        });
    }

    const enableBtn = (btn: HTMLElement | undefined, enable: boolean) => {
        if (!btn) return;
        (btn as any).disabled = !enable;
        btn.style.display = enable ? 'flex' : 'none';
    };

    enableBtn(open_setting_btn, true);
    enableBtn(start_stream_btn, false);
    enableBtn(voice_on_btn, false);
    enableBtn(voice_off_btn, false);
    enableBtn(video_on_btn, false);
    enableBtn(video_off_btn, false);
    enableBtn(stop_stream_btn, false);

    if (select_camera_btn) {
        select_camera_btn.onclick = async () => {
            loadVideoDevices();
        };
    }
    if (select_screen_btn) {
        select_screen_btn.onclick = async () => {
            loadScreenInputs();
        };
    }

    function loadVideoDevices() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !navigator.mediaDevices.enumerateDevices) {
                // alert('Your browser does not support media devices.');
                return;
            }
            // get video or audio devices | camera hardware
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            }).then(() => navigator.mediaDevices.enumerateDevices())
                .then((devices: MediaDeviceInfo[]) => {
                    console.log('devices:', devices);
                    //
                    if (devices.length === 0) {
                        const left_list_lay: HTMLElement = document.getElementById('media-left-list-lay') as HTMLElement;
                        // remove all elements which its class name contains 'media-list-item'
                        left_list_lay.innerHTML = '';
                        return;
                    }
                    //

                    // const camera_select_lay = document.getElementById('camera-select-lay') as HTMLElement;
                    // camera_select_lay.innerHTML = '';

                    const left_list_lay: HTMLElement = document.getElementById('media-left-list-lay') as HTMLElement;
                    // remove all elements which its class name contains 'media-list-item'
                    left_list_lay.innerHTML = '';
                    devices.forEach((device: MediaDeviceInfo) => {
                        // allow only video devices
                        if (device.kind != 'videoinput') return;
                        media_devices.push(device);
                    });
                    if (media_devices.length > 0) {
                        media_devices.forEach((device: MediaDeviceInfo, index: number) => {
                            console.log('device:', device, index);
                            const list_item = document.createElement('div');
                            list_item.className = 'media-list-item';
                            list_item.id = device.deviceId;
                            list_item.innerHTML = `
                                <div class="media-list-item-icon">
                                    <i class="fa fa-video-camera list-icon"></i>
                                </div>
                                <div class="media-list-item-text">
                                    <div class="media-list-item-text-title">${device.label ? device.label : 'Default Device'}</div>
                                    <div class="media-list-item-text-subtitle">${device.kind === 'videoinput' ? 'Video Input' : device.kind === 'audioinput' ? 'Audio Input' : 'Media Input'}</div>
                                    </div>
                                </div>
                            `;
                            list_item.onclick = async () => selectCamera(index);
                            left_list_lay.appendChild(list_item);
                        });

                        // selectCamera();
                    }
                    // devices.forEach((device: MediaDeviceInfo) => {
                    //     // if (device.kind === 'videoinput') {
                    //     //     const option = document.createElement('option');
                    //     //     option.value = device.deviceId;
                    //     //     option.innerText = device.label;
                    //     //     camera_select_lay.appendChild(option);
                    //     // }
                    // });
                    //
                }).catch((err: any) => {
                    console.log('err:', err);
                });
            // const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();

            // // check if there is a camera
            // const video_device = devices.find((device: MediaDeviceInfo) => device.kind === 'videoinput');
            // // ceck if there is a microphone
            // const audio_device = devices.find((device: MediaDeviceInfo) => device.kind === 'audioinput');

            // // check if there are any devices
            // if (devices.length === 0) {
            //     const left_list_lay: HTMLElement | undefined = document.getElementById('media-left-list-lay');
            //     if (!left_list_lay) return;
            //     // remove all elements which its class name contains 'media-list-item'
            //     left_list_lay.innerHTML = '';
            //     return;
            // }
            // console.log('loadVideoDevices-result', devices);
            // media_devices = devices;
            // loadVideoDevicesToListContainer(devices);

        } catch (err) {
            console.log('loadVideoDevices-error:', err);
        }
    }

    async function loadScreenInputs() {
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
            if (!stream) {
                const right_list_lay: HTMLElement | undefined = document.getElementById('media-right-list-lay');
                if (!right_list_lay) return;
                // remove all elements which its class name contains 'media-list-item'
                right_list_lay.innerHTML = '';
                return;
            }
            console.log('loadMediaScreen-result:', stream);
            loadScreenInputsToListContainer(stream);

        } catch (err) {
            console.log('loadMediaScreen-error:', err);
        }
    }

    function selectCamera(device_position: number = 0) {
        console.log('onMediaInputClick-device:', media_devices[device_position]);
        // load video stream from specific device id
        const deviceId = media_devices[device_position].deviceId;
        navigator.mediaDevices.getUserMedia({
            video: { deviceId: deviceId ? { exact: deviceId } : undefined },
            // audio: { deviceId: deviceId ? { exact: deviceId } : undefined }
        }).then((stream: MediaStream) => {
            console.log('onMediaInputClick-stream:', stream);
            if ((local_video as any).srcObject && (local_video as any).srcObject.getTracks) {
                (local_video as any).srcObject.getTracks().forEach((track: any) => track.stop());
            }
            if (!stream) return;
            console.log('onMediaInputClick-stream:', stream);

            localStream = stream;
            // clear remote stream
            // remoteStream = new MediaStream();

            // Push tracks from local stream to peer connection
            localStream.getTracks().forEach((track: MediaStreamTrack) => {
                if (pc.getSenders().find((sender: RTCRtpSender) => sender.track === track)) return;
                pc.addTrack(track, localStream);
            });

            (local_video as any).srcObject = stream;

            // enable buttons
            enableBtn(start_stream_btn, true);
            enableBtn(voice_on_btn, false);
            enableBtn(voice_off_btn, true);
            enableBtn(video_on_btn, false);
            enableBtn(video_off_btn, true);
            enableBtn(stop_stream_btn, true);
        }).catch((err: any) => {
            console.log('onMediaInputClick-error:', err);
        });
    }

    async function loadScreenInputsToListContainer(stream: MediaStream) {
        const right_list_lay: HTMLElement | undefined = document.getElementById('media-right-list-lay');
        if (!right_list_lay) return;
        // remove all elements which its class name contains 'media-list-item'
        right_list_lay.innerHTML = '';
        const list_item = document.createElement('div');
        list_item.className = 'media-list-item';
        list_item.id = stream.id;
        list_item.innerHTML = `
                <div class="media-list-item-icon">
                    <i class="fa fa-desktop list-icon"></i>
                </div>
                <div class="media-list-item-text">
                    <div class="media-list-item-text-title">Screen 1</div>
                    <div class="media-list-item-text-subtitle">Screen Input</div>
                    </div>
                </div>
            `;
        list_item.onclick = async () => onMediaSoftwareInputClick(stream);
        right_list_lay.appendChild(list_item);
    }

    async function onMediaSoftwareInputClick(stream: MediaStream) {
        console.log('onMediaSoftwareInputClick-stream:', stream);
        localStream = stream;
        // clear remote stream
        // remoteStream = new MediaStream();

        // Push tracks from local stream to peer connection
        stream.getTracks().forEach((track: MediaStreamTrack) => {
            // ceck if track is not already added
            if (pc.getSenders().find((sender: RTCRtpSender) => sender.track === track)) return;
            pc.addTrack(track, stream);
        });

        (local_video as any).srcObject = stream;

        // enable buttons
        enableBtn(start_stream_btn, true);
        enableBtn(voice_on_btn, false);
        enableBtn(voice_off_btn, true);
        enableBtn(video_on_btn, false);
        enableBtn(video_off_btn, true);
        enableBtn(stop_stream_btn, true);
    }

}
