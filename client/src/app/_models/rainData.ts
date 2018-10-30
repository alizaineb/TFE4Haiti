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
