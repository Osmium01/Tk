import Blockly from "blockly";
import { numberToCode } from "../../core/blockly/helpers/number-code.helper";
// TODO REPLACE WITH THIS -> https://github.com/valmat/LedMatrix

Blockly["Arduino"]["led_matrix_setup"] = function (block) {
  const dataPin = block.getFieldValue("PIN_DATA");
  const clkPin = block.getFieldValue("PIN_CLK");
  const csPin = block.getFieldValue("PIN_CS");

  Blockly["Arduino"].libraries_["define_led_matrix"] =
    "#include <LedControlMS.h>;\n";
  Blockly["Arduino"].libraries_[
    "led_matrix_setup"
  ] = `LedControl lc = LedControl(${dataPin},${clkPin},${csPin},1);\n`;

  Blockly["Arduino"].setupCode_["led_matrix"] =
    "\tlc.shutdown(0,false); \n\tlc.setIntensity(0,8);\n\tlc.clearDisplay(0);\n";

  return "";
};

Blockly["Arduino"]["led_matrix_make_draw"] = function (block) {
  let code = "\n\t//START CODE TO DRAW BLOCK " + block.id + "\n";

  for (let i = 1; i <= 8; i += 1) {
    for (let j = 1; j <= 8; j += 1) {
      const lightState = block.getFieldValue(i + "," + j).toLowerCase();
      code += "\tlc.setLed(0, " + i + ", " + j + ", " + lightState + ");\n";
    }
  }

  code += "\n\t//FINISH CODE TO DRAW BLOCK " + block.id + "\n";

  return code;
};

Blockly["Arduino"]["led_matrix_turn_one_on_off"] = function (block) {
  // todo fix code with variables
  let row = Blockly["Arduino"].valueToCode(
    block,
    "ROW",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  let column = Blockly["Arduino"].valueToCode(
    block,
    "COLUMN",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  const state = block.getFieldValue("STATE") === "ON" ? "true" : "false";

  return (
    "\tlc.setLed(0, " +
    numberToCode(row) +
    ", " +
    numberToCode(column) +
    ", " +
    state +
    ");\n"
  );
};
