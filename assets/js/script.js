document.addEventListener('DOMContentLoaded', function() {
  const createButton = document.getElementById('create');
  const slideShowButton = document.getElementById('slideShow');
  const fileManagerRoot = '/files';
  let currentPath = fileManagerRoot;
  let response = null; // To hold the fetched data for the current path
  const uPath = document.getElementById('uPath');
  const uForm = document.getElementById('upload');
  const filemanager = document.querySelector('.filemanager');
  const breadcrumbs = document.querySelector('.breadcrumbs');
  const statsEl = document.querySelector('.stats');
  const dataList = filemanager.querySelector('.dataContainer');
  window.addEventListener('hashchange', () => goto(window.location.hash));
  const reloadFileListEvent = new CustomEvent('reloadFileList');
  const search = document.querySelector('.search');
  const searchbox = document.querySelector('input[type="search"]');
  search.addEventListener('click',(e) =>{  searchbox.style.display = 'block';  searchbox.focus();});
searchbox.addEventListener('keyup',(e) =>{
    if(e.code === 'Enter'  || e.code === 'NumpadEnter'){
       filemanager.classList.add("searching");
       fetch('scan.php?get=search&search='+searchbox.value+'&path='+ encodeURI(fileManagerRoot))
         .then(r => r.json())
    .then(data => {
      response = [data];
      breadcrumbsUrls = generateBreadcrumbs(data.name);
      render(data.items || []);
      filemanager.classList.remove("searching");
      searchbox.style.display = 'none';
      searchbox.value = "";
    })
    .catch(console.error);
    }
});

if (createButton) {
    createButton.addEventListener('click', function() {
      if (uPath) {
        createButton.setAttribute('href', '#' + uPath.value);
        const fname = prompt("Foldername", "");
        if (fname !== null && fname.trim() !== "") {
          const url = `file.php?get=create&path=${uPath.value}/${encodeURIComponent(fname)}`;
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text();
            })
            .then(dat => {
              if (Number(dat) === 1) {
                fileScanner(uPath.value + '/' + fname); // Assuming fileScanner is defined elsewhere
              }
            })
            .catch(error => {
              statsEl.textContent = `Error creating folder:', error`;
            });
        }
      } 
    });
  }

if(slideShowButton){    
    slideShowButton.addEventListener('click', (e) => {
  e.preventDefault();
  imageFiles = dataList.querySelectorAll('.file-list a');
  let iData = [];
  let index=0,c = 0;
  imageFiles.forEach(image =>{
    if(image.firstChild.tagName === 'IMG')
     iData.push(image.parentNode.dataset.itemPath);
    if( e.explicitOriginalTarget.tagName !== "svg" && e.rangeParent.attributes.href &&  e.rangeParent.attributes.href.value == image.parentNode.dataset.itemPath) {
                index = c;
    }
        c++;
  });
   const slideshow = new SlideshowOverlay(iData,index);
  slideshow.triggerSlideshow();
});
}

const goto = (hash) => {
    const decodedHash = decodeURIComponent(hash).slice(1);
    const requestedPath = decodedHash.trim().length ? decodedHash : fileManagerRoot;
    if (requestedPath !== currentPath) {
      fileScanner(requestedPath);
      if (uPath) uPath.value = requestedPath;
      if (uForm) uForm.action = 'file.php?path=' + requestedPath;
    } else if (!response) {
      fileScanner(currentPath);
    }
  }

const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

