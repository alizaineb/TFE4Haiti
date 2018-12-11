export class RainData {
  public _id: string;
  public station_id: string;
  public user_id: string;
  public date: Date;
  public value: number;


  public constructor(
  ) {
    this.date = new Date();
  }
}

export class RainDataAwaiting {
  public _id: string;
  public station_id: string;
  public station : string;
  public user_id: string;
  public user: string;
  public date: Date;
  public value: number;
  public type: string;


  public constructor(
  ) {
    this.date = new Date();
  }
}
