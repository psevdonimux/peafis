class SimpleApp {
  constructor() {
    this.elements = this.getElements();
    this.dataset = document.documentElement.dataset;
    this.init();
    this.bindEvents();
  }
  getElements() {
    const ids = ['export', 'random', 'close', 'modalSettings', 'settings', 
                'weather', 'delete', 'one', 'transparent', 'optionsWeather', 
                'optionsMenu', 'chatgpt', 'imgc', 'mode', 'fileInput', 'import'];
    return Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  } 
  storage(key, value = undefined) {
    if (value === undefined) {
      return localStorage.getItem(key);
    }
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }  
  storageJSON(key, value = undefined) {
    if (value === undefined) {
      return JSON.parse(this.storage(key) || '{}');
    }
    this.storage(key, JSON.stringify(value));
  }
  toggleTheme() {
    const theme = this.storage('theme') === 'light' ? 'dark' : 'light';
    this.dataset.theme = theme;
    this.storage('theme', theme);
  } 
  async loadWeatherOptions(){
   const response = await fetch('config/weather.json');
   const weatherOptions = await response.json();
   const selectElement = document.getElementById('optionsWeather');        
   weatherOptions.forEach(option => {
   const optionElement = document.createElement('option');
   optionElement.value = option.value;
   optionElement.textContent = option.text;
   selectElement.appendChild(optionElement);
   });
   selectElement.value = this.storage('weatherId') || '';    
  } 
  updateTheme() {
    if (this.storage('theme') === 'light') {
      this.dataset.theme = 'light';
    }
    this.elements.mode.textContent = 
      this.storage('theme') === 'light' ? 'Светлая' : 'Тёмная';
  }  
  loadImage() {
    const imageSrc = this.storage('image');
    if (imageSrc) {
      document.body.style.cssText = `
        background-image: url(${imageSrc});
        background-size: ${window.innerWidth}px ${window.innerHeight}px;
      `;
    }
  }  
  updateChatGPT() {
    this.elements.chatgpt.innerHTML = this.storage('chatgpt') === 'true' ? 'Включён' : 'Отключён';
    this.elements.imgc.style.cssText = this.storage('chatgpt') === 'true' ? '' : 'transform: scale(0)';
  }  
  updateWeather() {
    const weatherId = parseInt(this.storage('weatherId'), 10);
    if (!isNaN(weatherId)) {
      this.elements.weather.src = `https://info.weather.yandex.net/${weatherId}/3.png`;
      this.elements.weather.style.display = 'flex';
    } else {
      this.elements.weather.style.display = 'none';
    }
  } 
  setOpacities(ids, value) {
    ids.forEach(id => document.getElementById(id).style.opacity = value);
  }
  init() {
    const transparentValue = this.storage('transparent') || '1';
    this.elements.transparent.value = transparentValue * 10;
    this.setOpacities(['settings', 'imgc'], transparentValue);   
    this.elements.optionsMenu.value = this.storage('search') || 'https://yandex.eu/search/touch/?text=';
    this.loadWeatherOptions();
    this.loadImage();
    this.updateChatGPT();
    this.updateTheme();
    this.updateWeather();
  }
  bindEvents() {
    this.elements.optionsMenu.onchange = (e) => this.storage('search', e.target.value);  
    this.elements.optionsWeather.onchange = (e) => {
      this.storage('weatherId', e.target.value);
      this.updateWeather();
    };   
    this.elements.mode.onclick = () => {
     this.toggleTheme();
     this.updateTheme();
    };
    this.elements.settings.onclick = () => this.elements.modalSettings.showModal();    
    this.elements.close.onclick = () => this.elements.modalSettings.close();  
    window.onresize = () => this.loadImage();  
    this.elements.import.onclick = () => this.elements.fileInput.click();    
    this.elements.export.onclick = () => {
      const imageData = this.storage('image');
      if (imageData) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'wallpaper.png';
        link.click();
      }
    };  
    this.elements.transparent.onchange = (e) => {
      const value = e.target.value / 10;
      this.storage('transparent', value);
      this.setOpacities(['settings', 'imgc'], value);
    };    
    this.elements.chatgpt.onclick = () => {
      const current = this.storage('chatgpt') === 'true';
      this.storage('chatgpt', current ? 'false' : 'true');
      this.updateChatGPT();
    };    
    this.elements.fileInput.onchange = (e) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.storage('image', event.target.result);
        this.loadImage();
      };
      reader.readAsDataURL(e.target.files[0]);
    };  
    this.elements.delete.onclick = () => {
      this.storage('image', null);
      this.loadImage();
    };    
    this.elements.random.onclick = () => {
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
        this.storage('image', dataURL);
        this.loadImage();
      };
    };    
    this.elements.one.onclick = () => this.handleCommand();
  } 
  handleCommand() {
    const input = prompt();
    if (!input) return;    
    const info = this.storageJSON('info');
    const [command, ...rest] = input.split(' ');
    const value = rest.join(' ');    
    const commands = {
      list: () => {
        alert(Object.entries(info).map(([k, v]) => `${k} - ${v}`).join('\n'));
      },
      copy: () => {
        const text = Object.entries(info).map(([k, v]) => `${k} ${v}`).join(', ');
        alert(text);
        navigator.clipboard.writeText(text);
      },
      delete: () => {
        value.split(', ').forEach(k => delete info[k]);
        this.storageJSON('info', info);
      },
      clearAll: () => {
        this.storage('info', null);
      }
    };    
    if (commands[command]) {
      commands[command]();
    } else if (value) {
      if (value.includes(',')) {
        let allPairs = [`${command} ${value.split(',')[0].trim()}`];
        if (value.split(',').length > 1) {
          allPairs = allPairs.concat(value.split(',').slice(1));
        }
        allPairs.forEach(pair => {
          let [key, val] = pair.trim().split(' ');
          if (key && val) info[key] = val;
        });
      } else {
        info[command] = value;
      }
      this.storageJSON('info', info);
    } else if (info[command]) {
      location.replace(info[command]);
    }
  } 
  search(event, value) {
    event.preventDefault();
    const searchUrl = this.storage('search') || 'https://yandex.eu/search/touch/?text=';
    location.replace(searchUrl + value);
  }
}
new SimpleApp();