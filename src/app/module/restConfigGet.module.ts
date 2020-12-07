import { ConfigureRest } from './restConfig.module';
export class ConfigResponse{
    constructor(
        public ok:boolean,
        public message: string,
        public existe:boolean = false,
        public id: string = "xxxxxxx",
        public config: ConfigureRest
    ){}
}