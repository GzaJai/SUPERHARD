package com.example.spring.superhard.superhard_proyect.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.spring.superhard.superhard_proyect.model.Rol;
import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioModel> listaUsuarios() {
        return usuarioService.listaUsuarios();
    }

    @PostMapping
    public UsuarioModel creaUsuario(UsuarioModel usuario) {
        return usuarioService.guardaUsuario(usuario);
    }

    @GetMapping("/{id}")
    public UsuarioModel obtieneUsuarioPorId(@PathVariable Long id) {
        return usuarioService.obtieneUsuarioPorId(id);
    }

    @PutMapping("/{id}")
    public UsuarioModel actualizaUsuario(@PathVariable Long id, @RequestBody UsuarioModel usuario) {
        return usuarioService.actualizaUsuario(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminaUsuario(@PathVariable Long id) {
        usuarioService.eliminaUsuario(id);
    }

    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody UsuarioModel usuario) {
    try {
        // 1️⃣ Validar que el email no exista
        boolean exists = usuarioService.listaUsuarios().stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(usuario.getEmail()));
        if (exists) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "El email ya está registrado"
            ));
        }

        // 2️⃣ Asignar rol por defecto
        usuario.setRol(Rol.USER);

        // 3️⃣ Guardar usuario
        UsuarioModel nuevoUsuario = usuarioService.guardaUsuario(usuario);

        // 4️⃣ Responder con datos para frontend
        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", nuevoUsuario,
                "rol", nuevoUsuario.getRol()
        ));

    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error al registrarse: " + e.getMessage()
        ));
    }
}

}
