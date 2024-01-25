/* eslint-disable vue/multi-word-component-names */
import "primevue/resources/themes/aura-light-noir/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import PrimeVue from "primevue/config";
import AutoComplete from "primevue/autocomplete";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import Badge from "primevue/badge";
import BadgeDirective from "primevue/badgedirective";
import BlockUI from "primevue/blockui";
import Button from "primevue/button";
import Breadcrumb from "primevue/breadcrumb";
// import Calendar from "primevue/calendar"
import BaseCalendar from "@/components/base/BaseCalendar.vue";
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import Chart from "primevue/chart";
import Checkbox from "primevue/checkbox";
import Chip from "primevue/chip";
import Chips from "primevue/chips";
import ColorPicker from "primevue/colorpicker";
import Column from "primevue/column";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import ContextMenu from "primevue/contextmenu";
import DataTable from "primevue/datatable";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Dropdown from "primevue/dropdown";
import Editor from "primevue/editor";
import Fieldset from "primevue/fieldset";
import FileUpload from "primevue/fileupload";
import Image from "primevue/image";
import InlineMessage from "primevue/inlinemessage";
import Inplace from "primevue/inplace";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import InputText from "primevue/inputtext";
import Knob from "primevue/knob";
import Galleria from "primevue/galleria";
import Listbox from "primevue/listbox";
import MegaMenu from "primevue/megamenu";
import Menu from "primevue/menu";
import Menubar from "primevue/menubar";
import Message from "primevue/message";
import MultiSelect from "primevue/multiselect";
import OrderList from "primevue/orderlist";
import OrganizationChart from "primevue/organizationchart";
import OverlayPanel from "primevue/overlaypanel";
import Paginator from "primevue/paginator";
import Panel from "primevue/panel";
import PanelMenu from "primevue/panelmenu";
import Password from "primevue/password";
import PickList from "primevue/picklist";
import ProgressBar from "primevue/progressbar";
import Rating from "primevue/rating";
import RadioButton from "primevue/radiobutton";
import Ripple from "primevue/ripple";
import SelectButton from "primevue/selectbutton";
import ScrollPanel from "primevue/scrollpanel";
import ScrollTop from "primevue/scrolltop";
import Slider from "primevue/slider";
import Sidebar from "primevue/sidebar";
import Skeleton from "primevue/skeleton";
import SpeedDial from "primevue/speeddial";
import SplitButton from "primevue/splitbutton";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";
import Steps from "primevue/steps";
import StyleClass from "primevue/styleclass";
import TabMenu from "primevue/tabmenu";
import Tag from "primevue/tag";
import TieredMenu from "primevue/tieredmenu";
import Textarea from "primevue/textarea";
import Timeline from "primevue/timeline";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Toolbar from "primevue/toolbar";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Tooltip from "primevue/tooltip";
import ToggleButton from "primevue/togglebutton";
import Tree from "primevue/tree";
import TreeSelect from "primevue/treeselect";
import TreeTable from "primevue/treetable";
import TriStateCheckbox from "primevue/tristatecheckbox";

class PrimeVueConfigurator {
  constructor() {}

