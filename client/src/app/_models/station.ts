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
  public users: string[];

  public constructor(
  ) {
  }
}

//new Station('','',undefined,undefined,'',null,null,'',[]);


