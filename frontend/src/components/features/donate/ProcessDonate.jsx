/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Wallet } from "lucide-react";
import { donateAPI } from "@/apis/donate";
import { formatVND } from "@/utils/formatVND";
import { FE_URL } from "@/configs/globalVariables";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ProcessDonate = ({ campaign }) => {
  const { user } = useSelector((store) => store.auth);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();

  const handleDonate = async () => {
    if (!selectedCampaign) return;

    const returnUrl = `${FE_URL}/forum`;
    const cancelUrl = `${FE_URL}/donate/cancel`;
    const response = await donateAPI(
      amount,
      description,
      isAnonymous,
      selectedCampaign._id,
      returnUrl,
      cancelUrl
    );

    if (response.status === 200) {
      window.location.href = response.data.paymentLink.checkoutUrl;
    }
  };

  const handleOpenDonate = (campaign) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để quyên góp");
      navigate("/login");
    }
    setSelectedCampaign(campaign);
    setOpen(true);
  };

  return (
    <div className="my-5 space-y-4">
      <div key={campaign._id} className="block-container">
        <h3 className="block-minorHeader">
          <Link to={`/donate/${campaign._id}`} rel="nofollow">
            {campaign?.title}
          </Link>
        </h3>

        <div className="block-body">
          <div className="block-row">
            <div className="donate-progressBarContainer mb-2 h-6 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className={`donate-progressBarContainer-bar h-full transition-all duration-600 ease-out relative animate-pulse
                    ${
                      (campaign?.currentAmount / campaign?.targetAmount) *
                        100 >=
                      100
                        ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"
                        : (campaign?.currentAmount / campaign?.targetAmount) *
                            100 >=
                          75
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                style={{
                  width: `${Math.min(
                    (campaign?.currentAmount / campaign?.targetAmount) * 100,
                    100
                  )}%`,
                }}
              >
                <div
                  className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] bg-[length:50%_100%] bg-no-repeat bg-[100%_0] motion-safe:transition-all"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                ></div>
              </div>
              <div className="donate-progressBarContainer-progress absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-semibold text-sm z-10">
                {Math.round(
                  (campaign?.currentAmount / campaign?.targetAmount) * 100
                )}
                %
              </div>
            </div>

            <dl className="pairs pairs--justified mb-2">
              <dt>Đã nhận</dt>
              <dd>{formatVND(campaign?.currentAmount)}</dd>
            </dl>

            <dl className="pairs pairs--justified">
              <dt>Mục tiêu</dt>
              <dd>{formatVND(campaign?.targetAmount)}</dd>
            </dl>

            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
                <span className="font-medium text-blue-800 mb-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Ngày bắt đầu
                </span>
                <span className="text-gray-700">
                  {new Date(campaign?.startDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex flex-col p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm">
                <span className="font-medium text-purple-800 mb-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ngày kết thúc
                </span>
                <span className="text-gray-700">
                  {new Date(campaign?.endDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="block-row flex items-center justify-between gap-2">
            <Button
              className="button--primary button rippleButton"
              onClick={() => handleOpenDonate(campaign)}
            >
              <span className="button-text">Donate</span>
            </Button>
            <Link
              to={`/donate/${campaign?._id}`}
              className="button button rippleButton"
            >
              <span className="button-text">Xem</span>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[825px]">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Donate to {selectedCampaign?.title}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">Số tiền quyên góp:</label>
                <input
                  type="number"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Nhập số tiền quyên góp"
                />
              </div>

              <div>
                <label className="block mb-1">Message</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your message"
                  rows="3"
                />
              </div>

              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="anonymous">Ẩn danh</label>
              </div> */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={!isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="anonymous">Tiết lộ số tiền</label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleDonate} className="button--primary">
                  <Wallet /> <span className="ml-2">Donate</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProcessDonate;
