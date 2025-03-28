/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import VerifiedBadge from "./VerifiedBadge";

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar style={{border: "1px solid #e0e0e0"}}>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-bold text-sm flex items-center gap-1">
          {comment?.author.username}{" "}
          {comment?.author.isVerified && <VerifiedBadge size={14}/>}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
