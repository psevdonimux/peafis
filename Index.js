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
  var weatherIdNumber = parseInt(weatherId, 10);
  if(!isNaN(weatherIdNumber)){
    elements.weather.src = 'https://info.weather.yandex.net/' + weatherIdNumber + '/3.png';
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
  switch(command) {
    case 'image':
      if(value) {
        localStorage.setItem('image', value);
        imageLoad();
      }
      break;
    case 'weather':
      if(value) {
        localStorage.setItem('weatherId', value);
        modeWeather();
      }
      else {
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
      if(value) {
        if(value.includes(',')) {
          let allPairs = [`${command} ${value.split(',')[0].trim()}`];          
          if(value.split(',').length > 1) {
            allPairs = allPairs.concat(value.split(',').slice(1));
          }
          allPairs.forEach(pair => {
            let [key, val] = pair.trim().split(' ');
            if(key && val) info[key] = val;
          });
        } 
        else{
          info[command] = value;
        }
        localStorage.setItem('info', JSON.stringify(info));
      }
      else if(info[command]) {
        location.replace(info[command]);
      }
  }
};

//the code is not optimized
const STORAGE_KEY = 'darkModeLabels';
let isDarkened = false, labels = [], lastTapTime = 0, longTouchTimer = null;
const darkOverlay = document.createElement('div');
darkOverlay.id = 'dark-overlay';
darkOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.7);z-index:9998;display:none;';
document.body.appendChild(darkOverlay);
const saveLabels = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(
 labels.map(({dataset}) => ({
  xVw: parseFloat(dataset.xVw),
  yVh: parseFloat(dataset.yVh),
  text: dataset.text,
  link: dataset.link
 }))
));
const createLabel = (x, y, text, link, xVw = null, yVh = null) => {
 const label = document.createElement('div');
 label.className = 'label';
 label.textContent = text;
 xVw ??= (x / window.innerWidth) * 100;
 yVh ??= (y / window.innerHeight) * 100;
 label.style.left = `${xVw}vw`;
 label.style.top = `${yVh}vh`;
 Object.assign(label.dataset, { link, xVw, yVh, text });
 let touchStartTime = 0, touchTimer = null;  
 label.ontouchstart = e => {
  touchStartTime = Date.now();
  touchTimer = setTimeout(() => showActionOptions(label), 800);
  e.preventDefault();
  e.stopPropagation();
 };  
 label.ontouchend = e => {
  clearTimeout(touchTimer);
  if(Date.now() - touchStartTime < 800) navigateToLink(label);
  e.preventDefault();
  e.stopPropagation();
 };
 label.ontouchmove = e => {
  clearTimeout(touchTimer);
  e.preventDefault();
  e.stopPropagation();
 }; 
 document.body.appendChild(label);
 return label;
};
const navigateToLink = label => {
 const infoStorage = localStorage.getItem('info');
 let url = label.dataset.link;
 if(infoStorage) {
  const infoData = JSON.parse(infoStorage);
  if(infoData[label.dataset.text]) url = infoData[label.dataset.text];
 }
 window.location.href = url;
};
const showActionOptions = label => {
 const confirmation = document.createElement('div');
 confirmation.className = 'delete-confirm';
 confirmation.innerHTML = `
  <p>Действия с меткой:</p>
  <p>"${label.textContent}"</p>
  <div class="button-container">
   <button class="confirm-edit">Редактировать</button>
   <button class="confirm-yes">Удалить</button>
   <button class="confirm-no">Отмена</button>
  </div>`;
 confirmation.querySelector('.confirm-yes').onclick = () => {
  labels = labels.filter(item => item !== label);
  label.remove();
  saveLabels();
  confirmation.remove();
 };
 confirmation.querySelector('.confirm-no').onclick = () => confirmation.remove();
 confirmation.querySelector('.confirm-edit').onclick = () => {
  confirmation.remove();
  showEditForm(label);
 };   
 document.body.appendChild(confirmation);
};
const showEditForm = label => {
 const editForm = document.createElement('div');
 editForm.className = 'edit-form';
 editForm.innerHTML = `
  <h3>Редактирование метки</h3>
  <div class="input-group">
   <label for="edit-text">Текст:</label>
   <input type="text" id="edit-text" value="${label.dataset.text}">
  </div>
  <div class="input-group">
   <label for="edit-link">Ссылка:</label>
   <input type="text" id="edit-link" value="${label.dataset.link}">
  </div>
  <div class="button-container">
   <button class="save-button">Сохранить</button>
   <button class="cancel-button">Отмена</button>
  </div>`;
 editForm.querySelector('.save-button').onclick = () => {
  const newText = editForm.querySelector('#edit-text').value;
  const newLink = editForm.querySelector('#edit-link').value;
  if(newText && newLink) {
   label.textContent = newText;
   label.dataset.text = newText;
   label.dataset.link = newLink;
   saveLabels();
   editForm.remove();
  } else alert('Текст и ссылка не могут быть пустыми!');
 };
 editForm.querySelector('.cancel-button').onclick = () => editForm.remove();
 document.body.appendChild(editForm);
};
const toggleDarkMode = () => {
 isDarkened = !isDarkened;
 darkOverlay.style.display = isDarkened ? 'block' : 'none';  
 if(isDarkened) {
  const savedLabels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  labels = savedLabels.map(data => {
   const xVw = data.xVw ?? data.xPercent;
   const yVh = data.yVh ?? data.yPercent;
   return createLabel(null, null, data.text, data.link, xVw, yVh);
  });
 } 
 else{
  labels.forEach(label => label.remove());
  labels = [];
 }
};
const handleLongTouch = event => {
 if(!isDarkened || event.touches.length !== 1 || event.target.classList.contains('label') || event.target.closest('.delete-confirm') || event.target.closest('.edit-form')) return;       
 const touch = event.touches[0];
 const text = prompt('Введите текст для метки:', '');
 if(!text) return;  
 const infoStorage = localStorage.getItem('info');
 let link = '';    
 if(infoStorage) {
  const infoData = JSON.parse(infoStorage);
  if(infoData[text] && confirm(`Найдена ссылка для "${text}": ${infoData[text]}\nИспользовать эту ссылку?`)) {
   labels.push(createLabel(touch.pageX, touch.pageY, text, infoData[text]));
   saveLabels();
   alert('Метка создана!');
   return;
  }
 } 
 link = prompt('Введите ссылку для этой метки:', '');
 if(link) {
  labels.push(createLabel(touch.pageX, touch.pageY, text, link));
  saveLabels();
  alert('Метка создана!');
 }
};
document.ontouchstart = event => {
 if(event.touches.length === 2) {
  const currentTime = Date.now();
  if(currentTime - lastTapTime < 500) toggleDarkMode();
  lastTapTime = currentTime;
 }
 if(isDarkened && event.touches.length === 1) {
  longTouchTimer = setTimeout(() => handleLongTouch(event), 500);
 }
};
document.ontouchend = () => clearTimeout(longTouchTimer);
