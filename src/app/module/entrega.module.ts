
export class EntragaModule{
    constructor(
        public ok:Boolean = true,
        public usuarios:{
            anio:Number,
            mes:Number,
            dia:Number,
            hora:Number,
            minuto:Number,
            lat:Number,
            long:Number
        }={
            anio:2020,
            mes:0,
            dia:1,
            hora:0,
            minuto:0,
            lat:0,
            long:0
        }
    ){
        
    }
}