const escapeHTML = (text) => {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

const addClickAbles = (elm, path) => {
  const delme = document.createElement('span');
  const renam= document.createElement('span');
  const edits= document.createElement('span');
  let uripath = encodeURIComponent(path);
  let conftext = "";
  delme.title = 'delete';
  renam.title = 'rename';

  delme.innerHTML = 'X';
  renam.innerHTML = 'R';
  
  delme.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.dataset.count && e.target.dataset.count !== 'Empty'){
            conftext =  'and all '+e.target.dataset.count;
    }
    if (confirm(`Do you want to delete ${path} ${conftext} ?`)) {
      fetch(`file.php?get=delete&path=${uripath}`)
        .then(r => r.text())
        .then(res => {
          if (Number(res) === 1) {
            fileScanner(currentPath);
          } else {
            alert(`failed to remove ${path}`);
          }
        })
        .catch(console.error);
    }
  });
  
  renam.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const fname = prompt("New name", "");
    if (fname !== null && fname.trim() !== "")
      fetch(`file.php?get=rename&newname=${decodeURIComponent(fname)}&path=${uripath}`)
        .then(r => r.text())
        .then(res => {
          msg = res;
          if (Number(res) === 1) {
            fileScanner(currentPath);
          } else {
            alert(`failed to rename ${path} ${msg}`);
          }
        })
        .catch(console.error);
    
  });
  
  elm.querySelector(".tool").appendChild(delme);
  elm.querySelector(".tool").appendChild(renam);
  if(elm.classList.contains('folders')){
      delme.classList.add('wa');
      delme.dataset.count = elm.querySelector('a').title;
  }else {
    if(elm.getElementsByTagName('img').length){
    edits.title = 'edit';edits.innerHTML = 'E';
    edits.addEventListener('click' , e =>{e.preventDefault();
    e.stopPropagation();
    elm.classList.add('selected');
    document.querySelector(".filemanager").classList.add('no-drag');
    const container = document.createElement('div');
    const uimg = document.createElement('img');
    uimg.id = 'uimg';
    uimg.src = `${path}`;
    container.id = 'crop-container';
    container.dataset.pic = `${path}`;
    dataList.insertBefore(container,document.querySelector(".folder-list"));
    container.appendChild(uimg);
    uimg.classList.add('loader');
    const myCropTool = new CropTool('crop-container','toolbox','uimg');
    deleteButton('crop-container');
    rotateButton();
    container.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  })
  elm.querySelector(".tool").appendChild(edits);  
    
  }}

  
  elm.setAttribute('draggable', 'true');
}

