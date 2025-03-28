import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "../ui/input";
import { MessageCircleCode, ImagePlus, Loader2, SmilePlus } from "lucide-react";
import { setMessages, setSurveyActive } from "@/redux/chatSlice";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getChatUserAPI, getProfileByIdAPI } from "@/apis/user";
import { sendMessageAPI, sendImageMessageAPI } from "@/apis/message";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import { Button } from "../ui/button";
import Messages from "../features/messages/Messages";
import {
  fetchAllAdoptionPostsByBreedAPI,
  getUserBehaviorAPI,
} from "@/apis/post";
import { getBreedsByIdAPI, getBreedsAPI } from "@/apis/pet";
import EmojiPicker from "emoji-picker-react";
import { chatbotAPI, recommendBreedsAPI } from "@/apis/chatbot";

const requiredKeywords = ["gợi ý", "thú cưng", "nhận nuôi", "loại pet"];

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [textMessage, setTextMessage] = useState("");
  const { user, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages, isSurveyActive } = useSelector(
    (store) => store.chat
  );
  const dispatch = useDispatch();
  const [chatUsers, setChatUsers] = useState([]);
  const [userBehavior, setUserBehavior] = useState([]);
  const [initialMessageSent, setInitialMessageSent] = useState(() => {
    const sentMessages = JSON.parse(
      localStorage.getItem("sentInitialMessages") || "[]"
    );
    const postId = location.state?.postId;
    return postId ? sentMessages.includes(postId) : false;
  });
  const [isUploading, setIsUploading] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  const aiUser = {
    id: "ai-support",
    username: "AI Support",
    profilePicture:
      "https://imgcdn.stablediffusionweb.com/2024/4/3/34eb3fd4-4f5e-4359-be90-19f0366c0c33.jpg",
    lastMessage: {
      content: "Xin chào! Tôi có thể giúp bạn tìm thú cưng để nhận nuôi.",
      time: new Date().toISOString(),
      from: "ai-support",
    },
  };

  const questions = [
    {
      id: 1,
      text: "Bạn thích thú cưng có kích thước như thế nào?",
      options: ["Nhỏ", "Trung bình", "Lớn"],
    },
    {
      id: 2,
      text: "Bạn muốn thú cưng có mức độ hoạt động ra sao?",
      options: ["Thấp (ít vận động)", "Trung bình", "Cao (rất năng động)"],
    },
    {
      id: 3,
      text: "Bạn có muốn thú cưng dễ huấn luyện không?",
      options: ["Có (dễ)", "Trung bình", "Không (không quan trọng)"],
    },
    {
      id: 4,
      text: "Bạn có không gian ngoài trời rộng rãi không?",
      options: [
        "Có (nhà vườn/sân lớn)",
        "Trung bình (sân nhỏ)",
        "Không (trong nhà)",
      ],
    },
    {
      id: 5,
      text: "Bạn sống ở khí hậu như thế nào?",
      options: ["Nóng (nhiệt đới)", "Lạnh (ôn đới)", "Trung bình (mát mẻ)"],
    },
    {
      id: 6,
      text: "Bạn có kinh nghiệm nuôi chó trước đây không?",
      options: ["Có (đã nuôi)", "Không (lần đầu)"],
    },
    {
      id: 7,
      text: "Bạn muốn thú cưng có lông như thế nào?",
      options: ["Ngắn (ít rụng)", "Trung bình", "Dài (rậm rạp)"],
    },
    {
      id: 8,
      text: "Bạn có trẻ nhỏ hoặc thú cưng khác trong nhà không?",
      options: ["Có", "Không"],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const profileResponse = await getProfileByIdAPI(id);
        const chatUsersResponse = await getChatUserAPI();
        dispatch(setSelectedUser(profileResponse.data.data));
        setChatUsers(chatUsersResponse.data.data);
      } else {
        const { data } = await getChatUserAPI();
        setChatUsers(data.data);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedUser?.id === "ai-support") {
      const fetchUserBehavior = async () => {
        try {
          console.log("🔄 Fetching user behavior...");
          const res = await getUserBehaviorAPI();
          console.log("📊 User behavior data:", res.data.data);
          setUserBehavior(res.data.data);

          const welcomeMessage = {
            _id: Date.now().toString(),
            senderId: "ai-support",
            message:
              "Xin chào! Tôi là AI Support. Bạn muốn tìm thú cưng như thế nào? (Ví dụ: cần gợi ý, cần thú cưng, cần nhận nuôi, cần loại pet,...). Tôi sẽ dựa vào sở thích của bạn để gợi ý!",
            createdAt: new Date().toISOString(),
          };

          const questionsAsked =
            JSON.parse(sessionStorage.getItem("questionsAsked")) || [];
          const surveyCompleted =
            sessionStorage.getItem("surveyCompleted") === "true";

          console.log("📝 Current survey state:", {
            questionsAsked,
            surveyCompleted,
            isSurveyActive,
          });

          if (questionsAsked.length > 0 && !surveyCompleted) {
            console.log("🔄 Resetting incomplete survey...");
            sessionStorage.removeItem("questionsAsked");
            sessionStorage.removeItem("userAnswers");
            sessionStorage.removeItem("surveyCompleted");
            dispatch(setSurveyActive(false));
          }

          dispatch(setMessages([welcomeMessage]));
        } catch (error) {
          console.error("❌ Error fetching user behavior:", error);
          setUserBehavior([]);
        }
      };
      fetchUserBehavior();
    } else {
      console.log("👤 Switching to user chat, clearing messages");
      dispatch(setMessages([]));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    const sendInitialMessage = async () => {
      if (
        location.state?.fromPost &&
        selectedUser &&
        !initialMessageSent &&
        selectedUser.id !== "ai-support"
      ) {
        const {
          postId,
          postTitle,
          petName,
          location: postLocation,
        } = location.state;
        const sentMessages = JSON.parse(
          localStorage.getItem("sentInitialMessages") || "[]"
        );
        if (sentMessages.includes(postId)) {
          return;
        }
        const messageData = {
          text: `Xin chào, tôi đến từ bài viết nhận nuôi: "${postTitle}" - Thú cưng: ${petName} tại ${postLocation}`,
          metadata: {
            type: "adoption_post",
            postId,
            postTitle,
            petName,
            location: postLocation,
          },
        };

        try {
          const { data } = await sendMessageAPI(
            selectedUser.id,
            JSON.stringify(messageData)
          );
          if (data?.success) {
            dispatch(
              setMessages([
                ...messages,
                {
                  ...data.newMessage,
                  message: JSON.stringify(messageData),
                },
              ])
            );
            setInitialMessageSent(true);
          }
          sentMessages.push(postId);
          localStorage.setItem('sentInitialMessages', JSON.stringify(sentMessages));
        } catch (error) {
          console.error("Error sending initial message:", error);
        }
      }
    };

    sendInitialMessage();
  }, [selectedUser, location.state, initialMessageSent]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        setIsUploading(true);
        const loadingMessage = {
          _id: `loading-${Date.now()}`,
          senderId: user?.id,
          message: JSON.stringify({
            text: "",
            type: "loading",
            loadingText: "Đang tải ảnh lên...",
          }),
          createdAt: new Date().toISOString(),
        };
        dispatch(setMessages([...messages, loadingMessage]));

        const metadata = location.state?.fromPost
          ? {
              type: "adoption_post",
              postId: location.state.postId,
              postTitle: location.state.postTitle,
              petName: location.state.petName,
              location: location.state.location,
            }
          : null;

        const { data } = await sendImageMessageAPI(
          selectedUser.id,
          file,
          metadata
        );

        if (data?.success) {
          const updatedMessages = messages.filter(
            (msg) => msg._id !== loadingMessage._id
          );
          dispatch(
            setMessages([
              ...updatedMessages,
              {
                ...data.newMessage,
              },
            ])
          );
        }
      } catch (error) {
        console.error("Error sending image:", error);
        const errorMessage = {
          _id: Date.now().toString(),
          senderId: "ai-support",
          message: "Không thể gửi hình ảnh. Vui lòng thử lại!",
          createdAt: new Date().toISOString(),
        };
        const updatedMessages = messages.filter(
          (msg) => !msg._id.includes("loading-")
        );
        dispatch(setMessages([...updatedMessages, errorMessage]));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAISurveyStart = () => {
    console.log("🔄 Starting new survey due to keyword match");
    sessionStorage.removeItem("questionsAsked");
    sessionStorage.removeItem("userAnswers");
    sessionStorage.removeItem("surveyCompleted");

    const resetMessage = {
      _id: Date.now().toString(),
      senderId: "ai-support",
      message:
        "Tôi sẽ giúp bạn tìm thú cưng phù hợp. Hãy trả lời một số câu hỏi nhé!",
      createdAt: new Date().toISOString(),
    };

    const firstQuestion = {
      _id: Date.now().toString() + "-question",
      senderId: "ai-support",
      message: questions[0].text,
      createdAt: new Date().toISOString(),
      suggestionButtons: questions[0].options.map((option, index) => ({
        index: index + 1,
        caption: option,
      })),
    };

    return [resetMessage, firstQuestion];
  };

  const handleAISurveyProgress = (
    effectiveMessage,
    questionsAsked,
    userAnswers
  ) => {
    const userMessage = {
      _id: Date.now().toString() + "-user",
      senderId: user?.id,
      message: effectiveMessage,
      createdAt: new Date().toISOString(),
    };

    if (questionsAsked.length > 0) {
      userAnswers[questionsAsked[questionsAsked.length - 1]] =
        effectiveMessage.trim();
      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }

    const nextQuestion = questions[questionsAsked.length];
    questionsAsked.push(nextQuestion.text);
    sessionStorage.setItem("questionsAsked", JSON.stringify(questionsAsked));

    const aiResponse = {
      _id: Date.now().toString(),
      senderId: "ai-support",
      message: nextQuestion.text,
      createdAt: new Date().toISOString(),
      suggestionButtons: nextQuestion.options.map((option, index) => ({
        index: index + 1,
        caption: option,
      })),
    };

    return [userMessage, aiResponse];
  };

  const createUserMessage = (effectiveMessage) => ({
    _id: Date.now().toString() + "-user",
    senderId: user?.id,
    message: effectiveMessage,
    createdAt: new Date().toISOString(),
  });

  const handleAIResponse = async (selectedPet, breedName) => {
    const careInstructions = await chatbotAPI(breedName);

    return {
      _id: Date.now().toString(),
      senderId: "ai-support",
      message: `Bạn đã chọn **${selectedPet.petName}** tại ${selectedPet.location} (${selectedPet.adopt_status}). Đây là hướng dẫn chăm sóc cho giống **${breedName}**:\n${careInstructions}\nBạn muốn hỏi chi tiết hơn về phần nào không? (Ví dụ: dinh dưỡng, vận động, huấn luyện, v.v.)`,
      createdAt: new Date().toISOString(),
    };
  };

  const handleAIChat = async (effectiveMessage) => {
    const userMessage = createUserMessage(effectiveMessage);
    const hasRequiredKeyword = requiredKeywords.some((keyword) =>
      effectiveMessage.includes(keyword)
    );

    if (hasRequiredKeyword) {
      const [resetMessage, firstQuestion] = handleAISurveyStart();
      dispatch(
        setMessages([...messages, userMessage, resetMessage, firstQuestion])
      );
      dispatch(setSurveyActive(true));
      sessionStorage.setItem(
        "questionsAsked",
        JSON.stringify([questions[0].text])
      );
      return true;
    }

    dispatch(setMessages([...messages, userMessage]));
    dispatch(setSurveyActive(true));

    let questionsAsked =
      JSON.parse(sessionStorage.getItem("questionsAsked")) || [];
    let userAnswers = JSON.parse(sessionStorage.getItem("userAnswers")) || {};
    let breeds = JSON.parse(sessionStorage.getItem("breeds"));
    const surveyCompleted =
      sessionStorage.getItem("surveyCompleted") === "true";

    if (!breeds) {
      const getAllPetsBreeds = await getBreedsAPI();
      breeds = getAllPetsBreeds.data.data || [];
      sessionStorage.setItem("breeds", JSON.stringify(breeds));
    }

    if (!surveyCompleted && questionsAsked.length < questions.length) {
      const [userMsg, aiResponse] = handleAISurveyProgress(
        effectiveMessage,
        questionsAsked,
        userAnswers
      );
      dispatch(setMessages([...messages, userMsg, aiResponse]));
      return true;
    }

    if (!surveyCompleted && questionsAsked.length === questions.length) {
      userAnswers[questionsAsked[questionsAsked.length - 1]] =
        effectiveMessage.trim();
      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));

      const userPreferences = `
        Kích thước: ${userAnswers[questions[0].text]}
        Mức độ hoạt động: ${userAnswers[questions[1].text]}
        Dễ huấn luyện: ${userAnswers[questions[2].text]}
        Không gian ngoài trời: ${userAnswers[questions[3].text]}
        Khí hậu: ${userAnswers[questions[4].text]}
        Kinh nghiệm nuôi chó: ${userAnswers[questions[5].text]}
        Độ dài lông: ${userAnswers[questions[6].text]}
        Có trẻ nhỏ/thú cưng khác: ${userAnswers[questions[7].text]}
      `;

      const breedList = breeds.map((breed) => breed.name);

      dispatch(
        setMessages([
          ...messages,
          userMessage,
          {
            _id: "loading",
            senderId: "ai-support",
            message: "🔄 AI đang phân tích sở thích của bạn...",
          },
        ])
      );

      try {
        const result = await recommendBreedsAPI(userPreferences, breedList);
        const recommendedBreeds = result.breeds;
        const explanation = result.explanation;

        const geminiResponse = {
          _id: Date.now().toString(),
          senderId: "ai-support",
          message: `Dựa trên sở thích của bạn, tôi đề xuất các giống chó sau:\n\n**${recommendedBreeds.join(
            ", "
          )}**\n\n${explanation}`,
          createdAt: new Date().toISOString(),
        };

        const allPosts = [];
        for (const breedName of recommendedBreeds) {
          const breed = breeds.find(
            (b) => b.name.toLowerCase() === breedName.toLowerCase()
          );
          if (breed) {
            const postsData = await fetchAllAdoptionPostsByBreedAPI(
              1,
              breed._id
            );
            allPosts.push(...(postsData.data.data?.results || []));
          }
        }

        let postsResponse;
        if (allPosts.length > 0) {
          postsResponse = {
            _id: Date.now().toString() + "-posts",
            senderId: "ai-support",
            message: `Đây là các bài đăng nhận nuôi phù hợp:\n\n${allPosts
              .map(
                (post, index) =>
                  `${index + 1}. ${post.pet?.name || "Không xác định"} - ${
                    post.location || "Không rõ vị trí"
                  } (${post.adopt_status || "Không rõ trạng thái"})`
              )
              .join(
                "\n"
              )}\n\nBạn muốn biết thêm về thú cưng nào? Hãy nhập số thứ tự!`,
            createdAt: new Date().toISOString(),
            suggestionButtons: allPosts.map((post, index) => ({
              index: index + 1,
              caption: post.caption || "Không có tiêu đề",
              location: post.location || "Không rõ vị trí",
              adopt_status: post.adopt_status || "Không rõ trạng thái",
              petName: post.pet?.name || "Không xác định",
              url: `${window.location.origin}/adoptDetail/${post._id}`,
              petBreed: post.pet?.breed || "Không xác định",
            })),
          };
        }

        const newMessages = [
          ...messages.filter((msg) => msg._id !== "loading"),
          userMessage,
          geminiResponse,
        ];
        if (postsResponse) {
          newMessages.push(postsResponse);
        }
        dispatch(setMessages(newMessages));

        sessionStorage.setItem("surveyCompleted", "true");
        dispatch(setSurveyActive(false));
        return true;
      } catch (error) {
        console.error("❌ Error in sendMessageHandler:", error);
        dispatch(
          setMessages([
            ...messages.filter((msg) => msg._id !== "loading"),
            {
              _id: Date.now().toString(),
              senderId: "ai-support",
              message: "Có lỗi xảy ra khi phân tích. Vui lòng thử lại!",
              createdAt: new Date().toISOString(),
            },
          ])
        );
      }

      sessionStorage.setItem("surveyCompleted", "true");
      dispatch(setSurveyActive(false));
      return true;
    }

    if (surveyCompleted) {
      const lastAiMessage = messages.findLast(
        (msg) => msg.senderId === "ai-support" && msg.suggestionButtons
      );
      if (lastAiMessage && lastAiMessage.suggestionButtons) {
        const selectedIndex = parseInt(effectiveMessage) || -1;
        if (
          selectedIndex > 0 &&
          selectedIndex <= lastAiMessage.suggestionButtons.length
        ) {
          const selectedPet =
            lastAiMessage.suggestionButtons[selectedIndex - 1];

          let breedName = "không xác định";
          try {
            const breedRes = await getBreedsByIdAPI(selectedPet.petBreed);
            breedName = breedRes.data.data.name;
          } catch (error) {
            console.error("Lỗi lấy giống thú cưng:", error);
          }

          dispatch(
            setMessages([
              ...messages,
              userMessage,
              {
                _id: "loading",
                senderId: "ai-support",
                message: "🔄 AI đang tìm kiếm thông tin chăm sóc...",
              },
            ])
          );

          try {
            const aiResponse = await handleAIResponse(selectedPet, breedName);
            dispatch(
              setMessages([
                ...messages.filter((msg) => msg._id !== "loading"),
                userMessage,
                aiResponse,
              ])
            );
            dispatch(setSurveyActive(false));
            return true;
          } catch (error) {
            console.error("Error getting care instructions:", error);
            dispatch(
              setMessages([
                ...messages.filter((msg) => msg._id !== "loading"),
                userMessage,
                {
                  _id: Date.now().toString(),
                  senderId: "ai-support",
                  message:
                    "Xin lỗi, tôi không thể lấy thông tin chăm sóc lúc này. Vui lòng thử lại sau!",
                  createdAt: new Date().toISOString(),
                },
              ])
            );
          }
        }
      }

      dispatch(
        setMessages([
          ...messages,
          userMessage,
          {
            _id: Date.now().toString(),
            senderId: "ai-support",
            message:
              "Vui lòng chọn số hợp lệ từ danh sách hoặc hỏi chi tiết về chăm sóc!",
            createdAt: new Date().toISOString(),
          },
        ])
      );
      dispatch(setSurveyActive(false));
      return true;
    }

    return false;
  };

  const handleRegularChat = async (receiverId, effectiveMessage) => {
    const { data } = await sendMessageAPI(receiverId, effectiveMessage);
    if (!data?.success) {
      throw new Error("Message send failed");
    }
    dispatch(setMessages([...messages, data.newMessage]));
    dispatch(setSurveyActive(false));
  };

  const sendMessageHandler = async (receiverId, messageOverride = null) => {
    const effectiveMessage = messageOverride || textMessage;
    if (!effectiveMessage.trim()) {
      console.log("Empty message, not sending");
      return;
    }

    try {
      if (receiverId === "ai-support") {
        console.log("🤖 Processing AI message...");
        const handled = await handleAIChat(effectiveMessage);
        if (handled) {
          setTextMessage("");
          return;
        }
      } else {
        await handleRegularChat(receiverId, effectiveMessage);
        setTextMessage("");
      }
    } catch (error) {
      console.error("❌ Error in sendMessageHandler:", error);
      const errorMessage = {
        _id: Date.now().toString(),
        senderId: "ai-support",
        message: "Có lỗi xảy ra. Vui lòng thử lại!",
        createdAt: new Date().toISOString(),
      };
      dispatch(setMessages([...messages, errorMessage]));
      setTextMessage("");
    }
  };

  const onEmojiClick = (emoji) => {
    if (inputRef.current) {
      const input = inputRef.current;
      const cursorPosition = input.selectionStart;
      const textBefore = textMessage.substring(0, cursorPosition);
      const textAfter = textMessage.substring(cursorPosition);
      const newMessage = `${textBefore}${emoji.emoji}${textAfter}`;
      setTextMessage(newMessage);

      setTimeout(() => {
        input.selectionStart = input.selectionEnd =
          cursorPosition + emoji.emoji.length;
        input.focus();
      }, 0);
    }
  };

  return (
    <div className="flex ml-[20px] h-screen">
      <section className="w-full md:w-1/5 border-r border-r-gray-300">
        <h1 className="font-bold my-8 text-xl">{user?.username}</h1>
        <div className="flex items-center justify-between mb-4 pr-4">
          <span className="text-md font-bold">Tin nhắn</span>
          <span className="text-sm font-bold text-gray-500">
            Tin nhắn đang chờ
          </span>
        </div>
        <div className="overflow-y-auto h-[80vh]">
          <div
            key={aiUser.id}
            onClick={() => dispatch(setSelectedUser(aiUser))}
            className={`flex gap-3 items-center cursor-pointer py-2 ${
              selectedUser?.id === aiUser.id
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <Avatar
                className="w-14 h-14"
                style={{ border: "1px solid #e0e0e0", position: "static" }}
              >
                <AvatarImage src={aiUser.profilePicture} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <span className="w-4 h-4 bg-green-500 border-2 border-white rounded-full ml-[-10px] mt-8"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{aiUser.username}</span>
              <span className="text-xs text-gray-500">Đang hoạt động</span>
            </div>
          </div>
          {chatUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?.id);
            const isSelected = selectedUser?.id === suggestedUser?.id;
            return (
              <div
                key={suggestedUser.id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`flex gap-3 items-center cursor-pointer py-2 ${
                  isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Avatar
                    className="w-14 h-14"
                    style={{ border: "1px solid #e0e0e0", position: "static" }}
                  >
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="w-4 h-4 bg-green-500 border-2 border-white rounded-full ml-[-10px] mt-8"></span>
                  )}
                </div>
                <div className="flex flex-col">
                  {suggestedUser.firstName && suggestedUser.lastName ? (
                    <span className="text-sm">
                      {suggestedUser?.lastName} {suggestedUser?.firstName}
                    </span>
                  ) : (
                    <span className="text-sm">{suggestedUser?.username}</span>
                  )}
                  {isOnline ? (
                    <span className="text-xs text-gray-500">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className={`text-xs text-gray-500`}>
                      {suggestedUser?.lastMessage?.from === user?.id
                        ? "Bạn: "
                        : ""}
                      {(() => {
                        try {
                          const content = JSON.parse(
                            suggestedUser?.lastMessage?.content
                          );
                          const text = content.text || "Không có tin nhắn";
                          return text.length > 14
                            ? `${text.substring(0, 14)}...`
                            : text;
                        } catch (e) {
                          const text =
                            suggestedUser?.lastMessage?.content ||
                            "Không có tin nhắn";
                          return text.length > 14
                            ? `${text.substring(0, 14)}...`
                            : text;
                        }
                      })()}{" "}
                      • {calculateTimeAgo(suggestedUser?.lastMessage?.time)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar style={{ border: "1px solid #e0e0e0" }}>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {selectedUser.firstName && selectedUser.lastName ? (
                  <span className="text-sm">
                    {selectedUser?.lastName} {selectedUser?.firstName}
                  </span>
                ) : (
                  <span className="text-sm">{selectedUser?.username}</span>
                )}
              </span>
            </div>
            {location.state?.fromPost && (
              <Button
                variant="ghost"
                className="ml-auto"
                onClick={() =>
                  navigate(`/adoptDetail/${location.state.postId}`)
                }
              >
                Xem bài viết gốc
              </Button>
            )}
          </div>
          <Messages
            selectedUser={selectedUser}
            postInfo={location.state}
            sendMessageHandler={sendMessageHandler}
            setTextMessage={setTextMessage}
          />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <div className="relative mr-2" style={{ width: "89%" }}>
              <div
                className={`absolute z-10 transition-all duration-300 ease-in-out ${
                  emojiPicker
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ bottom: "100%", right: "0" }}
                ref={emojiPickerRef}
              >
                <EmojiPicker open={emojiPicker} onEmojiClick={onEmojiClick} />
              </div>
              <Input
                ref={inputRef}
                onChange={(e) => setTextMessage(e.target.value)}
                value={textMessage}
                type="text"
                className="w-full focus-visible:ring-transparent"
                placeholder={
                  selectedUser.id === "ai-support" && isSurveyActive
                    ? "Vui lòng bấm vào button để trả lời"
                    : "Nhắn tin..."
                }
                disabled={selectedUser.id === "ai-support" && isSurveyActive}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessageHandler(selectedUser?.id);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-200"
                onClick={() => setEmojiPicker(!emojiPicker)}
              >
                <SmilePlus
                  size={18}
                  strokeWidth={1.5}
                  className="text-gray-600"
                />
              </Button>
            </div>
            <label
              className={`cursor-pointer mr-2 ${
                isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
              ) : (
                <ImagePlus className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              )}
            </label>
            <Button onClick={() => sendMessageHandler(selectedUser?.id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
