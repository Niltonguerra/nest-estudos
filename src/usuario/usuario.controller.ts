import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsuarioRepository } from './usuario.repository';
import { CriaUsuarioDTO } from "./dto/CriaUsuario.dto";
import { UsuarioEntity } from "./usuario.entity";
import {v4 as uuid} from 'uuid';
import { ListaUsuarioDTO } from "./dto/ListaUsuario.dto";
import { AtualizaUsuarioDTO } from "./dto/AtualizaUsuario.dto";

@Controller('/usuarios')
export class UsuarioController{
    
    constructor(private usuarioRepository: UsuarioRepository){}
    
    @Post()
    async criaUsuario(@Body() dadosDoUsuario:CriaUsuarioDTO){
        const usuarioEntity = new UsuarioEntity();
        usuarioEntity.email = dadosDoUsuario.email;
        usuarioEntity.nome = dadosDoUsuario.nome;
        usuarioEntity.senha = dadosDoUsuario.senha;
        usuarioEntity.id = uuid();

        this.usuarioRepository.salva(usuarioEntity);

        return {
            usuario: new ListaUsuarioDTO(usuarioEntity.nome, usuarioEntity.id),
            mensagem:"usuario criado com sucesso!"
        };
    }




    @Get()
    async listaUsuarios(){
        const usuarioSalvos = await this.usuarioRepository.listar();

        const usuariosLista = usuarioSalvos.map(
            usuario => new ListaUsuarioDTO(
                usuario.nome,
                usuario.id
            )
        );


        return usuariosLista;
    }

    @Put('/:id')
    async atualizaUsuario(@Param("id") id: string ,@Body() novosDados:AtualizaUsuarioDTO){
        const usuarioAtualizado = await this.usuarioRepository.atualiza(id, novosDados);
    
        return{
            usuario: usuarioAtualizado,
            mensagem: "usuario atualizado com sucesso!"
        }

    }

    @Delete('/:id')
    async removeUsuario(@Param("id") id:string){

        const usuarioRemovido = await this.usuarioRepository.remove(id);

        return{
            usuario: usuarioRemovido,
            mensagem: "usuário removido com sucesso!"
        }
    }
    
}