package com.ui.main.model.dto;

import java.util.List;

public record ProgressMeRes(
        GeneralProgress general,
        List<ModuloProgress> modulos,
        MonedaStatus monedas
) {

    public record GeneralProgress(
            boolean testInicialGeneral,
            boolean testFinalGeneral,
            boolean avatarDone
    ) {
        public static GeneralProgress empty() {
            return new GeneralProgress(false, false, false);
        }
    }

    public record MonedaStatus(
            boolean moneda1,
            boolean moneda2,
            boolean moneda3,
            boolean moneda4,
            boolean moneda5,
            boolean moneda6
    ) {
        public static MonedaStatus none() {
            return new MonedaStatus(false, false, false, false, false, false);
        }
    }

    public record ModuloProgress(
            int modulo,
            boolean testInitialDone,
            boolean testExitDone,
            boolean calificationDone,
            boolean introduccionDone,
            boolean pdf1Done,
            boolean pdf2Done,
            boolean pdf3Done,
            boolean pdf4Done,
            boolean quiz1Done,
            boolean quiz2Done,
            boolean quiz3Done,
            boolean quiz4Done
    ) {
        public static ModuloProgress empty(int modulo) {
            return new ModuloProgress(modulo, false, false, false, false, false, false, false, false,
                    false, false, false, false);
        }
    }
}