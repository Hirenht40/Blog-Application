import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Get blogs based on search query, selected category, and selected date
  const getFilteredBlogs = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/blog/all-blog?search=${searchQuery}&category=${selectedCategory}&date=${selectedDate}`
      );
      if (data?.success) {
        setBlogs(data?.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFilteredBlogs();
  }, [searchQuery, selectedCategory, selectedDate]);

  // Get all blogs initially
  useEffect(() => {
    getFilteredBlogs();
  }, []);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
          <option value="Positions">Positions</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {blogs
        .filter((blog) => {
          if (selectedCategory === "") {
            return true; // Show all blogs when no category is selected
          }
          return blog.category === selectedCategory;
        })
        .filter((blog) => {
          if (selectedDate === "") {
            return true; // Show all blogs when no date is selected
          }
          // Convert blog date to yyyy-mm-dd format
          const blogDate = new Date(blog.createdAt).toISOString().split("T")[0];
          return blogDate === selectedDate;
        })
        .filter((blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((blog) => (
          <BlogCard
            id={blog?._id}
            isUser={localStorage.getItem("userId") === blog?.user?._id}
            title={blog?.title}
            description={blog?.description}
            category={blog?.category}
            image={blog?.image}
            username={blog?.user?.username}
            time={blog.createdAt}
          />
        ))}
    </div>
  );
};

export default Blogs;
