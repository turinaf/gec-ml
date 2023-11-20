from flask import Flask, jsonify, request, render_template, Blueprint
from transformers import pipeline

bp = Blueprint("gec", __name__)
corrector = pipeline("text2text-generation", model="../server/gec-t5-base-40ep")

@bp.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        input_text = request.form.get("input_text")
        sentences = input_text.split(".")
        corrections = []
        annotated_input = []
        for i in range(len(sentences)):
            if len(sentences[i]) == 0:
                continue
            corrected = corrector(f"grammar: {sentences[i]}")
            corrected_text = corrected[0]["generated_text"]
            
            # add span with class for all changed string
            annotated_sentence = ""
            anno_input = ""
            cor_split = corrected_text.split(" ")
            orig_split = sentences[i].split(" ")
            
            for word in cor_split:
                if word not in orig_split:
                    annotated_sentence = annotated_sentence + f'<span class="corrected">{word}</span> '
                else:
                    annotated_sentence = annotated_sentence + word +" "
            for word in orig_split:
                if word not in cor_split:
                    anno_input = anno_input + f'<span class="error"> {word}</span> '
                else:
                    anno_input = anno_input + word + " "
            annotated_input.append(anno_input)   
            corrections.append(annotated_sentence)
        return jsonify({"corrections": corrections, "annotated_input": annotated_input})

    else:
        return render_template("index.html", input_text=None, corrections=None)
