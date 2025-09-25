package com.example.spring.superhard.superhard_proyect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.spring.superhard.superhard_proyect.model.ProductoModel;

public interface ProductoRepository extends JpaRepository<ProductoModel, Long> {
    
}
