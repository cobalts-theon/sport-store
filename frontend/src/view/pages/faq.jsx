import { useState } from 'react';
import './pages-style/faq.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ColorBends from '../components/ColorBends';
function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by going to the 'Track Order' page in the Help menu. Enter your order ID or check your order history in your profile."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are secured and encrypted."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 2-4 business days. Express shipping is available for 1-2 business days delivery. Free shipping on orders over 2,000,000đ."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for unused items in original packaging. Contact our support team to initiate a return."
        },
        {
            question: "How do I change or cancel my order?",
            answer: "Orders can be modified or cancelled within 1 hour of placing. After that, please contact our support team as soon as possible."
        },
        {
            question: "Are your products authentic?",
            answer: "Yes! All Prime Souls products are 100% authentic. We source directly from manufacturers and authorized distributors."
        },
        {
            question: "How do I choose the right size?",
            answer: "Check our size guide on each product page. We provide detailed measurements for shoes (VN sizes, foot length) and clothing (chest, length, shoulder)."
        },
        {
            question: "Do you ship internationally?",
            answer: "Currently, we only ship within Vietnam. International shipping will be available soon."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page-wrapper">
            <div className="color-bends-background">
                <ColorBends
                    colors={["#101200ff", "#a8ff5cff", "#2a341aff"]}
                    rotation={30}
                    speed={0.3}
                    scale={1}
                    frequency={1.4}
                    warpStrength={1.1}
                    mouseInfluence={0.8}
                    parallax={0.6}
                    noise={0.08}
                    transparent
                />
            </div>
            <div className="faq-container">
                <div className="faq-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about Prime Souls</p>
                </div>
                
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <div 
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <FontAwesomeIcon 
                                    icon={openIndex === index ? faChevronUp : faChevronDown} 
                                />
                            </div>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-contact">
                    <p>Still have questions?</p>
                    <span>Email us at <a href="mailto:nvo59876@gmail.com">nvo59876@gmail.com</a></span>
                </div>
            </div>
        </div>
    );
}

export default FAQ;
