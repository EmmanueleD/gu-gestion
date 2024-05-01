export default function useComunidad() {
  function segmentComunidadByRelations(list, relations) {
    let segmentedList = {};

    for (let item of list) {
      for (let relation of relations) {
        if (item.totSales > relation.min && item.totSales <= relation.max) {
          if (!segmentedList[relation.label]) {
            segmentedList[relation.label] = [];
          }
          segmentedList[relation.label].push(item);
        }
      }
    }
    return segmentedList;
  }

  return {
    segmentComunidadByRelations,
  };
}
