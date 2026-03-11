package com.ui.main.controller;

import com.ui.main.model.dto.*;
import com.ui.main.services.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progress;

    @GetMapping("/me")
    public Mono<ProgressMeRes> me(Mono<Authentication> auth) {
        return auth.map(a -> (String) a.getPrincipal())
                .flatMap(progress::getMyProgress);
    }

    @PostMapping("/me/tests")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> submitTest(Mono<Authentication> auth,
                                 @RequestBody Mono<TestSubmitReq> body) {
        return auth.map(a -> (String) a.getPrincipal())
                .zipWith(body)
                .flatMap(t -> progress.markTestDone(
                        t.getT1(),
                        t.getT2().modulo(),
                        t.getT2().type()
                ))
                .then();
    }

    /**
     * Marks a specific quiz (1-4) in a module as done or not done.
     * Body: { "modulo": 1, "quiz": 2, "done": true }
     */
    @PatchMapping("/me/quiz")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> submitQuiz(Mono<Authentication> auth,
                                 @RequestBody Mono<QuizSubmitReq> body) {
        return auth.map(a -> (String) a.getPrincipal())
                .zipWith(body)
                .flatMap(t -> progress.markQuizDone(
                        t.getT1(),
                        t.getT2().modulo(),
                        t.getT2().quiz(),
                        t.getT2().done()
                ))
                .then();
    }

    /**
     * Marks a medal (1-6) as earned for the authenticated user.
     * Called from the frontend when the Pixel Streaming experience reports a medal.
     * Body: { "numero": 1 }
     */
    @PatchMapping("/me/medals")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> markMedal(Mono<Authentication> auth,
                                @RequestBody Mono<MedalMarkReq> body) {
        return auth.map(a -> (String) a.getPrincipal())
                .zipWith(body)
                .flatMap(t -> progress.markMedalDone(t.getT1(), t.getT2().numero()))
                .then();
    }

    /** Convenience endpoint — marks the user's avatar as configured for the first time. */
    @PostMapping("/me/avatar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> markAvatarDone(Mono<Authentication> auth) {
        return auth.map(a -> (String) a.getPrincipal())
                .flatMap(email -> progress.markTestDone(email, 0, "avatar"));
    }

    @GetMapping("/all")
    public Mono<PagedUsersWithExperienceStatusRes> getUsersWithExperienceStatusPage(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        return progress.getUsersExperienceStatusPage(page, size);
    }

    @GetMapping("/all/export")
    public Flux<UserWithExperienceStatusRes> getAllUsersWithExperienceStatus() {
        return progress.getAllUsersExperienceStatus();
    }
}