package com.ui.main.repository;

import com.ui.main.repository.entity.UserEntity;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepository extends ReactiveCrudRepository<UserEntity, Long> {
    @Query("SELECT * FROM users WHERE UPPER(email) = UPPER(:email) LIMIT 1")
    Mono<UserEntity> findByEmailIgnoreCase(String email);
}