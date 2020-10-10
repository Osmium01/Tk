import { ArduinoComponentState } from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { Sensor } from "../../core/blockly/dto/sensors.type";

export interface UltraSonicSensorState extends ArduinoComponentState {
  cm: number;
  trigPin: ARDUINO_PINS;
  echoPin: ARDUINO_PINS;
}

export interface UltraSonicSensor extends Sensor {
  cm: number;
}
