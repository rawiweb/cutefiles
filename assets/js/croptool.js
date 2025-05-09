 const rotateButton = () =>{
   if (!document.getElementById('rotateButton')) {
    const rotateButton = document.createElement('button');
    rotateButton.innerHTML = '&orarr;';
    rotateButton.id = 'rotateButton';
    rotateButton.title = 'rotate image';
    rotateButton.addEventListener('click', () => {
       const img = document.getElementById('uimg').getAttribute('src');
       const url = `file.php?get=rotate&path=${img}`;
       document.getElementById('tooltoggle').classList.add('load');
       fetch(url).then(response => response.text())
       .then(html=>{
           document.getElementById('tooltoggle').classList.remove('load');
           document.getElementById('uimg').src = html;    
         //  container.insertAdjacentHTML('afterbegin',html);
         //  if(document.getElementById('resurl')) document.getElementById('resurl').value = document.getElementById('uimg').getAttribute('src');
            document.getElementById('deleteButton').disabled = false;
       })
    });
    document.getElementById('toolbox').appendChild(rotateButton);
   }
  }

const toolBox = (elmId) => {
  const tbhtml = '<button id="toolboxToggle"><svg fill="#000000" height="30px" width="30px" version="1.1" id="tooltoggle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54 54" xml:space="preserve"><g><path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571 c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571 		c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78 C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571 c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571 c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052 c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966 c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42 c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052 c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553  c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114 S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22 C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571 c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854 c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052 c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572  c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294 C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052 c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553  c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78 C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64 c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104 l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"></path><path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7 s7,3.141,7,7S30.859,34,27,34z"></path></g></svg>      </button>';
  const tbox = document.createElement('div');
  tbox.innerHTML = tbhtml;
  tbox.id="toolbox";
  document.getElementById(elmId).appendChild(tbox);
  
};

  const deleteButton = (container) =>{
   if (!document.getElementById('deleteButton')) {
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '&#128465;';
      deleteButton.id = 'deleteButton';
      deleteButton.title = 'detete image';
      deleteButton.disabled = true;
      deleteButton.addEventListener('click', (container) => {
      const img = document.getElementById('uimg').getAttribute('src');
      const url = `file.php?get=delimage&path=${img}`;
      document.getElementById('tooltoggle').classList.add('load');
      fetch(url).then(response => response.text())
      .then(html=>{
          document.getElementById('tooltoggle').classList.remove('load');
    //      document.getElementById('uimg').src = html;    
    //      container.insertAdjacentHTML('afterbegin',html);
    //      if(document.getElementById('resurl')) document.getElementById('resurl').value = '';
            document.getElementById('uimg').src =  document.getElementById('crop-container').dataset.pic;
      })
      });
      
      
      document.getElementById('toolbox').appendChild(deleteButton);
      
   }
  }

export class CropTool {
    constructor(containerId, toolboxId, uimgId) {
    this.container = document.getElementById(containerId);
    this.toolbox = document.getElementById(toolboxId);
    this.uimg = document.getElementById(uimgId);
    this.statsEl = null;
    this.overlay = null;
    this.handles = null;
    this.isDragging = false;
    this.isResizing = false;
    this.currentHandle = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.baseUrl = `file.php.php?get=crop&path=`;
    this.debounceTimer = null;
    this.cropfilter = 'brightness(50%)';
    this.cropfilterrev = 'brightness(100%)';
    this.init();
  }

    init() {
   // this.removeButtons(); 
    this.createButtons();
    this.createOverlay();
    this.setupEventListeners();
  }

    removeButtons() {
     //if(this.uimg) this.uimg.remove()
     if(this.toolbox) this.toolbox.remove();
     if(this.showButton) this.toolbox.remove();
     if(this.cancelButton) this.toolbox.remove();
     if(this.hideButton) this.toolbox.remove();
  }

    createOverlay() {
    if (!document.getElementById('overlay')) {
      this.overlay = document.createElement('div');
      this.overlay.id = 'overlay';
      this.overlay.style.position = 'absolute';
      this.overlay.style.zIndex = '79';
      this.overlay.style.cursor = 'move';
      this.overlay.style.boxSizing = 'border-box';
      this.overlay.style.display = 'none';
      this.overlay.style.willChange = 'transform';
      this.overlay.style.backdropFilter = 'brightness(200%)';
      const handleClasses = ['nw', 'ne', 'sw', 'se'];
      handleClasses.forEach(handleClass => {
        const handle = document.createElement('div');
        handle.classList.add('handle', handleClass);
        handle.style.position = 'absolute';
        handle.style.width = '25px';
        handle.style.height = '25px';
        
        handle.style.backdropFilter = 'invert(80%)';
       
        //handle.style.borderRadius = '10px';
        handle.style.cursor = `${handleClass}-resize`;
        if (handleClass === 'nw' || handleClass === 'ne') handle.style.top = '-5px';
        if (handleClass === 'nw' || handleClass === 'sw') handle.style.left = '-5px';
        if (handleClass === 'ne' || handleClass === 'se') handle.style.right = '-5px';
        if (handleClass === 'sw' || handleClass === 'se') handle.style.bottom = '-5px';
      this.overlay.appendChild(handle);
      });
      const handles = document.querySelectorAll('.handle');
      this.container.appendChild(this.overlay);
    }
    this.overlay = document.getElementById('overlay');
    this.handles = document.querySelectorAll('.handle');
  }

