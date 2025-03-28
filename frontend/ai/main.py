import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import thư viện flask-cors
import torch
from ultralytics import YOLO
import cv2
import requests
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from pymongo import MongoClient

load_dotenv()
# Kết nối tới MongoDB

DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_COLLECTION = os.getenv("COLECTION_NAME_SEARCH")

client = MongoClient(
    DATABASE_URL,
    tls=True,
    tlsAllowInvalidCertificates=True  # Bỏ qua lỗi chứng chỉ
)
db = client[DATABASE_NAME]  
collection = db[DATABASE_COLLECTION] 

# Đường dẫn đến mô hình
model_path = 'yl.pt'
model = YOLO(model_path)

# Tạo ứng dụng Flask
app = Flask(__name__)

# Kích hoạt CORS cho toàn bộ ứng dụng
CORS(app)

# Hàm để tải ảnh từ URL
def load_image_from_url(image_url):
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        image_arr = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(image_arr, cv2.IMREAD_COLOR)
        if img is None:
            return None, "Không thể tải ảnh, vui lòng kiểm tra URL."
        return img, None
    except Exception as e:
        return None, f"Lỗi khi tải ảnh: {e}"

@app.route('/detect', methods=['POST'])
def detect_pets():
    data = request.get_json()
    
    if 'image_url' not in data:
        return jsonify({'error': 'Vui lòng cung cấp đường dẫn URL của hình ảnh'}), 400
    
    image_url = data['image_url']
    img, error = load_image_from_url(image_url)
    
    if img is None:
        return jsonify({'error': error}), 400

    results = model.predict(source=img, conf=0.5)

    detected_classes = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            detected_classes.append(class_name)

    result = collection.find_one({"name": {"$in": detected_classes}})

    if result:
        result['_id'] = str(result['_id'])
        if 'breed' in result:
            result['breed'] = str(result['breed'])
        return jsonify({'detected_objects': result, 'name': detected_classes})
    else:
        return jsonify({'message': 'Không tìm thấy kết quả phù hợp trong cơ sở dữ liệu', 'name': detected_classes})

# def get_dog_by_text_search(dog_search):
#     file_path = './Updated_and_Balanced_Labeled_Dog_Breed_Data.csv'
#     df = pd.read_csv(file_path)

#     X = df['User Question'].values
#     y = df[['Labrador_retriever', 'Golden_retriever', 'German_shepherd', 'French_bulldog',
#             'Chihuahua', 'beagle', 'Siberian_husky', 'boxer', 'Border_collie', 'Shih-Tzu']].values
    
#     vectorizer = TfidfVectorizer(stop_words='english')
#     X_tfidf = vectorizer.fit_transform(X)

#     X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

#     knn = KNeighborsClassifier(n_neighbors=3)
#     knn.fit(X_train, y_train)
    
#     related_keywords = ['chó', 'cún']

#     if not any(keyword in dog_search.lower() for keyword in related_keywords):
#         return "Câu hỏi của bạn không liên quan đến các tiêu chí về giống chó. Vui lòng nhập câu hỏi liên quan."

#     user_input_tfidf = vectorizer.transform([dog_search])
#     predicted_breeds = knn.predict(user_input_tfidf)
    
#     breed_names = ['Labrador_retriever', 'Golden_retriever', 'German_shepherd', 'French_bulldog',
#                    'Chihuahua', 'beagle', 'Siberian_husky', 'boxer', 'Border_collie', 'Shih-Tzu']
    
#     result = [breed for breed, label in zip(breed_names, predicted_breeds[0]) if label == 1]
    
#     if not result:
#         return "Không tìm thấy giống chó phù hợp."

#     dog_info_list = []
#     for breed in result:
#         dog_info = collection.find_one({"name": breed})
#         if dog_info:
#             dog_info['_id'] = str(dog_info['_id'])
#             dog_info_list.append(dog_info)
    
#     if not dog_info_list:
#         return "Không tìm thấy thông tin chi tiết về giống chó trong cơ sở dữ liệu."
    
#     return dog_info_list

from sklearn.metrics.pairwise import cosine_similarity

def get_dog_by_text_search(dog_search, similarity_threshold=0.5):
    file_path = './Updated_and_Balanced_Labeled_Dog_Breed_Data.csv'
    df = pd.read_csv(file_path)

    X = df['User Question'].values  # Dữ liệu câu hỏi
    y = df[['Labrador_retriever', 'Golden_retriever', 'German_shepherd', 'French_bulldog',
            'Chihuahua', 'beagle', 'Siberian_husky', 'boxer', 'Border_collie', 'Shih-Tzu']].values
    
    vectorizer = TfidfVectorizer(stop_words='english')
    X_tfidf = vectorizer.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

    knn = KNeighborsClassifier(n_neighbors=3)
    knn.fit(X_train, y_train)
    
    related_keywords = ['chó', 'cún']

    # Kiểm tra nếu câu hỏi không chứa từ khóa liên quan
    if not any(keyword in dog_search.lower() for keyword in related_keywords):
        return "Câu hỏi của bạn không liên quan đến các tiêu chí về giống chó. Vui lòng nhập câu hỏi liên quan."

    # Chuyển đổi câu hỏi người dùng thành vector TF-IDF
    user_input_tfidf = vectorizer.transform([dog_search])
    
    # Tính độ tương đồng giữa câu hỏi của người dùng và tập câu hỏi trong dataset
    similarities = cosine_similarity(user_input_tfidf, X_tfidf)
    
    # Lấy giá trị độ tương đồng cao nhất
    max_similarity = similarities.max()
    print(max_similarity)
    # Nếu độ tương đồng thấp hơn ngưỡng, trả về thông báo
    if max_similarity < similarity_threshold:
        return f"Câu hỏi của bạn không đủ tương đồng (tương đồng tối đa: {max_similarity:.2f}) với bất kỳ câu hỏi nào trong dataset."

    # Nếu độ tương đồng vượt qua ngưỡng, tiếp tục với dự đoán giống chó
    predicted_breeds = knn.predict(user_input_tfidf)
    
    breed_names = ['Labrador_retriever', 'Golden_retriever', 'German_shepherd', 'French_bulldog',
                   'Chihuahua', 'beagle', 'Siberian_husky', 'boxer', 'Border_collie', 'Shih-Tzu']
    
    # Chỉ trả về những giống chó có nhãn 1
    result = [breed for breed, label in zip(breed_names, predicted_breeds[0]) if label == 1]
    
    # Nếu không có giống chó nào phù hợp, trả về thông báo
    if not result:
        return "Không tìm thấy giống chó phù hợp."
    
    # Nếu có kết quả từ mô hình, tìm kiếm thông tin về giống chó trong MongoDB
    dog_info_list = []
    for breed in result:
        dog_info = collection.find_one({"name": breed})  # Truy vấn trong MongoDB theo tên giống chó
        if dog_info:
            dog_info['_id'] = str(dog_info['_id'])  # Chuyển ObjectId thành chuỗi nếu có
            dog_info_list.append(dog_info)  # Thêm thông tin giống chó vào danh sách
    
    # Nếu không tìm thấy bất kỳ thông tin nào trong cơ sở dữ liệu
    if not dog_info_list:
        return "Không tìm thấy thông tin chi tiết về giống chó trong cơ sở dữ liệu."
    
    return dog_info_list

    # return result


@app.route('/search/<string:dog_search>', methods=['GET'])
def get_dog_by_search(dog_search):
    result = get_dog_by_text_search(dog_search)
    if result:
        return jsonify(result)
    return jsonify({"error": "Dog not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
