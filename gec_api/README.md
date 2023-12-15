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