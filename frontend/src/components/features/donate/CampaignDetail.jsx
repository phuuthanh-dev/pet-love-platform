import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import {
  getCampaignByIdAPI,
  getDonationsByCampaignIdAPI,
} from "@/apis/campaign";
import { formatVND } from "@/utils/formatVND";
import ProcessDonate from "./ProcessDonate";
import { useSelector } from "react-redux";

const CampaignDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((store) => store.auth);
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await getCampaignByIdAPI(id);
      setCampaign(response.data.data);
    };
    const fetchDonations = async () => {
      const response = await getDonationsByCampaignIdAPI(id, page);
      setTotalPages(response.data.data.totalPages);
      setDonations(response.data.data.results);
    };
    id && fetchCampaign();
    id && fetchDonations();
  }, [id, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with gradient overlay */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
        <img
          src={campaign?.image}
          alt={campaign?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{campaign?.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="w-full justify-start border-b mb-6">
                <TabsTrigger
                  value="story"
                  className="text-lg font-medium mr-8 pb-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                >
                  Câu chuyện
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="text-lg font-medium mr-8 pb-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                >
                  Cập nhật
                </TabsTrigger>
                {user && (
                  <TabsTrigger
                    value="donors"
                    className="text-lg font-medium pb-4 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                  >
                    Người ủng hộ
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="story" className="mt-6">
                <div className="prose max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: campaign?.description }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="updates" className="mt-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">
                    Người tạo chiến dịch
                  </h2>
                  <div className="flex items-center gap-4">
                    <img
                      src={campaign?.user?.profilePicture}
                      alt={campaign?.user?.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div>
                      <h3 className="text-xl font-bold">
                        {campaign?.user?.lastName} {campaign?.user?.firstName}
                      </h3>
                      <p className="text-gray-600">Người tổ chức chiến dịch</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="donors" className="mt-6">
                <div className="space-y-4">
                  {donations?.map((donor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          style={{ border: "1px solid #e0e0e0" }}
                          className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden"
                        >
                          {donor?.user?.profilePicture && (
                            <img
                              src={donor?.user?.profilePicture}
                              alt={
                                donor?.user?.lastName +
                                " " +
                                donor?.user?.firstName
                              }
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {donor?.isAnonymous
                              ? "Ẩn danh"
                              : donor?.user?.firstName
                              ? donor?.user?.lastName +
                                " " +
                                donor?.user?.firstName
                              : donor?.user?.username}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(donor?.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">
                          {formatVND(donor.amount)}
                        </p>
                        {donor.message && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            &quot;{donor.message}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="button"
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="button"
                  >
                    Next
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Donation Widget - Fixed on Desktop */}
          {campaign && (
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ProcessDonate campaign={campaign} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