const render = (data) => {
    dataList.innerHTML = ''; // Clear file list only once
    breadcrumbs.innerHTML = ''; // Clear breadcrumbs only once
    const scannedFolders = [];
    const scannedFiles = [];
    data.forEach(item => {
      if (item.type === 'folder') scannedFolders.push(item);
      else if (item.type === 'file') scannedFiles.push(item);
    });
    statsEl.innerHTML = `<span>${scannedFolders.length} folders | ${scannedFiles.length} Files</span>`;
    //dataList.style.display = scannedFolders.length || scannedFiles.length ? 'inline-block' : 'none';
const folderList = document.createElement('ul');
    folderList.className=scannedFolders.length ===0 ? "folder-list slayer" :"folder-list";
    const fileList = document.createElement('div');
    fileList.className="file-list";
    scannedFolders.forEach(f => {
    const itemsLength = f.items?.length || 0;
    const name = escapeHTML(f.name);
    const iconClass = itemsLength ? 'folder full' : 'folder';
    const itemText = itemsLength === 1 ? '1 item' : itemsLength > 1 ? `${itemsLength} items` : 'Empty';
    const folder = document.createElement('li');
    folder.className = 'folders';
    folder.classList.add('drop-target');
    let pat = `${fileManagerRoot}${f.path.startsWith(fileManagerRoot) ? f.path.substring(fileManagerRoot.length) : f.path}`;
    folder.dataset.targetPath = pat;
    folder.dataset.itemPath = pat;
    folder.innerHTML = `<div class="tool"></div><a title="${itemText}" href="${pat}">
                          <span class="icon ${iconClass}"></span>
                        </a><span class="name" title="${itemText}"> ${name} </span>`;
    folderList.appendChild(folder);
    addClickAbles(folder, f.path);
});
    scannedFiles.forEach(f => {
      const parts = f.name.split('.');
      const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';
      const fileSize = bytesToSize(f.size);
      const name = escapeHTML(f.name);
      let iconClass = "";

if (['jpg', 'jpeg', 'gif', 'png', 'webp', 'avif'].includes(ext)) {
  iconClass = `<img class="loader" src="image.php?path=${encodeURIComponent(f.path)}">`;
} else if (['webm', 'mp4', 'ogv'].includes(ext)) {
  iconClass = `<video controls> <source src="${f.path}" type="video/${ext}"></video>`;
} else if (['wav', 'mp3', 'ogg'].includes(ext)) {
  iconClass = `<audio controls> <source src="${f.path}" type="audio/${ext}"></audio>`;
}else {
  iconClass = `<span class="icon file f-${ext}">.${ext}</span>`;
}
      const file = document.createElement('div');
      file.className = 'files';
      file.dataset.itemPath = f.path;
            file.innerHTML = `<div class="tool"></div><a href="${f.path}" title="${f.path} Size: ${fileSize}" class="file">${iconClass}</a><span class="name" title=""> ${name} </span>`;
      fileList.appendChild(file);
      addClickAbles(file, f.path,true);

     // CKEditor integration 
     if (getUrlParam('ckeditorfuncnum')) {
        file.addEventListener('click', e => { e.preventDefault(); returnFileUrl(f.path); });
      }
    });

dataList.appendChild(folderList);
dataList.appendChild(fileList);
const images =fileList.querySelectorAll('img');
images.forEach(im=>{
    im.addEventListener('load',(img)=>{img.originalTarget.classList.remove('loader')})
});

const url = filemanager.classList.contains('searching') ?
  `<span>Search results for: ${breadcrumbsUrls[0].split('/')[1]}</span>` :
  `<ul class="breadcrumb-list">` + breadcrumbsUrls.map((u, i) => {
    const name = u.split('/').pop();
    if (i < breadcrumbsUrls.length - 1) {
      return `<li class="breadcrumb-item folders drop-target" data-target-path="${u}" data-item-path="${u}">
                <a href="${u}">
        <span class="icon folder full"></span>
              </a>
          <span class="name">${name}</span></li>`;
    } else {
      return `<li class="breadcrumb-item current">
                <a><span class="icon folder"></span></a>
              <span class="name">${name}</span></li>`;
    }}).join('') + `</ul>`;
breadcrumbs.insertAdjacentHTML('beforeend', url);
breadcrumbs.querySelectorAll('.breadcrumb-item.folders').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const path = this.dataset.targetPath;
    window.location.hash = encodeURIComponent(path);
  });
});
const draggableItems = document.querySelectorAll('.files, .folders');
      addDraggableItems(draggableItems);
const dropTargets = document.querySelectorAll('.folders.drop-target');
      addDropTargets(dropTargets);

}//render

const addDraggableItems = (items) =>{ items.forEach(item => {
    item.addEventListener('dragstart', function(e) {
      const itemPath = this.dataset.itemPath;
      const selectedElements = dataList.querySelectorAll('.selected');
      const selectedPaths = Array.from(selectedElements).map(selectedItem => selectedItem.dataset.itemPath);
      filemanager.querySelectorAll('.drop-target').forEach(el => el.classList.add('active'));
        if (selectedPaths.length > 1 && selectedPaths.includes(itemPath)) {
        e.dataTransfer.setData('application/json', JSON.stringify(selectedPaths));
        selectedElements.forEach(el => el.classList.add('dragging'));
      } else {
        e.dataTransfer.setData('text/plain', itemPath);
        this.classList.add('dragging'); // Only add to the dragged item for single selection
      }
    });
    item.addEventListener('dragend', function() {
      filemanager.querySelectorAll('.drop-target').forEach(el => el.classList.remove('active'));
      dataList.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    });
  
})};

