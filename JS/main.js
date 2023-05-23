var editCanvas = document.getElementById("canvas");
var ctx = editCanvas.getContext("2d");
var key;
var hunter = false;
var hunterCounter = 1;
var upload = false;

var blurLayer = document.getElementById("blurLayer");
var ctxBlurLayer = blurLayer.getContext("2d");
var funnyFaceLayer = document.getElementById("funnyFaceLayer");
var ctxFunnyFaceLayer = funnyFaceLayer.getContext("2d");
var recolorLayer = document.getElementById("recolorLayer");
var ctxRecolorLayer = recolorLayer.getContext("2d");
var fullColorLayer = document.getElementById("fullColorLayer");
var ctxFullColorLayer = fullColorLayer.getContext("2d");
var scribbleLayer = document.getElementById("scribbleLayer");
var ctxScribbleLayer = scribbleLayer.getContext("2d");

var openCVReadyFlag = false;
var chosenPlayerFlag = false;

var backgroundEffect = new Image();
var backgroundEffectIndex = 1;
var backgroundEffectList = [];
var effectList = [];
var onloadLock = 0;
var editLimit = 4;
var mat;

var classifier;
var utils;
var faceVect;
var blurFaceMat;
var xScale;
var yScale;

var chosenPlayer = document.getElementById("chosenPlayer");
var titleDiv = document.getElementById("title");
var roleSelector = document.getElementById("roleSelector");
var diguiseAgent = document.getElementById("selectionScreen");
var container = document.getElementById("container");
var editDiv = document.getElementById("edit");
var encryptionDiv = document.getElementById("encryptionKey");
var enterKey = document.getElementById("enterKey");


var originalImageData;
var greyImageData=[];
var myCanvasContext;
var greyCanvas;
var greyCanvasSrc;

