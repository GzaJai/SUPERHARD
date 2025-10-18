package com.example.spring.superhard.superhard_proyect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.spring.superhard.superhard_proyect.model.ProductoModel;
import com.example.spring.superhard.superhard_proyect.repository.ProductoRepository;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoModel> listaProductos() {
        return productoRepository.findAll();
    }

    public ProductoModel guardaProducto(ProductoModel producto) {
        return productoRepository.save(producto);
    }

    public void eliminaProducto(Long id) {
        productoRepository.deleteById(id);
    }

    public ProductoModel actualizaProducto(Long id, ProductoModel producto) {
        ProductoModel existente = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        existente.setMarca(producto.getMarca());
        existente.setNombre(producto.getNombre());
        existente.setPrecio(producto.getPrecio());
        existente.setCategoria(producto.getCategoria());
        existente.setDisponible(producto.isDisponible());
        existente.setDescription(producto.getDescription());
        existente.setImage(producto.getImage());
        existente.setStock(producto.getStock());
        return productoRepository.save(existente);
    }

    public ProductoModel obtieneProductoPorId(Long id) {
        return productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public List<ProductoModel> obtieneProductosPorCategoria(String categoria) {
        return productoRepository.findAll().stream()
                .filter(p -> p.getCategoria().equalsIgnoreCase(categoria))
                .toList();
    }

}
