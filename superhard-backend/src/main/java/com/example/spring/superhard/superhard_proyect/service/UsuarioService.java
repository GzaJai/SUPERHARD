package com.example.spring.superhard.superhard_proyect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioModel> listaUsuarios() {
        return usuarioRepository.findAll();
    }

    public UsuarioModel guardaUsuario(UsuarioModel usuario) {
        return usuarioRepository.save(usuario);
    }
    
    public UsuarioModel obtieneUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UsuarioModel actualizaUsuario(Long id, UsuarioModel usuario) {
        UsuarioModel existente = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        existente.setNombre(usuario.getNombre());
        existente.setEmail(usuario.getEmail());
        existente.setPassword(usuario.getPassword());
        return usuarioRepository.save(existente);
    }

    public void eliminaUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

}
