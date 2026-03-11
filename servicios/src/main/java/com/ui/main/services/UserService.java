package com.ui.main.services;

import com.ui.main.model.dto.UpdateUserReq;
import com.ui.main.repository.UserRepository;
import com.ui.main.repository.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;

    public Mono<UserEntity> getByEmail(String email) {
        return users.findByEmailIgnoreCase(email)
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    public Mono<UserEntity> patchUser(String email, UpdateUserReq req) {
        return getByEmail(email).flatMap(u -> {
            if (req.getName()               != null) u.setFullName(req.getName());
            if (req.getPhone()              != null) u.setPhone(req.getPhone());
            if (req.getAvatarId()           != null) u.setAvatarId(req.getAvatarId());
            if (req.getRiskScore()          != null) u.setRiskScore(req.getRiskScore());
            if (req.getRiskProfile()        != null) u.setRiskProfile(req.getRiskProfile());
            if (req.getActorVial()          != null) u.setActorVial(req.getActorVial());
            if (req.getGenero()             != null) u.setGenero(req.getGenero());
            if (req.getAgeRange()           != null) u.setAgeRange(req.getAgeRange());
            if (req.getDifferentialFocus()  != null) u.setDifferentialFocus(req.getDifferentialFocus());
            if (req.getDepartment()         != null) u.setDepartment(req.getDepartment());
            if (req.getMunicipality()       != null) u.setMunicipality(req.getMunicipality());
            return users.save(u);
        });
    }
}