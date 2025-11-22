import "./pages-style/userreview.css";
import avatar1 from "/src/assets/image/Bao-truong.jpg";
import avatar2 from "/src/assets/image/Grey.png";
import avatar3 from "/src/assets/image/Luz.png";
import { faStar, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
function UserReview() {
    return (
        <div className="user-review-container">
            <div className="title-s">
                <p><FontAwesomeIcon icon={faSquare} /> User Reviews</p>
                <h1 className="user-review-title">USER REVIEWS, YOUR OPINION MATTERS</h1>
            </div>
            <div className="line-s">
                <p>Together with Prime Souls, we are creating a world where athletes can buy and sell their own products. With your opinion, we can make Prime Souls even better, so we invite you to share your experience with us.</p>
                <div className="submit-review-section">
                    <input type="text" placeholder="Write your review here..." className="review-input"/>
                    <Link to="/signup" className="become-member-link"><button className="submit-review-btn">Submit</button></Link>
                </div>
                <div className="submit-review-button-line">
                    <p>Join us on Prime Souls and let your voice be heard!</p>
                    <Link to="/signup" className="become-member-link"><button className="submit-review-btn second"><FontAwesomeIcon icon={faSquare} style={{ fontSize: "10px" }}/> Join Us</button></Link>
                </div>
                <p className="user-review-text-third" style={{ fontSize: "8px"}}><FontAwesomeIcon icon={faSquare} /> Become a Prime Soul member today!</p>
            </div>
            <div className="center-circle"></div>
            <div className="user-review-content first">
                <div className="user-header">
                    <div className="user-avatar-info">
                        <img src={avatar1} alt="avatar1" />
                    </div>
                    <div className="user-name-role">
                        <h3 className="user-name">Riyaki</h3>
                        <p className="user-role">CEO OF RYCAFE</p>
                        <div className="user-rating">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                            ))}
                        </div>
                        <p className="user-review-text first-review">
                            "I love Prime Sales! Their products are top-notch and the customer service is excellent. Highly recommend to everyone!"
                        </p>
                    </div>
                </div>
            </div>
            <div className="user-review-content second">
                <div className="user-header second-user">
                    <div className="user-avatar-info second-user-avatar">
                        <img src={avatar2} alt="avatar1" />
                    </div>
                    <div className="user-name-role second-role-info">
                        <h3 className="user-name second-name">Grey</h3>
                        <p className="user-role second-role">THE ONE WHO ASK</p>
                        <div className="user-rating second-rating">
                            {[...Array(4)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                            ))}
                            <FontAwesomeIcon icon={faStar} className="star-icon empty" style={{opacity: 0.3}} />
                        </div>
                        <p className="user-review-text second-review">
                            "Great experience shopping at Prime Sales."
                        </p>
                    </div>
                </div>
            </div>
            <div className="user-review-content third">
                <div className="user-header third-user">
                    <div className="user-avatar-info third-user-avatar">
                        <img src={avatar3} alt="avatar1" />
                    </div>
                    <div className="user-name-role third-role-info">
                        <h3 className="user-name third-name">Luz</h3>
                        <p className="user-role third-role">USA PRESIDENT</p>
                        <div className="user-rating third-rating">
                            {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                            ))}
                        </div>
                        <p className="user-review-text third-review">
                            "Shopping at Prime Sales has been a fantastic experience. The variety of products and the ease of navigation on their website made my shopping enjoyable. Best online store ever!"
                        </p>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default UserReview;