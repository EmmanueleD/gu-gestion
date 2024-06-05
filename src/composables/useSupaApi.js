import useSupabaseDB from "./useSupabaseDB";
import { useRRHHStore } from "@/stores/useRRHHStore";

export default function useSupaApi() {
  const RRHH_STORE = useRRHHStore();

  const {
    dbResponseStatus,
    dbResp,
    get,
    getAll,
    getWithFilter,
    getLastOne,
    create,
    update,
    remove,
    supaLog,
  } = useSupabaseDB();

  async function wrapper(fn, message) {
    try {
      await fn();
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      } else {
        throw new Error(message);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // async function getEmployeeOptions() {
  //   try {
  //     await getWithFilter({
  //       table: "profiles",
  //       orderingBy: "createdAt",
  //       filter: {
  //         column: "gest_role_id",
  //         value: 6, // 6 is CUSTOMER
  //       },
  //       filterType: "neq",
  //     });
  //     if (dbResponseStatus.value === "OK") {
  //       return dbResp.value;
  //     } else {
  //       throw new Error("No se encontraron staff");
  //     }
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async function getEmployeeOptions() {
    return await wrapper(async () => {
      await getWithFilter({
        table: "profiles",
        orderingBy: "createdAt",
        filter: {
          column: "gest_role_id",
          value: 6, // 6 is CUSTOMER
        },
        filterType: "neq",
      });
    }, "getEmployeeOptions");
  }

  // async function getGestRoleOptions() {
  //   try {
  //     await getAll({
  //       table: "gest_role",
  //     });
  //     if (dbResponseStatus.value === "OK") {
  //       return dbResp.value;
  //     } else {
  //       throw new Error("No se encontraron roles");
  //     }
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async function getGestRoleOptions() {
    await wrapper(async () => {
      await getAll({
        table: "gest_role",
      });
    }, "getGestRoleOptions");
  }

  async function getStaffRoleOptions() {
    try {
      await getAll({
        table: "role_with_last_modifier",
        orderingBy: "label",
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      } else {
        throw new Error("getStaffRoleOptions");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStatusOptions() {
    try {
      await getAll({
        table: "status",
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      } else {
        throw new Error("getStatusOptions");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastSuperYpf() {
    try {
      await getLastOne({
        table: "mod_super_ypf",
        orderingBy: "created_at",
        ascending: false,
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastSuperYpf");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffRoles(staffId) {
    let idRoles = await getStaffIdRoles(staffId);
    let result = [];

    try {
      for (let role of idRoles) {
        await getWithFilter({
          table: "role_with_last_modifier",
          orderingBy: "last_modifier_value",
          filter: {
            column: "staff_role_id",
            value: role,
          },
        });

        if (dbResponseStatus.value === "OK") {
          result.push(dbResp.value[0]);
        } else {
          throw new Error("getStaffRoles");
        }
      }

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffIdRoles(staffId) {
    let result = [];
    try {
      await getWithFilter({
        table: "m2m_staff_role",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });
      if (dbResponseStatus.value === "OK") {
        for (let role of dbResp.value) {
          result.push(role.role_id);
        }
        return result;
      } else {
        throw new Error("getStaffIdRoles");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // async function setStaffIdRoles(staffId, roles) {
  //   // FIND ALL ROWS IN "m2m_staff_role" FOR THIS PROFILE
  //   await getWithFilter({
  //     table: "m2m_staff_role",
  //     orderingBy: "created_at",
  //     filter: {
  //       column: "profile_id",
  //       value: staffId,
  //     },
  //   });

  //   if (!dbResponseStatus.value === "OK") {
  //     throw new Error("setStaffIdRoles");
  //   }
  //   let originalRoles = dbResp.value;
  //   // REMOVE ALL ROWS ASSOCIATED WITH THIS PROFILE
  //   for (let role of originalRoles) {
  //     await remove({
  //       table: "m2m_staff_role",
  //       id: {
  //         key: "m2m_staff_role_id",
  //         value: role.m2m_staff_role_id,
  //       },
  //     });
  //   }
  //   // CREATE NEW ROWS FOR THE "roles" LIST IN
  //   for (let role of roles) {
  //     await create({
  //       table: "m2m_staff_role",
  //       data: {
  //         profile_id: staffId,
  //         role_id: role,
  //       },
  //     });
  //   }
  // }

  async function setStaffIdRoles(staffId, roles) {
    // FIND ALL ROWS IN "m2m_staff_role" FOR THIS PROFILE
    await getWithFilter({
      table: "m2m_staff_role",
      orderingBy: "created_at",
      filter: {
        column: "profile_id",
        value: staffId,
      },
    });

    if (!dbResponseStatus.value === "OK") {
      throw new Error("setStaffIdRoles");
    }
    let originalRoles = dbResp.value;

    let rolesToDelete = originalRoles.filter(
      (role) => !roles.includes(role.role_id)
    );

    let rolesToAdd = [];

    for (let r of roles) {
      if (!originalRoles.some((role) => role.role_id === r)) {
        rolesToAdd.push(r);
      }
    }

    for (let role of rolesToDelete) {
      await remove({
        table: "m2m_staff_role",
        id: {
          key: "m2m_staff_role_id",
          value: role.m2m_staff_role_id,
        },
      });
    }

    for (let role of rolesToAdd) {
      await create({
        table: "m2m_staff_role",
        data: {
          profile_id: staffId,
          role_id: role,
        },
      });
    }
  }

  async function getStaffMainRoleId(staffId) {
    try {
      await getWithFilter({
        table: "profiles",
        orderingBy: "createdAt",
        filter: {
          column: "id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].main_role_id;
      } else {
        throw new Error("getStaffMainRoleId");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffMainRole(staffId) {
    const roleOptions = await getStaffRoleOptions();
    const mainRoleId = await getStaffMainRoleId(staffId);

    return roleOptions.find((role) => role.staff_role_id === mainRoleId);
  }

  async function saveStaffMainRole(staffId, roleId) {
    try {
      await update({
        table: "profiles",
        id: {
          key: "id",
          value: staffId,
        },
        data: {
          main_role_id: roleId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffMainRole");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastStaffStatus(staffId) {
    try {
      await getWithFilter({
        table: "m2m_staff_status",
        orderingBy: "created_at",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].status_id;
      } else {
        throw new Error("getLastStaffStatus");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffStatus(staffId, status) {
    try {
      await create({
        table: "m2m_staff_status",
        data: {
          profile_id: staffId,
          status_id: status,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffStatus");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffExpTitulos(staffId) {
    try {
      await getWithFilter({
        table: "mod_exp_titulos",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value.length > 0
          ? dbResp.value[0]
          : { value: 0, description: "-" };
      } else {
        throw new Error("getStaffExpTitulos");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffExpTitulos(expTitulosData) {
    delete expTitulosData.mod_exp_titulos_id;
    try {
      await create({
        table: "mod_exp_titulos",
        data: expTitulosData,
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffExpTitulos");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffExpGuelcom(staffId) {
    try {
      await getWithFilter({
        table: "mod_exp_guelcom",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value.length > 0
          ? dbResp.value[0]
          : { value: 0, description: "-" };
      } else {
        throw new Error("getStaffExpGuelcom");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffExpGuelcom(expGuelcomData) {
    delete expGuelcomData.mod_exp_guelcom_id;
    try {
      await create({
        table: "mod_exp_guelcom",
        data: expGuelcomData,
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffExpGuelcom");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffAntiguedad(staffId) {
    try {
      await getWithFilter({
        table: "mod_staff_antiguedad",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value.length > 0
          ? dbResp.value[0]
          : { value: 0, description: "-" };
      } else {
        throw new Error("getStaffAntiguedad");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffAntiguedad(antiguedadData) {
    delete antiguedadData.mod_staff_antiguedad_id;
    try {
      await create({
        table: "mod_staff_antiguedad",
        data: antiguedadData,
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffAntiguedad");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffExpExterna(staffId) {
    try {
      await getWithFilter({
        table: "mod_exp_externa",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value.length > 0
          ? dbResp.value[0]
          : { value: 0, description: "-" };
      } else {
        throw new Error("getStaffExpExterna");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffExpExterna(expExternaData) {
    delete expExternaData.mod_exp_externa_id;
    try {
      await create({
        table: "mod_exp_externa",
        data: expExternaData,
      });
      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffExpExterna");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffDistance(staffId) {
    try {
      await getWithFilter({
        table: "mod_distance",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value.length > 0 ? dbResp.value[0].value : 0;
      } else {
        throw new Error("getStaffDistance");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffDistance(staffId, distance) {
    try {
      await create({
        table: "mod_distance",
        data: {
          profile_id: staffId,
          value: distance,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffDistance");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffDescuentoCC(staffId) {
    try {
      await getWithFilter({
        table: "mod_descuento_cc",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value.length > 0 ? dbResp.value[0].value : 0;
      } else {
        throw new Error("getStaffDescuentosCC");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveStaffDescuentoCC(staffId, descuentoCC) {
    try {
      await create({
        table: "mod_descuento_cc",
        data: {
          profile_id: staffId,
          value: descuentoCC,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveStaffDescuentosCC");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getProfileIdFromFingerId(fingerId) {
    try {
      await getWithFilter({
        table: "profiles",
        orderingBy: "createdAt",
        filter: {
          column: "finger_id",
          value: fingerId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].id;
      } else {
        throw new Error("getProfileIdFromFingerId");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getProfileFromFingerId(fingerId) {
    try {
      await getWithFilter({
        table: "profiles",
        orderingBy: "createdAt",
        filter: {
          column: "finger_id",
          value: fingerId,
        },
      });

      if (dbResponseStatus.value === "OK" && dbResp.value.length > 0) {
        return dbResp.value[0];
      } else {
        throw new Error("getProfileFromFingerId");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastPresentismoValue() {
    try {
      await getLastOne({
        table: "mod_presentismo",
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastPresentismoValue");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastViaticoValue() {
    try {
      await getLastOne({
        table: "mod_viatico",
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastViaticoValue");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastBaseHourValue() {
    try {
      await getLastOne({
        table: "mod_hora_base",
        orderingBy: "created_at",
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastBaseHourValue");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffStatusHistory(staffId) {
    try {
      await getWithFilter({
        table: "m2m_staff_status",
        filter: {
          column: "profile_id",
          value: staffId,
        },
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      } else {
        throw new Error("getStaffStatusHistory");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastAntiguedad() {
    try {
      await getLastOne({
        table: "mod_antiguedad",
      });

      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastAntiguedad");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function setProfileGestRole(profile_id, gest_role_id) {
    try {
      await update({
        table: "profiles",
        id: {
          key: "id",
          value: profile_id,
        },
        data: {
          gest_role_id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function savePaycheck() {
    const payload = {
      profile_id: RRHH_STORE.currentEmployee.id,
      lastBaseHourValue: RRHH_STORE.lastBaseHourValue,
      lastViaticoValue: RRHH_STORE.lastViaticoValue,
      lastPresentismoValue: RRHH_STORE.lastPresentismoValue,
      fingerId: RRHH_STORE.fingerId,
      totalHours: RRHH_STORE.totalHours,
      staffName: RRHH_STORE.currentEmployee.username,
      totalUno: RRHH_STORE.totalUno,
      presentismoAvailable: RRHH_STORE.presentismoAvailable,
      presentismo: RRHH_STORE.presentismo,
      viatico: RRHH_STORE.viatico,
      rolPrincipalPerc: RRHH_STORE.rolPrincipalPerc,
      rolPrincipalValue: RRHH_STORE.rolPrincipalValue,
      staffExp: RRHH_STORE.staffExp,
      antiguedad: RRHH_STORE.antiguedad,
      antiguedadValue: RRHH_STORE.antiguedadValue,
      lastSuperYpf: RRHH_STORE.lastSuperYpf,
      ayudaTransporte: RRHH_STORE.ayudaTransporte,
      plusGu: RRHH_STORE.plusGu,
      refuerzo: RRHH_STORE.refuerzo,
      respCierre: RRHH_STORE.respCierre,
      horaReal: RRHH_STORE.horaReal,
      totalDos: RRHH_STORE.totalDos,
      staffExpValue: RRHH_STORE.staffExpValue,
      late: RRHH_STORE.late,
      viaticoAvailable: RRHH_STORE.viaticoAvailable,
      feriadosAvailable: RRHH_STORE.feriadosAvailable,
      feriadoTime: RRHH_STORE.feriadoTime,
      feriados: RRHH_STORE.feriados,
      numberOfShifts: RRHH_STORE.numberOfShifts,
      cuentaCorriente: RRHH_STORE.cuentaCorriente,
      devolucionCC: RRHH_STORE.devolucionCC,
      descuentoCC: RRHH_STORE.descuentoCC,
      vacaciones: RRHH_STORE.vacaciones,
      sac: RRHH_STORE.sac,
      totalTres: RRHH_STORE.totalTres,
      recibo: RRHH_STORE.recibo,
      reciboSac: RRHH_STORE.reciboSac,
      totalAnticipos: RRHH_STORE.totalAnticipos,
      totalNeto: RRHH_STORE.totalNeto,
      customRowsTot2: RRHH_STORE.customRowsTot2,
      anticiposRows: RRHH_STORE.anticiposRows,
      customRowsTot3: RRHH_STORE.customRowsTot3,
      turnos: RRHH_STORE.turnos,
      startDate: RRHH_STORE.turnos[0].shift_start,
      endDate: RRHH_STORE.turnos[RRHH_STORE.turnos.length - 1].shift_end,
    };

    console.log("savePaycheck", payload);

    try {
      await create({
        table: "paycheck",
        data: payload,
      });

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("savePaycheck");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getCustomerList() {
    try {
      await getWithFilter({
        table: "profiles",
        orderingBy: "createdAt",
        filter: {
          column: "gest_role_id",
          value: 6, // CUSTOMER
        },
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      } else {
        throw new Error("getCustomerList");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getComunidadRelaciones() {
    try {
      await getAll({
        table: "comunidad_relaciones",
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value;
      } else {
        throw new Error("getComunidadRelaciones");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveComunidadRelaciones(relacion) {
    console.log("saveComunidadRelaciones", relacion);

    try {
      if (!relacion.comunidad_relaciones_id) {
        await create({
          table: "comunidad_relaciones",
          data: relacion,
        });
      } else {
        await update({
          table: "comunidad_relaciones",
          id: {
            key: "comunidad_relaciones_id",
            value: relacion.comunidad_relaciones_id,
          },
          data: relacion,
        });
      }

      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("saveComunidadRelaciones");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function deleteComunidadRelaciones(comunidad_relaciones_id) {
    try {
      await remove({
        table: "comunidad_relaciones",
        id: {
          key: "comunidad_relaciones_id",
          value: comunidad_relaciones_id,
        },
      });
      if (dbResponseStatus.value === "OK") {
        return true;
      } else {
        throw new Error("deleteComunidadRelaciones");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getExcelFiles() {
    let files = [];

    try {
      files = await getAllFiles({
        bucket: "excel_hours",
        folder: "excel_hours",
      });

      return files;
    } catch (error) {
      throw new Error(error);
    }
  }

  async function saveProfile(profile) {
    try {
      await update({
        table: "profiles",
        id: {
          key: "id",
          value: profile.id,
        },
        data: profile,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getStaffPlusGu(profileId) {
    try {
      await getWithFilter({
        table: "mod_plus_gu",
        orderingBy: "created_at",
        filter: {
          column: "profile_id",
          value: profileId,
        },
      });

      if (dbResponseStatus.value === "OK") {
        if (dbResp.value.length > 0) {
          return dbResp.value[0].value;
        } else {
          return 0;
        }
      } else {
        throw new Error("getLastSuperYpf");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastRefuerzo() {
    try {
      await getLastOne({
        table: "mod_refuerzo",
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastRefuerzo");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function getLastRespCierre() {
    try {
      await getLastOne({
        table: "mod_resp_cierre",
      });
      if (dbResponseStatus.value === "OK") {
        return dbResp.value[0].value;
      } else {
        throw new Error("getLastRespCierre");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getEmployeeOptions,
    getGestRoleOptions,
    getStaffRoleOptions,
    getStatusOptions,
    getLastSuperYpf,
    getStaffRoles,
    getStaffIdRoles,
    setStaffIdRoles,
    getStaffMainRoleId,
    getStaffMainRole,
    saveStaffMainRole,
    getLastStaffStatus,
    saveStaffStatus,
    getStaffAntiguedad,
    saveStaffAntiguedad,
    getStaffExpTitulos,
    saveStaffExpTitulos,
    getStaffExpGuelcom,
    saveStaffExpGuelcom,
    getStaffExpExterna,
    saveStaffExpExterna,
    getStaffDistance,
    saveStaffDistance,
    getStaffDescuentoCC,
    saveStaffDescuentoCC,
    getProfileIdFromFingerId,
    getProfileFromFingerId,
    getLastPresentismoValue,
    getLastViaticoValue,
    getLastBaseHourValue,
    getStaffStatusHistory,
    getLastAntiguedad,
    setProfileGestRole,
    savePaycheck,
    getCustomerList,
    getComunidadRelaciones,
    saveComunidadRelaciones,
    deleteComunidadRelaciones,
    getExcelFiles,
    saveProfile,
    getStaffPlusGu,
    getLastRefuerzo,
    getLastRespCierre,
  };
}
