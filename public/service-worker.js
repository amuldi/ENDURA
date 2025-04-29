self.addEventListener("install", function (e) {
    console.log("Service Worker 설치됨");
  });
  
  self.addEventListener("fetch", function (event) {
    // 네트워크 요청 가로채기
  });
  