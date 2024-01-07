# Leveraging The Power of Open-source LLM for GEC

## Flask Web App
The web app is simple demo built with [flask](https://flask.palletsprojects.com/en/3.0.x/)

### Run
Add model path to `gec_app.py`
Make sure the requirements are installed.
```bash
cd webapp
flask --app gec_app --debug run
```
Then open browser http://127.0.0.1:5000

## GEC API


`Method: POST`

`Api Path: /api/gec`

`Full api path: http://127.0.0.1:5000/api/gec`

`Request body:`

| Key         | Type     | Value |
|:--------------:|:-----------:|:------------:|
| `sentence` | `text`      | sentence to be corrected |

Success response:
```json
{
    "corrected": "I have had a headache since yesterday.",
    "message": "Correction successful",
    "original": "i has headche since yesterday",
    "status": 200
}
```
Failure response:
```json
{
    "message": "Failure, missing sentence",
    "status": 400
}
```

```json
{
 "input": "grammar: For not use car. ",
 "target": "Do not use in the car. "
}
```


## Dr. Geco App - Next Js

This app is designed to provide users with features similar to the popular grammar checking tool. Users can create accounts, create and edit documents, check the grammar of their text, find synonyms for words, and even translate text to other languages. The app is built using Next.js, CSS Modules, React with TypeScript, and utilizes a finetuned machine learning model for grammar checking.

## Features

- **Account Creation:** Users can sign up and create their own accounts to start using the app's features.

- **Document Editing:** Create and edit documents within the app's interface. The editing experience is user-friendly and intuitive.

- **Grammar Checking:** The app integrates with the OpenAI API to provide grammar checking services, helping users improve the quality of their written content.


## Tech Stack

- Frontend:
  - Next.js
  - React (TypeScript)
  - CSS Modules for styling

- Backend/API:
  - Next.js API routes

- External APIs:
  - Finetuned T5 ML Model with Flask API for grammar checking, see more information above.
 

## Requirements

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v7.0.0 or higher)

## Installation and Running

1. Clone the repository:
   ```bash
   git clone https://github.com/turinaf/gec-ml.git

2. Navigate to the project directory:
   ```bash
   cd Dr_Geco_App
3. Install dependencies:
   ```bash
   npm install
4. Running the Application:
   ```bash
   npm run dev

## Building the Application
1. To build the application for production:
   ```bash
   npm run build

## Running Tests
1. To execute tests:
   ```bash
   npm test

## Linting
1. To lint the project:
   ```bash
   npm run lint

## Future Plans

- **Mobile App:** While the current version of the app doesn't have a dedicated mobile layout, the future plan includes developing a React Native mobile app to provide a seamless experience for users on their phones.

## Contributing

Contributions to this project are welcome! Feel free to submit pull requests or open issues for any bugs, features, or improvements you'd like to see.

## License

This project is licensed under the [MIT License](LICENSE).

---

I hope you enjoy using the Dr. Geco App and find it helpful for your writing needs. If you have any questions or feedback, please don't hesitate to reach out.



