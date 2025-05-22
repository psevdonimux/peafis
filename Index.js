//vars
var design = new Design();
var transparentValue = localStorage.getItem('transparent');
const elementsIds = ['export', 'random', 'close', 'modalSettings', 'settings', 'weather', 'delete', 'one', 'transparent', 'optionsWeather', 'optionsMenu', 'chatgpt', 'imgc', 'mode', 'fileInput', 'import'];
var elements = Object.fromEntries(elementsIds.map(id => [id, document.getElementById(id)]));
//functions
function search(event, value){
 event.preventDefault();
 location.replace((localStorage.getItem('search') ?? 'https://yandex.eu/search/touch/?text=') + value);
}
function mode(){
 design.cssMode(['hm', 'searching', 'settings', 'mode', 'modalSettings', 'optionsMenu', 'optionsWeather', 'chatgpt']);
 elements.mode.textContent = design.isDarkMode() ? 'Тёмная' : 'Светлая';
 design.cssMode(['searching'], design.isDarkMode() ? '#FFFFFF' : '#000000', 'transparent');
 design.cssBorder(['searching', 'settings', 'mode', 'optionsMenu', 'chatgpt', 'optionsWeather']);
 design.imageMode(['imgc', 'import', 'export']);
}
function imageLoad(){
 var imageSrc = localStorage.getItem('image');
 if(imageSrc != ''){
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
   elements.weather.style.display = 'flex';
  }
  else{
   elements.weather.style.display = 'none';
  }
}
function setOpacities(ids, value){
 ids.forEach(id => document.getElementById(id).style.opacity = value);
}
//events
elements.optionsMenu.onchange = (event) => localStorage.setItem('search', event.target.value);
elements.optionsWeather.onchange = (event) => {
 localStorage.setItem('weatherId', event.target.value);
 modeWeather();
};
elements.settings.onclick = () => {
 elements.modalSettings.showModal();
};
elements.close.onclick = () => {
 elements.modalSettings.close();
};
window.onresize = () => imageLoad();
elements.import.onclick = () => elements.fileInput.click();
elements.export.onclick = () => {
  const imageData = localStorage.getItem('image');
  if(imageData){
   const link = document.createElement('a');
   link.href = imageData;
   link.download = 'wallpaper.png';
   link.click();
  }
};
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
elements.random.onclick = () => {
  const img = new Image();
  img.src = 'https://picsum.photos/1000?random=' + Date.now();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
   const canvas = document.createElement('canvas');
   canvas.width = img.width;
   canvas.height = img.height;
   const ctx = canvas.getContext('2d');
   ctx.drawImage(img, 0, 0);
   const dataURL = canvas.toDataURL();
   localStorage.setItem('image', dataURL);
   imageLoad();
  };
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
     alert('Синтаксис: weather (id) ' + "\n" + 'Москва - 213' + "\n" + 'Пермь - 50' + "\n" + 'Владикавказ - 33');
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
    if(value){
     if(value.includes(',')){
      let allPairs = [`${command} ${value.split(',')[0].trim()}`];
      if(value.split(',').length > 1){
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
    else if(info[command]){
     location.replace(info[command]);
    }
  }
};
//call functions
elements.transparent.value = transparentValue ? transparentValue * 10 : 10;
setOpacities(['settings', 'imgc'], transparentValue ?? 1);
elements.optionsMenu.value = localStorage.getItem('search') ?? 'https://yandex.eu/search/touch/?text=';
elements.optionsWeather.value = localStorage.getItem('weatherId') ?? '';
imageLoad();
chatGptStatusButton();
modeChatGpt();
mode();
modeWeather();

//the code is not optimized
const STORAGE_KEY = 'darkModeLabels';
let isDarkened = false, labels = [], lastTapTime = 0, longTouchTimer = null, longPressTimer = null;
let mouseX = 0, mouseY = 0;
let keysPressed = {};
const darkOverlay = document.createElement('div');
darkOverlay.id = 'dark-overlay';
darkOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 9998; display: none;';
document.body.appendChild(darkOverlay);
const saveLabels = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(labels.map(({ dataset: d }) => ({ xVw: +d.xVw, yVh: +d.yVh, text: d.text, link: d.link }))));
const createLabel = (x, y, text, link, xVw = null, yVh = null) => {
 const l = document.createElement('div');
 l.className = 'label';
 l.textContent = text;
 xVw = xVw ?? x / window.innerWidth * 100;
 yVh = yVh ?? y / window.innerHeight * 100;
 l.style.cssText = `left: ${xVw}vw; top: ${yVh}vh;`;
 Object.assign(l.dataset, { link, xVw, yVh, text });
 let touchStartTime = 0, touchTimer = null;
 const stop = e => {
  e.preventDefault();
  e.stopPropagation();
 };
 l.ontouchstart = e => {
  touchStartTime = Date.now();
  touchTimer = setTimeout(() => showActionOptions(l), 250);
  stop(e);
 };
 l.ontouchend = e => {
  clearTimeout(touchTimer);
  if(Date.now() - touchStartTime < 250) navigateToLink(l);
  stop(e);
 };
 l.ontouchmove = e => { clearTimeout(touchTimer); stop(e); };
 l.onclick = () => navigateToLink(l);
 l.oncontextmenu = (e) => {
  e.preventDefault();
  showActionOptions(l);
  return false;
 };
 document.body.appendChild(l);
 return l;
};
const navigateToLink = l => {
 const info = JSON.parse(localStorage.getItem('info') || 'null');
 location.href = info && info[l.dataset.text] ? info[l.dataset.text] : l.dataset.link;
};
const showActionOptions = l => {
 const c = document.createElement('div');
 c.className = 'delete-confirm';
 c.innerHTML = `<p>Действия с меткой:</p><p>"${l.textContent}"</p><div class="button-container"><button class="confirm-edit">Редактировать</button><button class="confirm-yes">Удалить</button><button class="confirm-no">Отмена</button></div>`;
 c.querySelector('.confirm-yes').onclick = () => {
  labels = labels.filter(item => item !== l);
  l.remove();
  saveLabels();
  c.remove();
 };
 c.querySelector('.confirm-no').onclick = () => c.remove();
 c.querySelector('.confirm-edit').onclick = () => { c.remove(); showEditForm(l); };
 document.body.appendChild(c);
};
const showEditForm = l => {
 const f = document.createElement('div');
 f.className = 'edit-form';
 f.innerHTML = `<h3>Редактирование метки</h3><div class="input-group"><label for="edit-text">Текст:</label><input type="text" id="edit-text" value="${l.dataset.text}"></div><div class="input-group"><label for="edit-link">Ссылка:</label><input type="text" id="edit-link" value="${l.dataset.link}"></div><div class="button-container"><button class="save-button">Сохранить</button><button class="cancel-button">Отмена</button></div>`;
 f.querySelector('.save-button').onclick = () => {
  const newText = f.querySelector('#edit-text').value;
  const newLink = f.querySelector('#edit-link').value;
  if(newText && newLink){
   l.textContent = l.dataset.text = newText;
   l.dataset.link = newLink;
   saveLabels();
   f.remove();
  } else alert('Текст и ссылка не могут быть пустыми!');
 };
 f.querySelector('.cancel-button').onclick = () => f.remove();
 document.body.appendChild(f);
};
const toggleDarkMode = () => {
 isDarkened = !isDarkened;
 darkOverlay.style.display = isDarkened ? 'block' : 'none';
 if(isDarkened){
  labels = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map(d =>
   createLabel(null, null, d.text, d.link, d.xVw ?? d.xPercent, d.yVh ?? d.yPercent)
  );
 }
 else{
  labels.forEach(l => l.remove());
  labels = [];
 }
};
const handleLongTouch = e => {
 if(!isDarkened || e.touches.length !== 1 || e.target.classList.contains('label') || e.target.closest('.delete-confirm, .edit-form')) return;
 const touch = e.touches[0];
 const text = prompt('Введите текст для метки:', '');
 if(!text) return;
 const info = JSON.parse(localStorage.getItem('info') || 'null');
 if(info && info[text] && confirm(`Найдена ссылка для "${text}": ${info[text]}\nИспользовать эту ссылку?`)){
  labels.push(createLabel(touch.pageX, touch.pageY, text, info[text]));
  saveLabels();
  alert('Метка создана!');
  return;
 }
 const link = prompt('Введите ссылку для этой метки:', '');
 if(link){
  labels.push(createLabel(touch.pageX, touch.pageY, text, link));
  saveLabels();
  alert('Метка создана!');
 }
};
const createLabelAtMouse = () => {
 if(!isDarkened) return;
 const text = prompt('Введите текст для метки:', '');
 if(!text) return;
 const info = JSON.parse(localStorage.getItem('info') || 'null');
 if(info && info[text] && confirm(`Найдена ссылка для "${text}": ${info[text]}\nИспользовать эту ссылку?`)){
  labels.push(createLabel(mouseX, mouseY, text, info[text]));
  saveLabels();
  alert('Метка создана!');
  return;
 }
 const link = prompt('Введите ссылку для этой метки:', '');
 if(link){
  labels.push(createLabel(mouseX, mouseY, text, link));
  saveLabels();
  alert('Метка создана!');
 }
};
document.addEventListener('mousemove', (e) => {
 mouseX = e.clientX;
 mouseY = e.clientY;
});
document.addEventListener('mousedown', (e) => {
  if(event.button === 1){
   toggleDarkMode();
  }
  if(!isDarkened || e.target.classList.contains('label') || e.target.closest('.delete-confirm, .edit-form')) return;
  longPressTimer = setTimeout(() => {
   mouseX = e.clientX;
   mouseY = e.clientY;
   createLabelAtMouse();
  }, 500);
});
document.addEventListener('mouseup', () => {
 clearTimeout(longPressTimer);
});
document.ontouchstart = e => {
 if(e.touches.length === 2 && !elements.modalSettings.open){
  toggleDarkMode();
  lastTapTime = Date.now();
 }
 if(isDarkened && e.touches.length === 1) longTouchTimer = setTimeout(() => handleLongTouch(e), 250);
};
document.ontouchend = () => clearTimeout(longTouchTimer);

