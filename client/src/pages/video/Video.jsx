import {
  AddTaskOutlined,
  ErrorOutlineOutlined,
  ReplyOutlined,
  ThumbDownAlt,
  ThumbDownOffAltOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import Comments from "../../components/comments/Comments";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/authCOntext";
import "./video.scss";
import moment from "moment";
import Recomendation from "../../components/recommendation/Recomendation";

export default function Video() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const queryClient = new useQueryClient();
  const { isLoading, error, data } = useQuery(["video", path], async () => {
    const res = await makeRequest.get(`/videos/find/${path}`);

    return res.data;
  });

  const {
    isLoading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(["videoUser", data], async () => {
    const res = await makeRequest.get(`/users/find/${data.userId}`);
    return res.data;
  });

  const {
    error: errorSubcribed,
    isLoading: subcribedIsLoading,
    data: subcribedData,
  } = useQuery(["subcribed", data], async () => {
    const res = await makeRequest.get(
      `/subcribed?followedUserId=${data.userId}`
    );
    return res.data;
  });

  const mutationLike = useMutation(
    () => {
      return makeRequest.put(`/users/like/${path}/${currentUser._id}`);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["video"]);
      },
    }
  );

  const mutationUnlike = useMutation(
    () => {
      return makeRequest.put(`/users/dislike/${path}/${currentUser._id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["video"]);
      },
    }
  );
  const mutationSubcribe = useMutation(
    () => {
      return makeRequest.post(`/subcribed/${data.userId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["video"]);
      },
    }
  );
  const mutationUnSubcribe = useMutation(
    () => {
      return makeRequest.delete(`/subcribed/${data.userId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["video"]);
      },
    }
  );
  const mutationView = useMutation(
    () => {
      return makeRequest.put(`/videos/view/${path}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["video"]);
      },
    }
  );

  const handleLike = async (e) => {
    e.preventDefault();
    mutationLike.mutate();
  };

  const handleDisLike = async (e) => {
    e.preventDefault();
    mutationUnlike.mutate();
  };

  const handleSubscribed = async (e) => {
    e.preventDefault();
    mutationSubcribe.mutate();
  };
  const handleUnSubscribed = async (e) => {
    e.preventDefault();
    mutationUnSubcribe.mutate();
  };

  const handleView = (e) => {
    // e.preventDefault();
    mutationView.mutate();
  };

  return (
    <div className="video">
      <Menu />
      <div className="vContanier">
        <Navbar />
        <div className="videoWrapper">
          {error ? (
            <ErrorOutlineOutlined />
          ) : isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <div className="content">
                <div className="contentWrapper">
                  <video
                    src={data.videoUrl}
                    controls
                    onClick={handleView}
                  ></video>
                  <h1>{data.title}</h1>
                  <div className="details">
                    <span>
                      {data.views} • {moment(data.createdAt).fromNow()}
                    </span>
                    <div className="buttons">
                      {currentUser && (
                        <>
                          <div className="button" onClick={handleLike}>
                            {data.likes.includes(currentUser._id) ? (
                              <ThumbUp htmlColor="red" />
                            ) : (
                              <ThumbUpOutlined />
                            )}{" "}
                            {data.likes.length}
                          </div>
                          <div className="button" onClick={handleDisLike}>
                            {data.dislikes.includes(currentUser._id) ? (
                              <ThumbDownAlt htmlColor="red" />
                            ) : (
                              <ThumbDownOffAltOutlined />
                            )}{" "}
                            Dislike
                          </div>
                          <div className="button">
                            <ReplyOutlined /> Share
                          </div>
                          <div className="button">
                            <AddTaskOutlined /> Save
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <hr />
                  <div className="channel">
                    <div className="channelInfo">
                      {userError ? (
                        <ErrorOutlineOutlined />
                      ) : userLoading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <img
                            src={
                              userData.img ||
                              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAACTCAMAAABRYnx0AAAANlBMVEV1dXXAwMBycnLDw8O8vLxvb2+tra25ubmlpaV4eHiFhYWwsLCLi4uOjo6BgYGfn5+ZmZlqamo0eBF6AAACwUlEQVRoge3aW5aDIAwAUAggLxW7/80O6plOx1aIJvpTsoF7AgEMKESLFi1atGjRosX3BYAx4P31DPgwuC5a3V3M9FNnlZJaSx0ug4wZU5QqOzm0th6ucSA7dmG0XEL110gAfSeVfA2V4AoLQtxAOTcVR3YLhFMbaBlGpQfDK5leb53nIDpWy0zPSngLrazgG0ST3sbuX16WbcJgKkqMFoQytFg8e6GPVSoX/YNBqg7faiWGIQREUnPQJVGfqTWtiZwWDDhKdmSqsqb+wlKlb6c0eRXfSblGNeqd6hrVqLOUvo+ydAoe6KyoSQVnMVLOygZaWoDdKyy5TwDsaSXp1HCAon2e3Un191HjAYrY7gOekiNJEgZPUbcL06Ep6jcnvgSVo/YHsHuLsKUCmcL2VwxtI7ZrZLgoMQmVVMdAQb97EfNK0fvTHCMqK+L6XcNjDkfNc6eFOPKZrs9Qq5jpZtXXJXojvEY+9XWlCAe2W7oKxHVxJhCbE+MdOAyFZazpe/prmMJGqBXbTC1RWMbcVKEEmamxOFecVC7B26jiQcL63pO3wbsok+6i4OGKVOB7gAmpeDqqjqsucotQexPh2tkRTaqKTEOI+BC0TIcw4tuMfj8yB+75gGWyTMT0Ipbj4xbXHjAs43n1IqR8EhtiJ+x7XB+SK6cb/OmnbwA/WexlYB5CZdN4CgMTti/21VAqDuZofRgxxdp29FmTbjwwa2BGdzShVywOApcaiIC/QNjBbEKUCMAQZfUTva5pVykRA5M9NUUfMBX7xy5mfJKl0/awpqfPkwYzxOfMvwPlFmV6/08nQ5oT+g1l3X8MxDXQEjr9YQAT69BtQ8n0Ww09dqc7H+t9Pzi5/+MLl7T8t+BRhyw57pMyBdjXKTKF+xmFhRL66oJ4Uv3ltfekbnJm6japUY1qVKMa1ahGNapRX0r9AG5nKjhKF/yFAAAAAElFTkSuQmCC"
                            }
                            alt=""
                          />
                          <div className="channelDetail">
                            <span className="name">{userData.name}</span>
                            <span className="counter">
                              {userData.subscribers} subscribers
                            </span>
                            <p>{data.desc}</p>
                          </div>
                        </>
                      )}
                    </div>
                    {errorSubcribed ? (
                      <ErrorOutlineOutlined />
                    ) : subcribedIsLoading ? (
                      <CircularProgress />
                    ) : (
                      <div className="div">
                        {currentUser && (
                          <>
                            {subcribedData.includes(currentUser._id) ? (
                              <button onClick={handleUnSubscribed}>
                                Subcribed
                              </button>
                            ) : (
                              <button onClick={handleSubscribed}>
                                Suscribe
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <hr />
                  <Comments videoId={data._id} />
                </div>
              </div>
              <Recomendation tags={data.tags} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
