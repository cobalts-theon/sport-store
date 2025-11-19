import React from "react";
import "./components-style/footer.css";
import footerImage from "/src/assets/image/running.jpg";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="ps-footer">
            <div className="ps-footer__container">
                <div className="ps-footer__main">
                    {/* Prime Section */}
                    <div className="ps-footer__column">
                        <h3 className="ps-footer__title">Products</h3>
                        <a href="/bikes">Bastketball</a>
                        <a href="/quads">Soccer</a>
                        <a href="/helmets">Tennis</a>
                        <a href="/gear">Pickleball</a>
                    </div>

                    {/* Company Section */}
                    <div className="ps-footer__column">
                        <h3 className="ps-footer__title">Company</h3>
                        <Link to="/about">About Us</Link>
                        <a href="/blog">Blog</a>
                        <a href="/careers">Careers</a>
                        <a href="/partnerships">Partnerships</a>
                    </div>

                    {/* Account Section */}
                    <div className="ps-footer__column">
                        <h3 className="ps-footer__title">Account</h3>
                        <Link to="/login">Log-in</Link>
                        <a href="/cart">Cart</a>
                        <a href="/order">Order</a>
                    </div>

                    {/* Image Section */}
                    <div className="ps-footer__image">
                        <img src={footerImage} alt="Prime Souls" />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="ps-footer__bottom">
                    <div className="ps-footer__social">
                        <a href="#" aria-label="Discord" className="ps-social-icon" title="Discord">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" className="ps-social-icon" title="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="TikTok" className="ps-social-icon" title="TikTok">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="YouTube" className="ps-social-icon" title="YouTube">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                            </svg>
                        </a>
                    </div>

                    <div className="ps-footer__links">
                        <a href="/media">Contact Us</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/supplier-terms">Supplier Terms</a>
                    </div>
                </div>

                {/* Large Text Decoration */}
                <div className="ps-footer__text">
                    <div className="ps-footer__decoration">
                        PRIME <span style={{ color: 'white' }}>SOULS.</span>
                    </div>
                    <div className="ps-footer__copyright">
                        &copy; 2025 Prime Souls. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
