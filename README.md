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
