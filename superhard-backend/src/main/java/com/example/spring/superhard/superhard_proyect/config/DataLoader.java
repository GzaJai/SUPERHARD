package com.example.spring.superhard.superhard_proyect.config;

import com.example.spring.superhard.superhard_proyect.model.Direccion_Usuario;
import com.example.spring.superhard.superhard_proyect.model.ProductoModel;
import com.example.spring.superhard.superhard_proyect.model.Rol;
import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.repository.ProductoRepository;
import com.example.spring.superhard.superhard_proyect.repository.UsuarioRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public DataLoader(ProductoRepository productoRepository, UsuarioRepository usuarioRepository) {
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Borra todos los productos que hay en la base de datos al iniciar la aplicación
        // productoRepository.deleteAll();
        usuarioRepository.deleteAll();
        // Productos de ejemplo para verificar el funcionamiento del programa y la conexión con la base de datos
        // productoRepository.save(new ProductoModel(null, "Ryzen 5", 134999.0, "Procesadores", 10, null));
        // productoRepository.save(new ProductoModel(null, "Intel i5", 120000.0, "Procesadores", 8, null));
        // productoRepository.save(new ProductoModel(null, "RTX 4060", 350000.0, "Placas de video", 5, null));
        Rol rol = Rol.ADMIN;
        Rol rol2 = Rol.USER;
        usuarioRepository.save(new UsuarioModel(null, "Agustin", "Genem", "Genemagustin@gmail.com", "2615993877", null ,"102030", rol));
        usuarioRepository.save(new UsuarioModel(null, "Juan", "Perez", "Juanperez@gmail.com", "2614325543", null ,"102030", rol2)); 
        System.out.println("Productos de ejemplo cargados en la base de datos.");
    }
}
