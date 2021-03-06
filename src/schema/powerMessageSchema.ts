/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface EnergyMqttTopic {
  Time?: string;
  /**
   * measured current
   */
  Current?: number;
  /**
   * measured voltage
   */
  Voltage?: number;
  /**
   * measured power
   */
  Power: number;
  [k: string]: any;
}
