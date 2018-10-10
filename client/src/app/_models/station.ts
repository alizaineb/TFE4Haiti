export class Station {


  public constructor(
    public _id: string,
    public name: string,
    public latitude: number,
    public longitude: number,
    public altitude: number,
    public state: string,
    public updatedAt: Date,
    public createdAt: Date,
    public interval: string,
    public users: string[],
  ) {
  }

  static getEmptyStation() {
    return new Station('','',undefined,undefined,undefined,'',null,null,'',[]);;
  }
}

//new Station('','',undefined,undefined,'',null,null,'',[]);


