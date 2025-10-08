package com.example.spring.superhard.superhard_proyect.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioModel> listaUsuarios() {
        return usuarioService.listaUsuarios();
    }

    @PostMapping
    public UsuarioModel creaUsuario(UsuarioModel usuario) {
        return usuarioService.guardaUsuario(usuario);
    }

    @GetMapping("/{id}")
    public UsuarioModel obtieneUsuarioPorId(@PathVariable Long id) {
        return usuarioService.obtieneUsuarioPorId(id);
    }

    @PutMapping("/{id}")
    public UsuarioModel actualizaUsuario(@PathVariable Long id, @RequestBody UsuarioModel usuario) {
        return usuarioService.actualizaUsuario(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminaUsuario(@PathVariable Long id) {
        usuarioService.eliminaUsuario(id);
    }

}
