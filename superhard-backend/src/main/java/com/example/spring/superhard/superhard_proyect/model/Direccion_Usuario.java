package com.example.spring.superhard.superhard_proyect.model;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Direccion_Usuario {
    private String calle;
    private String numero;
    private String ciudad;
    private String provincia;
    private String codigoPostal;
    
}
