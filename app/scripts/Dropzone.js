export default class Dropzone {
  constructor(options={}) {
    this.zone = options.zone;
    this.droppedFiles = [];
    this.filenameArea = this.zone.querySelector('[data-dropzone-filename]');
    this.inputFile = this.zone.querySelector('[data-dropzone-input]')

    this.zone.addEventListener('drag', this.preventAllTheThings);
    this.zone.addEventListener('dragstart', this.preventAllTheThings);
    this.zone.addEventListener('dragend', this.onDragLeave.bind(this));
    this.zone.addEventListener('dragover', this.onDragOver.bind(this));
    this.zone.addEventListener('dragenter', this.onDragOver.bind(this));
    this.zone.addEventListener('dragleave', this.onDragLeave.bind(this));
    this.zone.addEventListener('drop', this.onDrop.bind(this));
    if (this.inputFile) this.inputFile.addEventListener('change', this.onDrop.bind(this));

    this.zone.dropzone = this;
  }

  preventAllTheThings(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragOver(event) {
    this.preventAllTheThings(event);
    this.zone.classList.add('is--dragover');
  }

  onDragLeave(event) {
    this.preventAllTheThings(event);
    this.zone.classList.remove('is--dragover');
  }

  onDrop(event) {
    console.log(event);
    this.preventAllTheThings(event);
    console.log(event.target === this.inputFile);
    this.droppedFiles = [...((event.target === this.inputFile) ? event.target.files : event.dataTransfer.files)];

    console.log(this.droppedFiles);
    
    this.zone.classList.remove('is--dragover');
    this.zone.classList.add('has--file');
    if (this.filenameArea) this.filenameArea.textContent = this.droppedFiles[0].name;

  }
}