var design = new Design();
design.createModal('modal', 'content', 'settings');
var transparent = document.getElementById('transparent');
var transparentValue = localStorage.getItem('transparent');
var optionsMenu = document.getElementById('optionsMenu');
var content = document.getElementById('content').style;
var chatgpt = document.getElementById('chatgpt');
var imgc = document.getElementById('imgc');
var close = document.getElementById('close');
var settings = document.getElementById('settings');
var elMode = document.getElementById('mode');
var chatgpt = document.getElementById('chatgpt');
var fileInput = document.getElementById('fileInput');
var upload = document.getElementById('upload');
function getOrientation(v, h){
 return window.innerWidth < window.innerHeight ? v : h;
} 
function setColumn(id){
  document.getElementById(id).style.cssText = `
    position: absolute;
    display: grid;
    grid-template-columns: auto auto; 
    align-items: center; 
 `;
}
function getWidth(divider, divider2){
 return getOrientation((window.innerWidth / divider) + 'px', (window.innerWidth / divider2) + 'px');
}
function getHeight(divider, divider2){
 return getOrientation((window.innerHeight / divider) + 'px', (window.innerHeight / divider2) + 'px');
}
function setWH(id, width, height){
 var element = document.getElementById(id).style;
 element.width = width;
 element.height = height;
}
function setPosition(id, topH, rightH, topV, rightV){
 var element = document.getElementById(id).style;
 element.position = 'absolute';
 element.top = getHeight(topV, topH);
 element.right = getWidth(rightV, rightH);
}
function setCss(id, cssOne, cssTwo){
 document.getElementById(id).style.cssText = getOrientation(cssOne, cssTwo);
}
function search(event, value){
 event.preventDefault();
 location.replace((localStorage.getItem('search') ?? 'https://yandex.eu/search/touch/?text=') + value);
}
function mode(){
 design.cssMode(['hm', 'searching', 'settings', 'mode', 'content', 'title', 'optionsMenu', 'chatgpt', 'upload']); 
 elMode.innerHTML = design.isDarkMode() ? 'Тёмная' : 'Светлая';
 design.cssMode(['searching'], design.isDarkMode() ? '#FFFFFF' : '#000000', 'transparent');
 design.cssBorder(['searching', 'settings', 'mode', 'optionsMenu', 'chatgpt', 'upload']);
 design.imageMode(['imgc'], ['chatgpt.webp']);
}
function imageLoad(){
var imageSrc = localStorage.getItem('image');
var image = document.getElementById('hm').style;
 if(imageSrc != ''){
 image.backgroundImage = 'url(' + imageSrc + ')';
 image.backgroundSize = window.innerWidth + 'px ' + window.innerHeight + 'px';
}
}
function chatGptStatusButton(){
 chatgpt.innerHTML = localStorage.getItem('chatgpt') == 'true' ? 'Включён' : 'Отключён';
}
function modeChatGpt(){
 if(localStorage.getItem('chatgpt') == 'true'){
  setWH('imgc',  getWidth(4.5, 9), getHeight(10, 4));  
 }
 else{
  setWH('imgc', '0%', '0%'); 
 }
}
function setOpacity(id, value){
 document.getElementById(id).style.opacity = value;
}
function activate(){
 transparent.style.transform = getOrientation('scale(2)', 'scale(1)');
 transparent.style.width = getWidth(6, 7);
 content.marginTop = getHeight(3, 5);
 setWH('content', getWidth(1.5, 3.4), getHeight(3.1, 1.7));
 elMode.style.marginLeft = getWidth(80, 200); 
 setWH('mode',  getWidth(8, 17), getHeight(40, 25));  
 setColumn('column');
 setPosition('column', 2.33, 2.11, 2.28, 2.24);
 setWH('optionsMenu',  getWidth(8, 17), getHeight(40, 25));  
 optionsMenu.style.marginLeft = getOrientation('95%', '81.5%');
 optionsMenu.style.marginBottom = '25%';
 setColumn('column2');
 setPosition('column2', 1.87, 2.06, 2.01, 2.09);
 chatgpt.style.marginLeft = getOrientation('77%', '69.5%');
 chatgpt.style.marginBottom = getOrientation('23.5%', '1.5%');
 setWH('chatgpt',  getWidth(8, 17), getHeight(40, 25));  
 setColumn('column3');
 setPosition('column3', 1.56, 2.02, 1.79, 2.05);
 setWH('upload',  getWidth(8, 17), getHeight(40, 25));  
 setColumn('column4');
 setPosition('column4', 1.35, 2, 1.64, 2.00);
 upload.style.marginLeft = getOrientation('50%', '44%');
 upload.style.marginBottom = getOrientation('23.5%', '1.5%');
 close.style.fontSize = getOrientation('400%', '200%');
}
chatgpt.onclick = function(){
 localStorage.setItem('chatgpt', localStorage.getItem('chatgpt') == 'true' ? 'false' : 'true');
 chatGptStatusButton();
 modeChatGpt();
}; 
optionsMenu.onchange = function(event){
 localStorage.setItem('search', event.target.value);
};
imgc.onclick = function(){
 location.replace('https://dev.yqcloud.top/#/chat/9999999999999');
};
window.onresize = function(){
 imageLoad();
 modeChatGpt();
 activate();
}; 
transparent.onchange = function(event){
 var value = event.target.value / 10;
 localStorage.setItem('transparent', value);
 setOpacity('settings', value);
 setOpacity('imgc', value);
};
upload.onclick = function(){
 fileInput.click();
};
fileInput.onchange = function(){
  var reader = new FileReader();
  reader.onload = function(event) {  
   localStorage.setItem('image', event.target.result);  
   imageLoad();
 };
 reader.readAsDataURL(fileInput.files[0]);
};
transparent.value = transparentValue ? transparentValue * 10 : 10;
setOpacity('settings', transparentValue ?? 1);
setOpacity('imgc', transparentValue ?? 1);
optionsMenu.value = localStorage.getItem('search') ?? 'https://yandex.eu/search/touch/?text=';
imageLoad();
chatGptStatusButton();
modeChatGpt();
activate();
mode();
function clickOn(){
var prompts = prompt();
var split = prompts.split(' ');
let pairs = prompts.split(', ');
var pairs2 = prompts.replace('delete ', '').split(', ');
var info = JSON.parse(localStorage.getItem('info') ?? JSON.stringify({}));
var ls = info[split[0]];
if(split[0] == 'image' && split[1] != null){
 localStorage.setItem(split[0], split[1]);
 imageLoad();
}
else if(split[0] == 'list'){
var arr = [];
var i = 0;
for(let key in info){
 arr[i] = key + ' - ' + info[key];
 i++;
}
 alert(arr.join('\n'));
}
else if(split[0] == 'copy'){
var arr = [];
var i = 0;
for(let key in info){
 arr[i] = key + ' ' + info[key];
 i++;
}
 alert(arr.join(', '));
 navigator.clipboard.writeText(arr.join(', ')); 
}
else if(split[0] == 'delete' && split.length >= 2){
 if(pairs2.length > 0){
pairs2.forEach(pair2 => {
  if (info[pair2] != null) {
    delete info[pair2];
  }
});
}
else if(info[split[1]] != null) {
 delete info[split[1]];
 }
 localStorage.setItem('info', JSON.stringify(info));
}
else if(split[0] == 'clearAll'){
 localStorage.removeItem('info');
}
else if(split.length >= 2){ 
 if(pairs.length > 1){
pairs.forEach(pair => {
  let splits = pair.split(' ');
  if (splits.length == 2) {
    info[splits[0]] = splits[1];
  }
});
}
else{
 info[split[0]] = split[1];
 }
 localStorage.setItem('info', JSON.stringify(info));
}
else if(ls != null){
 location.replace(ls);
}
}
