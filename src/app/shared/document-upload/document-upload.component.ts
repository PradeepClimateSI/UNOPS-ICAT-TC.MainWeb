import { async } from '@angular/core/testing';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
// import {FileUploadModule} from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import {
  DocumentControllerServiceProxy,
  Documents,
  DocumentsDocumentOwner,
} from '../../../shared/service-proxies/service-proxies';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalArrayService } from '../global-documents/global-documents.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit, OnChanges {
  @Input() doucmentList: Documents[] = [];
  @Input() documentOwner: DocumentsDocumentOwner;
  @Input() documentOwnerId: number;
  @Input() isNew: boolean;
  @Input() showDeleteButton: boolean = true;
  @Input() showUpload: boolean = true;
  @Input() id: number = 0;
  @Output() valueClicked = new EventEmitter<any>();

  loading: boolean;
  uploadedFiles: any[] = [];
  SERVER_URL = environment.baseUrlAPIDocUploadAPI; //"http://localhost:7080/document/upload2";
  SERVER_URL_ANONYMOUS = environment.baseUrlAPIDocUploadAPI;
  uploadURL: string;
  token: string;
  constructor(
    private docService: DocumentControllerServiceProxy,
    private httpClient: HttpClient,
    private confirmationService: ConfirmationService,
    private docArrayforSave:GlobalArrayService,
    private messageService: MessageService,
  ) {
    // this.showDeleteButton = false;
    this.token = localStorage.getItem('ACCESS_TOKEN')!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.documentOwner) {
      this.uploadURL =
        (this.token ? this.SERVER_URL : this.SERVER_URL_ANONYMOUS) +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
    this.load();
  }

  ngOnInit(): void {
    // this.token = localStorage.getItem('access_token')!;

    console.log("documentOwnerId..",this.documentOwner);

    if (this.documentOwner) {
      this.uploadURL =
        (this.token ? this.SERVER_URL : this.SERVER_URL_ANONYMOUS) +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
    }
    console.log('uploadURL', this.uploadURL);
    console.log('============' + this.showDeleteButton + '==============');
  }

  loadDocments(event: LazyLoadEvent) {
    
    this.load();
  }

  async load() {
    if (!this.isNew) {
      this.loading = true;

      if (this.token) {
        // console.log('token123', this.token);
        await this.docService
          .getDocuments(this.documentOwnerId, this.documentOwner)
          .subscribe(
            (res) => {
              console.log('token12344444', res);
              this.doucmentList = res;
              this.loading = false;
              let ids=res.map(item=>{return item.id})
            
                this.docArrayforSave.addItem(ids)
              
              this.docArrayforSave.getArray();
              
             
            },
            (err: any) => console.log(err)
          );
      } else {
        console.log('token124', this.token);
     
        await this.docService
          .getDocuments(this.documentOwnerId, this.documentOwner)
          .subscribe(
            (res) => {
              this.valueClicked.emit({ data: res, res})
              this.doucmentList = res;
              this.loading = false;
            },
            (err: any) => console.log(err)
          );
      }
    }
  }

  onUploadComplete(event: any) {
    console.log(event);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Document  has been uploaded successfully ',
      closable: true,
    });
    setTimeout(() => {
      this.load();
    }, 1500);
    
  }

  async myUploader(event: any) {
    this.loading = true;
    if (this.doucmentList === undefined || this.doucmentList === null) {
      this.doucmentList = new Array();
    }
    let fileReader = new FileReader();

    for (let file of event.files) {
      console.log('timecheck1');
      this.loading = true;
      file.documentOwner = this.documentOwner;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentOwner', this.documentOwner.toString());
      let fullUrl =
        this.SERVER_URL +
        '/' +
        this.documentOwnerId +
        '/' +
        this.documentOwner.toString();
      console.log('this.uploadURL', this.uploadURL);

      
      this.httpClient.post<any>(fullUrl, formData).subscribe(
        (res) => {
          this.valueClicked.emit({ data: res, fullUrl})
          console.log("333333",res)
          
          this.load();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }
     
    console.log('timecheck2');
  }

  async deleteConfirm(doc: Documents) {
    console.log('name');
    this.confirmationService.confirm({
      message: `Do you want to delete ${(doc.fileName)} ?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (this.token) {
          this.docService.deleteDoc(doc.id).subscribe(
            (res: any) => {
              console.log('token12345', res);
             
              this.docArrayforSave.removeItem(doc.id)
              this.docArrayforSave.getArray()
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Document  has been deleted successfully ',
                closable: true,
              });
              setTimeout(() => {
                this.load();
              }, 1500);
            },
            (err: any) => console.log(err)
          );
        } else {
          this.docService.deleteDoc(doc.id).subscribe(
            (res: any) => {
              console.log('deleteDocAnonymous', res);
              this.load();
            },
            (err: any) => console.log(err)
          );
        }
      },
      reject: () => {
        //this.messageService.add({severity:'info', summary:'Rejected', detail:'You have rejected'});
      },
    });
  }

  base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onUpload(event: any) {
    alert('test');
  }
}
