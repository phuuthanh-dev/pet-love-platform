import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split

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

# Danh sách từ khóa liên quan đến loài chó
related_keywords = ['chó', 'cún']

# Bước 6: Dự đoán giống chó dựa trên câu hỏi
def predict_breed(user_input):
    # Kiểm tra nếu câu hỏi có chứa từ khóa liên quan không
    if not any(keyword in user_input.lower() for keyword in related_keywords):
        return "Câu hỏi của bạn không liên quan đến các tiêu chí về giống chó. Vui lòng nhập câu hỏi liên quan."

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
example_input = "tôi muốn tìm 1 loài chó mạnh mẽ để bảo vệ gia đình"
predicted_result = predict_breed(example_input)
print(predicted_result)

# Ví dụ khác với câu hỏi không liên quan
example_input_unrelated = "tôi muốn tìm 1 chiếc ô tô màu đỏ"
predicted_result_unrelated = predict_breed(example_input_unrelated)
print(predicted_result_unrelated)
