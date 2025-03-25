"use client";
import React, { useState } from 'react';
import Icon from '@/components/Icon';
const TranslatorAgentPage: React.FC = () => {
    const [language1, setLanguage1] = useState('en');
    const [language2, setLanguage2] = useState('es');
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTranslate = async () => {
        setLoading(true);
        setTranslatedText('');
        try {
            const response = await fetch('/demos-page/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent: 'translate_agent',
                    params: {
                        language1,
                        language2,
                        text,
                    },
                }),
            });
            const data = await response.json();
            setTranslatedText(data.answer);
        } catch (error) {
            console.error('Error translating text:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <div className="flex items-center space-x-3 w-full justify-center mb-10">
                <img src="/demos-page/neuralseek_logo.png" alt="NeuralSeek Logo" className="w-16 h-16" />
                <h1 className="text-4xl font-bold text-[#6A67CE] dark:text-[#B3B0FF]">Translator Agent</h1>
            </div>
            <div className="mb-4 flex items-center">
                <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">From:</label>
                    <select
                        value={language1}
                        onChange={(e) => setLanguage1(e.target.value)}
                        className="border p-2 rounded w-full 
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100 
                    border-gray-300 dark:border-gray-600 
                    focus:ring-blue-500 dark:focus:ring-blue-600 
                    focus:border-blue-500 dark:focus:border-blue-600"
                    >
                        <option value="en">English (en)</option>
                        <option value="es">Spanish (es)</option>
                        <option value="fr">French (fr)</option>
                        <option value="de">German (de)</option>
                        <option value="it">Italian (it)</option>
                        <option value="ko">Korean (ko)</option>
                        <option value="zh">Chinese (zh)</option>
                        <option value="ja">Japanese (ja)</option>
                        <option value="th">Thai (th)</option>
                        <option value="pt">Portuguese (pt)</option>
                    </select>
                </div>
                <button
                    onClick={() => {
                        const temp = language1;
                        setLanguage1(language2);
                        setLanguage2(temp);
                    }}
                    className="mx-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                    <Icon name="swap" className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <label className="block mb-2 text-gray-700 dark:text-gray-300">To:</label>
                    <select
                        value={language2}
                        onChange={(e) => setLanguage2(e.target.value)}
                        className="border p-2 rounded w-full 
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-gray-100 
                    border-gray-300 dark:border-gray-600 
                    focus:ring-blue-500 dark:focus:ring-blue-600 
                    focus:border-blue-500 dark:focus:border-blue-600"
                    >
                        <option value="en">English (en)</option>
                        <option value="es">Spanish (es)</option>
                        <option value="fr">French (fr)</option>
                        <option value="de">German (de)</option>
                        <option value="it">Italian (it)</option>
                        <option value="ko">Korean (ko)</option>
                        <option value="zh">Chinese (zh)</option>
                        <option value="ja">Japanese (ja)</option>
                        <option value="th">Thai (th)</option>
                        <option value="pt">Portuguese (pt)</option>
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">Text:</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="border p-2 rounded w-full 
                bg-white dark:bg-gray-700 
                text-gray-900 dark:text-gray-100 
                border-gray-300 dark:border-gray-600 
                focus:ring-blue-500 dark:focus:ring-blue-600 
                focus:border-blue-500 dark:focus:border-blue-600"
                    rows={4}
                />
            </div>
            <button
                onClick={handleTranslate}
                className="bg-blue-500 hover:bg-blue-600 
            text-white 
            p-2 rounded w-full 
            dark:bg-blue-600 dark:hover:bg-blue-700"
            >
                Translate
            </button>
            {loading && (
                <div className="flex justify-center mt-4">
                    <Icon name="loader" className="w-5 h-5 animate-spin text-gray-700 dark:text-gray-300" />
                </div>
            )}
            {translatedText && (
                <div className="mt-4 p-4 border rounded 
            bg-gray-50 dark:bg-gray-700 
            border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-gray-100">
                    <h2 className="text-xl font-bold mb-2">Translation:</h2>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default TranslatorAgentPage;