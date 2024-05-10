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
  const _staffExp = ref(null);
  const _antiguedad = ref(null);
  const _lastSuperYpf = ref(null);
  const _ayudaTransporte = ref(null);

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
      setTotalUno(JSON.parse(localStorage.getItem("gu_ge:totalUno")));
    }
    return _totalUno.value;
  });
  const presentismoAvailable = computed(() => {
    if (!_presentismoAvailable.value) {
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

  //FUNCTIONS
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

  return {
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

    staffExp,
    setStaffExp,

    antiguedad,
    setAntiguedad,

    lastSuperYpf,
    setLastSuperYpf,

    ayudaTransporte,
    setAyudaTransporte,
  };
});
