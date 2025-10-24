package com.example.spring.superhard.superhard_proyect;

import com.example.spring.superhard.superhard_proyect.model.ProductoModel;
import com.example.spring.superhard.superhard_proyect.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SuperhardProyectApplicationTests {

    @Autowired
    private ProductoRepository productoRepository;

    
    @Test
    void testGuardarYBuscarProducto() {
        ProductoModel p = new ProductoModel(null, "Ryzen 5", 134999.0, "" , "Procesadores", 10, null);
        ProductoModel guardado = productoRepository.save(p);

        assertThat(guardado.getId()).isNotNull();
        assertThat(guardado.getNombre()).isEqualTo("Ryzen 5");

        ProductoModel encontrado = productoRepository.findById(guardado.getId()).orElse(null);
        assertThat(encontrado).isNotNull();
        assertThat(encontrado.getPrecio()).isEqualTo(134999.0);
    }
}

