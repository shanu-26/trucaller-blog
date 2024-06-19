import { useEffect, useState } from 'react';
import trucallerLogo from '../images/truecaller.svg';
import { useNavigate } from 'react-router-dom';

const Detail = () => {
  const slug = window.location.pathname.split('/')[1];
  const DETAILED_POST_URL = `https://public-api.wordpress.com/rest/v1.1/sites/107403796/posts/slug:${slug}?fields=featured_image,title,author,content,date`;

  const navigate = useNavigate();
  const [postData, setPostData] = useState({});

  useEffect(() => {
    fetch(DETAILED_POST_URL)
      .then((response) => response.json())
      .then((response) => setPostData(response))
      .catch((error) => console.error(error));
  }, []);

  return postData ? (
    <div className="App">
      <div className="navbar">
        <img onClick={() => navigate(`/`)} height="30px" src={trucallerLogo} alt="" />
      </div>
      <div className="header-img">
        <img src={postData.featured_image} alt="" width="100%" height="600px" />
      </div>
      <h3>{postData.title}</h3>
      <h4>{postData?.author?.name}</h4>
      <h5>{new Date(postData.date).toDateString()}</h5>
      <div className="content-section-outer">
        <div className="content-section-inner" dangerouslySetInnerHTML={{ __html: postData.content }} />
      </div>
    </div>
  ) : (
    <div className="App">Loading...</div>
  );
};

export default Detail;
