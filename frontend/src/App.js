import { useState, useEffect } from "react";

function App() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState([]);
  const [time, setTime] = useState(60);

  useEffect(() => {
    fetch("http://localhost:5050/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          nextQuestion();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, currentIndex, finished]);

  const submitAnswer = async () => {
    const res = await fetch("http://localhost:5050/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    });

    const data = await res.json();
    setFeedback(data.feedback);

    const newResponse = {
      question: questions[currentIndex],
      answer,
      feedback: data.feedback,
    };

    setResponses((prev) => [...prev, newResponse]);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setFeedback("");
      setTime(60);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div style={styles.bg}>
        <div style={styles.card}>
          <h1>🎯 Interview Summary</h1>
          {responses.map((item, index) => (
            <div key={index} style={styles.reviewBox}>
              <p><b>Q{index + 1}:</b> {item.question}</p>
              <p>📝 {item.answer}</p>
              <p>💡 {item.feedback}</p>
            </div>
          ))}
          <button style={styles.btn} onClick={() => window.location.reload()}>
            🔄 Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: "10px" }}>🤖 AI Mock Interview</h1>

        {!started ? (
          <button style={styles.startBtn} onClick={() => setStarted(true)}>
            🚀 Start Interview
          </button>
        ) : (
          <>
            <div style={styles.topBar}>
              <span>Question {currentIndex + 1}/{questions.length}</span>
              <span style={styles.timer}>⏱ {time}s</span>
            </div>

            <div style={styles.questionBox}>
              {questions[currentIndex]}
            </div>

            <textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={styles.textarea}
            />

            <button style={styles.btn} onClick={submitAnswer}>
              Submit
            </button>

            <p style={styles.feedback}>{feedback}</p>

            <button
              style={styles.nextBtn}
              onClick={nextQuestion}
              disabled={!answer}
            >
              Next ➡️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#1e3c72,#2a5298)",
  },
  card: {
    backdropFilter: "blur(15px)",
    background: "rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "20px",
    width: "420px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  startBtn: {
    padding: "12px 25px",
    borderRadius: "30px",
    border: "none",
    background: "#00c6ff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  btn: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    background: "#00c6ff",
    color: "white",
    cursor: "pointer",
  },
  nextBtn: {
    marginTop: "10px",
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    height: "90px",
    marginTop: "15px",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },
  questionBox: {
    marginTop: "15px",
    padding: "15px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  feedback: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  timer: {
    color: "#ff4d4d",
    fontWeight: "bold",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  reviewBox: {
    marginTop: "10px",
    padding: "10px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    textAlign: "left",
  },
};

export default App;