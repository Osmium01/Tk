import { StateGenerator } from '../../state.factories';
import { LCDScreenState } from '../../../state/arduino-components.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../../../state/arduino.state';
import {
  arduinoStateByComponent,
  getDefaultIndeValue,
  findComponent
} from '../../factory.helpers';
import _ from 'lodash';
import { getInputValue } from '../../value.factories';

export const lcdScreenSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const rows = findFieldValue(block, 'SIZE') === '20 x 4' ? 4 : 2;
  const columns = findFieldValue(block, 'SIZE') === '20 x 4' ? 20 : 16;

  const lcdState: LCDScreenState = {
    pins: block.pins,
    rows,
    columns,
    type: ArduinoComponentType.LCD_SCREEN,
    memoryType: findFieldValue(block, 'MEMORY_TYPE'),
    blink: { row: 0, column: 0, blinking: false },
    backLightOn: true,
    rowsOfText: [
      '                    ',
      '                    ',
      '                    ',
      '                    '
    ]
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      lcdState,
      'Setting up LCD Screen.',
      previousState
    )
  ];
};

export const lcdScroll: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    findComponent<LCDScreenState>(
      previousState,
      ArduinoComponentType.LCD_SCREEN
    )
  );

  const direction = findFieldValue(block, 'DIR') as string;

  const rowsOfText = lcdState.rowsOfText.map((text) => {
    if (direction === 'RIGHT') {
      return ' ' + text.substr(0, 19);
    }
    return text.substr(1, 19) + ' ';
  });

  const newComponent: LCDScreenState = {
    ...lcdState,
    rowsOfText
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Scrolling text to the ${direction.toLowerCase()}.`,
      previousState
    )
  ];
};

export const lcdPrint: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    findComponent<LCDScreenState>(
      previousState,
      ArduinoComponentType.LCD_SCREEN
    )
  );

  const row = getDefaultIndeValue(
    1,
    20,
    getInputValue(blocks, block, variables, timeline, 'ROW', 1, previousState)
  );

  const column = getDefaultIndeValue(
    1,
    20,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      'COLUMN',
      1,
      previousState
    )
  );

  const print = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'PRINT',
    '',
    previousState
  );

  const rowsOfText = lcdState.rowsOfText.map((text, index) => {
    if (index + 1 !== row) {
      return text;
    }

    const actualColumn = column - 1;
    _.range(actualColumn, print.length).forEach((textIndex, rangeIndex) => {
      text = replaceAt(text, textIndex, print[rangeIndex]);
    });

    return text;
  });

  const newComponent: LCDScreenState = {
    ...lcdState,
    rowsOfText
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Printing "${print}" to the screen at position (${column}, ${row}).`,
      previousState
    )
  ];
};

function replaceAt(string: string, index: number, replace: string) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

export const lcdSimplePrint: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    previousState.components.find(
      (c) => c.type == ArduinoComponentType.LCD_SCREEN
    )
  ) as LCDScreenState;

  const rowsOfText = _.range(1, 5).map((i) => {
    return getInputValue(
      blocks,
      block,
      variables,
      timeline,
      'ROW_' + i,
      '',
      previousState
    );
  });

  const delay = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'DELAY',
    1,
    previousState
  );

  const newComponent: LCDScreenState = {
    ..._.cloneDeep(lcdState),
    rowsOfText: rowsOfText.map((text: string) => {
      if (text.length >= 20) {
        return text.slice(0, 20);
      }

      return (
        text +
        _.range(0, lcdState.columns - text.length)
          .map(() => ' ')
          .join('')
      );
    })
  };

  const clearComponent: LCDScreenState = {
    ..._.cloneDeep(newComponent),
    rowsOfText: [
      '                    ',
      '                    ',
      '                    ',
      '                    '
    ]
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Printing message for ${delay.toFixed(2)} seconds.`,
      previousState,
      false,
      false,
      delay * 1000
    ),
    arduinoStateByComponent(
      block.id,
      timeline,
      clearComponent,
      `Clearing the screen.`,
      previousState,
      false,
      false,
      0
    )
  ];
};