    createButtons() {
     const showButtonSVG = `<svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 956.815 956.815" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M137.621,162.622H20c-11.046,0-20,8.954-20,20v72.919c0,11.046,8.954,20,20,20h117.622L137.621,162.622L137.621,162.622z"></path> <path d="M774.193,956.815c11.046,0,20-8.954,20-20V819.193H681.274v117.621c0,11.046,8.954,20,20,20L774.193,956.815 L774.193,956.815z"></path> <path d="M794.193,656.275V182.622c0-11.046-8.954-20-20-20H300.54v112.919h380.734v380.734H794.193z"></path> <path d="M936.814,681.275H794.193H681.274H275.54V275.541V162.622V20c0-11.046-8.954-20-20-20h-72.918c-11.046,0-20,8.954-20,20 v142.622v112.919v498.653c0,11.046,8.954,20,20,20h498.653h112.918h142.622c11.045,0,20-8.954,20-20v-72.918 C956.814,690.229,947.86,681.275,936.814,681.275z"></path> </g> </g></svg>`;
     const toolboxToggleSVG = `<svg fill="#000000" height="30px" width="30px" version="1.1" id="tooltoggle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54 54" xml:space="preserve"><g><path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571 c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571 		c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78 C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571 c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571 c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052 c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966 c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42 c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052 c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553  c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114 S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22 C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571 c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854 c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052 c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572  c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294 C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052 c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553  c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78 C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64 c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104 l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"></path><path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7 s7,3.141,7,7S30.859,34,27,34z"></path></g></svg>`;
      this.statsEl = document.createElement('div');
      this.statsEl.style.position = 'relative';
      this.container.appendChild(this.statsEl);
      this.toolbox = document.createElement('div');
      this.toolbox.id = 'toolbox';
      this.toolbox.style.display = "flex";
      this.toolbox.style.flexDirection = "column";
      this.container.appendChild(this.toolbox);
      
      this.statsEl.style.top = '-20px';
      this.toolboxToggle = document.createElement('button');
      this.toolboxToggle.id = 'toolboxToggle';
      this.toolboxToggle.innerHTML = toolboxToggleSVG;
      this.toolboxToggle.title = 'crop image';
      this.toolbox.appendChild(this.toolboxToggle);
      
          this.cancelButton = document.createElement('button');
    this.cancelButton.id = 'cancelButton';
    this.cancelButton.title='cancel cropping';
    this.cancelButton.textContent = '❌'; // Cancel icon
 //   this.cancelButton.style.display = 'none'; // Initially hidden
    this.toolbox.appendChild(this.cancelButton);

      this.showButton = document.createElement('button');
      this.showButton.id = 'showButton';
      this.showButton.innerHTML = showButtonSVG;
      this.showButton.title = 'crop image';
      this.toolbox.appendChild(this.showButton);

    this.hideButton = document.createElement('button');
    this.hideButton.id = 'hideButton';
    this.hideButton.title = 'finish cropping'
    this.hideButton.textContent = '✅';
    this.toolbox.appendChild(this.hideButton);
    this.hideButton.style.display = "none";
    
           deleteButton(this.container.id);
    rotateButton();
  }
  
    setupEventListeners() {
    this.uimg.addEventListener('load',(e)=>{this.uimg.classList.remove('loader')}) 
    this.showButton.addEventListener('click', () => this.showOverlay());
    this.hideButton.addEventListener('click', () => this.hideOverlay());
    this.cancelButton.addEventListener('click', () => this.cancelCrop());
    this.overlay.addEventListener('mousedown', (e) => this.dragStart(e));
    document.addEventListener('mousemove', (e) => this.dragMove(e));
    document.addEventListener('mouseup', () => this.dragEnd());
        this.overlay.addEventListener('touchstart', (e) => this.dragStart(e));
    document.addEventListener('touchmove', (e) => this.dragMove(e));
    document.addEventListener('touchend', () => this.dragEnd());
    this.handles.forEach( handle => {
        handle.addEventListener('mousedown', (e) => this.resizeStart(e));
        handle.addEventListener('touchstart', (e) => this.resizeStart(e));
        handle.addEventListener('touchmove', (e) => this.dragMove(e));
        handle.addEventListener('touchend',  (e) => this.dragEnd(e));
    
    });
  }
  
