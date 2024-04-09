export default class Validator {
  rules = null;
  validation = true;
  messages = {};
  validationFunctionsByType = {
    String: this.validateString,
    Number: this.validateNumber,
    PositiveNumber: this.validatePositiveNumber,
    Array: this.validateArray,
    Object: this.validateObject,
    Date: this.validateDate,
    Boolean: this.validateBoolean,
    Dropdown: this.validateDropdown,
  };
  defaultValidationFunction = this.validateDefault;
  errorMessagesByType = {
    Number: " es obligatorio y debe ser un numero",
    PositiveNumber: " es obligatorio y debe ser un numero positivo",
    Date: " es obligatorio y debe ser una fecha",
  };
  defaultErrorMessage = " es obligatorio";

  constructor(data, config = {}) {
    this.rules = data ? data.data : [];
  }

  validate(element) {
    this.reset();
    if (!this.rules)
      return { validation: this.validation, messages: this.messages };

    this.rules.forEach((rule) => {
      if (this.isValidRule(rule, element)) {
        const value = rule.key ? element[rule.key] : null;
        const validationFunction = this.validationFunctionsByType[rule.type]
          ? this.validationFunctionsByType[rule.type]
          : this.defaultValidationFunction;

        validationFunction.call(this, rule, value);
      }
    });
    return { validation: this.validation, messages: this.messages };
  }

  reset() {
    this.validation = true;
    this.messages = {};
  }

  setValidationFailed(rule) {
    this.validation = false;
    const errorMessage = this.errorMessagesByType[rule.key]
      ? this.errorMessagesByType[rule.key]
      : this.defaultErrorMessage;
    this.messages[rule.key] = rule.name + errorMessage;
  }

  validateDefault(rule, value) {
    if (!value) {
      this.setValidationFailed(rule);
    }
  }

  validateString(rule, value) {
    if (value == null || value == "" || value == undefined) {
      this.setValidationFailed(rule);
    }
  }

  validateNumber(rule, value) {
    if (value == 0) return;
    if (value == null || value == "" || isNaN(value)) {
      this.setValidationFailed(rule);
    }
  }

  validatePositiveNumber(rule, value) {
    if (value == null || value == "" || isNaN(value) || Number(value) < 1) {
      this.setValidationFailed(rule);
    }
  }

  validateArray(rule, value) {
    if (value == null || value == [] || value.length == 0) {
      this.setValidationFailed(rule);
    }
  }

  validateObject(rule, value) {
    let isValid = true;
    if (typeof value !== "object" || !value) {
      isValid = false;
    }
    for (const fieldValue of Object.values(value)) {
      if (!fieldValue) {
        isValid = false;
      }
    }
    if (!isValid) this.setValidationFailed(rule);
  }

  validateDate(rule, value) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      this.setValidationFailed(rule);
    }
  }

  validateBoolean(rule, value) {
    if (
      !(value == true || value == false || value == "true" || value == "false")
    ) {
      this.setValidationFailed(rule);
    }
  }

  validateDropdown(rule, value) {
    if (value == null || value == "" || value == undefined) {
      this.setValidationFailed(rule);
    }
  }

  isValidRule(rule, element) {
    // console.log("isValidRule", { rule, element });
    let isValid = true;
    if (rule.if) {
      let operandsList = [];
      for (const condition of rule.if.conditions) {
        // console.log("isValidRule - condition", condition);
        if (condition.if) {
          operandsList.push(this.isValidRule(condition, element));
        } else {
          operandsList.push(this.checkRelation(condition, element));
        }
      }
      isValid = this.solveLogicOperation(rule.if.operator, operandsList);
    }
    return isValid;
  }

  checkRelation(condition, element) {
    // console.log("checkRelation", { condition, element });
    const { key, value, relation } = condition;
    const actualValue = element[key];
    switch (relation) {
      case "equal":
        // console.log("checkRelation - equal", { actualValue, value });
        return actualValue === value;
      case "not equal":
        // console.log("checkRelation - not equal", { actualValue, value });
        return actualValue !== value;
      default:
        return false;
    }
  }

  solveLogicOperation(operator, operandsList) {
    if (operator === "OR") {
      // console.log("solveLogicOperation - OR", operandsList);
      return operandsList.some((operand) => operand);
    }
    if (operator === "AND") {
      // console.log("solveLogicOperation - AND", operandsList);
      return operandsList.every((operand) => operand);
    }
  }
}
