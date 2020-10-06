import { ArduinoComponentState, Color, ArduinoFrame } from "./arduino.frame";
import { ARDUINO_PINS } from "../microcontroller/selectBoard";

export interface ArduinoReceiveMessageState extends ArduinoComponentState {
  hasMessage: boolean;
  message: string;
}

export interface MotorState extends ArduinoComponentState {
  motorNumber: number;
  speed: number;
  direction: MOTOR_DIRECTION;
}

export enum MOTOR_DIRECTION {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface RfidState extends ArduinoComponentState {
  txPin: ARDUINO_PINS;
  scannedCard: boolean;
  cardNumber: string;
  tag: string;
}

export interface ServoState extends ArduinoComponentState {
  degree: number;
}

export interface TemperatureState extends ArduinoComponentState {
  temperature: number;
  humidity: number;
}

export interface TimeState extends ArduinoComponentState {
  timeInSeconds: number;
}

export interface UltraSonicSensorState extends ArduinoComponentState {
  cm: number;
  trigPin: ARDUINO_PINS;
  echoPin: ARDUINO_PINS;
}
