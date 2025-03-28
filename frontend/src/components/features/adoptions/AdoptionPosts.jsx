import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdoptionPost from "./AdoptionPost";
import {
  fetchAllAdoptionPostsAPI,
  fetchAllAdoptionPostsByBreedAPI,
} from "@/apis/post";
import { useParams } from "react-router-dom";

const AdoptionPosts = () => {
  const { id } = useParams();
  const [adoptPosts, setAdoptPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const loaderRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const originalScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      history.scrollRestoration = originalScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && hasMorePosts && handleLoadMore(),
      { threshold: 0.5 }
    );

    loaderRef.current && observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMorePosts, adoptPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchAPI = id
          ? fetchAllAdoptionPostsByBreedAPI
          : fetchAllAdoptionPostsAPI;
        const { data } = await fetchAPI(page, id);
        if (data.status === 200) {
          setAdoptPosts((prevPosts) => [...prevPosts, ...data.data.results]);
          if (data.data.results.length === 0) setHasMorePosts(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [id, page]);

  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;
      setPage(nextPage);
    } catch (error) {
      toast.error("Failed to load more posts");
    }
  };

  return (
    <div>
      {adoptPosts.map((post) => (
        <Fragment key={post._id}>
          <AdoptionPost post={post} />
        </Fragment>
      ))}
      {hasMorePosts && (
        <div
          ref={loaderRef}
          style={{ height: "50px", background: "transparent" }}
        ></div>
      )}
    </div>
  );
};

export default AdoptionPosts;