var firstPageImageIds = [  "randomPersonel11", "randomPersonel12",  "randomPersonel21", "randomPersonel22",  "randomPersonel31", "randomPersonel32",  "randomPersonel41", "randomPersonel42",  "randomPersonel51", "randomPersonel52"];
var finalPageImageIds=['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10']
var doppelgangerIds=['doppelganger1', 'doppelganger2', 'doppelganger3', 'doppelganger4', 'doppelganger5', 'doppelganger6', 'doppelganger7', 'doppelganger8', 'doppelganger9', 'doppelganger10']
const race_is_element_id_is_pos = [0, 1, 2, 1, 3, 0, 0, 2, 3, 1, 2, 1, 0, 3, 1, 0, 3, 1, 2, 3, 0, 2, 1, 2];
const missing_images=['9_0_1_2_9', '0_0_0_2_4', '2_0_2_0_1', '2_0_2_0_2', '2_0_2_1_3', '2_0_2_1_7', '2_0_2_2_7', '3_0_1_1_3', '3_0_1_1_7', '3_0_1_1_9', '4_0_3_0_0', '4_0_3_0_1', '4_0_3_0_2', '4_0_3_0_3', '4_0_3_0_4', '4_0_3_0_5', '4_0_3_0_6', '4_0_3_0_7', '4_0_3_0_8', '4_0_3_0_9', '4_0_3_1_0', '4_0_3_1_1', '4_0_3_1_2', '4_0_3_1_3', '4_0_3_1_4', '4_0_3_1_5', '4_0_3_1_6', '4_0_3_1_7', '4_0_3_1_8', '4_0_3_1_9', '4_0_3_2_0', '4_0_3_2_1', '4_0_3_2_2', '4_0_3_2_3', '4_0_3_2_4', '4_0_3_2_5', '4_0_3_2_6', '4_0_3_2_7', '4_0_3_2_8', '4_0_3_2_9', '5_0_0_2_9', '6_0_0_0_4', '6_0_0_0_6', '6_0_0_0_7', '6_0_0_0_8', '6_0_0_1_4', '6_0_0_1_6', '6_0_0_1_7', '6_0_0_2_1', '6_0_0_2_2', '6_0_0_2_3', '6_0_0_2_4', '6_0_0_2_6', '6_0_0_2_7', '6_0_0_2_9', '7_0_2_1_7', '7_0_2_2_2', '7_0_2_2_3', '7_0_2_2_6', '7_0_2_2_7', '7_0_2_2_9', '8_0_3_0_7', '8_0_3_0_9', '9_0_1_1_1', '9_0_1_1_5', '9_0_1_1_7', '9_0_1_1_9', '10_0_2_0_3', '10_0_2_0_6', '10_0_2_1_2', '11_0_1_1_4', '11_0_1_1_5', '11_0_1_1_7', '11_0_1_1_9', '12_1_0_0_4', '12_1_0_0_7', '12_1_0_1_6', '12_1_0_1_7', '12_1_0_1_8', '12_1_0_2_0', '12_1_0_2_2', '12_1_0_2_4', '12_1_0_2_5', '12_1_0_2_6', '12_1_0_2_7', '12_1_0_2_8', '13_1_3_0_2', '13_1_3_0_3', '13_1_3_0_6', '13_1_3_1_4', '14_1_1_0_4', '14_1_1_0_6', '14_1_1_1_1', '14_1_1_1_4', '14_1_1_1_6', '14_1_1_1_7', '14_1_1_1_9', '14_1_1_2_7', '14_1_1_2_9', '15_1_0_0_4', '15_1_0_0_5', '15_1_0_0_9', '15_1_0_1_6', '15_1_0_1_7', '15_1_0_1_9', '16_1_3_0_9', '16_1_3_1_2', '16_1_3_2_4', '17_1_1_0_3', '17_1_1_1_3', '17_1_1_1_4', '17_1_1_1_5', '17_1_1_1_6', '17_1_1_1_8', '17_1_1_1_9', '18_1_2_0_4', '18_1_2_0_6', '18_1_2_0_7', '18_1_2_0_9', '18_1_2_1_0', '18_1_2_1_4', '18_1_2_1_5', '18_1_2_1_6', '18_1_2_1_7', '18_1_2_1_8', '18_1_2_1_9', '18_1_2_2_4', '18_1_2_2_7', '18_1_2_2_9', '19_1_3_0_8', '19_1_3_1_0', '21_1_2_0_4', '22_1_1_1_2', '22_1_1_1_5', '22_1_1_1_6', '22_1_1_1_7', '22_1_1_1_9', '22_1_1_2_4', '22_1_1_2_9', '23_1_2_0_4', '23_1_2_0_7', '23_1_2_2_4']
var imageSets;
var originalImageLocs;
var finalAgentChoices;
var doppelgangerSets=[];

var lastSliderVal=1;

var imageDir='images/cherry_picked_pics/';



var originalImagesElements = [];
for (var i = 0; i < firstPageImageIds.length; i++) {
    originalImagesElements.push(document.getElementById(firstPageImageIds[i]));
}

var finalImagesElements = [];
for (var i = 0; i < finalPageImageIds.length; i++) {
    finalImagesElements.push(document.getElementById(finalPageImageIds[i]));
}

var doppelgangerElements=[];
for (var i = 0; i < doppelgangerIds.length; i++) {
    doppelgangerElements.push(document.getElementById(doppelgangerIds[i]));
}

function onLoad() {
    for (let i = 1; i < 120; i++) {
        backgroundEffectList[i] = new Image();
        onloadLock--;
        backgroundEffectList[i].src = 'images/Source/source (' + i + ').png';
        backgroundEffectList[i].addEventListener('load', e => {
            onloadLock++;
        });
    }
}

function getRandomImages(directory, count) {
    const og_images = [];
    const ids=[]
    for (let i = 0; i < count; i++) {
        const image = getRandomFile(ids);
        og_images.push(directory + '/' + image+'.png');
        let prefix = image.substring(0, 2); // retrieve first two characters of the string
        if (prefix.substring(1,2) ==="_"){
            prefix=prefix.substring(0,1)
        }
        ids.push(prefix)
    }



    return og_images;
}

