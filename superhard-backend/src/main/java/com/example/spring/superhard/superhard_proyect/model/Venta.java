package com.example.spring.superhard.superhard_proyect.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioModel usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String productos; // JSON de los productos vendidos

    @Column(nullable = false)
    private Double total;

    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago;

    @Column(name = "pago_id")
    private String pagoId; // ID de la transacción (Stripe, MP, etc.)

    @Column(name = "estado_pago")
    private String estadoPago;

    @Column(name = "fecha_venta", nullable = false)
    private LocalDateTime fechaVenta = LocalDateTime.now();
}