    showOverlay() {
        this.toolboxToggle.firstChild.classList.add('load');
        const imageRect = this.uimg.getBoundingClientRect();
        this.overlay.style.width = imageRect.width - 1 + 'px';
        this.overlay.style.height = imageRect.height - 1 + 'px';
        this.overlay.style.left = imageRect.x+1+'px';
        this.overlay.style.top = imageRect.y+1+'px';
        this.overlay.style.left = '0px';
        this.overlay.style.top = '0px';
        this.overlay.style.border = '1px dashed #EFE8DE';
        this.overlay.style.backgroundImage = 'url(' + this.uimg.getAttribute('src') + ')';
        this.overlay.style.backgroundRepeat = 'no-repeat';
        this.overlay.style.backgroundSize =  this.uimg.width +'px '+this.uimg.height+'px';
        this.overlay.style.backgroundClip =  'content-box';
        this.overlay.style.backgroundPosition = '-2px -2px';
        this.uimg.style.filter = this.cropfilter; // Adjust filter as needed
        this.overlay.style.display = 'block';
        this.hideButton.style.display = 'block';
        this.cancelButton.style.display = 'block';
        if(document.getElementById('deleteButton')) document.getElementById('deleteButton').disabled = true;
        if(document.getElementById('rotateButton')) document.getElementById('rotateButton').disabled = true;
    }

    hideOverlay() {
      this.hideButton.style.display = 'none';
      
    //  this.cancelButton.style.display = 'none'; 
      if(document.getElementById('deleteButton')) document.getElementById('deleteButton').disabled = false;
      if(document.getElementById('rotateButton')) document.getElementById('rotateButton').disabled = false;
      const overlayRect = this.overlay.getBoundingClientRect();
      const imageRect = this.uimg.getBoundingClientRect();
      const scaleX = this.uimg.naturalWidth / imageRect.width;
      const scaleY = this.uimg.naturalHeight / imageRect.height;
      const top = Math.round((overlayRect.top - imageRect.top) * scaleY);
      const right = Math.round((imageRect.right - overlayRect.right) * scaleX)-1;
      const bottom = Math.round((this.uimg.naturalHeight - overlayRect.height * scaleY - top));
      const left = Math.round((overlayRect.left - imageRect.left) * scaleX)+1;
      if (this.uimg) {
        let img = this.uimg.getAttribute('src');
        const go = `${this.baseUrl}${img}&coords=${top},${right},${bottom},${left}`;
        this.overlay.style.top = '1px';
        this.overlay.style.left = '1px';
        this.overlay.style.width = imageRect.width + 'px';
        this.overlay.style.height = imageRect.height + 'px';
        this.overlay.style.display = 'none';
this.uimg.classList.add('loader');
        fetch(go)
          .then((response) => response.text())
          .then((html) => {
            //this.uimg.remove();
            //this.container.insertAdjacentHTML('afterbegin', html);
            this.uimg.src = html;
            this.resetOverlay();
            
            if(document.getElementById('resurl')) document.getElementById('resurl').value = document.getElementById('uimg').getAttribute('src');
            document.getElementById('tooltoggle').classList.remove('load');
            this.uimg.classList.remove('loader');
          //  if(window.triggerFileListReload()) window.triggerFileListReload();
          });
     }
  }

    resetOverlay() {
    this.uimg.style.filter = this.cropfilterrev;
    const imageRect = this.uimg.getBoundingClientRect();
    this.overlay.style.width = imageRect.width - 1 + 'px';
    this.overlay.style.height = imageRect.height - 1 + 'px';
    this.overlay.style.left = imageRect.x + 1 +'px';
    this.overlay.style.top = imageRect.y + 1 +'px';
    this.statsEl.textContent = "";
  }

    dragStart(e) {
    if (e.target === this.overlay) {
  
      this.isDragging = true;
      const tmpX = e.clientX ? e.clientX : e.touches[0].clientX;
      const tmpY = e.clientY ? e.clientY : e.touches[0].clientY;
      this.offsetX = tmpX - this.overlay.offsetLeft;
      this.offsetY = tmpY - this.overlay.offsetTop;
    }
  }

