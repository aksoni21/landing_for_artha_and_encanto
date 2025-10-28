import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AIStoryGeneratorProps {
  onStoryGenerated: (story: { title: string; content: string; author: string }) => void;
  onCancel: () => void;
}

export default function AIStoryGenerator({ onStoryGenerated, onCancel }: AIStoryGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState({
    difficulty_level: 3,
    word_count: 500,
    topic: '',
    focusAreas: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const difficultyLevels = [
    { value: 1, label: 'Beginner (TOEFL 0-31)', color: 'bg-green-100 text-green-800' },
    { value: 2, label: 'Elementary (TOEFL 32-42)', color: 'bg-lime-100 text-lime-800' },
    { value: 3, label: 'Intermediate (TOEFL 43-61)', color: 'bg-blue-100 text-blue-800' },
    { value: 4, label: 'Upper Intermediate (TOEFL 62-91)', color: 'bg-indigo-100 text-indigo-800' },
    { value: 5, label: 'Advanced (TOEFL 92-109)', color: 'bg-purple-100 text-purple-800' },
    { value: 6, label: 'Proficient (TOEFL 110-120)', color: 'bg-pink-100 text-pink-800' }
  ];

  const focusAreaOptions = [
    'Past Tense',
    'Present Perfect',
    'Modal Verbs',
    'Conditionals',
    'Vocabulary Building',
    'Idioms',
    'Business English',
    'Academic English',
    'Conversational English',
    'Grammar Practice'
  ];

  const toggleFocusArea = (area: string) => {
    setSettings(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleGenerateStory = async () => {
    if (!prompt.trim() && !settings.topic.trim()) {
      toast.error('Please provide a topic or prompt for the story');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with demo data
    setTimeout(() => {
      const demoStories = [
        {
          title: 'Adventure in the Hidden Forest',
          content: `Once upon a time, in a small village nestled against the foot of a vast mountain range, lived a brave and curious girl named Aiko. Aiko had an insatiable curiosity about the world around her, especially the mysterious forest that lay on the other side of the mountains. Despite warnings from the village elders about the dangers that lurked within the forest, Aiko couldn't resist the allure of the unknown and decided to embark on an adventure. One sunny morning, she packed her essentials and set off on her journey towards the forest. The path was steep and treacherous, but Aiko's determination carried her forward. As she entered the forest, the dense foliage blocked out the sunlight, casting eerie shadows on the forest floor. Aiko felt a chill run down her spine, but she pressed on, driven by her curiosity. She encountered strange plants and creatures, some beautiful, others unsettling. She took out her sketchbook and started to document her findings, careful not to disturb the natural balance of the forest. Suddenly, she heard a rustle in the bushes behind her. She turned around to see a small creature with bright eyes looking at her. It was a forest spirit, a guardian of the forest. The spirit told Aiko that the forest was dying due to a curse. Moved by the plight of the forest, Aiko decided to help. She followed the spirit to a hidden shrine where they performed a ritual to lift the curse. The forest immediately began to bloom with life. Aiko returned to her village, her heart filled with joy and a newfound respect for the natural world. She shared her adventure with the villagers, who were in awe of her bravery and the wonders of the forest. From then on, the villagers started to visit the forest, always mindful of the balance between humans and nature.`,
          author: 'AI Generated'
        },
        {
          title: 'Amber at the Conference',
          content: `Amber is a teacher. Today, she goes to an ESL conference. She meets new friends. They talk about teaching. She learns new things. She feels happy. At the end, Amber goes home. She can't wait to teach her students what she learned.`,
          author: 'AI Generated'
        },
        {
          title: 'The First Day',
          content: `Alex took a deep breath before entering the building. It was his first day at his new job, and butterflies filled his stomach. The office was modern and bright, with people working at computers and chatting in small groups.

"You must be Alex!" said a friendly voice. A woman with a warm smile approached him. "I'm Jennifer, your team leader. Welcome aboard!"

Jennifer showed Alex around the office, introducing him to his new colleagues. Everyone seemed nice and welcoming. By lunchtime, Alex already felt more comfortable.

During the afternoon, he worked on his first assignment. It was challenging but exciting. When the day ended, Alex realized his worries had been unnecessary. Sometimes, new beginnings are scary, but they often lead to wonderful opportunities.`,
          author: 'AI Generated'
        }
      ];

      const randomStory = demoStories[Math.floor(Math.random() * demoStories.length)];

      setIsGenerating(false);
      toast.success('Story generated successfully!');
      onStoryGenerated(randomStory);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Demo Badge */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
          <p className="text-xs text-yellow-700">Story generation will use pre-made demo content</p>
        </div>
      </div>

      {/* Story Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Story Topic or Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., A story about a student learning to cook for the first time..."
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {difficultyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSettings({ ...settings, difficulty_level: level.value })}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                settings.difficulty_level === level.value
                  ? `${level.color} border-current`
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Word Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Approximate Word Count: {settings.word_count}
        </label>
        <input
          type="range"
          min="200"
          max="1000"
          step="50"
          value={settings.word_count}
          onChange={(e) => setSettings({ ...settings, word_count: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 text-black rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>200 words</span>
          <span>1000 words</span>
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Focus Areas (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {focusAreaOptions.map((area) => (
            <button
              key={area}
              onClick={() => toggleFocusArea(area)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                settings.focusAreas.includes(area)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleGenerateStory}
          disabled={isGenerating}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Story...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate Story with AI
            </>
          )}
        </button>
      </div>
    </div>
  );
}
