package com.example.spring.superhard.superhard_proyect.controllers;

import com.example.spring.superhard.superhard_proyect.model.Venta;
import com.example.spring.superhard.superhard_proyect.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    // Endpoint para registrar una nueva venta
    @PostMapping
    public ResponseEntity<Venta> crearVenta(@RequestBody Venta venta) {
        if (venta.getEstadoPago() == null) {
            venta.setEstadoPago("Pagado"); // ✅ Establecer estado por defecto
        }
        Venta nuevaVenta = ventaRepository.save(venta);
        return ResponseEntity.ok(nuevaVenta);
    }

    // Endpoint para obtener todas las ventas (para el admin)
    @GetMapping
    public ResponseEntity<List<Venta>> obtenerVentas() {
        List<Venta> ventas = ventaRepository.findAll();
        return ResponseEntity.ok(ventas);
    }
}
