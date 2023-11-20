from flask import Flask, jsonify, request, render_template, Blueprint
from transformers import pipeline

bp = Blueprint("gec", __name__)
corrector = pipeline("text2text-generation", model="../server/gec-t5-base-40ep")

@bp.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # get input from the form in templates/index.html
        input_text = request.form.get("input_text")
        sentences = input_text.split(".") # separate user input into several sentences using period as delimiter
        corrections = []
        annotated_input = []
        for i in range(len(sentences)):
            if len(sentences[i]) == 0:
                continue
            # pass sentences
            corrected = corrector(f"grammar: {sentences[i]}")
            corrected_text = corrected[0]["generated_text"]
            
            # add span with class for all changed string
            # compare original sentences and model correction and add span where there's a change in the sentences
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
            # return the results in json format
        return jsonify({"corrections": corrections, "annotated_input": annotated_input})

    else:
        # if there not request for correction, just render the form
        return render_template("index.html", input_text=None, corrections=None)