function fileExists(filename) {
    if (missing_images.includes(filename))
    {
        return false
    }
    return true
}

function getRandomInt(max){
    return Math.floor(Math.random() * (max + 1));
}

function getRandomFile(repetitionArrayIn=[]) {
    let id = 20

    do{
        id = getRandomInt(23);
    }while (repetitionArrayIn.includes(id.toString()))
    let gender=0;
    if (id >= 12){
        gender=1;
    }
    let file=id+'_'+gender+'_'+race_is_element_id_is_pos[id]+'_'+getRandomInt(2)+'_'+getRandomInt(9);
    if (fileExists(file)){
        return file;
    }
    else{
        return getRandomFile(repetitionArrayIn)
    }
}



function startGameButton() {
    titleDiv.style.visibility = 'hidden';
    roleSelector.style.visibility = 'visible';
    document.getElementById("effectCount").innerHTML = "Effect Left: " + editLimit;
    let slider = document.getElementById("doppelgangerSlider").querySelector(".slider");
    slider.value = 1;
    imageSets=getRandomImages(imageDir, 10)
    originalImageLocs=imageSets
    finalAgentChoices=originalImageLocs
    for (var i = 0; i < originalImagesElements.length; i++) {
        originalImagesElements[i].src=originalImageLocs[i]
    }
}

function diguiseAgentButton() {
    clearInterval(update);
    roleSelector.style.visibility = 'hidden';
    diguiseAgent.style.visibility = 'visible';
}

function drawBackGroundEffect() {
    if (onloadLock == 0) {
        container.style.backgroundImage = 'images/Source/source (' + backgroundEffectIndex + ').png';
        /**
         var curr = new Image();
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         curr.src = 'images/Source/source (' + backgroundEffectIndex + ').png';
         ctx.drawImage(curr, 0, 0, canvas.width, canvas.height);*/
        backgroundEffectIndex++;
        if (backgroundEffectIndex >= backgroundEffectList.length) {
            backgroundEffectIndex = 1;
        }
    }
}

function choosePlayer(caller) {
    chosenPlayerFlag = true;
    upload = false;
    chosenPlayer.src = caller.src;
    mat = cv.imread(chosenPlayer);
}

let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
    chosenPlayerFlag = true;
    upload = true;

    chosenPlayer.src = URL.createObjectURL(e.target.files[0]);
    document.getElementById("p15").src = chosenPlayer.src;
}, false);


chosenPlayer.onload = function () {
    mat = cv.imread(chosenPlayer);
};

function update() {
    drawBackGroundEffect();
}

function openCVReady() {
    openCVReadyFlag = true;
}

function cascadeIsReady() {
}

function submitPwd() {
    const pwd = document.getElementById("submit").value;
    if (pwd === key) {
        document.getElementById("option").style.visibility = "visible";
        document.getElementById("keyLock").style.visibility = "hidden";
    } else {
        swal({
            title: "Wrong Password", icon: "error", button: "Try again"
        });
    }
}

function intel() {
    swal({
        text: "According to our provider, the agent is using some form of cryptography to lock their modification. The key itself has been encrypted. The provider have discovered the method they used to encrypt the key.\n\nThe characters' positions have been shifted two spaces forward or backward\n",
        title: "Encrypted Key: " + key.slice(2) + key.slice(0, 2),
        icon: "info",
        button: "Decrypt now"
    });
}

flag = 0;

function clearpwd() {
    if (flag == 0) {
        document.getElementById("submit").value = "";
        flag = 1;
    }

}

