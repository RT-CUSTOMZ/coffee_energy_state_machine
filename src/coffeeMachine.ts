import { TypedEventEmitter } from 'eventemitter-ts';
import { CoffeeStateMachine, State } from './coffeeStateMachine';
import { Message, Handler} from './Mqtt';

// export declare type OnStateChangedCallback = (state: State) => void

export interface Events {
    message: Message;
  }

// Setup Json validation
//////////////////////////////////////////////////////////////////////////////////////////
import * as Ajv from 'ajv'
const ajv = new Ajv();

// load generated typescript type information from json schema
import { EnergyMqttTopic } from './schema/powerMessageSchema'

const energyMqttTopicSchemaValidator = ajv.compile(
        require('../json_schema/powerMessageSchema.json')
    );
const coffeeStateSchemaValidator = ajv.compile(
        require('../json_schema/coffeeStateSchema.json')
    );
//////////////////////////////////////////////////////////////////////////////////////////


export class CoffeeMachine extends TypedEventEmitter<Events> implements Handler {
    outgoingTopic : string;
    coffeeStateMachine: CoffeeStateMachine;

    constructor(outgoingTopic: string) {
        super();
        this.outgoingTopic = outgoingTopic;

        this.coffeeStateMachine = new CoffeeStateMachine();
        this.coffeeStateMachine.on('stateChanged', this.onStateChanged.bind(this));
    }


    onMessage(message: any) {
        try { //JSON.parse may throw an SyntaxError exception
            const messageObj = JSON.parse(message) as EnergyMqttTopic;
            const valid = energyMqttTopicSchemaValidator(messageObj);

            if (true === valid) {
                this.coffeeStateMachine.processPowerChange(messageObj.Power);
            } else {
                console.log(ajv.errorsText(energyMqttTopicSchemaValidator.errors));
            }
        } catch(e) {
            console.error(e);
        }
    }

    onStateChanged(state: State) {
        const stateObj = {
            state: state.constructor.name,
            timestamp: new Date().toISOString()
        }
        console.log(stateObj);
        const valid = coffeeStateSchemaValidator(stateObj);
        if (true === valid) {
            const message = {
                topic: this.outgoingTopic,
                message: JSON.stringify(stateObj)
            };
            this.emit('message', message);
       } else {
            console.log(ajv.errorsText(coffeeStateSchemaValidator.errors));
        }
    }
}