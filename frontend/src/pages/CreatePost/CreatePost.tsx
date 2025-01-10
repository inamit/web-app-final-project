import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {USER_PROFILE_ROUTE} from "../UserProfile/UserProfile.tsx";

export const ASK_QUESTION_ROUTE = "/create-post";

const AskQuestion = () => {
    const [title, setTitle] = useState("");
    const [question, setQuestion] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Title:", title);
        console.log("Question:", question);
        console.log("Pic:", image);

    };
    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCancel = () => {
        setTitle("");
        setQuestion("");
        setImage(null);
        navigate(USER_PROFILE_ROUTE)
    };

    return (
        <div style={{maxWidth: "600px", margin: "0 auto", color: "#fff"}}>
            <h2>Ask a question</h2>
            <p style={{marginBottom: "20px", color: "#bbb"}}>
                Get answers from AI models, or share your knowledge with others
            </p>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: "20px"}}>
                    <label
                        htmlFor="title"
                        style={{
                            display: "block",
                            fontSize: "14px",
                            color: "#bbb",
                            marginBottom: "8px",
                            textAlign: "left",
                        }}
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #444",
                            backgroundColor: "#222",
                            color: "#fff",
                        }}
                        placeholder="Enter a title"
                    />
                </div>

                <div style={{marginBottom: "20px"}}>
                    <label
                        htmlFor="question"
                        style={{
                            display: "block",
                            fontSize: "14px",
                            color: "#bbb",
                            marginBottom: "8px",
                            textAlign: "left",
                        }}
                    >
                        What's your question?
                    </label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #444",
                            backgroundColor: "#222",
                            color: "#fff",
                            minHeight: "150px",
                        }}
                        placeholder="Type your question here"
                    />
                </div>

                <label
                    htmlFor="title"
                    style={{
                        display: "block",
                        fontSize: "14px",
                        color: "#bbb",
                        marginBottom: "8px",
                        textAlign: "left",
                    }}
                >
                    Upload Image (optional):
                </label>
                <div>
                    <input type="file" onChange={handleImageUpload}/>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                    }}
                >
                    <button
                        type="submit"
                        style={{

                            padding: "10px 20px",
                            borderRadius: "12px",
                            backgroundColor: "#5B6DC9",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Ask
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "12px",
                            backgroundColor: "5B6DC9",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AskQuestion;