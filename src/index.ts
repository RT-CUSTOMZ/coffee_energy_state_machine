import Mqtt from "./Mqtt";
import { CoffeeMachine} from './coffeeMachine'


const mqttHost = process.env.MQTT_HOST || 'ws://mqtt.42volt.de:9001/'

const coffeeMachineConfigurations = [
  {
    incomming: 'tele/Kaffeemaschine/ENERGY',
    outgoing: 'coffee/0/state'
  },
  // {
  //   incomming: 'tele/Maschine-17/ENERGY',
  //   outgoing: 'coffee/0/state'
  // },
];

console.log("Coffee state machine is starting");

const mqtt = new Mqtt();
for ( const entry of coffeeMachineConfigurations) {
  const coffeeMachine = new CoffeeMachine(entry.outgoing);
  mqtt.registerTopicHandler(entry.incomming, coffeeMachine);
  coffeeMachine.on("message", mqtt.onPublishMessage.bind(mqtt));
}
mqtt.connect(mqttHost);


process.on('SIGTERM', function () {
  console.log("Coffee state machine is shuting down")
  mqtt.end();

  // shutdown anyway after some time
  setTimeout(function(){
      process.exit(0);
  }, 8000);
});
