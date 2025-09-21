package com.example.spring.superhard.superhard_proyect.model;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor

public class UsuarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private Direccion_Usuario direccion;
    private String password;


}