const addDropTargets = (folders) => {folders.forEach(target => {
        
  target.addEventListener('dragover', function(e) {
    e.preventDefault(); // Allow the drop
    this.classList.add('drag-over'); // Visual feedback
  });
  target.addEventListener('dragenter', function(e) {
    this.classList.add('drag-over'); // Visual feedback
  });
  target.addEventListener('dragleave', function(e) {
    this.classList.remove('drag-over'); // Remove visual feedback
  });
target.addEventListener('drop', function(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  const targetFolderPath = this.dataset.targetPath;
  let itemsToMove = [];

  const multipleItems = e.dataTransfer.getData('application/json');
  if (multipleItems) {
    itemsToMove = JSON.parse(multipleItems);
  } else {
    const singleItemPath = e.dataTransfer.getData('text/plain');
    if (singleItemPath && singleItemPath !== 'undefined') {
      itemsToMove = [singleItemPath];
    }
  }

  if (itemsToMove.length > 0 && targetFolderPath) {
    itemsToMove.forEach(itemPath => {
      const formData = new FormData();
      formData.append('action', 'move');
      formData.append('itemPath', itemPath);
      formData.append('targetPath', targetFolderPath);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'file.php?get=move&path='+targetFolderPath, true);
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          statsEl.textContent = `Moved ${itemPath} to ${targetFolderPath}: ${xhr.responseText}`;
          // Optionally update UI after each move or after all moves
          if (itemsToMove.indexOf(itemPath) === itemsToMove.length - 1) {
         //   new WtF(currentPath+' '+ targetFolderPath);
            window.location.hash =encodeURIComponent(targetFolderPath); // Refresh after all moves
          }
        } else {
           statsEl.textContent = `Failed to move ${itemPath}: ${xhr.statusText}`;
        }
      };
      xhr.onerror = function() {
        statsEl.textContent = `Network error moving ${itemPath}.`;
      };
      xhr.send(formData);
    });
  }
});
})};

filemanager.addEventListener('click', e => {
    const folderLink = e.target?.closest('li.folders');
    if (folderLink) {
        e.preventDefault();
        const nextDir = folderLink.querySelector('a').getAttribute('href');
        window.location.hash = encodeURIComponent(nextDir);
    } else{
        if(e.target.tagName==="IMG"){
            e.preventDefault();
            slideShowButton.click()
}

    }
});

let selectedItems = new Set();
let selectionStartX = 0;
let selectionStartY = 0;
let isSelecting = false;

let selectionDiv = document.querySelector('.selection-rect');
document.addEventListener('mousedown', (e) => {
  const isDraggable = e.target.closest('.files, .folders');
 
  if (!isDraggable && !(e.target.closest('.tool'))) {
    // If the mousedown is NOT on a draggable item or a tool, start selection
    e.preventDefault(); // Prevent default text selection when drawing rectangle
    isSelecting = true;
  
  selectionStartX = e.clientX + window.scrollX -filemanager.offsetLeft;
  selectionStartY = e.clientY + window.scrollY ; 
  selectionDiv = document.createElement('div');
  selectionDiv.className = 'selection-rect';
  selectionDiv.style.left = `${selectionStartX}px`;
  selectionDiv.style.top = `${selectionStartY}px`;
  dataList.appendChild(selectionDiv);

    if (!(e.ctrlKey || e.metaKey)) {
      dataList.querySelectorAll('.selected').forEach(item => item.classList.remove('selected'));
    }
  } else if (isDraggable) {
    isSelecting = false; // Ensure we are not in selection mode if clicking to drag
    if (selectionDiv) {
      selectionDiv.remove(); // Clean up any leftover selection div
      selectionDiv = null;
      statsEl.innerHTML = `<span>${document.querySelectorAll('.folders').lenght} folders | ${document.querySelectorAll('.files').lenght} files</span>`
    }
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isSelecting || !selectionDiv || document.querySelector(".filemanager").classList.contains('no-drag')) return;
  
  const currentX = e.clientX + window.scrollX -filemanager.offsetLeft; 
  const currentY = e.clientY + window.scrollY ;
  
  const left = Math.min(selectionStartX, currentX);
  const top = Math.min(selectionStartY, currentY);
  const width = Math.abs(selectionStartX - currentX);
  const height = Math.abs(selectionStartY - currentY);
//statsEl.textContent = `X:${Math.round(currentX)} |Y:${Math.round(currentY)} |L:${left} |T:${top} |W:${width} |H:${height}  | `;

selectionDiv.style.left = `${Math.round(left)}px`;
selectionDiv.style.top = `${Math.round(top)}px`;
selectionDiv.style.width = `${Math.round(width)}px`;
selectionDiv.style.height = `${Math.round(height)}px`;

  // Select items within the rectangle
  const rect = selectionDiv.getBoundingClientRect();
  dataList.querySelectorAll('.files, li.folders').forEach(item => {
    const itemRect = item.getBoundingClientRect();
    const isIntersecting = !(rect.right < itemRect.left ||
                           rect.left > itemRect.right ||
                           rect.bottom < itemRect.top ||
                           rect.top > itemRect.bottom);

    if (isIntersecting) {
      item.classList.add('selected');
       statsEl.textContent = dataList.querySelectorAll('.selected').length+' items selected';
    } else if (!(e.ctrlKey || e.metaKey)) {
      item.classList.remove('selected');
    }
  });
});

