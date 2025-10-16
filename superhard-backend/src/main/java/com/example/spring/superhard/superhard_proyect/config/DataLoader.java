package com.example.spring.superhard.superhard_proyect.config;

import com.example.spring.superhard.superhard_proyect.model.ProductoModel;
import com.example.spring.superhard.superhard_proyect.model.Rol;
import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.repository.ProductoRepository;
import com.example.spring.superhard.superhard_proyect.repository.UsuarioRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

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

        // Borra todo al iniciar la app (opcional, comentar si no se quiere borrar)
        productoRepository.deleteAll();
        usuarioRepository.deleteAll();

        // Roles
        Rol admin = Rol.ADMIN;
        Rol user = Rol.USER;

        // 🔹 Productos de hardware
        List<ProductoModel> productos = List.of(
                new ProductoModel(null, "Ryzen 5 5600X", 134999.0, "Procesadores", 10, null),
                new ProductoModel(null, "Intel i5 12400F", 120000.0, "Procesadores", 8, null),
                new ProductoModel(null, "Ryzen 7 5800X", 180000.0, "Procesadores", 5, null),
                new ProductoModel(null, "Intel i7 12700K", 220000.0, "Procesadores", 4, null),
                new ProductoModel(null, "RTX 4060", 350000.0, "Placas de video", 5, null),
                new ProductoModel(null, "RTX 4070", 500000.0, "Placas de video", 3, null),
                new ProductoModel(null, "RTX 4080", 950000.0, "Placas de video", 2, null),
                new ProductoModel(null, "RX 6800", 450000.0, "Placas de video", 4, null),
                new ProductoModel(null, "16GB DDR4 3200MHz", 25000.0, "Memorias RAM", 15, null),
                new ProductoModel(null, "32GB DDR4 3600MHz", 48000.0, "Memorias RAM", 12, null),
                new ProductoModel(null, "16GB DDR5 5200MHz", 70000.0, "Memorias RAM", 8, null),
                new ProductoModel(null, "1TB SSD NVMe", 60000.0, "Almacenamiento", 10, null),
                new ProductoModel(null, "2TB SSD NVMe", 120000.0, "Almacenamiento", 6, null),
                new ProductoModel(null, "4TB HDD", 45000.0, "Almacenamiento", 8, null),
                new ProductoModel(null, "Mouse Gamer RGB", 15000.0, "Periféricos", 20, null),
                new ProductoModel(null, "Teclado Mecánico RGB", 25000.0, "Periféricos", 15, null),
                new ProductoModel(null, "Monitor 27\" 144Hz", 120000.0, "Periféricos", 5, null),
                new ProductoModel(null, "Auriculares Gamer", 18000.0, "Periféricos", 10, null),
                new ProductoModel(null, "Fuente 650W 80+ Gold", 35000.0, "Componentes", 10, null),
                new ProductoModel(null, "Fuente 850W 80+ Gold", 55000.0, "Componentes", 6, null),
                new ProductoModel(null, "Gabinete ATX", 25000.0, "Componentes", 12, null),
                new ProductoModel(null, "Placa Madre B550", 90000.0, "Componentes", 7, null),
                new ProductoModel(null, "Placa Madre Z690", 140000.0, "Componentes", 5, null),
                new ProductoModel(null, "Disipador CPU Cooler Master", 20000.0, "Componentes", 10, null),
                new ProductoModel(null, "SSD 500GB SATA", 30000.0, "Almacenamiento", 12, null),
                new ProductoModel(null, "16GB DDR4 3000MHz", 22000.0, "Memorias RAM", 14, null),
                new ProductoModel(null, "RTX 4050", 320000.0, "Placas de video", 5, null),
                new ProductoModel(null, "Intel i9 13900K", 350000.0, "Procesadores", 3, null),
                new ProductoModel(null, "Monitor 24\" 75Hz", 70000.0, "Periféricos", 8, null),
                new ProductoModel(null, "Teclado Gamer Membrana", 12000.0, "Periféricos", 18, null)
        );

        productoRepository.saveAll(productos);

        // 🔹 Usuarios de ejemplo
        List<UsuarioModel> usuarios = List.of(
                new UsuarioModel(null, "Agustin", "Genem", "agustin@gmail.com", "2615993877", null ,"102030", admin),
                new UsuarioModel(null, "Juan", "Perez", "juan@gmail.com", "2614325543", null ,"102030", user),
                new UsuarioModel(null, "Maria", "Lopez", "maria@gmail.com", "2615551234", null, "123456", user),
                new UsuarioModel(null, "Carlos", "Gomez", "carlos@gmail.com", "2615555678", null, "654321", admin),
                new UsuarioModel(null, "Lucia", "Fernandez", "lucia@gmail.com", "2615559876", null, "987654", user),
                new UsuarioModel(null, "Sofia", "Martinez", "sofia@gmail.com", "2615553456", null, "111222", user),
                new UsuarioModel(null, "Diego", "Sanchez", "diego@gmail.com", "2615556789", null, "333444", admin),
                new UsuarioModel(null, "Valentina", "Diaz", "valentina@gmail.com", "2615551122", null, "555666", user),
                new UsuarioModel(null, "Martin", "Rojas", "martin@gmail.com", "2615552233", null, "777888", user),
                new UsuarioModel(null, "Florencia", "Alvarez", "florencia@gmail.com", "2615553344", null, "999000", user),
                new UsuarioModel(null, "Federico", "Torres", "federico@gmail.com", "2615554455", null, "121212", user),
                new UsuarioModel(null, "Julieta", "Gonzalez", "julieta@gmail.com", "2615555566", null, "343434", user),
                new UsuarioModel(null, "Nicolas", "Vega", "nicolas@gmail.com", "2615556677", null, "565656", user),
                new UsuarioModel(null, "Camila", "Ramos", "camila@gmail.com", "2615557788", null, "787878", user),
                new UsuarioModel(null, "Bruno", "Silva", "bruno@gmail.com", "2615558899", null, "909090", admin)
        );

        usuarioRepository.saveAll(usuarios);

        System.out.println("Datos de ejemplo cargados: 30 productos y 15 usuarios.");
    }
}
