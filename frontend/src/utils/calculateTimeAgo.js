export const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const postDate = new Date(createdAt);
    const timeDiff = now - postDate;

    // Chuyển đổi milliseconds thành các đơn vị thời gian
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 1) {
        return ` Vừa xong`;
    } else if (minutes < 60) {
        return ` ${minutes} phút`;
    } else if (hours < 24) {
        return ` ${hours} giờ`;
    } else if (days < 7) {
        return ` ${days} ngày`;
    } else if (weeks < 12) {
        return ` ${weeks} tuần`;
    } else {
        return ` ${Math.floor(weeks / 12)} tháng`;
    }
};