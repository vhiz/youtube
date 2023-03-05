import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Card from "../../components/card/Card";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";

export default function Home({ type }) {
  const { isLoading, error, data } = useQuery([`${type}`], async () => {
    const res = await makeRequest.get(`/videos/${type}`);
    return res.data;
  });
  return (
    <div className="home">
      <Menu />
      <div className="homeContanier">
        <Navbar />
        <div className="homeWrapper">
          {error ? (
            <ErrorOutlineOutlined />
          ) : isLoading ? (
            <div className="skeleton">
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
              <Skeleton
                variant="rectangular"
                width={360}
                height={202}
                className="sback"
              />
            </div>
          ) : data.length === 0 ? (
            <div className="skeleton">
             <h1>No Video...</h1>
            </div>
          ) : (
            <div className="hcard">
              {data.map((video) => (
                <Card type={"big"} key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
