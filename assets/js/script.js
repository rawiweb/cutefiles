import { SlideshowOverlay } from './slideshow.js';
import { CropTool } from './croptool.js';

document.addEventListener('DOMContentLoaded', function() {
    const debug = false;
  const createButton = document.getElementById('create');
  const slideShowButton = document.getElementById('slideShow');
  const fileManagerRoot = '/files';
  let currentPath = fileManagerRoot;
  let response = null; // To hold the fetched data for the current path
  const uPath = document.getElementById('uPath');
  const uForm = document.getElementById('upload');
  const filemanager = document.querySelector('.filemanager');
  const breadcrumbs = document.querySelector('.breadcrumbs');
  let  breadcrumbsUrls = null;
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
  createSlideShow();
});
};

const createSlideShow =(index = 0)=>{
 const imageFiles = dataList.querySelectorAll('.file-list a');
  let iData = [];
  imageFiles.forEach(image =>{
    if(image.firstChild.tagName === 'IMG')
     iData.push(image.parentNode.dataset.itemPath);
     });
   const slideshow = new SlideshowOverlay(iData,index);
  slideshow.triggerSlideshow();
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
         const msg = res;
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

    container.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  })
  elm.querySelector(".tool").appendChild(edits);  
    
  }}

  
  elm.setAttribute('draggable', 'true');
}

const render = (data) => {
    dataList.innerHTML = ''; 
    breadcrumbs.innerHTML = ''; 
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

let index = 0;
    scannedFiles.forEach(f => {
      const parts = f.name.split('.');
      const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';
      const fileSize = bytesToSize(f.size);
      const name = escapeHTML(f.name);
      let iconClass = "";

if (['jpg', 'jpeg', 'gif', 'png', 'webp', 'avif'].includes(ext)) {
  iconClass = `<img class="loader" src="image.php?path=${encodeURIComponent(f.path)}" data-idx="${index++}">`;
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


}//render

const addDraggableItems = (items) =>{if(debug) console.log('make dragable'); items.forEach(item => {
    item.addEventListener('dragstart', function(e) {
        if(debug) console.log('Drag start. Selected elements:', dataList.querySelectorAll('.selected').length); 
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
      e.dataTransfer.effectAllowed = 'move';
       this.addEventListener('blur', () =>{if(debug) console.log('Dragged item lost focus'), { once: true }});
       const onMouseMove = (moveEvent) => {
   if(debug)  console.log('Mouse move during drag:', moveEvent.clientX, moveEvent.clientY);
  };
  document.addEventListener('mousemove', onMouseMove);
  this.addEventListener('dragend', () => {
    document.removeEventListener('mousemove', onMouseMove);
   if(debug)  console.log('Drag ended.');
  }, { once: true });
    });
    item.addEventListener('dragend', function(e) {
         if(debug) console.log('Drag end. Selected elements:',e); 
      filemanager.querySelectorAll('.drop-target').forEach(el => el.classList.remove('active'));
      dataList.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    });
});};

const addDropTargets = (folders) => {if(debug) console.log('make Dropable'); folders.forEach(target => {
        
  target.addEventListener('dragover', function(e) {
    e.preventDefault(); // Allow the drop
     if(debug) console.log('D-over'); 
    this.classList.add('drag-over'); // Visual feedback
  });
  target.addEventListener('dragenter', function(e) {
       if(debug) console.log('D-enter'); 
    this.classList.add('drag-over'); // Visual feedback
  });
  target.addEventListener('dragleave', function(e) {
       if(debug) console.log('D-leave'); 
    this.classList.remove('drag-over'); // Remove visual feedback
  });
target.addEventListener('drop', function(e) {
     if(debug) console.log('D-drop'); 
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
            createSlideShow(e.target.dataset.idx)
}

    }
});

let selectedItems = new Set();
let selectionStartX = 0;
let selectionStartY = 0;
let isSelecting = false;

let selectionDiv = document.querySelector('.selection-rect');
document.addEventListener('mousedown', (e) => {
    if(debug) console.log('FM click');
  const isDraggable = e.target.closest('.files, .folders');
 
  if (!isDraggable && !(e.target.closest('.tool'))) {
    // If the mousedown is NOT on a draggable item or a tool, start selection
   // e.preventDefault(); // Prevent default text selection when drawing rectangle
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
    if(debug) console.log('doc mousemove');
  if (!isSelecting || !selectionDiv || document.querySelector(".filemanager").classList.contains('no-drag')) return;
  
  const currentX = e.clientX + window.scrollX -filemanager.offsetLeft; 
  const currentY = e.clientY + window.scrollY ;
  
  const left = Math.min(selectionStartX, currentX);
  const top = Math.min(selectionStartY, currentY);
  const width = Math.abs(selectionStartX - currentX);
  const height = Math.abs(selectionStartY - currentY);
statsEl.textContent = `X:${Math.round(currentX)} |Y:${Math.round(currentY)} |L:${left} |T:${top} |W:${width} |H:${height}  | `;

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
    if(debug) console.log('DOC Mouseup');
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
     const draggableItems = document.querySelectorAll('.files, .folders');
     if(debug) console.log(draggableItems);
      addDraggableItems(draggableItems);
     const dropTargets = document.querySelectorAll('.folders.drop-target');
       if(debug) console.log(dropTargets);
        addDropTargets(dropTargets);
      
      const images =dataList.querySelectorAll('img');
images.forEach(im=>{
    im.addEventListener('load',(img)=>{img.target.classList.remove('loader')})
});
    })
    .catch(console.error);
};

function triggerFileListReload() {
  if (dataList) {
    dataList.dispatchEvent(reloadFileListEvent);
    //if(debug) console.log('Reload file list event dispatched.');
  } else {
    //console.warn('fileList element not found.');
  }
}

if (dataList) {
  dataList.addEventListener('reloadFileList', () => {
    //if(debug) console.log('Reload file list event received.');
    fileScanner(currentPath);
  });
}

window.triggerFileListReload = triggerFileListReload;

goto(window.location.hash);

});//DOM





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