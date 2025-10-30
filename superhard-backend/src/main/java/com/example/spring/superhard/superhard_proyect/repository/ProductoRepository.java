package com.example.spring.superhard.superhard_proyect.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.spring.superhard.superhard_proyect.model.ProductoModel;

public interface ProductoRepository extends JpaRepository<ProductoModel, Long> {
    
    // Buscar por categoría exacta
    List<ProductoModel> findByCategoria(String categoria);
    
    // ✅ SOLUCIÓN: Usar @Query personalizada para evitar problemas con CLOB
    @Query("SELECT p FROM ProductoModel p WHERE " +
           "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CAST(p.description AS string)) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<ProductoModel> buscarProductos(@Param("query") String query);
}