  init(app) {
    app.use(PrimeVue, {
      ripple: true,
      inputStyle: "outlined",
      // unstyled: true,
      locale: {
        startsWith: "Comienza con",
        contains: "Contiene",
        notContains: "No Contiene",
        endsWith: "Termina con",
        equals: "Igual",
        notEquals: "No Igual",
        noFilter: "Sin Filtro",
        lt: "Menor que",
        lte: "Menor o Igual que",
        gt: "Mayor que",
        gte: "Mayor o Igual que",
        dateIs: "Fecha Igual",
        dateIsNot: "Fecha No Igual",
        dateBefore: "Fecha Antes",
        dateAfter: "Fecha Después",
        clear: "Limpiar",
        apply: "Aplicar",
        matchAll: "Igual para Todos",
        matchAny: "Igual para Algunos",
        addRule: "Agregar Regla",
        removeRule: "Eliminar Regla",
        accept: "Aceptar",
        reject: "Rechazar",
        choose: "Elegir",
        upload: "Subir",
        cancel: "Cancelar",
        dayNames: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
        monthNames: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        monthNamesShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        chooseYear: "Elegir Año",
        chooseMonth: "Elegir Mes",
        chooseDate: "Elegir Fecha",
        prevDecade: "Década Anterior",
        nextDecade: "Década Siguiente",
        prevYear: "Año Anterior",
        nextYear: "Año Siguiente",
        prevMonth: "Mes Anterior",
        nextMonth: "Mes Siguiente",
        prevHour: "Hora Anterior",
        nextHour: "Hora Siguiente",
        prevMinute: "Minuto Anterior",
        nextMinute: "Minuto Siguiente",
        prevSecond: "Segundo Anterior",
        nextSecond: "Segundo Siguiente",
        am: "AM",
        pm: "PM",
        today: "Hoy",
        weekHeader: "Sem.",
        firstDayOfWeek: 0,
        dateFormat: "dd/mm/yy",
        weak: "Débil",
        medium: "Medio",
        strong: "Fuerte",
        passwordPrompt: "Introducir la Contraseña",
        emptyFilterMessage: "Resultados no Encontrados", // @deprecated Use 'emptySearchMessage' option instead.
        searchMessage: "{0} resultados disponibles",
        selectionMessage: "{0} elementos seleccionados",
        emptySelectionMessage: "Ningún elemento seleccionado",
        emptySearchMessage: "Resultados no Encontrados",
        emptyMessage: "No hay opciones disponibles",
        aria: {
          trueLabel: "Verdadero",
          falseLabel: "Falso",
          nullLabel: "No seleccionado",
          star: "1 estrella",
          stars: "{star} estrellas",
          selectAll: "Todos los elementos seleccionados",
          unselectAll: "Todos los elementos no seleccionados",
          close: "Cerrar",
          previous: "Anterior",
          next: "Siguiente",
          navigation: "Navegación",
          scrollTop: "Desplazar arriba",
          moveTop: "Mover arriba",
          moveUp: "Mover arriba",
          moveDown: "Mover abajo",
          moveBottom: "Mover abajo",
          moveToTarget: "Mover al destino",
          moveToSource: "Mover al origen",
          moveAllToTarget: "Mover todo al destino",
          moveAllToSource: "Mover todo al origen",
          pageLabel: "{page}",
          firstPageLabel: "Primera página",
          lastPageLabel: "Última página",
          nextPageLabel: "Página siguiente",
          prevPageLabel: "Página anterior",
          rowsPerPageLabel: "Filas por página",
          jumpToPageDropdownLabel: "Ir a la página",
          jumpToPageInputLabel: "Ir a la página",
          selectRow: "Fila seleccionada",
          unselectRow: "Fila no seleccionada",
          expandRow: "Expandir fila",
          collapseRow: "Contraer fila",
          showFilterMenu: "Mostrar menú de filtro",
          hideFilterMenu: "Ocultar menú de filtro",
          filterOperator: "Operador de filtro",
          filterConstraint: "Restricción de filtro",
          editRow: "Editar fila",
          saveEdit: "Guardar edición",
          cancelEdit: "Cancelar edición",
          listView: "Vista de lista",
          gridView: "Vista de cuadrícula",
          slide: "Diapositiva",
          slideNumber: "{slideNumber}",
          zoomImage: "Ampliar imagen",
          zoomIn: "Acercar",
          zoomOut: "Alejar",
          rotateRight: "Girar a la derecha",
          rotateLeft: "Girar a la izquierda",
        },
      },
    });
    app.use(ConfirmationService);
    app.use(ToastService);

    app.directive("tooltip", Tooltip);
    app.directive("ripple", Ripple);
    app.directive("badge", BadgeDirective);
    app.directive("styleclass", StyleClass);

    app.component("Accordion", Accordion);
    app.component("AccordionTab", AccordionTab);
    app.component("AutoComplete", AutoComplete);
    app.component("Avatar", Avatar);
    app.component("AvatarGroup", AvatarGroup);
    app.component("Badge", Badge);
    app.component("BlockUI", BlockUI);
    app.component("Breadcrumb", Breadcrumb);
    app.component("Button", Button);
    app.component("Calendar", BaseCalendar);
    app.component("Card", Card);
    app.component("Carousel", Carousel);
    app.component("Chart", Chart);
    app.component("Checkbox", Checkbox);
    app.component("Chip", Chip);
    app.component("Chips", Chips);
    app.component("ColorPicker", ColorPicker);
    app.component("Column", Column);
    app.component("ConfirmDialog", ConfirmDialog);
    app.component("ConfirmPopup", ConfirmPopup);
    app.component("ContextMenu", ContextMenu);
    app.component("DataTable", DataTable);
    app.component("DataView", DataView);
    app.component("DataViewLayoutOptions", DataViewLayoutOptions);
    app.component("Dialog", Dialog);
    app.component("Divider", Divider);
    app.component("Dropdown", Dropdown);
    app.component("Editor", Editor);
    app.component("Fieldset", Fieldset);
    app.component("FileUpload", FileUpload);
    app.component("Image", Image);
    app.component("InlineMessage", InlineMessage);
    app.component("Inplace", Inplace);
    app.component("InputMask", InputMask);
    app.component("InputNumber", InputNumber);
    app.component("InputSwitch", InputSwitch);
    app.component("InputText", InputText);
    app.component("Galleria", Galleria);
    app.component("Knob", Knob);
    app.component("Listbox", Listbox);
    app.component("MegaMenu", MegaMenu);
    app.component("Menu", Menu);
    app.component("Menubar", Menubar);
    app.component("Message", Message);
    app.component("MultiSelect", MultiSelect);
    app.component("OrderList", OrderList);
    app.component("OrganizationChart", OrganizationChart);
    app.component("OverlayPanel", OverlayPanel);
    app.component("Paginator", Paginator);
    app.component("Panel", Panel);
    app.component("PanelMenu", PanelMenu);
    app.component("Password", Password);
    app.component("PickList", PickList);
    app.component("ProgressBar", ProgressBar);
    app.component("RadioButton", RadioButton);
    app.component("Rating", Rating);
    app.component("SelectButton", SelectButton);
    app.component("ScrollPanel", ScrollPanel);
    app.component("ScrollTop", ScrollTop);
    app.component("Slider", Slider);
    app.component("Sidebar", Sidebar);
    app.component("Skeleton", Skeleton);
    app.component("SpeedDial", SpeedDial);
    app.component("SplitButton", SplitButton);
    app.component("Splitter", Splitter);
    app.component("SplitterPanel", SplitterPanel);
    app.component("Steps", Steps);
    app.component("TabMenu", TabMenu);
    app.component("TabView", TabView);
    app.component("TabPanel", TabPanel);
    app.component("Tag", Tag);
    app.component("Textarea", Textarea);
    app.component("TieredMenu", TieredMenu);
    app.component("Timeline", Timeline);
    app.component("Toast", Toast);
    app.component("Toolbar", Toolbar);
    app.component("ToggleButton", ToggleButton);
    app.component("Tree", Tree);
    app.component("TreeSelect", TreeSelect);
    app.component("TreeTable", TreeTable);
    app.component("TriStateCheckbox", TriStateCheckbox);
  }
}

export default new PrimeVueConfigurator();
