/* Front */

let scannerOptions = {
	video: document.getElementById('preview'),
	captureImage: true,
	backgroundScan: false
};

let scanner = new Instascan.Scanner(scannerOptions);

scanner.addListener('scan', handleScan);

function handleScan(content, image){
  console.log(content);
  document.getElementById("resultats").innerHTML += '<li>'+ content +'</li>';

  $.post("/TTS", {content}, function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
  });
}

Instascan.Camera.getCameras()
  .then(function (cameras) {
    /* Liste des caméras */
    cameras.map( (cam) => {
      document.getElementById("cameras").innerHTML += '<li>'+ cam.name +'</li>';
    });
    /* Utiliser une camera */
    if (cameras.length > 0) 
      scanner.start(cameras[0]);
    else 
      console.error('No cameras found.');
  })
  .catch( (e) => console.error(e) );

