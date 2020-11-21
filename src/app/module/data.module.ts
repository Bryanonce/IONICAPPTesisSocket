import {UsuariosModule} from './usuarios.module'
export class DataModule{
    constructor(
        public ok:Boolean = true,
        public usuarios: UsuariosModule[]
    ){

    }
}