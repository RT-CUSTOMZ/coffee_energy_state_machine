import { TypedEventEmitter } from 'eventemitter-ts';

export declare type OnStateChangedCallback = (state: State) => void

export interface State{
    coffeeStateMachine : CoffeeStateMachine;
    power(value : number);
}

export interface Events {
    stateChanged: State;
  }

const threshold = 500;
const debounceMaxValue = 2;

export class CoffeeStateMachine  extends TypedEventEmitter<Events>  {
    state : State;

    initState : InitState;
    workingState : WorkingState;
    readyState : ReadyState;

    constructor(){
        super();
        this.initState = new InitState(this);
        this.workingState = new WorkingState(this);
        this.readyState = new ReadyState(this);
        this.setState(this.initState);
    }

    setState(state: State) {
        this.state = state;
        this.emit('stateChanged', state);
    }

    processPowerChange(value: number) {
        this.state.power(value);
    }
}

export default CoffeeStateMachine;

class InitState implements State {
    coffeeStateMachine: CoffeeStateMachine;

    constructor(coffeeStateMachine: CoffeeStateMachine) {
        this.coffeeStateMachine = coffeeStateMachine;
    }

    power(value: number) {
        if(threshold < value)
            this.coffeeStateMachine.setState(this.coffeeStateMachine.workingState);
    }
}

class WorkingState implements State {
    coffeeStateMachine: CoffeeStateMachine;
    debounceCounter: number;

    constructor(coffeeStateMachine: CoffeeStateMachine) {
        this.debounceCounter = 0;
        this.coffeeStateMachine = coffeeStateMachine;
    }

    power(value: number) {
        if( threshold >= value) {
            this.debounceCounter++;
            if(this.debounceCounter >= debounceMaxValue)
                this.coffeeStateMachine.setState(this.coffeeStateMachine.readyState);
        } else {
            this.debounceCounter = 0;
        }
    }
}

class ReadyState implements State {
    coffeeStateMachine: CoffeeStateMachine;
    debounceCounter: number;

    constructor(coffeeStateMachine: CoffeeStateMachine) {
        this.debounceCounter = 0;
        this.coffeeStateMachine = coffeeStateMachine;
    }
    power(value: number) {
        if(threshold < value) {
            this.debounceCounter++;
            if(this.debounceCounter >= debounceMaxValue)
                this.coffeeStateMachine.setState(this.coffeeStateMachine.workingState);
        } else {
            this.debounceCounter = 0;
        }
    }
}