function calcGreyScale(){
    let width=600
    let height=600
    myCanvasContext=canvas.getContext("2d");
    originalImageData=myCanvasContext.getImageData(0,0, width, height);
    greyImageData=originalImageData;
    for (j=0; j<originalImageData.height; j++)
    {
        for (i=0; i<originalImageData.width; i++)
        {
            var index=(i*4)*width+(j*4);
            var red=originalImageData.data[index];
            var green=originalImageData.data[index+1];
            var blue=originalImageData.data[index+2];
            var alpha=originalImageData.data[index+3];
            var average=(red+green+blue)/3;
            //originalImageData.data[index]=average;
            //originalImageData.data[index+1]=average;
            //originalImageData.data[index+2]=average;
            //originalImageData.data[index+3]=alpha;
            greyImageData.data[index]=average;
            greyImageData.data[index+1]=average;
            greyImageData.data[index+2]=average;
            greyImageData.data[index+3]=alpha;
        }
    }

    greyCanvas = document.createElement('canvas'),
        ctx = greyCanvas.getContext('2d');
    greyCanvas.width = width;
    greyCanvas.height = height;
    var idata = ctx.createImageData(width, height);
    idata.data.set(greyImageData);
    ctx.putImageData(idata, 0, 0);
    return greyCanvas.toDataURL();
}

function startEdit() {
    doppelgangerSets.push(getDoppelgangerImages(imageDir, 2))
    doppelgangerSets.push(getDoppelgangerImages(imageDir, 3))
    doppelgangerSets.push(getDoppelgangerImages(imageDir, 4))

    for (var i = 0; i < doppelgangerElements.length; i++) {
        doppelgangerElements[i].src=originalImageLocs[i]
    }
    document.getElementById("doppelgangersPreview").style.visibility = "visible"
    if (openCVReadyFlag === false) {
        swal({
            text: "OpenCV hasn't finished loading. PLease wait a moment before trying again.",
            icon: "info"
        });
        return;
    }
    if (chosenPlayerFlag === false) {
        swal({
            title: "You didn't choose an agent.",
            icon: "warning"
        });
        return;
    }
    container.style.background = "";
    diguiseAgent.style.visibility='hidden';
    editDiv.style.visibility = 'visible';
    document.getElementById("tradeMark").style.color = "black";


    var resizeMat = new cv.Mat();
    let dsize = new cv.Size(600, 600);

    faceClassifier = new cv.CascadeClassifier();
    faceClassifier.load('haarcascade_frontalface_default.xml');
    faceVect = new cv.RectVector();
    faceClassifier.detectMultiScale(mat, faceVect);
    face = new cv.Rect(faceVect.get(0).x, faceVect.get(0).y, faceVect.get(0).width, faceVect.get(0).height);

    //cv.resize(mat, resizeMat, dsize, 0, 0, cv.INTER_AREA);
    //cv.imshow("canvas", mat);
    ctx.drawImage(chosenPlayer,0,0, 600, 600)

    xScale = 600 / (mat.size().width);
    yScale = 600 / (mat.size().height);

    // draw the noise layer:
    var blurNoiseSizeWidth = face.width / 40;
    var blurNoiseSizeHeight = face.height / 40;
    for (let i = 0; i < 41 ; i ++) {
        for (let j = 0; j < 41 ; j ++) {
            ctxBlurLayer.fillStyle =  'rgb('+
                Math.floor(Math.random()*256)+','+
                Math.floor(Math.random()*256)+','+
                Math.floor(Math.random()*256)+')';
            ctxBlurLayer.fillRect((face.x + i * blurNoiseSizeHeight) * xScale,
                (face.y + j * blurNoiseSizeWidth) * yScale,
                blurNoiseSizeHeight * xScale, blurNoiseSizeWidth * yScale
            )
        }
    }

    // Draw contour
    var image = new cv.Mat();
    var cannyImage = new cv.Mat();

    cv.cvtColor(mat, image, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(mat, cannyImage, 50, 100, 3, false);

    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    var poly = new cv.MatVector();

    mat.convertTo(image, cv.CV_8UC3);
    cv.findContours(cannyImage, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    var contour = new cv.Mat();
    contour = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);

    for (let i = 0; i < contours.size(); ++i) {
        var color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
            Math.round(Math.random() * 255));
        cv.drawContours(contour, contours, i, color, 1, 8, hierarchy, 10);
    }
    var contourScaled = new cv.Mat();
    console.log(contour.size())
    cv.resize(contour, contourScaled ,dsize, 0, 0, cv.INTER_AREA);
    cv.imshow("scribbleLayer", contourScaled);

    // Draw sth
    image = new cv.Mat();
    cannyImage = new cv.Mat();

    cv.cvtColor(mat, image, cv.COLOR_RGBA2GRAY, 0);
    cv.Canny(mat, cannyImage, 50, 100, 3, false);

    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    poly = new cv.MatVector();

    mat.convertTo(image, cv.CV_8UC3);
    cv.findContours(cannyImage, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    contour = new cv.Mat();
    contour = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);

    for (let i = 0; i < contours.size(); ++i) {
        var color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
            Math.round(Math.random() * 255));
        cv.drawContours(contour, contours, i, color, 1, 8, hierarchy, -1);
    }
    contourScaled = new cv.Mat();
    console.log(contour.size())
    cv.resize(contour, contourScaled ,dsize, 0, 0, cv.INTER_AREA);
    cv.imshow("recolorLayer", contourScaled);

    //
    ctxFullColorLayer.fillStyle =  'rgba('+
        Math.floor(Math.random()*256) + ',' +
        Math.floor(Math.random()*256) + ',' +
        Math.floor(Math.random()*256) + ',' +
        0.2 + ')';
    ctxFullColorLayer.fillRect(0,0,600,600);
}


