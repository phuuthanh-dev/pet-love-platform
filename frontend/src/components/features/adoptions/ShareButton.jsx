import React, { useEffect } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
} from "react-share";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import { Send } from "lucide-react";
import {getUserBehaviorAPI, shareAdoptionPostAPI} from "../../../apis/post";
import { toast } from "sonner";

const ShareButton = ({ post }) => {
  const postUrl = `${window.location.origin}/adoptDetail/${post._id}`;
  const postTitle = post.title;

  const [isOpen, setIsOpen] = React.useState(false);

  const handleShare = async (platform) => {
    try {
      await shareAdoptionPostAPI(post._id, platform);
    } catch (error) {
        throw error;
    }
  };

  return (
    <>
      <Send
        size={22}
        className="cursor-pointer hover:text-gray-600"
        onClick={() => setIsOpen(true)}
      />

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-80 p-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share Post</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
            <FacebookShareButton url={postUrl} quote={postTitle} onClick={() => handleShare("Facebook")}>
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaFacebook className="text-blue-600 text-xl" />
                  <span>Facebook</span>
                </div>
              </FacebookShareButton>

              <TwitterShareButton url={postUrl} title={postTitle} onClick={() => handleShare("Twitter")}>
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaTwitter className="text-blue-400 text-xl" />
                  <span>Twitter</span>
                </div>
              </TwitterShareButton>

              <LinkedinShareButton url={postUrl} title={postTitle} onClick={() => handleShare("LinkedIn")}>
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaLinkedin className="text-blue-700 text-xl" />
                  <span>LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <WhatsappShareButton
                url={postUrl}
                title={postTitle}
                separator=" - "
                onClick={() => handleShare("WhatsApp")}
              >
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaWhatsapp className="text-green-500 text-xl" />
                  <span>WhatsApp</span>
                </div>
              </WhatsappShareButton>

              <TelegramShareButton url={postUrl} title={postTitle} onClick={() => handleShare("Telegram")}>
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaTelegram className="text-blue-500 text-xl" />
                  <span>Telegram</span>
                </div>
              </TelegramShareButton>

              <EmailShareButton
                url={postUrl}
                subject={postTitle}
                body={`Check out this post: ${postUrl}`}
                onClick={() => handleShare("Email")}
              >
                <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <FaEnvelope className="text-red-500 text-xl" />
                  <span>Email</span>
                </div>
              </EmailShareButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
