package com.example.spring.superhard.superhard_proyect.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos")
@Data
@AllArgsConstructor
@NoArgsConstructor


public class ProductoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String marca;
    private String nombre;
    private Double precio;
    @Lob
    private String description;
    private String categoria;
    private boolean disponible;
    private int stock;
    private String image;
    

}
