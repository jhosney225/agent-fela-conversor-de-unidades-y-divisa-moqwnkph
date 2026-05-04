
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

const tools = [
  {
    name: "convert_units",
    description:
      "Convierte entre diferentes unidades de medida (longitud, peso, volumen, temperatura, etc.)",
    input_schema: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "El valor numérico a convertir",
        },
        from_unit: {
          type: "string",
          description:
            "La unidad de origen (ej: metros, kilogramos, grados celsius, etc.)",
        },
        to_unit: {
          type: "string",
          description: "La unidad de destino a convertir",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
  {
    name: "convert_currency",
    description: "Convierte entre diferentes monedas usando tasas de cambio",
    input_schema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "La cantidad de dinero a convertir",
        },
        from_currency: {
          type: "string",
          description: "La moneda de origen (ej: USD, EUR, MXN, etc.)",
        },
        to_currency: {
          type: "string",
          description: "La moneda de destino",
        },
      },
      required: ["amount", "from_currency", "to_currency"],
    },
  },
  {
    name: "list_supported_conversions",
    description:
      "Lista las conversiones de unidades y divisas soportadas por el sistema",
    input_schema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["units", "currencies", "all"],
          description: "Categoría de conversiones a listar",
        },
      },
      required: ["category"],
    },
  },
];

// Funciones de conversión
function convertUnits(value, fromUnit, toUnit) {
  const conversions = {
    // Longitud (metros)
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.34,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,

    // Peso (kilogramos)
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000,

    // Volumen (litros)
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
    fl_oz: 0.0295735,
    cup: 0.236588,
    tbsp: 0.0147868,
    tsp: 0.00492892,
    m3: 1000,
    cm3: 0.001,

    // Temperatura (casos especiales)
    c: "celsius",
    f: "fahrenheit",
    k: "kelvin",
  };

  const normalizedFrom = fromUnit.toLowerCase();
  const normalizedTo = toUnit.toLowerCase();

  if (!conversions[normalizedFrom] || !conversions[normalizedTo]) {
    return {
      error: `Unidades no soportadas. De: ${fromUnit}, A: ${toUnit}`,
    };
  }

  // Conversión de temperatura (casos especiales)
  if (
    conversions[normalizedFrom] === "celsius" &&
    conversions[normalizedTo] === "fahrenheit"
  ) {
    const result = (value * 9) / 5 + 32;
    return {
      value: parseFloat(result.toFixed(2)),
      from: fromUnit,
      to: toUnit,
      result: `${value}${fromUnit} = ${result.toFixed(2)}${toUnit}`,
    };
  }

  if (
    conversions[normalizedFrom] === "celsius" &&
    conversions[normalizedTo] === "kelvin"
  ) {
    const result = value + 273.15;
    return {
      value: parseFloat(result.toFixed(2)),
      from: fromUnit,
      to: toUnit,
      result: `${value}${fromUnit} = ${result.toFixed(2)}${toUnit}`,
    };
  }

  if (
    conversions[normalizedFrom] === "fahrenheit" &&
    conversions[normalizedTo] === "celsius"
  ) {
    const result = ((value - 32) * 5) / 9;
    return {
      value: parseFloat(result.toFixed(2)),
      from: fromUnit,
      to: toUnit,
      result: `${value}${fromUnit} = ${result.toFixed(2)}${toUnit}`,
    };
  }

  if (
    conversions[normalizedFrom] === "fahrenheit" &&
    conversions[normalizedTo] === "kelvin"
  ) {
    const celsius = ((value - 32) * 5) / 9;
    const result = celsius + 273.15;
    return {
      value: parseFloat(result.toFixed(2)),
      from: fromUnit,
      to: toUnit,
      result: `${value}${fromUnit} = ${result.toFixed(2)}${toUnit}`,
    };
  }

  if (
    conversions[normalizedFrom] === "kelvin" &&
    conversions[normalizedTo] === "celsius"
  ) {
    const result = value - 273.15;
    return {
      