    dragMove(e) {
  if (this.isDragging) {
    e.preventDefault();
    let touchX, touchY;
  
    if (e.touches && e.touches.length > 0) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    } else if (e.clientX && e.clientY){
      touchX = e.clientX;
      touchY = e.clientY;
    } else{
      return;
    }
    const imageRect = this.uimg.getBoundingClientRect();
    let newLeft = parseInt(touchX - this.offsetX);
    let newTop = parseInt(touchY - this.offsetY);
    const overlayRect = this.overlay.getBoundingClientRect();
    const bgPosX = imageRect.left - overlayRect.left - 2 + 'px';
    const bgPosY = imageRect.top - overlayRect.top - 2 + 'px';
    this.debouncedUpdateBackgroundPosition(bgPosX, bgPosY);
    newLeft = newLeft >= 0 ? (newLeft + this.overlay.offsetWidth <= imageRect.width ? newLeft : imageRect.width - this.overlay.offsetWidth) : 0;
    newTop = newTop >= 0 ? (newTop + this.overlay.offsetHeight <= imageRect.height ? newTop : imageRect.height - this.overlay.offsetHeight) : 0;
newLeft=Number(newLeft);
newTop=Number(newTop);
        this.overlay.style.left = newLeft + 'px';
    this.overlay.style.top = newTop + 'px';
    this.statsEl.textContent = 'Left:'+newLeft + 'px, Top:'+newTop + 'px, Width:'+this.overlay.style.width + ', Height:'+this.overlay.style.height;
  }
  if (this.isResizing) {
    this.resizeOverlay(e);
  }
}

    dragEnd() {
      
    this.isDragging = false;
    this.isResizing = false;
    this.currentHandle = null;
  }

    resizeStart(e) {
    
         event.preventDefault();
        this.isResizing = true;
    this.currentHandle = e.target;
    this.offsetX = e.clientX ? e.clientX : e.touches[0].clientX;
    this.offsetY = e.clientY ? e.clientY : e.touches[0].clientY;
     
    e.stopPropagation();
  }

    resizeOverlay(e) {
     
        e.preventDefault(); // Prevent default touch behavior
        let touchX, touchY;

        if (e.touches && e.touches.length > 0) {
          touchX = e.touches[0].clientX;
          touchY = e.touches[0].clientY;
        } else if (e.clientX && e.clientY){
          touchX = e.clientX;
          touchY = e.clientY;
        } else {
          return;
        }

        const deltaX = touchX - this.offsetX;
        const deltaY = touchY - this.offsetY;
        const overlayRect = this.overlay.getBoundingClientRect();
        const imageRect = this.uimg.getBoundingClientRect();
        let newLeft = (overlayRect.left - imageRect.left);
        let newTop = (overlayRect.top - imageRect.top);
        let newWidth = (overlayRect.width);
        let newHeight = (overlayRect.height);

        const bgPosX = imageRect.left - overlayRect.left - 2 + 'px';
        const bgPosY = imageRect.top - overlayRect.top - 2 + 'px';
        this.debouncedUpdateBackgroundPosition(bgPosX, bgPosY);

        if (this.currentHandle.classList.contains('nw')) {
          newLeft += deltaX;
          newTop += deltaY;
          newWidth -= deltaX;
          newHeight -= deltaY;
        } else if (this.currentHandle.classList.contains('ne')) {
          newTop += deltaY;
          newWidth += deltaX;
          newHeight -= deltaY;
        } else if (this.currentHandle.classList.contains('sw')) {
          newLeft += deltaX;
          newWidth -= deltaX;
          newHeight += deltaY;
        } else if (this.currentHandle.classList.contains('se')) {
          newWidth += deltaX;
          newHeight += deltaY;
        }

        if (
          newWidth > 0 &&
          newHeight > 0 &&
          newLeft >= 0 &&
          newTop >= 0 &&
          newLeft + newWidth <= imageRect.width &&
          newTop + newHeight <= imageRect.height
        ) {
          this.overlay.style.left = newLeft + 'px';
          this.overlay.style.top = newTop + 'px';
          this.overlay.style.width = newWidth + 'px';
          this.overlay.style.height = newHeight + 'px';
          this.statsEl.textContent = 'Left:'+parseInt(newLeft) + 'px, Top:'+parseInt(newTop) + 'px, Width:'+parseInt(newWidth) + 'px, Height:'+parseInt(newHeight) + 'px';
          // Update offsets *before* the next touchmove
          this.offsetX = touchX;
          this.offsetY = touchY;
        }
      }

    cancelCrop() {
    this.overlay.remove();
    if(document.getElementById('deleteButton')) document.getElementById('deleteButton').disabled = false;
    if(document.getElementById('rotateButton')) document.getElementById('rotateButton').disabled = false;
   // this.uimg.parentElement.style.backgroundImage = 'url('+this.uimg.attributes.src.value+')';
    this.uimg.style.filter = this.cropfilterrev;
    this.uimg.src="";
    this.container.remove();
     if(window.triggerFileListReload()) window.triggerFileListReload();
  }
  
    debouncedUpdateBackgroundPosition(bgPosX, bgPosY) {
      requestAnimationFrame(() => {
        this.overlay.style.backgroundPosition = bgPosX + ' ' + bgPosY;
      });
  }
  };