import { ErrorOutlineOutlined, Send } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authCOntext";
import Comment from "../comment/Comment";
import "./comments.scss";

export default function Comments({ videoId }) {
  const {
    isLoading,
    error,
    data: comments,
  } = useQuery(["comment", videoId], async () => {
    const res = await makeRequest.get(`/comment/${videoId}`);

    return res.data;
  });

  const { currentUser } = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    videoId: videoId,
    desc: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = new useQueryClient();

  const mutation = useMutation(
    (inputs) => {
      return makeRequest.post(`/comment`, inputs);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comment"]);
      },
    }
  );

  const handleClick = (e) => {
    e.preventDefault();

    mutation.mutate(inputs);
    setInputs(null);
  };

  return (
    <div className="comments">
      {currentUser && (
        <div className="newComment">
          <img
            src={
              currentUser.img ||
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAACTCAMAAABRYnx0AAAANlBMVEV1dXXAwMBycnLDw8O8vLxvb2+tra25ubmlpaV4eHiFhYWwsLCLi4uOjo6BgYGfn5+ZmZlqamo0eBF6AAACwUlEQVRoge3aW5aDIAwAUAggLxW7/80O6plOx1aIJvpTsoF7AgEMKESLFi1atGjRosX3BYAx4P31DPgwuC5a3V3M9FNnlZJaSx0ug4wZU5QqOzm0th6ucSA7dmG0XEL110gAfSeVfA2V4AoLQtxAOTcVR3YLhFMbaBlGpQfDK5leb53nIDpWy0zPSngLrazgG0ST3sbuX16WbcJgKkqMFoQytFg8e6GPVSoX/YNBqg7faiWGIQREUnPQJVGfqTWtiZwWDDhKdmSqsqb+wlKlb6c0eRXfSblGNeqd6hrVqLOUvo+ydAoe6KyoSQVnMVLOygZaWoDdKyy5TwDsaSXp1HCAon2e3Un191HjAYrY7gOekiNJEgZPUbcL06Ep6jcnvgSVo/YHsHuLsKUCmcL2VwxtI7ZrZLgoMQmVVMdAQb97EfNK0fvTHCMqK+L6XcNjDkfNc6eFOPKZrs9Qq5jpZtXXJXojvEY+9XWlCAe2W7oKxHVxJhCbE+MdOAyFZazpe/prmMJGqBXbTC1RWMbcVKEEmamxOFecVC7B26jiQcL63pO3wbsok+6i4OGKVOB7gAmpeDqqjqsucotQexPh2tkRTaqKTEOI+BC0TIcw4tuMfj8yB+75gGWyTMT0Ipbj4xbXHjAs43n1IqR8EhtiJ+x7XB+SK6cb/OmnbwA/WexlYB5CZdN4CgMTti/21VAqDuZofRgxxdp29FmTbjwwa2BGdzShVywOApcaiIC/QNjBbEKUCMAQZfUTva5pVykRA5M9NUUfMBX7xy5mfJKl0/awpqfPkwYzxOfMvwPlFmV6/08nQ5oT+g1l3X8MxDXQEjr9YQAT69BtQ8n0Ww09dqc7H+t9Pzi5/+MLl7T8t+BRhyw57pMyBdjXKTKF+xmFhRL66oJ4Uv3ltfekbnJm6japUY1qVKMa1ahGNapRX0r9AG5nKjhKF/yFAAAAAElFTkSuQmCC"
            }
            alt=""
          />
          <input
            type="text"
            placeholder="Add a comment ....."
            onChange={handleChange}
            name="desc"
          />
          <Send className="send" onClick={handleClick} />
        </div>
      )}
      {error ? (
        <ErrorOutlineOutlined />
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        comments.map((comment) => (
          <Comment comment={comment} key={comment._id} />
        ))
      )}
    </div>
  );
}
