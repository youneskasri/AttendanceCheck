// const DATE_FORMAT = 'DD/MM/YYYY à HH:mm';

let scannerOptions = {
	video: document.getElementById('preview'),
	captureImage: false,
	backgroundScan: false,
  refractoryPeriod: 200
};

let scanner = new Instascan.Scanner(scannerOptions);

scanner.addListener('scan', handleScan);

Instascan.Camera.getCameras()
.then(function (cameras) {
  /* Liste des caméras */
  cameras.map( (cam) => {
    let camName = cam && cam.name ? cam.name : 'Activate the Web Cam in your Browser then <a href="/"> Refresh the page </a>';
    document.getElementById("cameras").innerHTML += '<li>'+ camName +'</li>';
  });
  /* Utiliser une camera */
  if (cameras.length > 1) 
    scanner.start(cameras[1]);
  else if (cameras.length > 0) 
    scanner.start(cameras[0]);
  else {
    alertError('NO_CAMERA_FOUND');
  }
})
.catch(err => showErrorModal(err.message));

