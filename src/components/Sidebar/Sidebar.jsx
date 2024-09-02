import React, { useState, useContext } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSection, setActiveSection] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(true); // State to manage sidebar visibility
    const { onSent, prevPrompts, setRecentPrompt, newChat, darkMode } = useContext(Context);

    const loadPrompt = async (prompt) => {
        await onSent(prompt);
        setRecentPrompt(prompt);
    };

    const filteredPrompts = prevPrompts.filter(prompt =>
        prompt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    return (
        <>
            <button
                className="sidebar-toggle-button"
                onClick={() => setSidebarVisible(prev => !prev)}
            >
                ☰ {/* Sidebar toggle icon */}
            </button>
            <div className={`sidebar ${darkMode ? 'dark-mode' : ''} ${sidebarVisible ? 'show' : 'hide'}`}>
                <div className="top">
                    <button
                        className="close-sidebar"
                        onClick={() => setSidebarVisible(false)}
                    >
                        &times; {/* Close icon */}
                    </button>
                    <img 
                        src={assets.menu_icon} 
                        alt="Menu" 
                        className="menu" 
                        onClick={() => setExtended(prev => !prev)} 
                    />
                    <div 
                        onClick={() => newChat()} 
                        className="new-chat"
                    >
                        <img src={assets.plus_icon} alt="New Chat" />
                        {extended && <p>New Chat</p>}
                    </div>
                    {extended && (
                        <div className="recent">
                            <p className='recent-title'>Recent</p>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="search-bar"
                            />
                            {filteredPrompts.map((item, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => loadPrompt(item)} 
                                    className="recent-entry"
                                >
                                    <img src={assets.message_icon} alt="Prompt" />
                                    <p>{item.slice(0, 18)}{"..."}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bottom">
                    <div 
                        className="bottom-item recent-entry" 
                        onClick={() => handleSectionClick('help')}
                    >
                        <img src={assets.question_icon} alt="Help" />
                        {extended && <p>Help</p>}
                    </div>
                    <div 
                        className="bottom-item recent-entry" 
                        onClick={() => handleSectionClick('activity')}
                    >
                        <img src={assets.history_icon} alt="Activity" />
                        {extended && <p>Activity</p>}
                    </div>
                    <div 
                        className="bottom-item recent-entry" 
                        onClick={() => handleSectionClick('settings')}
                    >
                        <img src={assets.setting_icon} alt="Settings" />
                        {extended && <p>Settings</p>}
                    </div>
                </div>
                {activeSection === 'help' && <div className="section-content">Help content goes here</div>}
                {activeSection === 'activity' && <div className="section-content">Activity content goes here</div>}
                {activeSection === 'settings' && <div className="section-content">Settings content goes here</div>}
            </div>
        </>
    );
};

export default Sidebar;
