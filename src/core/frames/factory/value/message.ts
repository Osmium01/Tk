import { ValueGenerator } from '../value.factories';
import { BluetoothSensor } from '../../../blockly/dto/sensors.type';
import { findComponent } from '../factory.helpers';
import { ArduinoMessageState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';

export const getArduinoMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ArduinoMessageState>(
    previousState,
    ArduinoComponentType.MESSAGE
  ).message;
};

export const arduinoHasMessage: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<ArduinoMessageState>(
    previousState,
    ArduinoComponentType.MESSAGE
  ).hasMessage;
};
