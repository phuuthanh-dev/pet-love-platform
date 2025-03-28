/* eslint-disable react/prop-types */
import { cancelDonateAPI } from "@/apis/donate";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const DonateCancel = ({children}) => {
  const navigate = useNavigate();  
  const [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    const cancelDonate = async () => {
      const status = searchParams.get("status");
      const cancel = searchParams.get("cancel");
      const orderCode = searchParams.get("orderCode");

      if (status === "CANCELLED" && cancel === "true" && orderCode) {
        const { data } = await cancelDonateAPI(orderCode);
        if (data.status === 200) {
          setSearchParams({});
          toast.success("Hủy giao dịch thành công");
        }
      }
    };
    cancelDonate();
  }, [navigate]);

  return (
    <>
      {children}
    </>
  );
};

export default DonateCancel;
