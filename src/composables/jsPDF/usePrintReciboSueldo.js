import { useRRHHStore } from "@/stores/useRRHHStore";

import { useDateFormat } from "@vueuse/core";

import useGeneric from "@/composables/utils/useGeneric";

import BASE64 from "@/constants/BASE64";

import pdfMake, { s } from "pdfmake/build/pdfmake";
import pdfFonts from "./usePdfFonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function usePrintReciboSueldo() {
  const RRHH_STORE = useRRHHStore();

  const { decimalToHoursMinutes, formatCurrency } = useGeneric();

  function print() {
    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [40, 80, 40, 60],
      content: [],
      styles: {
        header: {
          fontSize: 24,
          color: "#3e3e3e",
          margin: [0, 0, 0, 30],
        },
        headerDetails: {
          fontSize: 8,
          color: "#3e3e3e",
          bold: true,
        },
        subheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 50],
        },
        total: {
          fontSize: 14,
          color: "#295bac",
          bold: true,
        },
        superTotal: {
          fontSize: 16,
          color: "#295bac",
          bold: true,
          margin: [0, 0, 0, 10],
        },
        item: {
          fontSize: 12,
          color: "#3e3e3e",
        },
      },
    };

    const fechaSalario = RRHH_STORE.fechaSalario
      ? RRHH_STORE.fechaSalario.split("-")[1] +
        "-" +
        RRHH_STORE.fechaSalario.split("-")[0]
      : useDateFormat(new Date(), "MM-YYYY").value;

    docDefinition.content.push({
      columns: [
        {
          image: BASE64.GU_LOGO, // Replace with your base64 encoded image data
          width: 75,
          margin: [0, 0, 0, 30],
        },
        {
          text:
            fechaSalario +
            " - " +
            "Resumen Salarial, " +
            (RRHH_STORE.staffName || ""),
          bold: true,
          alignment: "right",
          margin: [0, 0, 0, 30],
        },
      ],
    });

    // docDefinition.content.push({
    //   image: BASE64.GU_LOGO, // Replace with your base64 encoded image data
    //   width: 100,
    //   alignment: "left",
    //   margin: [0, 0, 0, 30],
    // });

    // docDefinition.content.push({
    //   text:
    //     fechaSalario +
    //     " - " +
    //     "Resumen Salarial, " +
    //     (RRHH_STORE.staffName || ""),
    //   bold: true,
    //   alignment: "right",
    //   margin: [0, 0, 0, 30],
    // });

    const firstBody = [
      ["", "", ""],
      [
        { text: "Hora base", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.lastBaseHourValue),
          alignment: "right",
          style: "item",
        },
      ],
      [
        { text: "Hora real", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.horaReal),
          alignment: "right",
          style: "item",
        },
      ],
      [
        { text: "Total horas", style: "item" },
        "",
        {
          text: decimalToHoursMinutes(RRHH_STORE.totalHours),
          alignment: "right",
          style: "item",
        },
      ],
      [
        { text: "Total 1", style: "total" },
        "",
        {
          text: formatCurrency(RRHH_STORE.totalUno),
          alignment: "right",
          style: "total",
        },
      ],
    ];

    const secondBody = [
      ["", "", ""],
      [
        {
          text: "Devolución CC (" + RRHH_STORE.descuentoCC + "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.devolucionCC),
          alignment: "right",
          style: "item",
        },
      ],
      [
        {
          text:
            "Area " +
            RRHH_STORE.MAP_STAFF_ROLE_OPTIONS[
              RRHH_STORE.currentEmployee.main_role_id
            ].label +
            " (" +
            (
              (RRHH_STORE.rolPrincipalValue / RRHH_STORE.totalUno) *
              100
            ).toFixed(2) +
            "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.rolPrincipalValue),
          alignment: "right",
          style: "item",
        },
      ],
      [
        { text: "Experiencia (" + RRHH_STORE.staffExp + "%)", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.staffExpValue),
          alignment: "right",
          style: "item",
        },
      ],
    ];

    if (RRHH_STORE.viaticoAvailable) {
      secondBody.push([
        {
          text:
            "Viatico (" +
            ((RRHH_STORE.viatico / RRHH_STORE.totalUno) * 100).toFixed(2) +
            "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.viatico),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.presentismoAvailable) {
      secondBody.push([
        {
          text:
            "Presentismo (" +
            ((RRHH_STORE.presentismo / RRHH_STORE.totalUno) * 100).toFixed(2) +
            "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.presentismo),
          alignment: "right",
          style: "item",
        },
      ]);
    } else {
      secondBody.push([
        {
          text:
            "Presentismo (" +
            ((RRHH_STORE.presentismo / RRHH_STORE.totalUno) * 100).toFixed(2) +
            "%)",
          style: "item",
        },
        "",
        { text: "-", alignment: "right", style: "item" },
      ]);
    }

    secondBody.push([
      {
        text:
          "Antiguedad (" +
          ((RRHH_STORE.antiguedadValue / RRHH_STORE.totalUno) * 100).toFixed(
            2
          ) +
          "%)",
        style: "item",
      },
      "",
      {
        text: formatCurrency(RRHH_STORE.antiguedadValue),
        alignment: "right",
        style: "item",
      },
    ]);

    if (RRHH_STORE.ayudaTransporte) {
      secondBody.push([
        {
          text:
            "Ayuda Transporte (" +
            ((RRHH_STORE.ayudaTransporte / RRHH_STORE.totalUno) * 100).toFixed(
              2
            ) +
            "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.ayudaTransporte),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.respCierre) {
      secondBody.push([
        {
          text:
            "Responsable cierre (" +
            ((RRHH_STORE.respCierre / RRHH_STORE.totalUno) * 100).toFixed(2) +
            "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.respCierre),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.refuerzo) {
      secondBody.push([
        {
          text:
            "Refuerzo (" +
            ((RRHH_STORE.refuerzo / RRHH_STORE.totalUno) * 100).toFixed(2) +
            "%)",
          style: "item",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.refuerzo),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.plusGu) {
      secondBody.push([
        { text: "Plus Guelcom", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.plusGu),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.feriados) {
      secondBody.push([
        { text: "Feriados", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.feriados),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.vacaciones) {
      secondBody.push([
        { text: "Vacaciones", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.vacaciones),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.sac) {
      secondBody.push([
        { text: "SAC", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.sac),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    RRHH_STORE.customRowsTot2.forEach((row) => {
      secondBody.push([
        { text: row.label, style: "item" },
        "",
        { text: formatCurrency(row.value), alignment: "right", style: "item" },
      ]);
    });

    secondBody.push(
      [
        { text: "Total 2", style: "total" },
        "",
        {
          text: formatCurrency(RRHH_STORE.totalDos),
          alignment: "right",
          style: "total",
        },
      ],
      [
        { text: "TOT1 + TOT2", style: "total" },
        "",
        {
          text: formatCurrency(RRHH_STORE.totalTres),
          alignment: "right",
          style: "total",
        },
      ]
    );

    const thirdBody = [
      ["", "", ""],
      [
        { text: "Cuenta Corriente", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.cuentaCorriente),
          alignment: "right",
          style: "item",
        },
      ],
    ];

    if (RRHH_STORE.recibo) {
      thirdBody.push([
        { text: "Recibo", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.recibo),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    if (RRHH_STORE.reciboSac) {
      thirdBody.push([
        { text: "Recibo SAC", style: "item" },
        "",
        {
          text: formatCurrency(RRHH_STORE.reciboSac),
          alignment: "right",
          style: "item",
        },
      ]);
    }

    RRHH_STORE.anticiposRows.forEach((row) => {
      thirdBody.push([
        {
          text: "Adelanto: " + useDateFormat(row.date, "DD-MM-YYYY").value,
          style: "item",
        },
        "",
        { text: formatCurrency(row.value), alignment: "right", style: "item" },
      ]);
    });

    RRHH_STORE.customRowsTot3.forEach((row) => {
      thirdBody.push([
        { text: row.label, style: "item" },
        "",
        { text: formatCurrency(row.value), alignment: "right", style: "item" },
      ]);
    });

    thirdBody.push([
      { text: "TOTAL ANTICIPOS", style: "total" },
      "",
      {
        text: formatCurrency(RRHH_STORE.totalAnticipos),
        alignment: "right",
        style: "total",
      },
    ]);

    const totalNeto = [
      [
        {
          text: "TOTAL NETO (TOT3 - TOT ANTICIPOS)",
          style: "total",
        },
        "",
        {
          text: formatCurrency(RRHH_STORE.totalNeto),
          alignment: "right",
          style: "superTotal",
        },
      ],
    ];

    docDefinition.content.push({
      layout: "headerLineOnly",
      table: {
        headerRows: 1,
        widths: ["40%", "30%", "30%"],
        body: firstBody,
      },
      margin: [0, 0, 0, 10],
    });

    docDefinition.content.push({
      layout: "headerLineOnly",
      table: {
        headerRows: 1,
        widths: ["40%", "30%", "30%"],
        body: secondBody,
      },
      margin: [0, 0, 0, 10],
    });

    docDefinition.content.push({
      layout: "headerLineOnly",
      table: {
        headerRows: 1,
        widths: ["40%", "30%", "30%"],
        body: thirdBody,
      },
      margin: [0, 0, 0, 10],
    });

    docDefinition.content.push({
      layout: "headerLineOnly",
      table: {
        headerRows: 1,
        widths: ["40%", "30%", "30%"],
        body: totalNeto,
      },
      margin: [0, 0, 0, 10],
    });

    pdfMake
      .createPdf(docDefinition)
      .download(
        "recibo" +
          fechaSalario +
          " - " +
          "Resumen Salarial, " +
          (RRHH_STORE.staffName || "") +
          ".pdf"
      );
  }

  return {
    print,
  };
}
