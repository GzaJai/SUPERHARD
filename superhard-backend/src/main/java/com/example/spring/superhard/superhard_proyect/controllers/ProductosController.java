package com.example.spring.superhard.superhard_proyect.controllers;

import java.util.List;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.spring.superhard.superhard_proyect.model.ProductoModel;
import com.example.spring.superhard.superhard_proyect.service.ProductoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductosController {
    private final ProductoService productoService;

    public ProductosController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductoModel> listaProductos() {
        return productoService.listaProductos();
    }

    @PostMapping
    public ProductoModel creaProducto(@RequestBody ProductoModel producto) {
        return productoService.guardaProducto(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminaProducto(@PathVariable Long id) {
        productoService.eliminaProducto(id);
    }

    @PutMapping("/{id}")
    public ProductoModel actualizaProducto(@PathVariable Long id, @RequestBody ProductoModel producto) {
        return productoService.actualizaProducto(id, producto);
    }

    @GetMapping("/{id}")
    public ProductoModel obtieneProductoPorId(@PathVariable Long id) {
        return productoService.obtieneProductoPorId(id);
    }

    @GetMapping("/categoria/{categoria}")
    public List<ProductoModel> obtieneProductosPorCategoria(@PathVariable String categoria) {
        return productoService.obtieneProductosPorCategoria(categoria);
    }


}
