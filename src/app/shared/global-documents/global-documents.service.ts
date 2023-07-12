import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalArrayService {
  private myArray: number[] = [];

  constructor() { }

  getArray(): any[] {
    console.log(this.myArray)
    return this.myArray;
  }

  addItem(item: any): void {
    this.myArray.length=0 
    for(let items of item){
      if (!this.myArray.includes(items)) {
        this.myArray.push(items);
      }
    }
    
    console.log(this.myArray)
  }

  removeItem(index: number): void {
    this.myArray.splice(index, 1);
    console.log(this.myArray)
  }
}