function turnOffEffect() {
    editCanvas.style.filter = "";
    blurLayer.style.filter = "";
    recolorLayer.style.filter = "";
    scribbleLayer.style.filter = "";
    fullColorLayer.style.filter = "";
    funnyFaceLayer.style.filter = "";
    blurLayer.style.visibility = "hidden";
    funnyFaceLayer.style.visibility = "hidden";
    recolorLayer.style.visibility = "hidden";
    fullColorLayer.style.visibility = "hidden";
    scribbleLayer.style.visibility = "hidden";
}

function turnOnEffect() {
    for (const effect of effectList) {
        toggelEffect(effect);
    }
}

function enterPassword() {
    encryptionDiv.style.visibility = "hidden";
    enterKey.style.visibility = "visible";
}

function submitPassword() {
    let pwd = document.getElementById("pwd").value;

    if (pwd === "") {
        swal({
            title: "Enter a key", icon: "warning"
        });
        return;
    }

    if (pwd.length !== 4) {
        swal({
            title: "Enter a four letter key", icon: "warning"
        });
        return;
    }

    if (/\d/.test(pwd)) {
        swal({
            title: "Please use no numbers in your key", icon: "warning"
        });
        return;
    }

    if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(pwd)) {
        swal({
            title: "Please don't use any special characters in your key", icon: "warning"
        });
        return;
    }

    key = pwd;
    enterPlayer2();
}

function enterPlayer2() {
    /*
      if (!document.getElementById("blurFace").checked){
        document.getElementById("blurFace").disabled = true;
      }

      if (!document.getElementById("funnyFace").checked){
        document.getElementById("funnyFace").disabled = true;
      }

      if (!document.getElementById("recolor").checked){
        document.getElementById("recolor").disabled = true;
      }
      if (!document.getElementById("fullColor").checked){
        document.getElementById("fullColor").disabled = true;
      }

      if (!document.getElementById("scribble").checked){
        document.getElementById("scribble").disabled = true;
      }

      if (!document.getElementById("gaussianBlur").checked){
        document.getElementById("gaussianBlur").disabled = true;
      }
    */

    enterKey.style.visibility = "hidden";
    encryptionDiv.style.visibility = "hidden";
    roleSelector.style.visibility = "visible";

    var b1 = document.getElementById("b1");
    document.getElementById("roleName").innerHTML = "Bounty Hunter";
    document.getElementById("tradeMark").style.color = "white";
    b1.setAttribute("onclick", "identifyAgentButton()");
    container.style.background = "url('images/source.gif')";
    hunter = true;
}

