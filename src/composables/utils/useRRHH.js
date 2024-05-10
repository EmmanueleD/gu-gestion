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
    }
    RRHH_STORE.setTotalUno(
      RRHH_STORE.lastBaseHourValue * RRHH_STORE.totalHours
    );
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
      return;
    }
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

  async function getStaffData(staffFingerId) {
    try {
      let res = await getProfileFromFingerId(staffFingerId);
      RRHH_STORE.setCurrentEmployee(res);
    } catch (error) {
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
    } catch (error) {
      throw new Error(error);
    }

    RRHH_STORE.setStaffExp(
      Number(expTitulos.value) +
        Number(expExterna.value) +
        Number(expGuelcom.value) +
        Number(roles.length * 2)
    );
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
    try {
      let res = await getStaffAntiguedad(RRHH_STORE.currentEmployee.id);
      RRHH_STORE.setAntiguedad(res.value);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleAyudaTransporte() {
    try {
      let distance = await getStaffDistance(RRHH_STORE.currentEmployee.id);
      RRHH_STORE.setAyudaTransporte(RRHH_STORE.lastSuperYpf * distance);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleFeriados() {
    if (!RRHH_STORE.feriados) {
      RRHH_STORE.setFeriados(0);
      return;
    }
  }

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
    Promise.all([
      _getStaffRoleOptions(),
      _getLastBaseHourValue(),
      _getLastViaticoValue(),
      _getLastPresentismoValue(),
      _getLastSuperYpf(),
    ]);
  }

  async function calcResumenSalarial(staffFingerId) {
    try {
      await getBaseDataRRHH();
      await getStaffData(staffFingerId);
    } catch (error) {
      throw new Error(error);
    } finally {
      // total 1
      handleTotalUno();

      // total 2
      handlePresentismo();
      handleViatico();
      handleRolPrincipal();
      handleStaffExp();
      handleAyudaTransporte();

      // total 3
      // handleAntiguedad(); Se calcula con los tiempos de status: ACTIVO
      handleCustomAntiguedad(); // Se calcula con un input custom del valor de antiguedad
      handleFeriados();
      // total anticipos

      // total neto
    }
  }

  return { calcResumenSalarial, handlePresentismo };
}
