from transformers import pipeline
from flask import request, jsonify, Blueprint

from .constants import status, response_code


bp = Blueprint('api', __name__, url_prefix='/api')
corrector = pipeline("text2text-generation", model=r"D:\UESTC\Courses\Semester8\Thesis\code\gec\server\gec-t5-base-40ep", tokenizer=r"D:\UESTC\Courses\Semester8\Thesis\code\gec\server\gec-t5-base-40ep")

@bp.route('/gec', methods=['POST'])
def gec():
    if 'sentence' not in request.form:
        return jsonify(status=status.HTTP_400_BAD_REQUEST, message="Failure, missing sentence"), 400
    sentence = request.form['sentence']
    if not sentence:
        return jsonify(status=status.HTTP_400_BAD_REQUEST, message="Failure, missing sentence"), 400
    # elif
    corrected = corrector(sentence)[0]['generated_text']
    return jsonify(status=status.HTTP_200_OK, message="Correction successful", corrected=corrected, original=sentence), 200
    