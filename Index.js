//vars
var design = new Design();
var transparentValue = localStorage.getItem('transparent');
const elementsIds = ['weather', 'delete', 'one', 'transparent', 'optionsMenu', 'chatgpt', 'imgc', 'mode', 'fileInput', 'upload'];
var elements = Object.fromEntries(elementsIds.map(id => [id, document.getElementById(id)]));
//functions
function search(event, value){
 event.preventDefault();
 location.replace((localStorage.getItem('search') ?? 'https://yandex.eu/search/touch/?text=') + value);
}
function mode(){
 design.cssMode(['hm', 'searching', 'settings', 'mode', 'content', 'title', 'optionsMenu', 'chatgpt', 'upload']); 
 elements.mode.innerHTML = design.isDarkMode() ? 'Тёмная' : 'Светлая';
 design.cssMode(['searching'], design.isDarkMode() ? '#FFFFFF' : '#000000', 'transparent');
 design.cssBorder(['searching', 'settings', 'mode', 'optionsMenu', 'chatgpt', 'upload']);
 design.imageMode(['imgc'], ['chatgpt.webp']);
}
function imageLoad() {
 var imageSrc = localStorage.getItem('image'); 
 if(imageSrc != '') { 
  document.getElementById('hm').style.cssText = `
   background-image: url(${imageSrc});
   background-size: ${window.innerWidth}px ${window.innerHeight}px;
  `;
  } 
  mode(); 
}
function chatGptStatusButton(){
 elements.chatgpt.innerHTML = localStorage.getItem('chatgpt') == 'true' ? 'Включён' : 'Отключён';
}
function modeChatGpt(){
 elements.imgc.style.cssText = localStorage.getItem('chatgpt') == 'true' ? '' : `transform: scale(0)`;
}
function modeWeather(){
 var weatherId = localStorage.getItem('weatherId');
 if(!isNaN(weatherId)){
  elements.weather.src = 'https://info.weather.yandex.net/' + weatherId + '/3.png';
  elements.weather.style.display = 'block';
 }
 else{
  elements.weather.style.display = 'none';
 } 
}
function setOpacities(ids, value){ 
 ids.forEach(id => document.getElementById(id).style.opacity = value);
}
//call functions
design.createModal('modal', 'content', 'settings');
elements.transparent.value = transparentValue ? transparentValue * 10 : 10;
setOpacities(['settings', 'imgc'], transparentValue ?? 1);
elements.optionsMenu.value = localStorage.getItem('search') ?? 'https://yandex.eu/search/touch/?text=';
imageLoad();
chatGptStatusButton();
modeChatGpt();
mode();
modeWeather();
//events
elements.optionsMenu.onchange = (event) => localStorage.setItem('search', event.target.value);
window.onresize = () => imageLoad();
elements.upload.onclick = () => elements.fileInput.click();
elements.transparent.onchange = (event) => {
 var value = event.target.value / 10;
 localStorage.setItem('transparent', value);
 setOpacities(['settings', 'imgc'], value);
};
elements.chatgpt.onclick = () => {
 localStorage.setItem('chatgpt', localStorage.getItem('chatgpt') == 'true' ? 'false' : 'true');
 chatGptStatusButton();
 modeChatGpt();
}; 
elements.fileInput.onchange = () => {
  var reader = new FileReader();
  reader.onload = (event) => {  
   localStorage.setItem('image', event.target.result);  
   imageLoad();
 };
 reader.readAsDataURL(elements.fileInput.files[0]);
};
elements.delete.onclick = () => {
 localStorage.removeItem('image');
 imageLoad();
};
elements.one.onclick = () => {
  var input = prompt();
  var info = JSON.parse(localStorage.getItem('info') ?? '{}');
  var args = input.split(' ');
  var command = args[0];
  var value = args.slice(1).join(' ');
  switch(command){
  case 'image':
   if(value){
    localStorage.setItem('image', value);
    imageLoad();
   }
  break;
  case 'weather':
   if(value){
    localStorage.setItem('weatherId', value);
    modeWeather();
   }
   else{
    alert('Синтаксис: weather (id) ' + "\n" +
     'Москва - 213' + "\n" +
     'Пермь - 50' + "\n" +
     'Владикавказ - 33');
   }
  break;
  case 'list':
   alert(Object.entries(info).map(([k, v]) => `${k} - ${v}`).join('\n'));
  break;
  case 'copy':
   var text = Object.entries(info).map(([k, v]) => `${k} ${v}`).join(', ');
   alert(text);
   navigator.clipboard.writeText(text);
  break;
  case 'delete':
   value.split(', ').forEach(k => delete info[k]);
   localStorage.setItem('info', JSON.stringify(info));
  break;
  case 'clearAll':
   localStorage.removeItem('info');
  break;
  default:
   if(args.length >= 2){
    value.split(', ').forEach(pair => {
    let [key, val] = pair.split(' ');
    if(key && val) info[key] = val;
   });
   localStorage.setItem('info', JSON.stringify(info));
  }
  else if(info[command]){
   location.replace(info[command]);
  }
  }
};
