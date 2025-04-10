class Design {
 getColorMode(light = '#FFFFFF', dark = '#000000', reverse = false){
  if(!reverse){
   return this.isDarkMode() ? light : dark;
  }
  else{
   return this.isDarkMode() ? dark : light;
  }
 }
 getImageMain(){
  var imageMode3 = this.isDarkMode() ? 'dark' : 'light';
  return 'image/' + imageMode3 + '/';
 } 
 getRequest(url){
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.send(null);
 }
 getRqst(url){
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.onreadystatechange = function(){
   localStorage.setItem('rqst', req.responseText);
  }; 
  req.send();
  return localStorage.getItem('rqst');
 }
 isDarkMode(){
  return localStorage.getItem('mode') == 'dark';
 }
 setMode(mode){
  localStorage.setItem('mode', mode);
 }
 cssMode(ids, custom = '', custom2 = ''){
  var dark = this.isDarkMode() ? '#000000' : '#FFFFFF';
  var white = this.isDarkMode() ? '#FFFFFF' : '#000000';
   for(var i = 0; i < ids.length; i++){
  if(custom != '' && custom2 != ''){
   dark = custom2;
   white = custom;
  }  
   document.getElementById(ids[i]).style.backgroundColor = dark;
   document.getElementById(ids[i]).style.color = white;
   }
 }
 cssModePlaceholder(ids, custom = ''){
  for(var i = 0; i < ids.length; i++){
   document.getElementById(ids[i]).style.setProperty('--' + ids[i], custom != '' ? custom : this.getColorMode());  
  }
 }
 cssShadow(ids){
  var color = this.getColorMode();
   for(var i = 0; i < ids.length; i++){
    document.getElementById(ids[i]).style.textShadow = '-0.5px -0.5px 0 ' + color + ', 0.5px -0.5px 0 ' + color + ', -0.5px 0.5px 0 ' + color + ', 0.5px 0.5px 0 ' + color;
   }
 }
 cssShadowBorder(ids){
   var color = this.getColorMode();
   for(var i = 0; i < ids.length; i++){
    document.getElementById(ids[i]).style.boxShadow = '-0.5px -0.5px 0 ' + color + ', 0.5px -0.5px 0 ' + color + ', -0.5px 0.5px 0 ' + color + ', 0.5px 0.5px 0 ' + color;
   }
 }
 cssShadowNegative(ids){
  var color = this.getColorMode('#FFFFFF', '#000000', true);
  for(var i = 0; i < ids.length; i++){
   document.getElementById(ids[i]).style.textShadow = '-1px -1px 0 ' + color + ', 1px -1px 0 ' + color + ', -1px 1px 0 ' + color + ', 1px 1px 0 ' + color;
  }
 }
 cssBorder(ids){
   for(var i = 0; i < ids.length; i++){
   document.getElementById(ids[i]).style.borderColor = this.getColorMode();
   }
 }
 updateMode(){
  this.setMode(this.isDarkMode() ? 'light' : 'dark');
 }
 cssDropShadow(ids, shadow){
  var white = '#FFFFFF';
  var black = '#000000';
   for(var i = 0; i < ids.length; i++){
  if(this.isDarkMode()){
   document.getElementById(ids[i]).style.filter = 'drop-shadow(0px 0px ' + shadow + ' ' + white + ')';
  }
  /*else if(!this.isDarkMode()){
   document.getElementById(ids[i]).style.filter = 'drop-shadow(7px 7px 2.5px ' + black + ')';
  }*/
   }
 }
 imageMode(ids){
  for(var i = 0; i < ids.length; i++){
   document.getElementById(ids[i]).style.filter = this.isDarkMode() ? 'invert(0)' : 'invert(1)';
  } 
 }
 loaderImage(images){
  for(var i = 0; i < images.length; i++){
   document.getElementById("loader").src = design.getImageMain() + images[i];
  } 
 }
}