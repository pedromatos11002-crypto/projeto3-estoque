package com.senac.estoque.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    @ConditionalOnMissingBean(DataSource.class)
    public DataSource dataSource(Environment env) {
        // Prefer explicit spring.datasource.url if present (auto-config will create DataSource then)
        String springUrl = env.getProperty("spring.datasource.url");
        if (springUrl != null && !springUrl.isBlank()) {
            return null;
        }

        // Check common env vars provided by hosting platforms
        String dbUrl = env.getProperty("DB_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = env.getProperty("DATABASE_URL");
        }

        if (dbUrl == null || dbUrl.isBlank()) {
            return null; // let auto-config or other settings handle it
        }

        String username = env.getProperty("DB_USERNAME");
        String password = env.getProperty("DB_PASSWORD");

        String jdbcUrl = dbUrl;

        // If the URL is in the form postgres://user:pass@host:port/dbname, convert to JDBC
        if (dbUrl.startsWith("postgres://")) {
            try {
                String withoutScheme = dbUrl.substring("postgres://".length());

                // split userinfo and host/db
                String[] parts = withoutScheme.split("@", 2);

                String userInfo = null;
                String hostPart;

                if (parts.length == 2) {
                    userInfo = parts[0];
                    hostPart = parts[1];
                } else {
                    hostPart = parts[0];
                }

                if (userInfo != null && (username == null || username.isBlank())) {
                    String[] up = userInfo.split(":", 2);
                    if (up.length >= 1) username = up[0];
                    if (up.length == 2) password = up[1];
                }

                // hostPart is host:port/dbname or host/dbname
                String host;
                String port = null;
                String database;

                int slashIdx = hostPart.indexOf('/');
                String hostPort = slashIdx >= 0 ? hostPart.substring(0, slashIdx) : hostPart;
                database = slashIdx >= 0 ? hostPart.substring(slashIdx + 1) : "";

                if (hostPort.contains(":")) {
                    String[] hp = hostPort.split(":", 2);
                    host = hp[0];
                    port = hp[1];
                } else {
                    host = hostPort;
                }

                if (port != null && !port.isBlank()) {
                    jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s", host, port, database);
                } else {
                    jdbcUrl = String.format("jdbc:postgresql://%s/%s", host, database);
                }
            } catch (Exception ex) {
                // If parsing fails, fall back to original value and let the driver fail with clear logs
                jdbcUrl = dbUrl;
            }
        }

        DataSourceBuilder<?> builder = DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(jdbcUrl);

        if (username != null && !username.isBlank()) builder.username(username);
        if (password != null && !password.isBlank()) builder.password(password);

        return builder.build();
    }
}
