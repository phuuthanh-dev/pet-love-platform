import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import pymongo
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_COLLECTION = os.getenv("COLECTION_NAME_SEARCH")



client = pymongo.MongoClient(DATABASE_URL)  
client = pymongo.MongoClient(
    DATABASE_URL,
    tls=True,
    tlsAllowInvalidCertificates=True  # Bỏ qua lỗi chứng chỉ
)
db = client[DATABASE_NAME]  

collection = db[DATABASE_COLLECTION]  


app = Flask(__name__)

# Root endpoint (optional)
@app.route('/')
def home():
    return "Welcome to the Dog API"

# # Get all dogs
# @app.route('/dogs', methods=['GET'])
# def get_dogs():
#     return jsonify(dogs_data)



def get_dog_by_text_search(dog_search):
    # Bước 1: Tải dữ liệu
    file_path = './Updated_and_Balanced_Labeled_Dog_Breed_Data.csv'  # Đường dẫn đến file CSV của bạn
    df = pd.read_csv(file_path)

    # Bước 2: Chuẩn bị dữ liệu
    X = df['User Question'].values  # Dữ liệu câu hỏi
    y = df[['Labrador_retriever', 'Golden_retriever', 'German_shepherd', 'French_bulldog',
            'Chihuahua', 'beagle', 'Siberian_husky', 'boxer', 'Border_collie', 'Shih-Tzu']].values  # Nhãn giống chó

    # Bước 3: Chuyển đổi câu hỏi thành vector TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    X_tfidf = vectorizer.fit_transform(X)

    # Bước 4: Chia dữ liệu thành tập huấn luyện và kiểm tra
    X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

    # Bước 5: Huấn luyện mô hình KNN
    knn = KNeighborsClassifier(n_neighbors=3)
    knn.fit(X_train, y_train)

    # Bước 6: Dự đoán giống chó dựa trên câu hỏi
    def predict_breed(user_input):
        # Chuyển đổi câu hỏi người dùng thành vector TF-IDF
        user_input_tfidf = vectorizer.transform([user_input])
        # Dự đoán nhãn
        predicted_breeds = knn.predict(user_input_tfidf)
        # Trả về giống chó tương ứng với nhãn
        breed_names = ['Labrador_retriever', 'Golden_retriever', 'German_shepherd', 'French_bulldog',
                    'Chihuahua', 'beagle', 'Siberian_husky', 'boxer', 'Border_collie', 'Shih-Tzu']
        result = {breed: int(label) for breed, label in zip(breed_names, predicted_breeds[0])}
        return result

    # Ví dụ: Nhập câu hỏi để kiểm tra mô hình
    #example_input = "tôi muốn tìm 1 loài chó phù nhỏ"
    predicted_result = predict_breed(dog_search)
    return predicted_result
    


@app.route('/dogs/<string:dog_id>', methods=['GET'])
def get_dog_by_id(dog_search):
    result = get_dog_by_text_search(dog_search)
    query_result = collection.find_one({"name": dog_search})
    if query_result:
        return jsonify(query_result)
    return jsonify({"error": "Dog not found"}), 404

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