document.addEventListener('mouseup', () => {
  if (isSelecting && selectionDiv) {
    isSelecting = false;
    selectionDiv.remove();
    selectionDiv = null;
  if(!document.querySelectorAll('.selected').length)
     statsEl.innerHTML = `<span>${document.querySelectorAll('.folders').length} folders | ${document.querySelectorAll('.files').length} files</span>` 
  }
});

const generateBreadcrumbs = (path) => {
  const segments = path.split('/').filter(s => s !== '');
  const urls = [];
  let current = '';
  for (let i = 0; i < segments.length; i++) {
    current += '/' + segments[i];
  //  if (current !== '/') { // Exclude the root '/files'
      urls.push(current);
  //}
  }
  return urls;
}

const fileScanner = (path) =>{
  document.querySelector(".filemanager").classList.remove('no-drag');
  currentPath = path;
  if(uPath) uPath.value = currentPath;
  if(uForm) uForm.action = 'file.php?path='+currentPath;
  fetch(`scan.php?path=${encodeURIComponent(path === fileManagerRoot ? '/' : path)}`)
    .then(r => r.json())
    .then(data => {
      response = [data];
      breadcrumbsUrls = generateBreadcrumbs(currentPath);
      render(data.items || []);
 
    })
    .catch(console.error);
};

function triggerFileListReload() {
  if (dataList) {
    dataList.dispatchEvent(reloadFileListEvent);
    //console.log('Reload file list event dispatched.');
  } else {
    //console.warn('fileList element not found.');
  }
}

if (dataList) {
  dataList.addEventListener('reloadFileList', () => {
    //console.log('Reload file list event received.');
    fileScanner(currentPath);
  });
}

window.triggerFileListReload = triggerFileListReload;

goto(window.location.hash);

});//DOM

class SlideshowOverlay {
  constructor(imagePaths,index=0) {
    this.imagePaths = imagePaths;
    this.currentIndex = index;
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

  class CropTool {
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

class WtF{
    constructor(text){
        this.name = "WfT";
        this.myElmaa = null;
        this.message = text;
        this.init();
    }
    
    init(){
        this.create();
    }
    
    create(){
        this.myElmaa = document.createElement('div');
        this.myElmaa.className="whatTheFuck";
        this.myElmaa.innerHTML = `<span>${this.message}</span> | `;
        document.getElementsByTagName("footer")[0].appendChild(this.myElmaa);
    }
    destroy(){
      if(this.myElmaa) this.myElmaa.remove();
    }
}