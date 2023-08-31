const buildUrl = 'Build';
const loaderUrl = buildUrl + '/tds_web_deploy.loader.js';

const instanceConfig = {
    dataUrl: buildUrl + '/tds_web_deploy.data.unityweb',
    frameworkUrl: buildUrl + '/tds_web_deploy.framework.js.unityweb',
    
    codeUrl: buildUrl + '/tds_web_deploy.wasm.unityweb',
    
    
    
    streamingAssetsUrl: 'StreamingAssets',
    companyName: "BarbarGames",
    productName: "Tanchiki",
    productVersion: "0.1",
    showBanner: () => {}
}

var unity;
var vkInitialized = false;

const onWindowLoaded = () => {
    Init();

    const loadingProgress = new progressBar('loading-progress');
    const gameCanvas = document.getElementById('game-canvas');
    const loaderScript = document.createElement('script');

    loaderScript.src = loaderUrl;
    loadingProgress.setMax(1);
    loadingProgress.show();
    
    loaderScript.onload = () => {
        createUnityInstance(gameCanvas, instanceConfig, (progress) => loadingProgress.setCurrent(progress))
            .then((unityInstance) => {
                console.log('unityInstance Initialized');
                unity = unityInstance;
                unity.SendMessage('JSHandler', 'Init');
                loadingProgress.hide();
            })
            .catch((msg) => {
                alert(msg);
            });
    }
    
    document.body.appendChild(loaderScript);
}

window.onload = onWindowLoaded;

function Init() {
    console.log('Init');

    const bridge = vkBridge.default;
    bridge.subscribe((e) => console.log("vkBridge event", e));
    bridge.send('VKWebAppInit')
        .then((data) => {
            if (data.result) {
                // Приложение инициализировано
                vkInitialized = true;
            } else {
                // Ошибка
            }
        })
        .catch((error) => {
            // Ошибка
            console.log(error);
        });
}

function GetUserInfo() {
    console.log('GetUserInfo');

    if (vkInitialized == false)
    {
        SetUserInfoByMachineId();
        return;
    }

    const bridge = vkBridge.default;
    bridge.send('VKWebAppGetUserInfo', {})
        .then((data) => {
            if (data.id) {
                // Данные пользователя получены
                console.log(data);
                unity.SendMessage('JSHandler', 'SetUserInfo', 'vk_' + data.id + ';' + data.first_name);
            }
            else
            {
                SetUserInfoByMachineId();
            }
        })
        .catch((error) => {
            // Ошибка
            console.log(error);
            SetUserInfoByMachineId();
        });
}

function SetUserInfoByMachineId()
{
    console.log('SetUserInfoByMachineId');
    var deviceID = GetMachineId();
    unity.SendMessage('JSHandler', 'SetUserInfo', 'machine_' + deviceID);
}

function GetMachineId() {

    let machineId = localStorage.getItem('MachineId');

    if (!machineId) {
        machineId = Math.random() * 999999;
        localStorage.setItem('MachineId', machineId);
    }

    return machineId;
}