function submitTarget(picture) {
    swal({
        text: "Do you want to lock down on this target?", icon: "warning", buttons: ["No", "Yes"]
    }).then(function (isConfirm) {
        if (isConfirm) {
            if (upload) {
                if (picture.src === chosenPlayer.src) {
                    turnOffEffect();
                    document.getElementById("edit").style.visibility = "hidden";
                    document.getElementById("maleChoice").style.visibility = "hidden";
                    document.getElementById("roleSelector").style.visibility = "hidden";
                    document.getElementById("option").style.visibility = "hidden";
                    document.getElementById("intelBtn").style.visibility = "hidden";
                    document.getElementById("submitPwdBtn").style.visibility = "hidden";
                    document.getElementById("submit").style.visibility = "hidden";
                    document.getElementById("win").style.visibility = "visible";
                } else {
                    turnOffEffect();
                    document.getElementById("edit").style.visibility = "hidden";
                    document.getElementById("maleChoice").style.visibility = "hidden";
                    document.getElementById("roleSelector").style.visibility = "hidden";
                    document.getElementById("option").style.visibility = "hidden";
                    document.getElementById("intelBtn").style.visibility = "hidden";
                    document.getElementById("submitPwdBtn").style.visibility = "hidden";
                    document.getElementById("submit").style.visibility = "hidden";
                    document.getElementById("win").style.visibility = "visible";

                    document.getElementById("labelWinLose").innerHTML = "You lose";
                    document.getElementById("announcement").innerHTML = "You have identified and captured the wrong target!";
                }
            } else {
                if (picture.src === chosenPlayer.src) {
                    turnOffEffect();
                    document.getElementById("edit").style.visibility = "hidden";
                    document.getElementById("maleChoice").style.visibility = "hidden";
                    document.getElementById("roleSelector").style.visibility = "hidden";
                    document.getElementById("option").style.visibility = "hidden";
                    document.getElementById("intelBtn").style.visibility = "hidden";
                    document.getElementById("submitPwdBtn").style.visibility = "hidden";
                    document.getElementById("submit").style.visibility = "hidden";
                    document.getElementById("win").style.visibility = "visible";
                } else {
                    turnOffEffect();
                    document.getElementById("edit").style.visibility = "hidden";
                    document.getElementById("maleChoice").style.visibility = "hidden";
                    document.getElementById("roleSelector").style.visibility = "hidden";
                    document.getElementById("option").style.visibility = "hidden";
                    document.getElementById("intelBtn").style.visibility = "hidden";
                    document.getElementById("submitPwdBtn").style.visibility = "hidden";
                    document.getElementById("submit").style.visibility = "hidden";
                    document.getElementById("win").style.visibility = "visible";

                    document.getElementById("labelWinLose").innerHTML = "You lose";
                    document.getElementById("announcement").innerHTML = "You have identified and captured the wrong target!";
                }
            }
        }
    })
}

function restart() {
    location.reload();
}

//credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


