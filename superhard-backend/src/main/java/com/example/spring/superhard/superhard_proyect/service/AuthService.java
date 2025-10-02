package com.example.spring.superhard.superhard_proyect.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.repository.UsuarioRepository;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioModel login(String email, String password) {
        Optional<UsuarioModel> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            UsuarioModel usuario = usuarioOpt.get();
            if (usuario.getPassword().equals(password)) {
                return usuario;
            }
        }
        throw new RuntimeException("Datos de inicio de sesión inválidos");
    }
    
}
