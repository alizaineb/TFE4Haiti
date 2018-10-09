import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  storage$: Observable<any>;
  private storage = new Subject<any>();
  private lStorage = {};

  constructor() {
    this.storage$ = this.storage.asObservable();
    this.lStorage = JSON.parse(localStorage.getItem("storage") || '{}');
    this.updateLocalStorage();
  }

  getItem(key){
    return this.lStorage[key];
  }

  setItem(key, value) {
    console.log(key, value); // I have data! Let's return it so subscribers can use it!
    // we can do stuff with data if we want
    this.lStorage[key] = value;
    this.updateLocalStorage();
  }

  removeItem(key: string) {
    delete this.lStorage[key];
    this.updateLocalStorage();
  }

  private updateLocalStorage(){
    localStorage.setItem("storage", JSON.stringify(this.lStorage));
    this.storage.next(this.lStorage);
  }

  getStorage() {
    return this.lStorage;
  }
}
