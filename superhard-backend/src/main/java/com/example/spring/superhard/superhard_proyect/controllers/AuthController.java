package com.example.spring.superhard.superhard_proyect.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.spring.superhard.superhard_proyect.model.UsuarioModel;
import com.example.spring.superhard.superhard_proyect.service.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        UsuarioModel usuario = authService.login(email, password);

        Map<String, Object> response = new HashMap<>();
        if (usuario != null) {
            response.put("success", true);
            response.put("user", usuario);
            response.put("rol", usuario.getRol());
            response.put("token", "TOKEN_FAKE_123"); 
        } else {
            response.put("success", false);
            response.put("message", "Correo o contraseña incorrectos");
        }
        return response;
    }
}
