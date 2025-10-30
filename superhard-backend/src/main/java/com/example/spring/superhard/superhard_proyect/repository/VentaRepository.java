package com.example.spring.superhard.superhard_proyect.repository;

import com.example.spring.superhard.superhard_proyect.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
}
