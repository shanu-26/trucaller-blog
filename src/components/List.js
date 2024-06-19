import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import trucallerLogo from '../images/truecaller.svg';
import headerImg from '../images/header.jpg';
import Pagination from '../pagination/Pagination';

const CATEGORIES_URL = 'https://public-api.wordpress.com/rest/v1.1/sites/107403796/categories';
const COLOR_LIST = [
  'blue',
  'yellow',
  'green',
  'red',
  'orange',
  'black',
  'grey',
  'purple',
  'violet',
  'indigo',
  'cyan',
  'magenta',
  'maroon',
  'greenyellow',
  'tomato',
  'fuchsia'
];
const COLOR_MAP = {};

export const calculateDateDifference = (date) => {
  const date1 = new Date(new Date().toLocaleDateString());
  const date2 = new Date(new Date(date).toLocaleDateString());
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays.toString() + ' days ago';
};

const List = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([
    {
      id: 0,
      name: 'All categories'
    }
  ]);
  const [currCategory, setCurrCategory] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const POSTS_URL = `https://public-api.wordpress.com/rest/v1.1/sites/107403796/posts?category=${currCategory}?fields=slug,categories,post_thumbnail,title,date&number=20&page=${currentPage}`;

  useEffect(() => {
    fetchCategories();
    fetchPosts('');
  }, []);

  useEffect(() => {
    setPosts([]);
    fetchPosts(currCategory);
  }, [currentPage]);

  const fetchPosts = (category) => {
    setTimeout(() => {
      fetch(POSTS_URL + `&category=${category === 'All categories' ? '' : category}`)
        .then((response) => response.json())
        .then((response) => {
          setPosts(response.posts);
          setTotalCount(response.found);
        })
        .catch((error) => console.error(error));
    }, 1000);
  };

  const fetchCategories = () => {
    fetch(CATEGORIES_URL)
      .then((response) => response.json())
      .then((response) => {
        let categoriesResponse = response.categories.map((category, index) => {
          COLOR_MAP[category.name] = COLOR_LIST[index % COLOR_LIST.length];
          return {
            id: category.ID,
            name: category.name
          };
        });
        setCategories([...categories, ...categoriesResponse]);
      })
      .catch((error) => console.error(error));
  };

  const handleLogoClick = () => {
    navigate('#');
    if (currCategory !== 'All categories') {
      setCurrCategory('All categories');
    }
    fetchPosts('');
  };

  const handleCategoryChange = (e) => {
    setCurrCategory(e.target.value);
    fetchPosts(e.target.value);
  };

  const handleLoadDetailedView = (slug) => {
    navigate(`/${slug}`);
  };

  return posts.length ? (
    <div className="App">
      <div className="navbar">
        <img onClick={handleLogoClick} height="30px" src={trucallerLogo} alt="Trucaller Logo" />
      </div>
      <div className="header-img">
        <img width="100%" height="600px" src={headerImg} alt="Header Image" />
        <text>The Truecaller Blog</text>
      </div>
      <div className="content">
        <div className="category-header">
          {categories.length && (
            <>
              <div className="category-header-label">
                <label for="categories">Latest Articles</label>
              </div>
              <select name="categories" selected={currCategory} key="1" onClick={handleCategoryChange}>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </>
          )}
        </div>
        <div className="grid">
          {posts.map((post) => {
            let filterdTitle = post.title?.indexOf(';') > -1 ? post.title?.split(';')[1] : post.title;
            filterdTitle = filterdTitle.length > 50 ? filterdTitle.substring(0, 50) + '...' : filterdTitle;
            let categoryName = Object.keys(post.categories)[0];
            if (currCategory.length && currCategory !== 'All categories') {
              categoryName = Object.keys(post.categories).find((cat) => cat === currCategory);
            }

            return (
              <div onClick={() => handleLoadDetailedView(post.slug)} id={post?.post_thumbnail?.ID} post={post} className="card">
                <div className="card-text">
                  <span className="card-text-dot" style={{ backgroundColor: `${COLOR_MAP[categoryName]}` }}></span>
                  {categoryName}
                </div>
                <img width="100%" height="60%" src={post?.post_thumbnail?.URL} alt={'Category Image'} />
                <div className="card-text">
                  {filterdTitle}
                  <br />
                  <span style={{ color: '#A9A9A9', fontSize: '0.75rem' }}>{calculateDateDifference(post?.date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="paginate">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={20}
          onPageChange={(currentPage) => setCurrentPage(currentPage)}
        />
      </div>
    </div>
  ) : (
    <div className="App">Loading...</div>
  );
};

export default List;
