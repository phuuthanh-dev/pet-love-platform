import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/formatVND";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Campaigns = () => {
  const { user } = useSelector((store) => store.auth);
  const { campaigns } = useSelector((store) => store.campaign);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tất cả chiến dịch quyên góp</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <Card key={campaign._id} className="w-full">
            <CardHeader>
              <CardTitle className="text-center font-bold">
                {campaign.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
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
              <div className="space-y-4">
                <Progress
                  value={(campaign.currentAmount / campaign.targetAmount) * 100}
                />
                <div
                  className="flex justify-between text-sm"
                  style={{ marginBottom: "10px" }}
                >
                  <span>Đã quyên góp: {formatVND(campaign.currentAmount)}</span>
                  <span>Mục tiêu: {formatVND(campaign.targetAmount)}</span>
                </div>
                {user && (
                  <Button className="w-full" style={{ marginTop: "10px" }}>
                    Quyên góp ngay
                  </Button>
                )}
                <Link to={`/donate/${campaign._id}`}>
                  <Button className="w-full" style={{ marginTop: "10px" }}>
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
