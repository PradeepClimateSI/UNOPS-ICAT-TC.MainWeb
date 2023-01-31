import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
// import { environment } from 'src/environments/environment';

export enum UploadFileType{
  img="img",
  pdf="pdf"
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  // environment:any=environment;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('myInput') private myInputVariable: ElementRef;


  @Output() onDeleteFile: EventEmitter<{id: number|undefined,index: number, file: any}> = new EventEmitter<{id: number|undefined,index: number, file: any}>();
  @Output() onChangeFile: EventEmitter<{index: number, file: any}> = new EventEmitter<{index: number, file: any}>();


  @Input() deletable: boolean=true;
  @Input() addable: boolean=true;
  @Input() rootUrl: string;
  @Input() multiple: boolean=true;
  @Input() fileTypes: UploadFileType[] = [];
  @Input() data: {id: number,path: string, documentType: string}[] = [];

  constructor(public sanitizer:DomSanitizer) { }


  displayData(){
    console.log("deletable-", this.deletable);
    console.log("addable-", this.addable);
    console.log("rootUrl-", this.rootUrl);
    console.log("multiple-", this.multiple);
    console.log("fileTypes-", this.fileTypes);
    console.log("data-", this.data);

  }

  ngOnInit(): void {
    this.displayData()
    this.files = []
    this.id = (Math.random() + 1).toString(36).substring(7);
    if (this.data){
      this.files=this.data.map((d,i) => {
        return {
          index: i,
          id: d.id,
          row: {},
          displayDelete: true,
          preview: this.rootUrl+"/"+d.path,
          fileType: d.documentType,
          name: d.path.split("_")[1]
        }
      })
    }
  }

  id: any = "";

  public files: {
    index: number,
    id: number | undefined,
    row: any,
    displayDelete: boolean,
    preview: SafeResourceUrl,
    fileType: string,
    name: string
  }[] = []

  change(e: any){
    if (e.target.files.length && this.addable) {
      let raw =e.target.files[0];
      const data = {
        displayDelete: false,
        id: undefined,
        index: this.multiple? this.files.length: 0,
        row: raw,
        preview: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(e.target.files[0])) ,
        fileType:  raw.type.includes("image") ? "IMAGE": "FILE",
        name: raw.name
      };
      if (this.multiple){
        this.files = [data, ...this.files]
      }else {
        this.files = [data]
      }
      this.myScrollContainer.nativeElement.scrollLeft -= 150;
      this.reset()
      this.onChangeFile.emit({
        index:this.files.length,
        file: raw
      })
    }
  }

  deleteFile(i: number) {
    const file = this.files[i];
    this.files.splice(this.files.indexOf(file), 1)
    this.onDeleteFile.emit({file: file.row, index: file.index, id: file.id})
  }

  reset() {
    this.myInputVariable.nativeElement.value = "";
  }
}
