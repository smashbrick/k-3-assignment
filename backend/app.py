from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore


cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)
CORS(app)




# POST /api/createQuestion
@app.route('/api/createQuestion', methods=['POST'])
def create_question():
    data = request.get_json()
    new_question = {
        "question_text": data['questionText'],
        "option1": data['options'][0],
        "option2": data['options'][1],
        "option3": data['options'][2],
        "option4": data['options'][3],
        "answer": data['correctAnswer'],
        "marks": data['marks']
    }

    doc_ref = db.collection("users").document()
    doc_ref.set(new_question)

    return jsonify({"message": "Question created successfully!"}), 201

# # DELETE /api/deleteQuestionByID
@app.route('/api/deleteQuestionByID/<string:question_id>', methods=['DELETE'])
def delete_question(question_id):
    db.collection("users").document(question_id).delete()
    return jsonify({"message": "Question deleted successfully!"}), 200

# GET /api/getQuizQuestions
@app.route('/api/getQuizQuestions', methods=['GET'])
def get_questions():
    try:
        users_ref = db.collection("users")
        docs = users_ref.stream()
        questions = []

        #  10
        for doc in docs:
            # print(f"Document ID {doc.id} : {doc.to_dict()}")
            a = doc.to_dict()
            # print(a)
            options = [a['option1'], a['option2'], a['option3'], a['option4']]
            question = {
                "id": doc.id,
                "question_text": a['question_text'],
                "options": options,
                "correct_answer": a['answer'],
                "marks": a['marks']
            }

            print(question)
            questions.append(question)
            
        return jsonify(questions), 200
    except Exception as e:
        app.logger.error(f"Error fetching quiz data: {str(e)}")
        return jsonify({"error": "Failed to load quiz questions."}), 500

if __name__ == '__main__':
    app.run(debug=True)
