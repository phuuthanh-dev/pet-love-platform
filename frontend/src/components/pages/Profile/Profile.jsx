import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  AtSign,
  Grid3x3,
  Heart,
  MessageCircle,
  Gift,
  Calendar,
  Receipt,
  PawPrint,
  Bone,
} from "lucide-react";
import { setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { setSelectedPost } from "@/redux/postSlice";
import CommentDialog from "../../features/posts/CommentDialog";
import { FaBookmark } from "react-icons/fa";
import { followOrUnfollowAPI } from "@/apis/user";
import VerifiedBadge from "../../core/VerifiedBadge";
import UserListItem from "../../features/users/UserListItem";
import useFetchData from "@/hooks/useFetchData";
import { getDonationByUserIdAPI } from "@/apis/donate";
import { BASE_URL } from "@/configs/globalVariables";
import { getPetBySubmittedIdAPI } from "@/apis/pet";
import SubmittedPetTable from "./SubmittedPetTable";
import { fetchAdoptionFormsBySenderIdAPI } from "@/apis/post";
import AdoptionFormTable from "./AdoptionFormTable";

const Profile = () => {
  useFetchData();
  const params = useParams();
  const username = params.username;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useGetUserProfile(username);
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?.id === userProfile?.id;
  const [isFollowing, setIsFollowing] = useState(
    userProfile?.followers.includes(user?.id)
  );
  const [numberFollowers, setNumberFollowers] = useState(
    userProfile?.followers?.length
  );
  const [numberFollowing, setNumberFollowing] = useState(
    userProfile?.following?.length
  );
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [submittedPets, setSubmittedPets] = useState({ results: [] });
  const [adoptionForms, setAdoptionForms] = useState({ results: [] });
  const [petPage, setPetPage] = useState(1);
  const limit = 5;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setNumberFollowers(userProfile?.followers.length);
    setNumberFollowing(userProfile?.following.length);
    setIsFollowing(userProfile?.followers.includes(user?.id));
    if (user) {
      getDonation(userProfile?.id);
      getSubmittedPets(userProfile?.id, petPage);
      getAdoptedPets(userProfile?.id, petPage);
    }
  }, [userProfile, user, petPage]);

  const followOrUnfollowHandler = async () => {
    try {
      if (!user) {
        toast.warning("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const { data } = await followOrUnfollowAPI(userProfile.id);
      if (data.status === 200) {
        setIsFollowing(!isFollowing);
        setNumberFollowers(
          isFollowing ? numberFollowers - 1 : numberFollowers + 1
        );
        dispatch(
          setUserProfile({
            ...userProfile,
            followers: isFollowing
              ? userProfile.followers.filter((id) => id !== user.id)
              : [...userProfile.followers, user.id],
          })
        );
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowClick = (type) => {
    setModalType(type);
    setShowFollowModal(true);
  };

  const getModalUsers = () => {
    if (!userProfile) return [];
    return modalType === "followers"
      ? userProfile.followers
      : userProfile.following;
  };

  const handlePostClick = async (post) => {
    try {
      const { data } = await authorizedAxiosInstance.get(
        `${BASE_URL}/post/${post._id}/getpostbyid`
      );
      dispatch(setSelectedPost(data.data));
      setShowPostModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getDonation = async (userId) => {
    const { data } = await getDonationByUserIdAPI(userId, 1, 5);
    setDonations(data.data.results);
  };

  const getSubmittedPets = async (userId, page) => {
    try {
      const { data } = await getPetBySubmittedIdAPI(userId, { page, limit });
      setSubmittedPets(data.data);
    } catch (error) {
      console.error("Error fetching submitted pets:", error);
    }
  };

  const getAdoptedPets = async (userId, page) => {
    try {
      const { data } = await fetchAdoptionFormsBySenderIdAPI(
        userId,
        page,
        limit
      );

      setAdoptionForms(data.data);
    } catch (error) {
      console.error("Error fetching adopted pets:", error);
    }
  };

  const handleCheckSubmit = async () => {
    await getAdoptedPets(userProfile?.id, petPage);
  };

  const handlePetPageChange = (newPage) => {
    setPetPage(newPage);
  };

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts
      : activeTab === "saved"
      ? userProfile?.bookmarks
      : donations;

  return (
    <div
      className="flex max-w-8xl justify-center mx-auto"
      style={{ padding: "0 100px" }}
    >
      <div className="flex flex-col gap-20 p-8 w-full">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar
              className="h-40 w-40 rounded-full object-cover"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="text-xl" style={{ fontWeight: "400" }}>
                  {userProfile?.username}
                </span>
                {userProfile?.isVerified && <VerifiedBadge size={18} />}
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Chỉnh sửa trang cá nhân
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Cài đặt
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className="h-8"
                      onClick={followOrUnfollowHandler}
                    >
                      Bỏ theo dõi
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-[#0095F6] hover:bg-[#3192d2] h-8"
                    onClick={followOrUnfollowHandler}
                  >
                    Theo dõi
                  </Button>
                )}
                {!isLoggedInUserProfile && (
                  <Button
                    variant="secondary"
                    className="h-8"
                    onClick={() => navigate(`/chat/${userProfile?.id}`)}
                  >
                    Nhắn tin
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-8">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  bài viết
                </p>
                <p
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => handleFollowClick("followers")}
                >
                  <span className="font-semibold">{numberFollowers} </span>
                  người theo dõi
                </p>
                <p
                  className="cursor-pointer hover:opacity-70"
                  onClick={() => handleFollowClick("following")}
                >
                  Đang theo dõi
                  <span className="font-semibold"> {numberFollowing} </span>
                  người dùng
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm" style={{ fontWeight: "600" }}>
                  {userProfile?.lastName} {userProfile?.firstName}
                </span>
                <Badge
                  className="w-fit"
                  variant="secondary"
                  style={{ fontWeight: "400" }}
                >
                  <AtSign size={14} />{" "}
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span className="text-sm" style={{ fontWeight: "400" }}>
                  {userProfile?.bio}
                </span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer flex items-center gap-2 ${
                activeTab === "posts" ? "font-bold" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("posts")}
            >
              <Grid3x3 size={18} /> BÀI VIẾT
            </span>
            <span
              className={`py-3 cursor-pointer flex items-center gap-2 ${
                activeTab === "saved" ? "font-bold" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("saved")}
            >
              <FaBookmark size={16} /> ĐÃ LƯU
            </span>
            {user && (
              <span
                className={`py-3 cursor-pointer flex items-center gap-2 ${
                  activeTab === "donations" ? "font-bold" : "text-gray-500"
                }`}
                onClick={() => handleTabChange("donations")}
              >
                <Gift size={18} /> LỊCH SỬ QUYÊN GÓP
              </span>
            )}
            {user && (
              <span
                className={`py-3 cursor-pointer flex items-center gap-2 ${
                  activeTab === "pets" ? "font-bold" : "text-gray-500"
                }`}
                onClick={() => handleTabChange("pets")}
              >
                <PawPrint size={18} /> THÚ CƯNG
              </span>
            )}
            {user && (
              <span
                className={`py-3 cursor-pointer flex items-center gap-2 ${
                  activeTab === "adopts" ? "font-bold" : "text-gray-500"
                }`}
                onClick={() => handleTabChange("adopts")}
              >
                <Bone size={18} /> NHẬN NUÔI
              </span>
            )}
          </div>
          <div className="min-h-[200px]">
            {activeTab === "pets" ? (
              submittedPets.results.length > 0 ? (
                <SubmittedPetTable
                  data={submittedPets}
                  onPageChange={handlePetPageChange}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                  <PawPrint size={48} className="mb-4 text-gray-400" />
                  <p>Chưa gửi đi con pet nào</p>
                </div>
              )
            ) : activeTab === "adopts" ? (
              adoptionForms.results.length > 0 ? (
                <AdoptionFormTable
                  data={adoptionForms}
                  onPageChange={handlePetPageChange}
                  currentUser={user}
                  onCheckSubmit={handleCheckSubmit}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                  <Bone size={48} className="mb-4 text-gray-400" />
                  <p>Chưa nhận nuôi con pet nào</p>
                </div>
              )
            ) : activeTab === "donations" ? (
              donations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 font-medium text-gray-900">
                          Ngày
                        </th>
                        <th className="px-6 py-4 font-medium text-gray-900">
                          Số tiền
                        </th>
                        <th className="px-6 py-4 font-medium text-gray-900">
                          Chiến dịch
                        </th>
                        <th className="px-6 py-4 font-medium text-gray-900">
                          Thú cưng
                        </th>
                        <th className="px-6 py-4 font-medium text-gray-900">
                          Mã giao dịch
                        </th>
                        <th className="px-6 py-4 font-medium text-gray-900">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {donations.map((donation) => (
                        <tr
                          key={donation._id}
                          className="bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-500" />
                              <span>
                                {new Date(
                                  donation.createdAt
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-medium text-green-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(donation.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900 line-clamp-1">
                              {donation?.campaign?.title || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 line-clamp-1">
                                {donation?.pet?.name || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Receipt size={14} className="text-gray-500" />
                              <span className="text-gray-500">
                                {donation?.code}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              style={{
                                color:
                                  donation.status === "pending"
                                    ? "yellow"
                                    : donation.status === "completed"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {donation.status.charAt(0).toUpperCase() +
                                donation.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 py-10">
                  <Gift size={48} className="mb-4 text-gray-400" />
                  <p>Chưa có lịch sử quyên góp nào</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {displayedPost?.map((post) => (
                  <div
                    key={post._id}
                    className="relative group cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    {post.image?.[0] ? (
                      <img
                        src={post.image[0]}
                        alt="postimage"
                        className="rounded-sm w-full aspect-square object-cover"
                      />
                    ) : (
                      post.video?.[0] && (
                        <video
                          src={post.video[0]}
                          autoPlay
                          muted
                          loop
                          className="rounded-sm w-full aspect-square object-cover"
                        />
                      )
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!displayedPost?.length && (
                  <div className="col-span-3 flex items-center justify-center text-gray-500">
                    Không có bài viết nào
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CommentDialog open={showPostModal} setOpen={setShowPostModal} />
      <Dialog open={showFollowModal} onOpenChange={setShowFollowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {modalType === "followers" ? "Followers" : "Following"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {getModalUsers().map((userId) => (
              <UserListItem
                key={userId}
                userId={userId}
                onClose={() => setShowFollowModal(false)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
