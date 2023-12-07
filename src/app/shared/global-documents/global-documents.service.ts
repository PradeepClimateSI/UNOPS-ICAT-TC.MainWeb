import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalArrayService {
  private myArray: number[] = [];

  constructor() { }

  getArray(): any[] {
    return this.myArray;
  }

  addItem(item: any): void {
    this.myArray.length=0 
    for(let items of item){
      if (!this.myArray.includes(items)) {
        this.myArray.push(items);
      }
    }
    
  }

  removeItem(index: number): void {
    this.myArray.splice(index, 1);
  }
}
