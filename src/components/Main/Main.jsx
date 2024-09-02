import React, { useContext, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import chatbotIcon from '../../assets/chatbot.png'; // Import the chatbot PNG

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  const [darkMode, setDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Toggle dark mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Function to handle card clicks
  const handleCardClick = (prompt) => {
    console.log('Card clicked with prompt:', prompt);
    setInput(prompt); 
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input) {
      console.log('Enter key pressed with input:', input); // Debugging log
      onSent(); // Trigger the onSent function
    }
  };

  // Function to handle gallery selection
  const handleGallerySelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file);
    }
  };

  // Function to handle voice recording
  const handleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please try a different browser.');
      return;
    }

    if (isRecording) {
      // Stop recording
      recognition.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      setRecognition(newRecognition);

      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';

      newRecognition.onstart = () => {
        console.log('Voice recording started');
        setIsRecording(true);
      };

      newRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice recorded:', transcript);
        setInput(transcript);
      };

      newRecognition.onerror = (event) => {
        console.error('Voice recording error:', event.error);
        setIsRecording(false);
      };

      newRecognition.onend = () => {
        console.log('Voice recording ended');
        setIsRecording(false);
      };

      newRecognition.start();
    }
  };

  return (
    <div className={`main ${darkMode ? 'dark-mode' : ''}`}>
      <div className="nav">
        <img src={chatbotIcon} alt="Chatbot" className="chatbot-icon" /> 
        <p>Timesheet Buddy</p>
        
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="main-container">
        {showResult ? (
          <div className="result">
            <div className="result-title">
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="Gemini" />
              {loading ? (
                <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => handleCardClick('Suggest beautiful places to see on an upcoming road trip')}>
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="Compass" />
              </div>
              <div className="card" onClick={() => handleCardClick('Briefly summarize this concept: urban planning')}>
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="Bulb" />
              </div>
              <div className="card" onClick={() => handleCardClick('Brainstorm team bonding activities for our work retreat')}>
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="Message" />
              </div>
              <div className="card" onClick={() => handleCardClick('Improve the readability of the following code')}>
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="Code" />
              </div>
            </div>
          </>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder="Enter a prompt here" 
              onKeyPress={handleKeyPress} 
            />
            <div>
              <label htmlFor="gallery-upload">
                <img src={assets.gallery_icon} width={30} alt="Gallery" />
              </label>
              <input 
                id="gallery-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleGallerySelect} 
              />
              <img 
                src={assets.mic_icon} 
                width={30} 
                alt="Mic" 
                onClick={handleVoiceRecording} 
                style={{ cursor: 'pointer' }}
              />
              {input ? <img onClick={() => onSent()} src={assets.send_icon} width={30} alt="Send" className="send-btn" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            Our chatbot is designed to assist you with timesheet-related inquiries and provide guidance. While we strive for accuracy, please verify any critical information and ensure your data is correctly entered. For any issues, reach out to your HR department.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
