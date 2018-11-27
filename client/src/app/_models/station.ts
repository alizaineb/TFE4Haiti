export class Station {
  public _id: string;
  public name: string;
  public latitude: number;
  public longitude: number;
  public altitude: number;
  public state: string;
  public updatedAt: Date;
  public createdAt: Date;
  public interval: string;
  public commune: string;
  public bassin_versant: string;
  public user_creator_id: string;
  public user_creator: any;
  public users: string[];

  public constructor(
  ) {
  }
}
