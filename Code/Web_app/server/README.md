# Setup backend

Run the following commands

## Environment variables

Add your own `.env` file with the correct data to connect the database:
```
yarn env-win # windows
# or
yarn env-lin # linux
```
Or copy the `.env.example` and rename it to .env

---

## Now setup the project:

```
yarn setup
```

---

## Run before commit:
```
yarn lint # to check if there are lint errors
# and
yarn lint-fix # to fix lint errors
```

---

## Tests
```
yarn test
```