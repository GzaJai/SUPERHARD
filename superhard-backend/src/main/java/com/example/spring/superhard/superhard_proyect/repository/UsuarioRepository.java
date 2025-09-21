package com.example.spring.superhard.superhard_proyect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
    
}
