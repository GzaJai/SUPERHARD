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
    private String ddr;
    private String socket;
    private boolean disponible;
    private int stock;
    private String image;
    private Double descuento;

    /**
     * Calcula el precio final aplicando el descuento.
     * Este método no se persiste en la base de datos gracias a @Transient.
     * @return El precio con el descuento aplicado, o el precio original si no hay descuento.
     */
    @Transient
    public Double getPrecioConDescuento() {
        if (this.precio == null) {
            return null;
        }
        if (this.descuento == null || this.descuento <= 0) {
            return this.precio;
        }
        return this.precio * (1 - (this.descuento / 100));
    }
}
