export class SlideshowOverlay {
  constructor(imagePaths,index=0) {
    this.imagePaths = imagePaths;
    this.currentIndex = parseInt(index);
    this.overlay = null;
    this.container = null;
    this.image = null;
    this.rotation = 0;
    this.zoom = 100;
    this.prevButton = null;
    this.nextButton = null;
    this.closeButton = null;
    this.keyButton = null;
    this.rotateButton = null;
    this.indicator = null;
  }

  createOverlay() {
    if(document.querySelector(".filemanager")) document.querySelector(".filemanager").classList.add('no-drag');
    this.overlay = document.createElement('div');
    this.overlay.classList.add('slideshow-overlay');
    this.overlay.id = 'slideshow-overlay';
    this.container = document.createElement('div');
    this.container.classList.add('slideshow-container');
    this.container.dataset.pic = this.imagePaths[this.index];
    this.image = document.createElement('img');
    this.image.classList.add('slideshow-image');
    this.container.appendChild(this.image);
    this.prevButton = document.createElement('button');
    this.prevButton.textContent = 'Previous';
    this.prevButton.classList.add('slideshow-button', 'prev');
    this.prevButton.addEventListener('click', () => this.showPrevious());
    this.nextButton = document.createElement('button');
    this.nextButton.textContent = 'Next';
    this.nextButton.classList.add('slideshow-button', 'next');
    this.nextButton.addEventListener('click', () => this.showNext());
    this.closeButton = document.createElement('button');
    this.closeButton.textContent = 'Close';
    this.closeButton.classList.add('slideshow-button', 'close');
    this.closeButton.addEventListener('click', () => this.closeOverlay());
    this.rotateButton = document.createElement('button');
    this.rotateButton.innerHTML = '&orarr;';
    this.rotateButton.classList.add('slideshow-button', 'rotate');
    this.rotateButton.addEventListener('click', () => {
        this.rotation +=90;
        this.rotation = this.rotation == 360 ? 0 : this.rotation;
        this.image.style.transform = 'scale('+ this.zoom +'%) rotate('+this.rotation+'deg)'}
            );
    this.indicator = document.createElement('div');
    this.indicator.classList.add('slideshow-indicator');
    this.overlay.appendChild(this.indicator);
    this.overlay.appendChild(this.container);
    this.overlay.appendChild(this.prevButton);
    this.overlay.appendChild(this.nextButton);
    this.overlay.appendChild(this.closeButton);
     this.overlay.appendChild(this.rotateButton);
    document.body.appendChild(this.overlay);
       this.updateIndicator();
    
    this.keyButton = document.createElement('button');
    this.keyButton.id = "keyButton";
    this.keyButton.style.position = "absolute";
    this.keyButton.style.top = "-150px";
    this.keyButton.addEventListener('keydown',(key) =>{
        this.prevButton.textContent = key.code;
        if(key.code === "ArrowRight") {this.showNext();return}
        if(key.code === "ArrowLeft") {this.showPrevious();return}
        if(key.code === "Enter"){key.preventDefault();return}
        if(key.code === "Escape" || key.code === "KeyC"){this.closeOverlay();return}
        if(key.code === "KeyR"){this.rotateButton.click();return}
        if(key.code === "KeyZ" || key.code === "KeyY" || key.code === "ArrowUp"){
          key.preventDefault();
           this.zoom +=5;
           this.image.style.transform = 'scale('+ this.zoom +'%) rotate('+this.rotation+'deg)';
           return;
       }
        if(key.code === "KeyO" || key.code === "KeyX" || key.code === "ArrowDown"){
          key.preventDefault();
           this.zoom -=5;
           this.image.style.transform = 'scale('+ this.zoom +'%) rotate('+this.rotation+'deg)';
           return;
       }
    });
    this.overlay.appendChild(this.keyButton);
    this.showBackgroundImage(this.currentIndex);
    this.image.addEventListener('load',(e)=>{this.image.classList.remove('loader')}) 
 }

  updateIndicator() {
    const imageName = this.imagePaths[this.currentIndex].split('/').pop();
    this.indicator.textContent = `${this.currentIndex + 1} of ${this.imagePaths.length} ${imageName}`;
  }

  showBackgroundImage(index) {
    if (index >= 0 && index < this.imagePaths.length) {
      this.image.classList.add("loader");
      this.currentIndex = index;
      this.image.src = "";
      const baseurl = "slideshowimage.php?path="+this.imagePaths[index]+"&h=";
      const dimensions = this.container.getBoundingClientRect();
      this.image.src = baseurl+dimensions.height+'&w='+dimensions.width;
      //this.container.style.backgroundImage = `url('${this.imagePaths[this.currentIndex]}')`;
      this.keyButton.focus();
      this.rotation = 0;
      this.zoom = 100;
        this.image.style.transform = 'scale(100%) rotate(0deg)';
      this.container.dataset.pic = this.imagePaths[this.currentIndex];
      this.updateIndicator();
     
    }else{
       this.closeOverlay(); 
    }
  }

  showNext() {
    this.showBackgroundImage(this.currentIndex + 1);
  }

  showPrevious() {
    this.showBackgroundImage(this.currentIndex - 1);
  }

  closeOverlay() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
      this.container = null;
      this.prevButton = null;
      this.nextButton = null;
      this.closeButton = null;
      this.indicator = null;
      this.currentIndex = 0;
      if(document.querySelector(".filemanager")) document.querySelector(".filemanager").classList.remove('no-drag');
    }
  }

  triggerSlideshow() {
    if (!this.overlay && this.imagePaths.length !==0) {
      this.createOverlay();
    }
  }
}