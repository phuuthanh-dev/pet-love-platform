/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addAdoptionForm } from "@/apis/post";
import { HeartFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getPetByIdAPI } from "@/apis/pet";
import { DatePicker } from "antd";
import moment from "moment";
const CreateAdoptionFormModal = ({ open, setOpen, post, onSubmit }) => {
  const [adopterName, setAdopterName] = useState("");
  const [adopterEmail, setAdopterEmail] = useState("");
  const [adopterPhone, setAdopterPhone] = useState("");
  const [reason, setReason] = useState("");
  const [address, setAddress] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCommitmentModalOpen, setIsCommitmentModalOpen] = useState(false);
  const [agreeTerms1, setAgreeTerms1] = useState(false);
  const [agreeTerms2, setAgreeTerms2] = useState(false);
  const [hasSentForm, setHasSentForm] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [expectedDate, setExpectedDate] = useState(null);
  const { user } = useSelector((store) => store.auth);

  const checkUserAlreadySentForm = async (userId) => {
    try {
      const { data } = await getPetByIdAPI(post.pet._id);
      if (data.status === 200) {
        return data.data.adoptionRequests.includes(userId);
      }
      return false;
    } catch (error) {
      console.error("Error checking form status:", error);
      return false;
    }
  };

  useEffect(() => {
    if (open) {
      const checkFormStatus = async () => {
        setIsChecking(true);
        const hasSent = await checkUserAlreadySentForm(user.id);
        setHasSentForm(hasSent);
        setIsChecking(false);
      };

      fetchProvinces();
      setSelectedUser(user);
      setAdopterName(user?.name || "");
      setAdopterEmail(user.email);
      setAdopterPhone(user.phoneNumber || "");
      setAddress("");
      setExpectedDate(null);
      checkFormStatus();
    }
  }, [open, user, post.pet._id]);

  const fetchProvinces = async () => {
    try {
      setLoadingAddress(true);
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      toast.error("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setLoadingAddress(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      setLoadingAddress(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts);
      setDistrictCode("");
      setWards([]);
      setWardCode("");
    } catch (error) {
      toast.error("Không thể tải danh sách quận/huyện");
    } finally {
      setLoadingAddress(false);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      setLoadingAddress(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards);
      setWardCode("");
    } catch (error) {
      toast.error("Không thể tải danh sách phường/xã");
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Vui lòng chọn một người dùng trước khi gửi form");
      return;
    }

    // Map codes to names
    const provinceName =
      provinces.find((p) => p.code.toString() === provinceCode)?.name || "";
    const districtName =
      districts.find((d) => d.code.toString() === districtCode)?.name || "";
    const wardName =
      wards.find((w) => w.code.toString() === wardCode)?.name || "";

    if (!provinceName || !districtName || !wardName) {
      toast.error(
        "Vui lòng chọn đầy đủ tỉnh/thành phố, quận/huyện và phường/xã"
      );
      return;
    }

    const formData = {
      adoptionPost: post._id,
      pet: post.pet._id || post.pet,
      sender: selectedUser.id,
      adopter: {
        name: adopterName,
        email: adopterEmail,
        phone: adopterPhone,
        address: {
          province: provinceName,
          district: districtName,
          ward: wardName,
          detail: address,
        },
      },
      reason,
      expectedDate: expectedDate ? expectedDate.toISOString() : null,
    };

    try {
      setLoading(true);
      const { data } = await addAdoptionForm(formData);
      if (data.status === 201) {
        toast.success(data.message || "Form đã được tạo thành công!");
        onSubmit();
        setOpen(false);
        // Reset form
        setAdopterName("");
        setAdopterEmail("");
        setAdopterPhone("");
        setReason("");
        setAddress("");
        setProvinceCode("");
        setDistrictCode("");
        setWardCode("");
        setSelectedUser(null);
        setExpectedDate(null);
        setAgreeTerms1(false);
        setAgreeTerms2(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-50 rounded-full">
                <HeartFilled style={{ color: "#f472b6", fontSize: "24px" }} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-amber-800 mb-1">
                  Đăng ký nhận nuôi thú cưng
                </h2>
                <p className="text-sm text-gray-500 line-clamp-1">
                  Bài đăng: {post.caption}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Pet Information */}
          {isChecking ? (
            <div className="p-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p>Đang kiểm tra trạng thái đăng ký...</p>
            </div>
          ) : hasSentForm ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p>Bạn đã đăng ký nhận nuôi thú cưng này rồi!</p>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Đóng
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-pink-50/50 rounded-md border border-pink-100">
                <h3 className="text-lg font-medium text-amber-800 mb-2">
                  Thông tin thú cưng
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-pink-700">
                      Tên thú cưng:
                    </span>{" "}
                    {post.pet?.name || "Không rõ"}
                  </p>
                  <p>
                    <span className="font-semibold text-pink-700">Loài:</span>{" "}
                    {post.pet?.species || post.pet?.breed?.name || "Không rõ"}
                  </p>
                  <p>
                    <span className="font-semibold text-pink-700">Tuổi:</span>{" "}
                    {post.pet?.age || "Không rõ"}
                  </p>
                  <p>
                    <span className="font-semibold text-pink-700">
                      Giới tính:
                    </span>{" "}
                    {post.pet?.gender || "Không rõ"}
                  </p>
                </div>
                {post.image?.length > 0 && (
                  <img
                    src={post.image[0]}
                    alt={post.pet?.name || "Pet"}
                    className="mt-2 w-24 h-24 object-cover rounded-md border border-pink-200"
                  />
                )}
              </div>

              <div className="mb-6">
                <Label className="block text-sm font-medium text-pink-700 mb-1">
                  Tên tài khoản
                </Label>
                <Input
                  value={selectedUser?.username}
                  readOnly
                  className="w-full border-pink-200 bg-pink-50/50 text-gray-800 focus-visible:ring-pink-400"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="adopterName"
                    className="block text-sm font-medium text-pink-700 mb-1"
                  >
                    Tên người nhận nuôi
                  </Label>
                  <Input
                    id="adopterName"
                    value={adopterName}
                    onChange={(e) => setAdopterName(e.target.value)}
                    className="w-full border-pink-200 bg-pink-50/50 text-gray-800 focus-visible:ring-pink-400"
                    placeholder="Nhập tên người nhận nuôi"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="adopterEmail"
                    className="block text-sm font-medium text-pink-700 mb-1"
                  >
                    Email
                  </Label>
                  <Input
                    id="adopterEmail"
                    type="email"
                    value={adopterEmail}
                    onChange={(e) => setAdopterEmail(e.target.value)}
                    className="w-full border-pink-200 bg-pink-50/50 text-gray-800 focus-visible:ring-pink-400"
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="adopterPhone"
                    className="block text-sm font-medium text-pink-700 mb-1"
                  >
                    Số điện thoại
                  </Label>
                  <Input
                    id="adopterPhone"
                    type="tel"
                    value={adopterPhone}
                    onChange={(e) => setAdopterPhone(e.target.value)}
                    className="w-full border-pink-200 bg-pink-50/50 text-gray-800 focus-visible:ring-pink-400"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label className="block text-sm font-medium text-pink-700">
                    Địa chỉ
                  </Label>
                  <div>
                    <Select
                      value={provinceCode}
                      onValueChange={(value) => {
                        setProvinceCode(value);
                        fetchDistricts(value);
                      }}
                    >
                      <SelectTrigger className="border-pink-200 bg-pink-50/50 focus:ring-pink-400">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-pink-100">
                        {provinces?.map((prov) => (
                          <SelectItem
                            key={prov.code}
                            value={prov.code.toString()}
                          >
                            {prov.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={districtCode}
                      onValueChange={(value) => {
                        setDistrictCode(value);
                        fetchWards(value);
                      }}
                      disabled={!provinceCode}
                    >
                      <SelectTrigger className="border-pink-200 bg-pink-50/50 focus:ring-pink-400">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-pink-100">
                        {districts?.map((dist) => (
                          <SelectItem
                            key={dist.code}
                            value={dist.code.toString()}
                          >
                            {dist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={wardCode}
                      onValueChange={setWardCode}
                      disabled={!districtCode}
                    >
                      <SelectTrigger className="border-pink-200 bg-pink-50/50 focus:ring-pink-400">
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-pink-100">
                        {wards?.map((w) => (
                          <SelectItem key={w.code} value={w.code.toString()}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border-pink-200 bg-pink-50/50 text-gray-800 focus-visible:ring-pink-400"
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="expectedDate"
                    className="block text-sm font-medium text-pink-700 mb-1"
                  >
                    Ngày nhận dự kiến
                  </Label>
                  <DatePicker
                    id="expectedDate"
                    value={expectedDate}
                    onChange={(date) => setExpectedDate(date)}
                    format="DD/MM/YYYY"
                    className="w-full border-pink-200 hover:border-pink-400"
                    disabledDate={(current) =>
                      current && current < moment().startOf("day")
                    }
                    placeholder="Chọn ngày nhận dự kiến đến cơ sở tiếp nhận"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="block text-sm font-medium text-pink-700 mb-1"
                  >
                    Lý do
                  </Label>
                  <Textarea
                    id="message"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[80px] resize-none border-pink-200 bg-pink-50/50 text-gray-800 placeholder:text-gray-400 focus-visible:ring-pink-400"
                    placeholder="Nhập lý do bạn muốn nhận nuôi thú cưng này"
                  />
                </div>

                <div className="mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCommitmentModalOpen(true)}
                    className="border-pink-300 text-pink-700 hover:bg-pink-100 px-2"
                  >
                    Xem các bản cam kết
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="terms1"
                        checked={agreeTerms1}
                        onChange={(e) => setAgreeTerms1(e.target.checked)}
                        className="hidden peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                        {agreeTerms1 && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        Tôi đồng ý chăm sóc thú cưng một cách chu đáo và không
                        bỏ rơi chúng.
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="terms2"
                        checked={agreeTerms2}
                        onChange={(e) => setAgreeTerms2(e.target.checked)}
                        className="hidden peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                        {agreeTerms2 && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        Tôi đồng ý tuân thủ các quy định về nhận nuôi của tổ
                        chức.
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t border-pink-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading || loadingAddress || !agreeTerms1 || !agreeTerms2
                    }
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md py-2 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      "Đăng ký nhận nuôi"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Xem các bản cam kết với PDF */}
      <Dialog
        open={isCommitmentModalOpen}
        onOpenChange={setIsCommitmentModalOpen}
      >
        <DialogContent
          className="max-w-3xl p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
          aria-describedby="commitment-description"
        >
          <DialogHeader>
            <h2 className="text-xl font-semibold text-amber-800">
              Các bản cam kết
            </h2>
            <p id="commitment-description" className="text-sm text-gray-500">
              Xem nội dung cam kết khi nhận nuôi thú cưng.
            </p>
          </DialogHeader>
          <div
            className="mt-4 relative"
            style={{ height: "500px", overflow: "hidden" }}
          >
            <iframe
              src="/pdfs/commitment.pdf#toolbar=0&navpanes=0&scrollbar=0"
              width="100%"
              height="90%"
              title="Cam kết nhận nuôi"
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setIsCommitmentModalOpen(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAdoptionFormModal;
