export class time{

constructor(totalDurationSecons,speed){
    this.speed = speed;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = totalDurationSecons;
}

getDuration(){


    this.second  = Math.round(this.second / this.speed);

    if(this.second >= 86400 ){//day
        this.day= this.second / 86400 | 0;
        this.second = this.second % 86400;
    }
    
    if(this.second >= 3600){//hour
        this.hour = this.second / 3600 | 0;
        this.second =  this.second % 3600;
    }
    
    if(this.second >= 60){//minutes
        this.minute = this.second / 60 | 0;
        this.second =  this.second % 60;
    }
    
    return this;
}



}