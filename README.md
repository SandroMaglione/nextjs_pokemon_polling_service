# `PokePol`

Single-page application that uses 2 public APIs to build a **Pokemon polling service**.

1. `Polling API`: The Documentation for the API is available at [http://docs.pollsapi.apiary.io/](http://docs.pollsapi.apiary.io/)
2. `Pokemon API`: The Documentation for the API is available at [https://pokeapi.co/](https://pokeapi.co/)

---

The application is built using [NextJs](https://nextjs.org/). Following a list of packages and libraries used in the project:

- [TailwindCSS](https://tailwindcss.com/): Styling
- [fp-ts](https://gcanti.github.io/fp-ts/): Functional programming
- [io-ts](https://gcanti.github.io/io-ts/): Data validation (parsing)
- [axios](https://axios-http.com/): HTTP requests
- [ESLint](https://eslint.org/): Linting
- [Prettier](https://prettier.io/): Code formatting

## Features

1. Users can see the latest questions available on `Pollsapi`
2. Users can create a new question
   - It is a pokemon-based question
   - Users can provide a pokemon name for which a question should be generated or generate a question for a random pokemon (Every question has 4 choices)
   - The user can view a preview of the generated question
   - User can submit the question to the `Pollsapi`

---

Made by [**Sandro Maglione**](https://github.com/SandroMaglione):

- [Twitter](https://twitter.com/SandroMaglione)
- [Linkedin](https://www.linkedin.com/in/sandro-maglione97/)
- [Github](https://github.com/SandroMaglione)