function getDoppelgangerImages(directory, value) {
    //f"{id}_{gender}_{race}_{background}_{costume}"
    let chosenInfo=chosenPlayer.src
    let chosenId=chosenInfo.substring(chosenInfo.length-14, chosenInfo.length-12)
    if (chosenId.substring(0,1)==="/"){
        chosenId=chosenId.substring(1,2)
    }
    let gender=-1
    let genderOffset=-1
    if (chosenId<12){
        gender='0'
        genderOffset=0
    }
    else{
        gender='1'
        genderOffset=12
    }

    let imagesToReturn=[]

    let race = chosenInfo.substring(chosenInfo.length-9, chosenInfo.length-8)
    let background = chosenInfo.substring(chosenInfo.length-7, chosenInfo.length-6)
    let costume = chosenInfo.substring(chosenInfo.length-5, chosenInfo.length-4)
    const ids=[]
    let idsToSkip=[]
    let file=""

    do {
        firstIdToSkip = (getRandomInt(11) + genderOffset).toString()
    } while (firstIdToSkip == chosenId)
    idsToSkip.push(firstIdToSkip)

    if(gender==0){
        idsToSkip.push('4') //There is no Identity 4
    }else{
        do {
            secondIdToSkip = (getRandomInt(11) + genderOffset).toString()
        } while (secondIdToSkip == chosenId || secondIdToSkip == firstIdToSkip)
        idsToSkip.push(secondIdToSkip)
    }

    for (let i = genderOffset; i < (12+genderOffset); i++) {
        if (i.toString()===chosenId || idsToSkip.includes(i.toString())){
            continue
        }
        if(value==2){
            do{
                file=i+'_'+gender+'_'+race_is_element_id_is_pos[i]+'_'+getRandomInt(2)+'_'+getRandomInt(9);
            } while(!fileExists(file))
        }
        if(value==3){
            do{
                file=i+'_'+gender+'_'+race_is_element_id_is_pos[i]+'_'+background+'_'+getRandomInt(9);
            } while(!fileExists(file))
        }
        if(value==4){
            do{
                file=i+'_'+gender+'_'+race_is_element_id_is_pos[i]+'_'+background+'_'+costume;
                if(!fileExists(file)){
                    file=i+'_'+gender+'_'+race_is_element_id_is_pos[i]+'_'+background+'_'+getRandomInt(9);
                }
            } while(!fileExists(file))
        }

        imagesToReturn.push(directory+'/'+file+'.png')
    }
    imagesToReturn.push(directory+'/'+chosenId+'_'+gender+'_'+race+'_'+background+'_'+costume+'.png')


    return shuffle(imagesToReturn);
}

function updateDoppelgangers(value){
    editLimit=editLimit-(value-lastSliderVal)
    if(editLimit<0){
        swal({
            title: "Can't add more effects", icon: "warning"
        });
        let slider = document.getElementById("doppelgangerSlider").querySelector(".slider");
        slider.value = lastSliderVal;
        editLimit=editLimit+(value-lastSliderVal)
        return
    }
    document.getElementById("effectCount").innerHTML = "Effect Left: " + editLimit;
    if (value == 1){

        finalAgentChoices=originalImageLocs
    }
    else{
        finalAgentChoices=doppelgangerSets[value-2]
    }
    for (var i = 0; i < doppelgangerElements.length; i++) {
        doppelgangerElements[i].src=finalAgentChoices[i]
    }
    lastSliderVal=value
}

function finishEdit() {
    document.getElementById("learn_blurFace").remove();
    document.getElementById("learn_scribble").remove();
    document.getElementById("learn_fullColor").remove();
    document.getElementById("learn_gaussian").remove();
    document.getElementById("doppelgangerSlider").remove();
    editDiv.style.visibility = 'hidden';
    encryptionDiv.style.visibility = "visible";
    document.getElementById("doppelgangersPreview").style.visibility = "hidden"
    let agentChoicesLocs=finalAgentChoices
    for (var i = 0; i < finalImagesElements.length; i++) {
        finalImagesElements[i].src=agentChoicesLocs[i]
    }
    turnOffEffect();
}

function identifyAgentButton() {
    editDiv.style.visibility = "visible";

    document.getElementById("effectCount").style.visibility = "hidden";
    document.getElementById("randomButton").style.visibility = "hidden";

    document.getElementById("maleChoice").style.visibility = "visible";

    if (key != null) {
        document.getElementById("option").style.visibility = "hidden";
        document.getElementById("keyLock").style.visibility = "visible";
    }

    container.style.background = "";
    turnOnEffect();
    document.getElementById("blurFace").checked = false;
    document.getElementById("recolor").checked = false;
    document.getElementById("fullColor").checked = false;
    document.getElementById("gaussianBlur").checked = false;
    document.getElementById("label").innerHTML = "Choose wisely! You can only try to undo 1 effect";
    document.getElementById("tradeMark").style.color = "black";
}

