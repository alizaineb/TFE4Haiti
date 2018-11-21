export class RainData {
  public _id: string;
  public id_station: string;
  public id_user: string;
  public date: Date;
  public value: number;


  public constructor(
  ) {
    this.date = new Date();
  }
}

export class RainDataAwaiting {
  public _id: string;
  public id_station: string;
  public station : string;
  public id_user: string;
  public user: string;
  public date: Date;
  public value: number;
  public type: string;


  public constructor(
  ) {
    this.date = new Date();
  }
}
