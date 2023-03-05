import { Link } from "react-router-dom";
import "./card.scss";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

export default function Card({ type, video }) {
  const { isLoading, error, data } = useQuery(
    ["channelUser", video.userId],
    async () => {
      const res = await makeRequest.get(`/users/find/${video.userId}`);
      return res.data;
    }
  );

  const HomePage = () => {
    return (
      <div className="card">
        {error ? (
          <ErrorOutlineOutlined />
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <img src={video.imgUrl} alt="" />
            <div className="details">
              <img
                src={
                  data.img ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAACTCAMAAABRYnx0AAAANlBMVEV1dXXAwMBycnLDw8O8vLxvb2+tra25ubmlpaV4eHiFhYWwsLCLi4uOjo6BgYGfn5+ZmZlqamo0eBF6AAACwUlEQVRoge3aW5aDIAwAUAggLxW7/80O6plOx1aIJvpTsoF7AgEMKESLFi1atGjRosX3BYAx4P31DPgwuC5a3V3M9FNnlZJaSx0ug4wZU5QqOzm0th6ucSA7dmG0XEL110gAfSeVfA2V4AoLQtxAOTcVR3YLhFMbaBlGpQfDK5leb53nIDpWy0zPSngLrazgG0ST3sbuX16WbcJgKkqMFoQytFg8e6GPVSoX/YNBqg7faiWGIQREUnPQJVGfqTWtiZwWDDhKdmSqsqb+wlKlb6c0eRXfSblGNeqd6hrVqLOUvo+ydAoe6KyoSQVnMVLOygZaWoDdKyy5TwDsaSXp1HCAon2e3Un191HjAYrY7gOekiNJEgZPUbcL06Ep6jcnvgSVo/YHsHuLsKUCmcL2VwxtI7ZrZLgoMQmVVMdAQb97EfNK0fvTHCMqK+L6XcNjDkfNc6eFOPKZrs9Qq5jpZtXXJXojvEY+9XWlCAe2W7oKxHVxJhCbE+MdOAyFZazpe/prmMJGqBXbTC1RWMbcVKEEmamxOFecVC7B26jiQcL63pO3wbsok+6i4OGKVOB7gAmpeDqqjqsucotQexPh2tkRTaqKTEOI+BC0TIcw4tuMfj8yB+75gGWyTMT0Ipbj4xbXHjAs43n1IqR8EhtiJ+x7XB+SK6cb/OmnbwA/WexlYB5CZdN4CgMTti/21VAqDuZofRgxxdp29FmTbjwwa2BGdzShVywOApcaiIC/QNjBbEKUCMAQZfUTva5pVykRA5M9NUUfMBX7xy5mfJKl0/awpqfPkwYzxOfMvwPlFmV6/08nQ5oT+g1l3X8MxDXQEjr9YQAT69BtQ8n0Ww09dqc7H+t9Pzi5/+MLl7T8t+BRhyw57pMyBdjXKTKF+xmFhRL66oJ4Uv3ltfekbnJm6japUY1qVKMa1ahGNapRX0r9AG5nKjhKF/yFAAAAAElFTkSuQmCC"
                }
                alt=""
              />
              <div className="texts">
                <h1>{video.title}</h1>
                <h2>{data.name}</h2>
                <div className="info">
                  {video.views} views • {moment(video.createdAt).fromNow()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const VideoPage = () => {
    return (
      <div className="cardsmall">
        {error ? (
          <ErrorOutlineOutlined />
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <img src={video.imgUrl} alt="" />
            <div className="details">
              <div className="texts">
                <h1>{video.title}</h1>
                <h2>{data.name}</h2>
                <div className="info">
                  {video.views} views • {moment(video.createdAt).fromNow()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <Link to={`/${video._id}`} style={{ textDecoration: "none" }}>
      {type === "big" && <HomePage />}
      {type === "small" && <VideoPage />}
    </Link>
  );
}