function edit(effect) {
    if (effectList.includes(effect.id)) {
        if (hunter) {
            effect.checked = true;

            if (hunterCounter <= 0) {
                swal({
                    title: "You have ran out of undoes!", icon: "warning"
                });
                effect.checked = false;
                return;
            }
            hunterCounter--;
        }
        effectList.splice(effectList.indexOf(effect.id), 1);
        toggelEffect(effect.id);
        editLimit++;
    } else {
        if (hunter) {
            effect.checked = false;
            if (hunterCounter <= 0) {
                swal({
                    title: "You have ran out of undoes!", icon: "warning"
                });
                return;
            }
            hunterCounter--;
            swal({
                title: "You have chosen the wrong effect to remove!", icon: "error"
            });
            return;
        }
        if (editLimit === 0) {
            swal({
                title: "Can't add more effects", icon: "warning"
            });
            effect.checked = false;
            return;
        }
        effectList.push(effect.id);
        toggelEffect(effect.id);
        editLimit--;
    }
    document.getElementById("effectCount").innerHTML = "Effect Left: " + editLimit;
}

function toggelEffect(effectID) {
    if (effectID === "blurFace") {
        if (blurLayer.style.visibility === "hidden") {
            blurLayer.style.visibility = "visible";
        } else {
            blurLayer.style.visibility = "hidden";
            if (hunter) {
                document.getElementById("blurFace").disabled = true;
            }
        }
        return;
    }
    if (effectID === "funnyFace") {
        if (funnyFaceLayer.style.visibility === "hidden") {
            funnyFaceLayer.style.visibility = "visible";
        } else {
            funnyFaceLayer.style.visibility = "hidden";
            if (hunter) {
                document.getElementById("funnyFace").disabled = true;
            }
        }
        return;
    }
    if (effectID === "recolor") {
        if (recolorLayer.style.visibility === "hidden") {
            recolorLayer.style.visibility = "visible";
        } else {
            recolorLayer.style.visibility = "hidden";
            if (hunter) {
                document.getElementById("recolor").disabled = true;
            }
        }
        return;
    }
    if (effectID === "fullColor") {
        if (fullColorLayer.style.visibility === "hidden") {
            fullColorLayer.style.visibility = "visible";
        } else {
            fullColorLayer.style.visibility = "hidden";
            if (hunter) {
                document.getElementById("fullColor").disabled = true;
            }
        }
        return;
    }
    if (effectID === "scribble") {
        if (scribbleLayer.style.visibility === "hidden") {
            scribbleLayer.style.visibility = "visible";
        } else {
            scribbleLayer.style.visibility = "hidden";
            if (hunter) {
                document.getElementById("scribble").disabled = true;
            }
        }
        return;
    }
    if (effectID === "gaussianBlur") {
        if (editCanvas.style.filter === "") {
            editCanvas.style.filter = "blur(5px)";
            blurLayer.style.filter = "blur(5px)";
            recolorLayer.style.filter = "blur(5px)";
            scribbleLayer.style.filter = "blur(5px)";
            fullColorLayer.style.filter = "blur(5px)";
            funnyFaceLayer.style.filter = "blur(5px)";
        } else {
            if (hunter) {
                document.getElementById("gaussianBlur").disabled = true;
            }
            editCanvas.style.filter = "";
            blurLayer.style.filter = "";
            recolorLayer.style.filter = "";
            scribbleLayer.style.filter = "";
            fullColorLayer.style.filter = "";
            funnyFaceLayer.style.filter = "";
        }
    }
}

function toggleMoreInfo(title) {
    let info = "";
    if (title === "Blur Face") {
        info = "Conceals face by completely covering it."
    } else if (title === "Scribble") {
        info = "Changes the image into a scribble form of drawing."
    } else if (title === "Full Color") {
        info = "full color"
    } else {
        info = "Blurs the whole image by a Gaussian function which reduces image detail."
    }
    swal({
        title: title, text: info, icon: "info"
    });
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

onLoad();
setInterval(update, 80);