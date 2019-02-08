# Typescript is based on:
https://blog.risingstack.com/building-a-node-js-app-with-typescript-tutorial/

# Docker
```
docker build \
  -t coffee_energy_state_machine \
  .

docker run \
  -it \
  --rm \
  coffee_energy_state_machine:latest
```

# JSON Schema Validation

http://json-schema.org/latest/json-schema-validation.html

https://github.com/epoberezkin/ajv

```bash
npx json2ts \
  -i json_schema/powerMessageSchema.json \
  -o src/schema/powerMessageSchema.ts
npx json2ts \
  -i json_schema/coffeeStateSchema.json \
  -o src/schema/coffeeStateSchema.ts
```