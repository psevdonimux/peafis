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
    const darkOverlay = document.createElement('div');
    darkOverlay.id = 'dark-overlay';
    darkOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: none;
   `;
    document.body.appendChild(darkOverlay);    
    let lastTapTime = 0;
    let isDarkened = false;
    let labels = [];
    let longTouchTimer = null;
    function saveLabels() {
        const labelsData = labels.map(label => ({
            xVw: parseFloat(label.dataset.xVw),
            yVh: parseFloat(label.dataset.yVh),
            text: label.dataset.text,
            link: label.dataset.link
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(labelsData));
    }  
    function loadLabels() {     
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];        
    }   
    function toggleDarkMode() {
        isDarkened = !isDarkened;
        darkOverlay.style.display = isDarkened ? 'block' : 'none';       
        if (isDarkened) {
            loadSavedLabels();
        } else {
            labels.forEach(label => label.remove());
            labels = [];
        }
    }   
    function loadSavedLabels() {
        labels.forEach(label => label.remove());
        labels = [];       
        loadLabels().forEach(data => {
            const xVw = data.xVw !== undefined ? data.xVw : data.xPercent;
            const yVh = data.yVh !== undefined ? data.yVh : data.yPercent;
            createLabel(null, null, data.text, data.link, xVw, yVh);
        });
    }   
    function createLabel(x, y, text, link, xVw = null, yVh = null) {
        if (xVw === null && x !== null) {
            xVw = (x / window.innerWidth) * 100;
        }     
        if (yVh === null && y !== null) {
            yVh = (y / window.innerHeight) * 100;
        }       
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = text;
        label.style.left = `${xVw}vw`;
        label.style.top = `${yVh}vh`;      
        label.dataset.link = link;
        label.dataset.xVw = xVw;
        label.dataset.yVh = yVh;
        label.dataset.text = text;     
        let touchStartTime = 0;
        let touchTimer = null;       
        label.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchTimer = setTimeout(() => showDeleteConfirmation(label), 800);
            e.preventDefault();
            e.stopPropagation();
        });     
        label.addEventListener('touchend', (e) => {
            clearTimeout(touchTimer);
            if (Date.now() - touchStartTime < 800) {
                const infoStorage = localStorage.getItem('info');
                if (infoStorage) {
                    const infoData = JSON.parse(infoStorage);
                    if (infoData[label.dataset.text]) {
                        window.location.href = infoData[label.dataset.text];
                    } else {
                        window.location.href = label.dataset.link;
                    }
                } else {
                    window.location.href = label.dataset.link;
                }
            }
            e.preventDefault();
            e.stopPropagation();
        });        
        label.addEventListener('touchmove', (e) => {
            clearTimeout(touchTimer);
            e.preventDefault();
            e.stopPropagation();
        });     
        document.body.appendChild(label);
        labels.push(label);
        return label;
    }    
    function showDeleteConfirmation(label) {
        const confirmation = document.createElement('div');
        confirmation.className = 'delete-confirm';
        confirmation.innerHTML = `
            <p>Действия с меткой:</p>
            <p>"${label.textContent}"</p>
            <div class="button-container">
                <button class="confirm-edit">Редактировать</button>
                <button class="confirm-yes">Удалить</button>
                <button class="confirm-no">Отмена</button>
            </div>
        `;       
        confirmation.querySelector('.confirm-yes').addEventListener('click', () => {
            const labelIndex = labels.indexOf(label);
            if (labelIndex !== -1) {
                labels.splice(labelIndex, 1);
            }
            label.remove();
            saveLabels();
            confirmation.remove();
        });        
        confirmation.querySelector('.confirm-no').addEventListener('click', () => {
            confirmation.remove();
        });       
        confirmation.querySelector('.confirm-edit').addEventListener('click', () => {
            confirmation.remove();
            showEditForm(label);
        });        
        document.body.appendChild(confirmation);
    }   
    function showEditForm(label) {
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
            </div>
        `;        
        editForm.querySelector('.save-button').addEventListener('click', () => {
            const newText = editForm.querySelector('#edit-text').value;
            const newLink = editForm.querySelector('#edit-link').value;            
            if (newText && newLink) {
                label.textContent = newText;
                label.dataset.text = newText;
                label.dataset.link = newLink;
                saveLabels();
                editForm.remove();
            } else {
                alert('Текст и ссылка не могут быть пустыми!');
            }
        });      
        editForm.querySelector('.cancel-button').addEventListener('click', () => {
            editForm.remove();
        });      
        document.body.appendChild(editForm);
    }  
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length === 2) {
            const currentTime = new Date().getTime();
            if (currentTime - lastTapTime < 500) {
                toggleDarkMode();
            }
            lastTapTime = currentTime;
        }       
        if (isDarkened && event.touches.length === 1) {
            if (event.target.classList.contains('label') || event.target.closest('.delete-confirm') || event.target.closest('.edit-form')) {
                return;
            }      
            longTouchTimer = setTimeout(() => {
                const touch = event.touches[0];
                const text = prompt('Введите текст для метки:', '');
                if (text) {
                    let link = '';
                    const infoStorage = localStorage.getItem('info');
                    if (infoStorage) {
                        const infoData = JSON.parse(infoStorage);
                        if (infoData[text]) {
                            link = infoData[text];
                            if (confirm(`Найдена ссылка для "${text}": ${link}\nИспользовать эту ссылку?`)) {
                                createLabel(touch.pageX, touch.pageY, text, link);
                                saveLabels();
                                alert('Метка создана!');
                                return;
                            }
                        }
                    }                    
                    link = prompt('Введите ссылку для этой метки:', '');
                    if (link) {
                        createLabel(touch.pageX, touch.pageY, text, link);
                        saveLabels();
                        alert('Метка создана!');
                    }
                }
            }, 500);
        }
    });    
    document.addEventListener('touchend', function() {
        clearTimeout(longTouchTimer);
        longTouchTimer = null;
    });

