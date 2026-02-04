package com.pds.gatewayservice;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@DisplayName("Gateway Service Application Tests")
class GatewayServiceApplicationTest {

    @Test
    @DisplayName("Context loads successfully")
    void contextLoads() {
        assertDoesNotThrow(() -> {});
    }

    @Test
    @DisplayName("Application starts without errors")
    void applicationStarts() {
        assertDoesNotThrow(() -> GatewayServiceApplication.main(new String[]{}));
    }
}
