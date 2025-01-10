import "./PostsList.css";
import Post from "../../models/post";
import PostTile from "../PostTile/PostTile";
import Divider from "@mui/material/Divider";
import { List, ListItem, Pagination, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { paginate } from "../../utils/pagination";
import { LoadingState } from "../../services/loadingState";
import _ from "lodash";

interface Props {
  posts: Post[];
  maxPostsPerPage: number;
  loadingState?: LoadingState;
}

export default function PostsList({
  posts,
  maxPostsPerPage,
  loadingState,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedPosts = paginate(posts, maxPostsPerPage);

  if (loadingState === LoadingState.LOADING) {
    const postsSekeletons: React.JSX.Element[] = [];
    _.times(maxPostsPerPage, (i) =>
      postsSekeletons.push(
        <Skeleton
          key={i}
          variant="rectangular"
          animation="wave"
          height={100}
          sx={{ marginTop: "15px", bgcolor: "grey.800" }}
        />
      )
    );
    return <>...postsSekeletons</>;
  } else if (loadingState === LoadingState.ERROR) {
    return <div>Error loading posts</div>;
  }

  return (
    <>
      <List className="postsList">
        {paginatedPosts[currentPage - 1]?.map((post) => (
          <div key={post.id}>
            <ListItem>
              <PostTile post={post} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      {paginatedPosts.length > 1 && (
        <div className="pagination">
          <Pagination
            count={paginatedPosts.length}
            page={currentPage}
            onChange={(_, newPage) => setCurrentPage(newPage)}
            color="primary"
            sx={{ width: "100%", ul: { justifyContent: "center" } }}
          />
        </div>
      )}
    </>
  );
}