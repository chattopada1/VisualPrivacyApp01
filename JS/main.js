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
var editLimit = 2;
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

function onLoad() {
  for (let i = 1; i < 120; i ++) {
    backgroundEffectList[i] = new Image();
    onloadLock --;
    backgroundEffectList[i].src = 'images/Source/source (' + i + ').png';
    backgroundEffectList[i].addEventListener('load', e => {
      onloadLock ++;
    });
  }
}

function startGameButton() {
  titleDiv.style.visibility='hidden';
  roleSelector.style.visibility = 'visible';
}

function diguiseAgentButton() {
  clearInterval(update);
  roleSelector.style.visibility='hidden';
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
    backgroundEffectIndex ++;
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


chosenPlayer.onload = function() {
  mat = cv.imread(chosenPlayer);
};

function update() {
  drawBackGroundEffect();
}

function openCVReady() {
  openCVReadyFlag = true;
}

function cascadeIsReady(){}

function submitPwd() {
  var pwd = document.getElementById("submit").value;
  if (pwd == key) {
    document.getElementById("option").style.visibility = "visible";
    document.getElementById("keyLock").style.visibility = "hidden";
  } else {
    alert("Wrong Password");
  }
}

function intel() {
  alert("According to our provider, the agent is using some form of cryptography to lock their modification. The key itself has been encrypted. The provider have discover the method they use to encryp the key.\nAll the characters in the key has been shift two character forward or backward\n" + key.slice(2) + key.slice(0,2));
}

flag = 0;
function clearpwd() {
  if (flag == 0) {
    document.getElementById("submit").value = "";
    flag = 1;
  }

}

function startEdit() {
  if (openCVReadyFlag == false) {
    alert("OpenCV hasn't finnished loading. PLease wait a moment before trying again.");
    return;
  }
  if (chosenPlayerFlag == false) {
    alert("You haven't choose the agent.");
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
  pwd = document.getElementById("pwd").value;

  if (pwd == "") {
    alert("Enter a key");
    return;
  }

  if (pwd.length != 4) {
    alert("Please use a 4 digit key!");
    return;
  }

  if (/\d/.test(pwd)) {
    alert("Please use no number in your key!");
    return;
  }

  if (/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(pwd)) {
    alert("Please use no special charactor in your key!");
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
  if (confirm("Do you want to lock down on this target?")) {
    if (upload) {
      if (picture.src == chosenPlayer.src) {
        turnOffEffect();
        document.getElementById("edit").style.visibility = "hidden";
        document.getElementById("maleChoice").style.visibility = "hidden";
        document.getElementById("roleSelector").style.visibility = "hidden";
        document.getElementById("option").style.visibility = "hidden";
        document.getElementById("intelBtn").style.visibility = "hidden";
        document.getElementById("submitPwdBtn").style.visibility = "hidden";
        document.getElementById("submit").style.visibility = "hidden";
        document.getElementById("win").style.visibility = "visible";
      }
      else {
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
        document.getElementById("announcement").innerHTML = "You have identifed and captured the wrong target!";
      }
    } else {
      if (picture.src == chosenPlayer.src) {
        turnOffEffect();
        document.getElementById("edit").style.visibility = "hidden";
        document.getElementById("maleChoice").style.visibility = "hidden";
        document.getElementById("roleSelector").style.visibility = "hidden";
        document.getElementById("option").style.visibility = "hidden";
        document.getElementById("intelBtn").style.visibility = "hidden";
        document.getElementById("submitPwdBtn").style.visibility = "hidden";
        document.getElementById("submit").style.visibility = "hidden";
        document.getElementById("win").style.visibility = "visible";
      }
      else {
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
        document.getElementById("announcement").innerHTML = "You have identifed and captured the wrong target!";
      }
    }
  } else {
    return;
  }
}

function restart() {
  location.reload();
}

function finishEdit() {
  editDiv.style.visibility = 'hidden';
  encryptionDiv.style.visibility = "visible";
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
        alert ("You have ran out of undo!");
        effect.checked = false;
        return;
      }
      hunterCounter --;
    }
    effectList.splice(effectList.indexOf(effect.id), 1);
    toggelEffect(effect.id);
    editLimit ++;
  } else {
    if (hunter) {
      effect.checked = false;
      if (hunterCounter <= 0) {
        alert ("You have ran out of undo!");
        return;
      }
      hunterCounter --;
      alert ("You have chosen the wrong effect to remove!");
      return;
    }
    if (editLimit == 0) {
      alert("Can't add more effect");
      effect.checked = false;
      return;
    }
    effectList.push(effect.id);
    toggelEffect(effect.id);
    editLimit --;
  }
  document.getElementById("effectCount").innerHTML = "Effect Left: " + editLimit;
}

function toggelEffect(effectID) {
  if (effectID == "blurFace") {
    if (blurLayer.style.visibility == "hidden") {
      blurLayer.style.visibility = "visible";
    }  else {
      blurLayer.style.visibility = "hidden";
      if (hunter) {
        document.getElementById("blurFace").disabled = true;
      }
    }
    return;
  }
  if (effectID == "funnyFace") {
    if (funnyFaceLayer.style.visibility == "hidden") {
      funnyFaceLayer.style.visibility = "visible";
    }  else {
      funnyFaceLayer.style.visibility = "hidden";
      if (hunter) {
        document.getElementById("funnyFace").disabled = true;
      }
    }
    return;
  }
  if (effectID == "recolor") {
    if (recolorLayer.style.visibility == "hidden") {
      recolorLayer.style.visibility = "visible";
    }  else {
      recolorLayer.style.visibility = "hidden";
      if (hunter) {
        document.getElementById("recolor").disabled = true;
      }
    }
    return;
  }
  if (effectID == "fullColor") {
    if (fullColorLayer.style.visibility == "hidden") {
      fullColorLayer.style.visibility = "visible";
    }  else {
      fullColorLayer.style.visibility = "hidden";
      if (hunter) {
        document.getElementById("fullColor").disabled = true;
      }
    }
    return;
  }
  if (effectID == "scribble") {
    if (scribbleLayer.style.visibility == "hidden") {
      scribbleLayer.style.visibility = "visible";
    }  else {
      scribbleLayer.style.visibility = "hidden";
      if (hunter) {
        document.getElementById("scribble").disabled = true;
      }
    }
    return;
  }
  if (effectID == "gaussianBlur") {
    if (editCanvas.style.filter == "") {
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
    return;
  }
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
