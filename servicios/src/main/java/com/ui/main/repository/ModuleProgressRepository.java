package com.ui.main.repository;

import com.ui.main.repository.entity.ModuleProgressEntity;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ModuleProgressRepository extends ReactiveCrudRepository<ModuleProgressEntity, Long> {

    Flux<ModuleProgressEntity> findAllByEmailIgnoreCase(String email);

    Mono<ModuleProgressEntity> findByEmailIgnoreCaseAndModulo(String email, int modulo);
}
