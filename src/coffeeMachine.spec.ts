import { CoffeeMachine } from './coffeeMachine';
import { expect } from 'chai';
import 'mocha';

import * as Ajv from 'ajv'
const ajv = new Ajv();

// load generated typescript type information from json schema
import { CoffeeStateMqttTopic } from './schema/coffeeStateSchema'

const energyMqttTopicSchemaValidator = ajv.compile(
        require('../json_schema/powerMessageSchema.json')
    );
const coffeeStateSchemaValidator = ajv.compile(
        require('../json_schema/coffeeStateSchema.json')
    );

describe('check input validation', () => {

  it('should generate valid workingstate message', function(done) {
      const coffeeMachine = new CoffeeMachine("topic");
      coffeeMachine.on("message", function(message){
        expect(message.topic).to.equal('topic');

        const messageObj = JSON.parse(message.message) as CoffeeStateMqttTopic;
        const valid = coffeeStateSchemaValidator(messageObj);
        expect(valid).to.be.true;

        expect(messageObj.state).to.equal("WorkingState");

        done();
      });
      coffeeMachine.onMessage(
        JSON.stringify({
            "Time":"2019-02-08T18:19:04", 
            "Total":11.044, 
            "Yesterday":0.098, 
            "Today":0.219, 
            "Period":10, 
            "Power":2100, 
            "Factor":1.00, 
            "Voltage":222, 
            "Current":8.906
        })
      );
  });

});