import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const clientSetting = useSelector((state) => state.setting.clientSetting);
  const email = clientSetting?.find((item) => item.name === "Email")?.value;
  const phone = clientSetting?.find((item) => item.name === "Phone")?.value;
  const address = clientSetting?.find((item) => item.name === "Address")?.value;
  const facebook = clientSetting?.find(
    (item) => item.name === "Facebook"
  )?.value;
  const instagram = clientSetting?.find(
    (item) => item.name === "Instagram"
  )?.value;

  return (
    <div className="flex justify-evenly p-8 bg-[#6e1d99] text-white">
      <div className="flex flex-col gap-4 text-lg">
        <div>
          <h2 className="font-bold">FTHEO DÕI CHÚNG TÔI</h2>
        </div>
        <ul className="flex gap-4">
          <li>
            <Link to={facebook}>
              <FaFacebookF />
            </Link>
          </li>
          <li>
            <Link to={instagram}>
              <FaXTwitter />
            </Link>
          </li>
          <li>
            <Link to={instagram}>
              <FaInstagram />
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg ">
        <h2 className="font-bold">HỖ TRỢ</h2>
        <ul className="flex flex-col gap-2">
          <li>Liên hệ chúng tôi</li>
          <li>Câu hỏi thường gặp</li>
          <li>Điều khoản dịch vụ</li>
          <li>Chính sách quyền riêng tư</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg">
        <h2 className="font-bold">TÀI NGUYÊN</h2>
        <ul className="flex flex-col gap-2">
          <li><Link to={'/blog'}>Blog</Link></li>
          <li>Phát triển bền vững</li>
          <li>Về chúng tôi</li>
          <li>Pawparazzi</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg w-1/3">
        <h2 className="font-bold">BẢN TIN</h2>
        <p className="w-2/3">
          {
            'Đăng ký nhận thông tin cập nhật về sản phẩm, dịch vụ và sự kiện của "I and love and you"'
          }
        </p>
        <form action="">
          <div className="flex flex-col gap-4">
            <label className="block">Email của chúng tôi: {email}</label>
            <label className="block">Địa chỉ: {address}</label>
            <label className="block">Điện thoại: {phone}</label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Footer;
