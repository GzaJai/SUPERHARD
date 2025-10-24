package com.example.spring.superhard.superhard_proyect.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
        System.out.println("Stripe API Key configurada"); // para debug
    }
}
