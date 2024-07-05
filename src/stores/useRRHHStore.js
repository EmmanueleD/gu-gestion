import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useRRHHStore = defineStore("RRHH", () => {
  //MAPS
  const MAP_STAFF_ROLE_OPTIONS = computed(() => {
    if (!_MAP_STAFF_ROLE_OPTIONS.value) {
      setMapStaffRoleOptions(
        JSON.parse(localStorage.getItem("gu_ge:mapStaffRoleOptions"))
      );
    }
    return _MAP_STAFF_ROLE_OPTIONS.value;
  });

  //REFS
  const _MAP_STAFF_ROLE_OPTIONS = ref(null);
  const _baseDataLastCall = ref(null);
  const _sessionToken = ref(null);
  const _currentEmployee = ref(null);
  const _freeFingerId = ref(null);
  const _staffRoleOptions = ref(null);
  const _lastBaseHourValue = ref(null);
  const _lastViaticoValue = ref(null);
  const _lastPresentismoValue = ref(null);
  const _fingerId = ref(null);
  const _totalHours = ref(null);
  const _staffName = ref(null);
  const _totalUno = ref(null);
  const _presentismoAvailable = ref(true);
  const _presentismo = ref(null);
  const _viatico = ref(null);
  const _rolPrincipalPerc = ref(null);
  const _rolPrincipalValue = ref(null);
  const _staffExp = ref(null);
  const _antiguedad = ref(null);
  const _antiguedadValue = ref(null);
  const _lastSuperYpf = ref(null);
  const _ayudaTransporte = ref(null);
  const _plusGu = ref(null);
  const _refuerzo = ref(null);
  const _respCierre = ref(null);
  const _horaReal = ref(null);
  const _totalDos = ref(null);
  const _staffExpValue = ref(null);
  const _late = ref(null);
  const _viaticoAvailable = ref(true);
  const _feriadosAvailable = ref(false);
  const _feriadoTime = ref(0);
  const _feriados = ref(null);
  const _numberOfDaysInShifts = ref(null);
  const _cuentaCorriente = ref(null);
  const _devolucionCC = ref(null);
  const _descuentoCC = ref(null);
  const _vacaciones = ref(null);
  const _sac = ref(null);
  const _totalTres = ref(null);
  const _recibo = ref(0);
  const _reciboSac = ref(0);
  const _totalAnticipos = ref(0);
  const _totalNeto = ref(null);
  const _customRowsTot2 = ref([]);
  const _anticiposRows = ref([]);
  const _customRowsTot3 = ref([]);
  const _turnos = ref([]);
  const _idPaycheck = ref(null);

  //COMPUTED
  const baseDataLastCall = computed(() => {
    if (!_baseDataLastCall.value) {
      setBaseDataLastCall(
        JSON.parse(localStorage.getItem("gu_ge:baseDataLastCall"))
      );
    }
    return _baseDataLastCall.value;
  });
  const sessionToken = computed(() => {
    if (!_sessionToken.value) {
      setSessionToken(JSON.parse(localStorage.getItem("gu_ge:sessionToken")));
    }
    return _sessionToken.value;
  });
  const currentEmployee = computed(() => {
    if (!_currentEmployee.value) {
      setCurrentEmployee(
        JSON.parse(localStorage.getItem("gu_ge:currentEmployee"))
      );
    }
    return _currentEmployee.value;
  });
  const freeFingerId = computed(() => {
    if (!_freeFingerId.value) {
      setFreeFingerId(JSON.parse(localStorage.getItem("gu_ge:freeFingerId")));
    }
    return _freeFingerId.value;
  });
  const staffRoleOptions = computed(() => {
    if (!_staffRoleOptions.value) {
      setStaffRoleOptions(
        JSON.parse(localStorage.getItem("gu_ge:staffRoleOptions"))
      );
    }
    return _staffRoleOptions.value;
  });
  const lastBaseHourValue = computed(() => {
    if (!_lastBaseHourValue.value) {
      setLastBaseHourValue(
        JSON.parse(localStorage.getItem("gu_ge:lastBaseHourValue"))
      );
    }
    return _lastBaseHourValue.value;
  });
  const lastViaticoValue = computed(() => {
    if (!_lastViaticoValue.value) {
      setLastViaticoValue(
        JSON.parse(localStorage.getItem("gu_ge:lastViaticoValue"))
      );
    }
    return _lastViaticoValue.value;
  });
  const lastPresentismoValue = computed(() => {
    if (!_lastPresentismoValue.value) {
      setLastPresentismoValue(
        JSON.parse(localStorage.getItem("gu_ge:lastPresentismoValue"))
      );
    }
    return _lastPresentismoValue.value;
  });
  const fingerId = computed(() => {
    if (!_fingerId.value) {
      setFingerId(JSON.parse(localStorage.getItem("gu_ge:fingerId")));
    }
    return _fingerId.value;
  });
  const totalHours = computed(() => {
    if (!_totalHours.value) {
      setTotalHours(JSON.parse(localStorage.getItem("gu_ge:totalHours")));
    }
    return _totalHours.value;
  });
  const staffName = computed(() => {
    if (!_staffName.value) {
      setStaffName(JSON.parse(localStorage.getItem("gu_ge:staffName")));
    }
    return _staffName.value;
  });
  const totalUno = computed(() => {
    if (!_totalUno.value) {
      setTotalUno(JSON.parse(localStorage.getItem("gu_ge:totalUno") || 0));
    }
    return _totalUno.value;
  });
  const presentismoAvailable = computed(() => {
    if (
      _presentismoAvailable.value === null ||
      _presentismoAvailable.value === undefined
    ) {
      setPresentismoAvailable(
        JSON.parse(localStorage.getItem("gu_ge:presentismoAvailable"))
      );
    }
    return _presentismoAvailable.value;
  });
  const presentismo = computed(() => {
    if (!_presentismo.value) {
      setPresentismo(JSON.parse(localStorage.getItem("gu_ge:presentismo")));
    }
    return _presentismo.value;
  });
  const viatico = computed(() => {
    if (!_viatico.value) {
      setViatico(JSON.parse(localStorage.getItem("gu_ge:viatico")));
    }
    return _viatico.value;
  });
  const rolPrincipalPerc = computed(() => {
    if (!_rolPrincipalPerc.value) {
      setRolPrincipalPerc(
        JSON.parse(localStorage.getItem("gu_ge:rolPrincipalPerc"))
      );
    }
    return _rolPrincipalPerc.value;
  });
  const rolPrincipalValue = computed(() => {
    if (!_rolPrincipalValue.value) {
      setRolPrincipalValue(
        JSON.parse(localStorage.getItem("gu_ge:rolPrincipalValue"))
      );
    }
    return _rolPrincipalValue.value;
  });
  const staffExp = computed(() => {
    if (!_staffExp.value) {
      setStaffExp(JSON.parse(localStorage.getItem("gu_ge:staffExp")));
    }
    return _staffExp.value;
  });
  const antiguedad = computed(() => {
    if (!_antiguedad.value) {
      setAntiguedad(JSON.parse(localStorage.getItem("gu_ge:antiguedad")));
    }
    return _antiguedad.value;
  });
  const antiguedadValue = computed(() => {
    if (!_antiguedadValue.value) {
      setAntiguedadValue(
        JSON.parse(localStorage.getItem("gu_ge:antiguedadValue"))
      );
    }
    return _antiguedadValue.value;
  });
  const lastSuperYpf = computed(() => {
    if (!_lastSuperYpf.value) {
      setLastSuperYpf(JSON.parse(localStorage.getItem("gu_ge:lastSuperYpf")));
    }
    return _lastSuperYpf.value;
  });
  const ayudaTransporte = computed(() => {
    if (!_ayudaTransporte.value) {
      setAyudaTransporte(
        JSON.parse(localStorage.getItem("gu_ge:ayudaTransporte"))
      );
    }
    return _ayudaTransporte.value;
  });
  const plusGu = computed(() => {
    if (!_plusGu.value) {
      setPlusGu(JSON.parse(localStorage.getItem("gu_ge:plusGu")));
    }
    return _plusGu.value;
  });
  const refuerzo = computed(() => {
    if (!_refuerzo.value) {
      setRefuerzo(JSON.parse(localStorage.getItem("gu_ge:refuerzo")));
    }
    return _refuerzo.value;
  });
  const respCierre = computed(() => {
    if (!_respCierre.value) {
      setRespCierre(JSON.parse(localStorage.getItem("gu_ge:respCierre")));
    }
    return _respCierre.value;
  });
  const horaReal = computed(() => {
    if (!_horaReal.value) {
      setHoraReal(JSON.parse(localStorage.getItem("gu_ge:horaReal")));
    }
    return _horaReal.value;
  });
  const totalDos = computed(() => {
    if (!_totalDos.value) {
      setTotalDos(JSON.parse(localStorage.getItem("gu_ge:totalDos")));
    }
    return _totalDos.value;
  });
  const staffExpValue = computed(() => {
    if (!_staffExpValue.value) {
      setStaffExpValue(JSON.parse(localStorage.getItem("gu_ge:staffExpValue")));
    }
    return _staffExpValue.value;
  });
  const late = computed(() => {
    if (!_late.value) {
      setLate(JSON.parse(localStorage.getItem("gu_ge:late")));
    }
    return _late.value;
  });
  const viaticoAvailable = computed(() => {
    if (
      _viaticoAvailable.value === null ||
      _viaticoAvailable.value === undefined
    ) {
      setViaticoAvailable(
        JSON.parse(localStorage.getItem("gu_ge:viaticoAvailable"))
      );
    }
    return _viaticoAvailable.value;
  });
  const feriadosAvailable = computed(() => {
    if (!_feriadosAvailable.value) {
      setFeriadosAvailable(
        JSON.parse(localStorage.getItem("gu_ge:feriadosAvailable"))
      );
    }
    return _feriadosAvailable.value;
  });
  const feriadoTime = computed(() => {
    if (_feriadoTime.value === null || _feriadoTime.value === undefined) {
      setFeriadoTime(JSON.parse(localStorage.getItem("gu_ge:feriadoTime")));
    }
    return _feriadoTime.value;
  });
  const feriados = computed(() => {
    if (!_feriados.value) {
      setFeriados(JSON.parse(localStorage.getItem("gu_ge:feriados")));
    }
    return _feriados.value;
  });
  const numberOfDaysInShifts = computed(() => {
    if (!_numberOfDaysInShifts.value) {
      setNumberOfDaysInShifts(
        JSON.parse(localStorage.getItem("gu_ge:numberOfDaysInShifts"))
      );
    }
    return _numberOfDaysInShifts.value;
  });
  const cuentaCorriente = computed(() => {
    if (
      _cuentaCorriente.value === null ||
      _cuentaCorriente.value === undefined
    ) {
      setCuentaCorriente(
        JSON.parse(localStorage.getItem("gu_ge:cuentaCorriente"))
      );
    }
    return _cuentaCorriente.value;
  });
  const devolucionCC = computed(() => {
    if (_devolucionCC.value === null || _devolucionCC.value === undefined) {
      setDevolucionCC(JSON.parse(localStorage.getItem("gu_ge:devolucionCC")));
    }
    return _devolucionCC.value;
  });
  const descuentoCC = computed(() => {
    if (_descuentoCC.value === null || _descuentoCC.value === undefined) {
      setDescuentoCC(JSON.parse(localStorage.getItem("gu_ge:descuentoCC")));
    }
    return _descuentoCC.value;
  });
  const vacaciones = computed(() => {
    if (_vacaciones.value === null || _vacaciones.value === undefined) {
      setVacaciones(JSON.parse(localStorage.getItem("gu_ge:vacaciones")));
    }
    return _vacaciones.value;
  });
  const sac = computed(() => {
    if (_sac.value === null || _sac.value === undefined) {
      setSac(JSON.parse(localStorage.getItem("gu_ge:sac")));
    }
    return _sac.value;
  });
  const totalTres = computed(() => {
    if (_totalTres.value === null || _totalTres.value === undefined) {
      setTotalTres(JSON.parse(localStorage.getItem("gu_ge:totalTres")));
    }
    return _totalTres.value;
  });
  const recibo = computed(() => {
    if (_recibo.value === null || _recibo.value === undefined) {
      setRecibo(JSON.parse(localStorage.getItem("gu_ge:recibo")));
    }
    return _recibo.value;
  });
  const reciboSac = computed(() => {
    if (_reciboSac.value === null || _reciboSac.value === undefined) {
      setReciboSac(JSON.parse(localStorage.getItem("gu_ge:reciboSac")));
    }
    return _reciboSac.value;
  });
  const totalAnticipos = computed(() => {
    if (_totalAnticipos.value === null || _totalAnticipos.value === undefined) {
      setTotalAnticipos(
        JSON.parse(localStorage.getItem("gu_ge:totalAnticipos"))
      );
    }
    return _totalAnticipos.value;
  });
  const totalNeto = computed(() => {
    if (_totalNeto.value === null || _totalNeto.value === undefined) {
      setTotalNeto(JSON.parse(localStorage.getItem("gu_ge:totalNeto")));
    }
    return _totalNeto.value;
  });
  const customRowsTot2 = computed(() => {
    if (_customRowsTot2.value === null || _customRowsTot2.value === undefined) {
      setCustomRowsTot2(
        JSON.parse(localStorage.getItem("gu_ge:customRowsTot2"))
      );
    }
    return _customRowsTot2.value;
  });
  const anticiposRows = computed(() => {
    if (_anticiposRows.value === null || _anticiposRows.value === undefined) {
      setAnticiposRows(JSON.parse(localStorage.getItem("gu_ge:anticiposRows")));
    }
    return _anticiposRows.value;
  });
  const customRowsTot3 = computed(() => {
    if (_customRowsTot3.value === null || _customRowsTot3.value === undefined) {
      setCustomRowsTot3(
        JSON.parse(localStorage.getItem("gu_ge:customRowsTot3"))
      );
    }
    return _customRowsTot3.value;
  });
  const turnos = computed(() => {
    if (_turnos.value === null || _turnos.value === undefined) {
      setTurnos(JSON.parse(localStorage.getItem("gu_ge:turnos")));
    }
    return _turnos.value;
  });
  const idPaycheck = computed(() => {
    if (_idPaycheck.value === null || _idPaycheck.value === undefined) {
      setIdPaycheck(JSON.parse(localStorage.getItem("gu_ge:idPaycheck")));
    }
    return _idPaycheck.value;
  });

  //FUNCTIONS
  function clearAll() {
    setBaseDataLastCall(null);
    setSessionToken(null);
    setCurrentEmployee(null);
    setFreeFingerId(null);
    setStaffRoleOptions(null);
    setLastBaseHourValue(null);
    setLastViaticoValue(null);
    setLastPresentismoValue(null);
    setFingerId(null);
    setTotalHours(null);
    setStaffName(null);
    setTotalUno(null);
    setPresentismoAvailable(null);
    setPresentismo(null);
    setViatico(null);
    setRolPrincipalPerc(null);
    setRolPrincipalValue(null);
    setStaffExp(null);
    setAntiguedad(null);
    setAntiguedadValue(null);
    setLastSuperYpf(null);
    setAyudaTransporte(null);
    setPlusGu(null);
    setRefuerzo(null);
    setRespCierre(null);
    setHoraReal(null);
    setTotalDos(null);
    setStaffExpValue(null);
    setViaticoAvailable(null);
    setFeriadosAvailable(null);
    setFeriadoTime(0);
    setFeriados(null);
    setNumberOfDaysInShifts(null);
    setLate(0);
    setFeriados(null);
    setCuentaCorriente(null);
    setDevolucionCC(null);
    setDescuentoCC(null);
    setVacaciones(null);
    setSac(null);
    setTotalTres(null);
    setRecibo(0);
    setReciboSac(0);
    setTotalAnticipos(0);
    setTotalNeto(0);
    setCustomRowsTot2([]);
    setAnticiposRows([]);
    setCustomRowsTot3([]);
    setTurnos([]);
    setIdPaycheck(null);
  }
  function setBaseDataLastCall(value) {
    localStorage.removeItem("gu_ge:baseDataLastCall");
    _baseDataLastCall.value = null;
    localStorage.setItem("gu_ge:baseDataLastCall", JSON.stringify(value));
    _baseDataLastCall.value = value;
  }
  function setSessionToken(token) {
    localStorage.removeItem("gu_ge:sessionToken");
    _sessionToken.value = null;
    localStorage.setItem("gu_ge:sessionToken", JSON.stringify(token));
    _sessionToken.value = token;
  }
  function setCurrentEmployee(employee) {
    localStorage.removeItem("gu_ge:currentEmployee");
    _currentEmployee.value = null;
    localStorage.setItem("gu_ge:currentEmployee", JSON.stringify(employee));
    _currentEmployee.value = employee;
  }

  function setFreeFingerId(fingerId) {
    localStorage.removeItem("gu_ge:freeFingerId");
    _freeFingerId.value = null;
    localStorage.setItem("gu_ge:freeFingerId", JSON.stringify(fingerId));
    _freeFingerId.value = fingerId;
  }

  function setStaffRoleOptions(options) {
    localStorage.removeItem("gu_ge:staffRoleOptions");
    _staffRoleOptions.value = null;
    localStorage.setItem("gu_ge:staffRoleOptions", JSON.stringify(options));
    _staffRoleOptions.value = options;
  }
  function setLastBaseHourValue(value) {
    localStorage.removeItem("gu_ge:lastBaseHourValue");
    _lastBaseHourValue.value = null;
    localStorage.setItem("gu_ge:lastBaseHourValue", JSON.stringify(value));
    _lastBaseHourValue.value = value;
  }
  function setLastViaticoValue(value) {
    localStorage.removeItem("gu_ge:lastViaticoValue");
    _lastViaticoValue.value = null;
    localStorage.setItem("gu_ge:lastViaticoValue", JSON.stringify(value));
    _lastViaticoValue.value = value;
  }
  function setLastPresentismoValue(value) {
    localStorage.removeItem("gu_ge:lastPresentismoValue");
    _lastPresentismoValue.value = null;
    localStorage.setItem("gu_ge:lastPresentismoValue", JSON.stringify(value));
    _lastPresentismoValue.value = value;
  }
  function setFingerId(fingerId) {
    localStorage.removeItem("gu_ge:fingerId");
    _fingerId.value = null;
    localStorage.setItem("gu_ge:fingerId", JSON.stringify(fingerId));
    _fingerId.value = fingerId;
  }
  function setTotalHours(hours) {
    localStorage.removeItem("gu_ge:totalHours");
    _totalHours.value = null;
    localStorage.setItem("gu_ge:totalHours", JSON.stringify(hours));
    _totalHours.value = hours;
  }
  function setStaffName(name) {
    localStorage.removeItem("gu_ge:staffName");
    _staffName.value = null;
    localStorage.setItem("gu_ge:staffName", JSON.stringify(name));
    _staffName.value = name;
  }
  function setTotalUno(value) {
    localStorage.removeItem("gu_ge:totalUno");
    _totalUno.value = null;
    localStorage.setItem("gu_ge:totalUno", JSON.stringify(value));
    _totalUno.value = value;
  }
  function setPresentismoAvailable(value) {
    localStorage.removeItem("gu_ge:presentismoAvailable");
    _presentismoAvailable.value = null;
    localStorage.setItem("gu_ge:presentismoAvailable", JSON.stringify(value));
    _presentismoAvailable.value = value;
  }
  function setPresentismo(value) {
    localStorage.removeItem("gu_ge:presentismo");
    _presentismo.value = null;
    localStorage.setItem("gu_ge:presentismo", JSON.stringify(value));
    _presentismo.value = value;
  }

  function setViatico(value) {
    localStorage.removeItem("gu_ge:viatico");
    _viatico.value = null;
    localStorage.setItem("gu_ge:viatico", JSON.stringify(value));
    _viatico.value = value;
  }
  function setRolPrincipalPerc(value) {
    localStorage.removeItem("gu_ge:rolPrincipalPerc");
    _rolPrincipalPerc.value = null;
    localStorage.setItem("gu_ge:rolPrincipalPerc", JSON.stringify(value));
    _rolPrincipalPerc.value = value;
  }
  function setRolPrincipalValue(value) {
    localStorage.removeItem("gu_ge:rolPrincipalValue");
    _rolPrincipalValue.value = null;
    localStorage.setItem("gu_ge:rolPrincipalValue", JSON.stringify(value));
    _rolPrincipalValue.value = value;
  }
  function setMapStaffRoleOptions(value) {
    localStorage.removeItem("gu_ge:mapStaffRoleOptions");
    _MAP_STAFF_ROLE_OPTIONS.value = null;
    localStorage.setItem("gu_ge:mapStaffRoleOptions", JSON.stringify(value));
    _MAP_STAFF_ROLE_OPTIONS.value = value;
  }
  function setStaffExp(value) {
    localStorage.removeItem("gu_ge:staffExp");
    _staffExp.value = null;
    localStorage.setItem("gu_ge:staffExp", JSON.stringify(value));
    _staffExp.value = value;
  }
  function setAntiguedad(value) {
    localStorage.removeItem("gu_ge:antiguedad");
    _antiguedad.value = null;
    localStorage.setItem("gu_ge:antiguedad", JSON.stringify(value));
    _antiguedad.value = value;
  }
  function setAntiguedadValue(value) {
    localStorage.removeItem("gu_ge:antiguedadValue");
    _antiguedadValue.value = null;
    localStorage.setItem("gu_ge:antiguedadValue", JSON.stringify(value));
    _antiguedadValue.value = value;
  }
  function setLastSuperYpf(value) {
    localStorage.removeItem("gu_ge:lastSuperYpf");
    _lastSuperYpf.value = null;
    localStorage.setItem("gu_ge:lastSuperYpf", JSON.stringify(value));
    _lastSuperYpf.value = value;
  }
  function setAyudaTransporte(value) {
    localStorage.removeItem("gu_ge:ayudaTransporte");
    _ayudaTransporte.value = null;
    localStorage.setItem("gu_ge:ayudaTransporte", JSON.stringify(value));
    _ayudaTransporte.value = value;
  }
  function setPlusGu(value) {
    localStorage.removeItem("gu_ge:plusGu");
    _plusGu.value = null;
    localStorage.setItem("gu_ge:plusGu", JSON.stringify(value));
    _plusGu.value = value;
  }
  function setRefuerzo(value) {
    localStorage.removeItem("gu_ge:refuerzo");
    _refuerzo.value = null;
    localStorage.setItem("gu_ge:refuerzo", JSON.stringify(value));
    _refuerzo.value = value;
  }
  function setRespCierre(value) {
    localStorage.removeItem("gu_ge:respCierre");
    _respCierre.value = null;
    localStorage.setItem("gu_ge:respCierre", JSON.stringify(value));
    _respCierre.value = value;
  }
  function setHoraReal(value) {
    localStorage.removeItem("gu_ge:horaReal");
    _horaReal.value = null;
    localStorage.setItem("gu_ge:horaReal", JSON.stringify(value));
    _horaReal.value = value;
  }
  function setTotalDos(value) {
    localStorage.removeItem("gu_ge:totalDos");
    _totalDos.value = null;
    localStorage.setItem("gu_ge:totalDos", JSON.stringify(value));
    _totalDos.value = value;
  }
  function setStaffExpValue(value) {
    localStorage.removeItem("gu_ge:staffExpValue");
    _staffExpValue.value = null;
    localStorage.setItem("gu_ge:staffExpValue", JSON.stringify(value));
    _staffExpValue.value = value;
  }
  function setLate(value) {
    localStorage.removeItem("gu_ge:late");
    _late.value = null;
    localStorage.setItem("gu_ge:late", JSON.stringify(value));
    _late.value = value;
  }
  function handleVariationLate(value) {
    let original = _late.value;
    original = original + value;
    setLate(original);
  }
  function setViaticoAvailable(value) {
    localStorage.removeItem("gu_ge:viaticoAvailable");
    _viaticoAvailable.value = null;
    localStorage.setItem("gu_ge:viaticoAvailable", JSON.stringify(value));
    _viaticoAvailable.value = value;
  }
  function setFeriadosAvailable(value) {
    localStorage.removeItem("gu_ge:feriadosAvailable");
    _feriadosAvailable.value = null;
    localStorage.setItem("gu_ge:feriadosAvailable", JSON.stringify(value));
    _feriadosAvailable.value = value;
  }
  function setFeriadoTime(value) {
    localStorage.removeItem("gu_ge:feriadoTime");
    _feriadoTime.value = null;
    localStorage.setItem("gu_ge:feriadoTime", JSON.stringify(value));
    _feriadoTime.value = value;
  }
  function handleVariationFeriatoTime(value) {
    let original = _feriadoTime.value;
    original = original + value;
    setFeriadoTime(original);
  }
  function setFeriados(value) {
    localStorage.removeItem("gu_ge:feriados");
    _feriados.value = null;
    localStorage.setItem("gu_ge:feriados", JSON.stringify(value));
    _feriados.value = value;
  }
  function setNumberOfDaysInShifts(value) {
    localStorage.removeItem("gu_ge:numberOfDaysInShifts");
    _numberOfDaysInShifts.value = null;
    localStorage.setItem("gu_ge:numberOfDaysInShifts", JSON.stringify(value));
    _numberOfDaysInShifts.value = value;
  }
  function setCuentaCorriente(value) {
    localStorage.removeItem("gu_ge:cuentaCorriente");
    _cuentaCorriente.value = null;
    localStorage.setItem("gu_ge:cuentaCorriente", JSON.stringify(value));
    _cuentaCorriente.value = value;
  }
  function setDevolucionCC(value) {
    localStorage.removeItem("gu_ge:devolucionCC");
    _devolucionCC.value = null;
    localStorage.setItem("gu_ge:devolucionCC", JSON.stringify(value));
    _devolucionCC.value = value;
  }
  function setDescuentoCC(value) {
    localStorage.removeItem("gu_ge:descuentoCC");
    _descuentoCC.value = null;
    localStorage.setItem("gu_ge:descuentoCC", JSON.stringify(value));
    _descuentoCC.value = value;
  }
  function setVacaciones(value) {
    localStorage.removeItem("gu_ge:vacaciones");
    _vacaciones.value = null;
    localStorage.setItem("gu_ge:vacaciones", JSON.stringify(value));
    _vacaciones.value = value;
  }
  function setSac(value) {
    localStorage.removeItem("gu_ge:sac");
    _sac.value = null;
    localStorage.setItem("gu_ge:sac", JSON.stringify(value));
    _sac.value = value;
  }
  function setTotalTres(value) {
    localStorage.removeItem("gu_ge:totalTres");
    _totalTres.value = null;
    localStorage.setItem("gu_ge:totalTres", JSON.stringify(value));
    _totalTres.value = value;
  }
  function setRecibo(value) {
    localStorage.removeItem("gu_ge:recibo");
    _recibo.value = null;
    localStorage.setItem("gu_ge:recibo", JSON.stringify(value));
    _recibo.value = value;
  }
  function setReciboSac(value) {
    localStorage.removeItem("gu_ge:reciboSac");
    _reciboSac.value = null;
    localStorage.setItem("gu_ge:reciboSac", JSON.stringify(value));
    _reciboSac.value = value;
  }
  function setTotalAnticipos(value) {
    localStorage.removeItem("gu_ge:totalAnticipos");
    _totalAnticipos.value = null;
    localStorage.setItem("gu_ge:totalAnticipos", JSON.stringify(value));
    _totalAnticipos.value = value;
  }
  function setTotalNeto(value) {
    localStorage.removeItem("gu_ge:totalNeto");
    _totalNeto.value = null;
    localStorage.setItem("gu_ge:totalNeto", JSON.stringify(value));
    _totalNeto.value = value;
  }
  function setCustomRowsTot2(value) {
    localStorage.removeItem("gu_ge:customRowsTot2");
    _customRowsTot2.value = null;
    localStorage.setItem("gu_ge:customRowsTot2", JSON.stringify(value));
    _customRowsTot2.value = value;
  }
  function setAnticiposRows(value) {
    localStorage.removeItem("gu_ge:anticiposRows");
    _anticiposRows.value = null;
    localStorage.setItem("gu_ge:anticiposRows", JSON.stringify(value));
    _anticiposRows.value = value;
  }
  function setCustomRowsTot3(value) {
    localStorage.removeItem("gu_ge:customRowsTot3");
    _customRowsTot3.value = null;
    localStorage.setItem("gu_ge:customRowsTot3", JSON.stringify(value));
    _customRowsTot3.value = value;
  }
  function setTurnos(value) {
    localStorage.removeItem("gu_ge:turnos");
    _turnos.value = null;
    localStorage.setItem("gu_ge:turnos", JSON.stringify(value));
    _turnos.value = value;
  }
  function setIdPaycheck(value) {
    localStorage.removeItem("gu_ge:idPaycheck");
    _idPaycheck.value = null;
    localStorage.setItem("gu_ge:idPaycheck", JSON.stringify(value));
    _idPaycheck.value = value;
  }

  return {
    clearAll,

    MAP_STAFF_ROLE_OPTIONS,
    setMapStaffRoleOptions,

    baseDataLastCall,
    setBaseDataLastCall,

    sessionToken,
    setSessionToken,

    currentEmployee,
    setCurrentEmployee,

    freeFingerId,
    setFreeFingerId,

    staffRoleOptions,
    setStaffRoleOptions,

    lastBaseHourValue,
    setLastBaseHourValue,

    lastViaticoValue,
    setLastViaticoValue,

    lastPresentismoValue,
    setLastPresentismoValue,

    fingerId,
    setFingerId,

    totalHours,
    setTotalHours,

    staffName,
    setStaffName,

    totalUno,
    setTotalUno,

    presentismoAvailable,
    setPresentismoAvailable,

    presentismo,
    setPresentismo,

    viatico,
    setViatico,

    rolPrincipalPerc,
    setRolPrincipalPerc,

    rolPrincipalValue,
    setRolPrincipalValue,

    staffExp,
    setStaffExp,

    antiguedad,
    setAntiguedad,

    antiguedadValue,
    setAntiguedadValue,

    lastSuperYpf,
    setLastSuperYpf,

    ayudaTransporte,
    setAyudaTransporte,

    plusGu,
    setPlusGu,

    refuerzo,
    setRefuerzo,

    respCierre,
    setRespCierre,

    horaReal,
    setHoraReal,

    totalDos,
    setTotalDos,

    staffExpValue,
    setStaffExpValue,

    late,
    setLate,
    handleVariationLate,

    viaticoAvailable,
    setViaticoAvailable,

    feriadosAvailable,
    setFeriadosAvailable,

    feriadoTime,
    setFeriadoTime,
    handleVariationFeriatoTime,

    feriados,
    setFeriados,

    numberOfDaysInShifts,
    setNumberOfDaysInShifts,

    cuentaCorriente,
    setCuentaCorriente,

    devolucionCC,
    setDevolucionCC,

    descuentoCC,
    setDescuentoCC,

    vacaciones,
    setVacaciones,

    sac,
    setSac,

    totalTres,
    setTotalTres,

    recibo,
    setRecibo,

    reciboSac,
    setReciboSac,

    totalAnticipos,
    setTotalAnticipos,

    totalNeto,
    setTotalNeto,

    customRowsTot2,
    setCustomRowsTot2,

    anticiposRows,
    setAnticiposRows,

    customRowsTot3,
    setCustomRowsTot3,

    turnos,
    setTurnos,

    idPaycheck,
    setIdPaycheck,
  };
});
