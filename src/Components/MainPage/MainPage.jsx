import axios from "axios";
import { useContext, useEffect, useState } from "react";
import './style.css';
import useCheckMobileScreen from "../../Functions/useCheckMobileScreen";
import { CategoryContext } from "../../Context/CategoryContext";
import { TimeConverter } from "../../Functions/useTimeConverter";
import MobileLoader from "../../Functions/useMobileLoader";
import DesktopLoader from "../../Functions/useDesktopLoader";
import Pagination from "../Pagination";

const MainPage = () => {

    const {category, page } = useContext(CategoryContext);
    // const [data, setData] = useState(null); // Initialize with null for better conditional checks
    const [articles, setArticles] = useState(null); // Initialize with null for better conditional checks
    const [isLoading, setIsLoading] = useState(true);
    const isMobile = useCheckMobileScreen();
    console.log("ismobile", isMobile);

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const key = "1436c2c4dbc348e1b92cbc2c5010d5a1";
                const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${key}`;
                const response = await axios.get(url);
                // setData(response.data.articles);
                setArticles(response.data.articles);
                console.log("Your data:", response.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [category]); // Add category as dependency to refetch data when category changes

    return (
        <>
            <h1 className="head">Top Headlines in {category}</h1>
            <div className="article-container">
                {isLoading ? (
                    !isMobile ? (
                    <div className="loader-container">
                        {[...Array(7)].map((_,index) => (
                            <DesktopLoader key={index}/>
                        ))}
                    </div>
                ): (
                    <div>
                        {[...Array(7)].map((_, index) => (
                            <MobileLoader key={index}/>
                        ))}
                    </div>
                )
                ) : articles && articles.length > 0 ? (
                    <>
                        {!isMobile ? (
                            articles.slice(page * 7 - 7, page * 7).map((article, index) => (
                                    <div className="article" key={index}>
                                    <div>
                                        <h3 className="title">{article.title.slice(0, 80)}...</h3>
                                        <img className="img" src={article.urlToImage} alt={article.title} />
                                        <p className="description">
                                            {article.description ? article.description.slice(0, 100) + "..." : "No description available"}
                                        </p>
                                        {/* <a href={article.url}>hello</a> */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            articles.slice(page * 7 - 7, page * 7).map((article, index) => (
                                <div className="article" key={index}>
                                    <div className="container">
                                        <img className="img" src={article.urlToImage} alt={article.title} />
                                        <div className="mini-container">
                                            <h3 className="title">{article.title.slice(0, 50)}...</h3>
                                            <p className="source">{article.source.name}</p>
                                            <p className="publish">{TimeConverter(article.publishedAt.slice(0,10))}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <p>No data</p>
                )}
                <div className="page">
                    <Pagination/>
                </div>
            </div>
        </>
    );
};

export default MainPage;