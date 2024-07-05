import useSupaApi from "../useSupaApi";
import { useRRHHStore } from "@/stores/useRRHHStore";
import { useAuthStore } from "@/stores/useAuthStore";
import useDatetime from "@/composables/utils/useDateTime";

const RRHH_STORE = useRRHHStore();
const AUTH_STORE = useAuthStore();

const {
  getLastBaseHourValue,
  getLastViaticoValue,
  getStaffRoleOptions,
  getLastPresentismoValue,
  getProfileFromFingerId,
  getStaffExpTitulos,
  getStaffExpExterna,
  getStaffExpGuelcom,
  getStaffRoles,
  getStaffStatusHistory,
  getStaffAntiguedad,
  getStaffDistance,
  getLastSuperYpf,
  getStaffPlusGu,
  getLastRefuerzo,
  getLastRespCierre,
  getStaffDescuentoCC,
} = useSupaApi();

const { extractActivePeriods, calculateTotalTime } = useDatetime();

export default function useRRHH() {
  function differenceInHours(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
  }
  async function _getLastBaseHourValue() {
    try {
      let res = await getLastBaseHourValue();
      RRHH_STORE.setLastBaseHourValue(res);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function _getLastViaticoValue() {
    try {
      let res = await getLastViaticoValue();
      RRHH_STORE.setLastViaticoValue(res);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function _getLastPresentismoValue() {
    try {
      let res = await getLastPresentismoValue();
      RRHH_STORE.setLastPresentismoValue(res);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function _getStaffRoleOptions() {
    try {
      let res = await getStaffRoleOptions();
      buildMapStaffRoleOptions(res);
      RRHH_STORE.setStaffRoleOptions(res);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function _getLastSuperYpf() {
    try {
      let res = await getLastSuperYpf();
      RRHH_STORE.setLastSuperYpf(res);
    } catch (error) {
      throw new Error(error);
    }
  }

  function buildMapStaffRoleOptions(staffRoleOptions) {
    const MAP_STAFF_ROLE_OPTIONS = {};
    staffRoleOptions.forEach((role) => {
      MAP_STAFF_ROLE_OPTIONS[role.staff_role_id] = role;
    });
    RRHH_STORE.setMapStaffRoleOptions(MAP_STAFF_ROLE_OPTIONS);
  }

  function handleTotalUno() {
    if (!RRHH_STORE.lastBaseHourValue || !RRHH_STORE.totalHours) {
      RRHH_STORE.setTotalUno(0);
      return;
    }
    RRHH_STORE.setTotalUno(
      RRHH_STORE.lastBaseHourValue * RRHH_STORE.totalHours
    );
  }

  function handleTotalDos() {
    let customRows2 = 0;
    if (RRHH_STORE.customRowsTot2.length > 0) {
      for (let row of RRHH_STORE.customRowsTot2) {
        customRows2 += row.value;
      }
    }

    RRHH_STORE.setTotalDos(
      (RRHH_STORE.devolucionCC || 0) +
        (RRHH_STORE.rolPrincipalValue || 0) +
        (RRHH_STORE.staffExpValue || 0) +
        (RRHH_STORE.viatico || 0) +
        (RRHH_STORE.presentismo || 0) +
        (RRHH_STORE.antiguedadValue || 0) +
        (RRHH_STORE.ayudaTransporte || 0) +
        (RRHH_STORE.respCierre || 0) +
        (RRHH_STORE.refuerzo || 0) +
        (RRHH_STORE.plusGu || 0) +
        (RRHH_STORE.feriados || 0) +
        (RRHH_STORE.vacaciones || 0) +
        (RRHH_STORE.sac || 0) +
        customRows2
    );
  }

  function handleTotalTres() {
    RRHH_STORE.setTotalTres(
      (RRHH_STORE.totalDos || 0) + (RRHH_STORE.totalUno || 0)
    );
  }

  function handleTotalAnticipos() {
    let customRows3 = 0;
    let anticipos = 0;

    if (RRHH_STORE.customRowsTot3.length > 0) {
      for (let row of RRHH_STORE.customRowsTot3) {
        customRows3 += row.value;
      }
    }

    if (RRHH_STORE.anticiposRows.length > 0) {
      for (let row of RRHH_STORE.anticiposRows) {
        anticipos += row.value;
      }
    }

    RRHH_STORE.setTotalAnticipos(
      (RRHH_STORE.cuentaCorriente || 0) +
        (RRHH_STORE.recibo || 0) +
        (RRHH_STORE.reciboSac || 0) +
        customRows3 +
        anticipos
    );
  }

  function handleTotalNeto() {
    RRHH_STORE.setTotalNeto(
      (RRHH_STORE.totalTres || 0) - (RRHH_STORE.totalAnticipos || 0)
    );
  }

  function handleTotales() {
    handleTotalUno();
    handleTotalDos();
    handleTotalTres();
    handleTotalAnticipos();
    handleTotalNeto();
    calcHoraReal();
  }

  function handlePresentismo() {
    if (!RRHH_STORE.presentismoAvailable) {
      RRHH_STORE.setPresentismo(0);
      return;
    }
    RRHH_STORE.setPresentismo(
      RRHH_STORE.lastPresentismoValue * RRHH_STORE.totalUno
    );
  }

  function handleViatico() {
    if (!RRHH_STORE.currentEmployee.viatico) {
      RRHH_STORE.setViatico(0);
      RRHH_STORE.setViaticoAvailable(false);
      return;
    }
    RRHH_STORE.setViaticoAvailable(true);
    RRHH_STORE.setViatico(RRHH_STORE.lastViaticoValue * RRHH_STORE.totalUno);
  }

  function handleRolPrincipal() {
    if (!RRHH_STORE.staffRoleOptions) {
      RRHH_STORE.setRolPrincipalPerc(null);
      return;
    }
    RRHH_STORE.setRolPrincipalPerc(
      RRHH_STORE.MAP_STAFF_ROLE_OPTIONS[RRHH_STORE.currentEmployee.main_role_id]
        .last_modifier_value
    );
  }

  function calcHoraReal() {
    //totHours
    let totHours = RRHH_STORE.totalHours || 0;
    //base ok
    let totUno = RRHH_STORE.totalUno || 0;
    //rol ok
    let mainRol = RRHH_STORE.rolPrincipalPerc * RRHH_STORE.totalUno || 0;
    RRHH_STORE.setRolPrincipalValue(mainRol);
    //exp ok
    let exp = (RRHH_STORE.staffExp * totUno) / 100 || 0;
    RRHH_STORE.setStaffExpValue(exp);
    //viatico
    let viatico = RRHH_STORE.viatico || 0;
    //presentismo
    let presentismo = RRHH_STORE.presentismo || 0;
    //plusGu
    let plusGu = RRHH_STORE.plusGu || 0;
    //refuerzo
    let refuerzo = RRHH_STORE.refuerzo || 0;
    //respCierre
    let respCierre = RRHH_STORE.respCierre || 0;
    //ayudaTransporte
    let ayudaTransporte = RRHH_STORE.ayudaTransporte || 0;
    //antiguedad
    let antiguedad = RRHH_STORE.antiguedadValue || 0;

    let horaReal =
      (totUno +
        mainRol +
        exp +
        viatico +
        presentismo +
        plusGu +
        refuerzo +
        respCierre +
        ayudaTransporte +
        antiguedad) /
      totHours;

    RRHH_STORE.setHoraReal(horaReal);
  }

  async function handleDevolucionCC() {
    try {
      let descuento = await getStaffDescuentoCC(RRHH_STORE.currentEmployee.id);
      let cc = RRHH_STORE.cuentaCorriente || 0;
      if (descuento) {
        RRHH_STORE.setDescuentoCC(descuento);
        RRHH_STORE.setCuentaCorriente(cc);
        RRHH_STORE.setDevolucionCC((cc * descuento) / 100);
      } else {
        RRHH_STORE.setDevolucionCC(0);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleRefuerzo() {
    try {
      let res = await getLastRefuerzo();
      if (RRHH_STORE.currentEmployee.refuerzo) {
        RRHH_STORE.setRefuerzo((res * RRHH_STORE.totalUno) / 100);
      } else {
        RRHH_STORE.setRefuerzo(0);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleRespCierre() {
    try {
      let res = await getLastRespCierre();
      if (RRHH_STORE.currentEmployee.resp_cierre) {
        RRHH_STORE.setRespCierre((res * RRHH_STORE.totalUno) / 100);
      } else {
        RRHH_STORE.setRespCierre(0);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffData(staffFingerId) {
    try {
      let res = await getProfileFromFingerId(staffFingerId);
      RRHH_STORE.setCurrentEmployee(res);
    } catch (error) {
      RRHH_STORE.setCurrentEmployee(null);
      throw new Error(error);
    }
  }

  async function handleStaffExp() {
    const idStaff = RRHH_STORE.currentEmployee.id;
    let expTitulos, expExterna, expGuelcom, roles;
    try {
      expTitulos = await getStaffExpTitulos(idStaff);
      expExterna = await getStaffExpExterna(idStaff);
      expGuelcom = await getStaffExpGuelcom(idStaff);
      roles = await getStaffRoles(idStaff);

      RRHH_STORE.setStaffExp(
        Number(expTitulos.value) +
          Number(expExterna.value) +
          Number(expGuelcom.value) +
          Number(roles.length * 2)
      );
    } catch (error) {
      RRHH_STORE.setStaffExp(0);
      throw new Error(error);
    }
  }

  async function handleAntiguedad() {
    try {
      let staffStatusHistory = await getStaffStatusHistory(
        RRHH_STORE.currentEmployee.id
      );
      let activePeriods = extractActivePeriods(staffStatusHistory);
      let totActivity = calculateTotalTime(activePeriods);
      RRHH_STORE.setAntiguedad(Math.floor(totActivity) * 2);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleCustomAntiguedad() {
    // PRENDERE IL VALORE SU profiles.antiguedad
    try {
      let antiguedadPerc = await getStaffAntiguedad(
        RRHH_STORE.currentEmployee.id
      );
      let aniosTrabajados = RRHH_STORE.currentEmployee.antiguedad;
      if (!aniosTrabajados) aniosTrabajados = 0;

      RRHH_STORE.setAntiguedadValue(
        (RRHH_STORE.totalUno * antiguedadPerc.value) / 100
      );
      RRHH_STORE.setAntiguedad(antiguedadPerc.value);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handlePlusGuelcom() {
    try {
      let res = await getStaffPlusGu(RRHH_STORE.currentEmployee.id);
      if (res.value) {
        RRHH_STORE.setPlusGu(res.value);
      } else {
        RRHH_STORE.setPlusGu(0);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleAyudaTransporte() {
    try {
      let distance = await getStaffDistance(RRHH_STORE.currentEmployee.id);

      RRHH_STORE.setAyudaTransporte(
        ((RRHH_STORE.lastSuperYpf * distance) / 10) *
          RRHH_STORE.numberOfDaysInShifts
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  function handleFeriados() {
    RRHH_STORE.setFeriadosAvailable(RRHH_STORE.currentEmployee.feriados);
    if (RRHH_STORE.currentEmployee.feriados) {
      RRHH_STORE.setFeriados(
        RRHH_STORE.feriadoTime * RRHH_STORE.lastBaseHourValue
      );
    } else {
      RRHH_STORE.setFeriados(0);
    }
  }

  function handleVacaciones() {}
  function handleSac() {}

  async function getBaseDataRRHH(force = false) {
    //check if last call is less than 24 hours ago
    if (
      differenceInHours(new Date(), new Date(RRHH_STORE.baseDataLastCall)) <
        24 &&
      !force
    )
      return;

    //set last call
    RRHH_STORE.setBaseDataLastCall(new Date());

    //get all common data for all staff
    await Promise.all([
      _getStaffRoleOptions(),
      _getLastBaseHourValue(),
      _getLastViaticoValue(),
      _getLastPresentismoValue(),
      _getLastSuperYpf(),
    ]);
  }

  async function calcResumenSalarial() {
    try {
      await getBaseDataRRHH();

      //1.1 OK
      // hora base (in getBaseDataRRHH)

      //1.3 OK
      // tot horas
      // total 1
      handleTotalUno();

      //2.1 OK
      handlePresentismo();
      //2.2 OK
      handleViatico();
      //2.3 OK
      handleRolPrincipal();
      //2.4 OK
      await handleStaffExp();
      //2.5 OK
      handleCustomAntiguedad();
      //2.6 OK
      handleAyudaTransporte();
      //2.7 OK
      handleRespCierre();
      //2.8 OK
      await handleRefuerzo();
      //2.9 OK
      await handlePlusGuelcom();
      //2.10
      await handleDevolucionCC();
      //2.11
      handleFeriados();
      //2.12
      handleVacaciones(); // non fa nulla
      //2.13
      handleSac(); // non fa nulla
      // total 2 OK
      handleTotalDos();

      // total 3
      handleTotalTres();

      //1.2 OK
      calcHoraReal();

      //4.1
      //4.2
      //4.3
      //4.4
      //4
      handleTotalAnticipos();

      //5 total neto
      handleTotales();
    } catch (error) {
      throw new Error(error);
    } finally {
    }
  }

  return {
    calcResumenSalarial,
    handlePresentismo,
    handleTotales,
  };
}
