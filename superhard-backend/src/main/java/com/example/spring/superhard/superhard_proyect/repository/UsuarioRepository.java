package com.example.spring.superhard.superhard_proyect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
    Optional<UsuarioModel> findByEmail(String email);    
}
