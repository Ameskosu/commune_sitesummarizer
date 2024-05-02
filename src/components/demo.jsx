import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [historyshowflag, setHistoryshowflag] = useState(false);

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleDownloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([article.summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element); // Required for this to work in Firefox
    element.click();
  };

  const handleshow = () =>{
    setHistoryshowflag(!historyshowflag);
    console.log(historyshowflag);
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center '
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='link-icon'
            className='absolute left-0 my-2 ml-3 w-5'
          />

          <input
            type='url'
            placeholder='Paste the article link'
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className='url_input peer ' // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
          />
          {/* <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
          >
            <p>↵</p>
          </button> */}
          <button type="submit" class="submit_btn text-white bg-blue-700/80 hover:bg-blue-800 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            <span class="sr-only">Icon description</span>
          </button>
        </form>

        <button onClick={() => handleshow()} className="text-gray-200">
          {historyshowflag?
            <div className="flex justify-center">
              <svg class="w-6 h-2 text-gray-200 hover:text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
              </svg>  
            </div>
          : <div className="flex justify-center">
              <svg class="w-6 h-2 text-gray-200 hover:text-gray-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </div>
          }
        </button>

        {/* Browse History */}
        {historyshowflag ?
          <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
            {allArticles.reverse().map((item, index) => (
              <div
                key={`link-${index}`}
                onClick={() => {setArticle(item); setHistoryshowflag(false);}}
                className='link_card'
              >
                <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                  <img
                    src={copied === item.url ? tick : copy}
                    alt={copied === item.url ? "tick_icon" : "copy_icon"}
                    className='w-[40%] h-[40%] object-contain'
                  />
                </div>
                <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                  {item.url}
                </p>
              </div>
            ))}
          </div>
        : <></> }
      </div>

      {/* Display Result */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-gray-200 text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-satoshi font-normal text-gray-200'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-white text-xl'>
                <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-200'>
                  {article.summary}
                </p>
                <div className="flex justify-end mr-6">
                  <button onClick={handleDownloadSummary}>
                    <svg class="w-6 h-4 text-green-400 hover:text-green-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;