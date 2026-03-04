package com.ui.main.repository.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("module_progress")
public class ModuleProgressEntity {

    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    private String email;

    /** Número de módulo: 1 a 6. */
    private int modulo;

    @Column("test_initial_done")
    private boolean testInitialDone;

    @Column("test_exit_done")
    private boolean testExitDone;

    @Column("calification_done")
    private boolean calificationDone;

    @Column("introduccion_done")
    private boolean introduccionDone;

    @Column("pdf1_done")
    private boolean pdf1Done;

    @Column("pdf2_done")
    private boolean pdf2Done;

    @Column("pdf3_done")
    private boolean pdf3Done;

    @Column("pdf4_done")
    private boolean pdf4Done;

    @Column("quiz1_done")
    private boolean quiz1Done;

    @Column("quiz2_done")
    private boolean quiz2Done;

    @Column("quiz3_done")
    private boolean quiz3Done;

    @Column("quiz4_done")
    private boolean quiz4Done;

    @Column("avatar_done")
    private boolean avatarDone;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}
