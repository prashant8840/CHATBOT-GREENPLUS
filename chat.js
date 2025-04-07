// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Chatbot Functionality
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const suggestionChips = document.querySelectorAll('.suggestion-chip');
const quickTips = document.querySelectorAll('.quick-tips li');

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyBUNSfwwIw5A-5Dq3jqWEcMEfNomO6o3pg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Function to get current time
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Check if message contains newlines and format accordingly
    if (message.includes('\n')) {
        message.split('\n').forEach((line, index) => {
            if (index > 0) {
                messageContent.appendChild(document.createElement('br'));
            }
            messageContent.appendChild(document.createTextNode(line));
        });
    } else {
        messageContent.textContent = message;
    }
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle user input
async function handleUserInput(message) {
    if (message.trim() === '') return;

    // Clear input field
    userInput.value = '';

    // Add user message to chat
    addMessage(message, true);

    try {
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = '<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get response from Gemini API
        const response = await getGeminiResponse(message);
        
        // Remove typing indicator
        typingDiv.remove();

        // Add bot response to chat
        addMessage(response);
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.');
    }
}

// Event listeners for sending messages
sendButton.addEventListener('click', () => handleUserInput(userInput.value));
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput(userInput.value);
    }
});

// Handle suggestion chips
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        handleUserInput(chip.textContent);
    });
});

// Handle quick tips
quickTips.forEach(tip => {
    tip.addEventListener('click', () => {
        handleUserInput(`Tell me more about ${tip.textContent}`);
    });
});

// Function to get response from Gemini API
async function getGeminiResponse(message) {
    try {
        // Customize the prompt to focus on green living tips
        const prompt = `You are GreenPulse, an AI assistant specialized in sustainable living and eco-friendly tips. 
        Provide helpful, concise advice related to: energy conservation, waste reduction, sustainable shopping, 
        and eco-friendly habits. Be friendly and encouraging. If the question is not related to environmental sustainability, 
        politely redirect the conversation to sustainable living topics.
        
        User question: ${message}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the response text from the Gemini API response
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        
        // Fallback responses if API fails
        return getFallbackResponse(message);
    }
}

// Fallback function for when API call fails
function getFallbackResponse(message) {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('energy') || messageLower.includes('electricity')) {
        return "Here are some energy-saving tips:\n1. Use LED bulbs instead of traditional ones\n2. Install a programmable thermostat\n3. Unplug electronics when not in use\n4. Use natural light during the day\n5. Consider solar panels for renewable energy";
    }
    
    if (messageLower.includes('waste') || messageLower.includes('recycling')) {
        return "Here are some waste reduction tips:\n1. Start composting your food scraps\n2. Use reusable containers instead of single-use plastics\n3. Recycle paper, glass, and metal\n4. Donate items you no longer need\n5. Buy products with minimal packaging";
    }
    
    if (messageLower.includes('shopping') || messageLower.includes('buy')) {
        return "Here are some sustainable shopping tips:\n1. Buy local produce\n2. Choose products with eco-friendly packaging\n3. Support sustainable brands\n4. Buy in bulk to reduce packaging\n5. Consider second-hand items";
    }
    
    if (messageLower.includes('water') || messageLower.includes('conservation')) {
        return "Here are some water conservation tips:\n1. Fix leaky faucets\n2. Install low-flow showerheads\n3. Collect rainwater for plants\n4. Run full loads in the dishwasher\n5. Turn off the tap while brushing teeth";
    }

    // Default response if no keywords match
    const responses = [
        "Here's a tip for sustainable living: Try using reusable shopping bags instead of plastic ones!",
        "Did you know? Turning off lights when leaving a room can save significant energy.",
        "Consider starting a small herb garden in your kitchen window for fresh, local produce!",
        "Using public transportation or carpooling is a great way to reduce your carbon footprint.",
        "Try to reduce food waste by planning meals and storing leftovers properly.",
        "Using LED bulbs instead of traditional ones can save up to 80% more energy.",
        "Consider installing a rain barrel to collect water for your garden.",
        "Try to buy products with minimal packaging to reduce waste.",
        "Using a programmable thermostat can help save energy when you're not home.",
        "Consider starting a compost bin for your food scraps and yard waste."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
} 