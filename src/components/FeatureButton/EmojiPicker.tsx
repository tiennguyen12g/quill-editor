import React, { useState, useRef, useEffect } from "react";
import "./EmojiPicker.css";

interface EmojiPickerProps {
  quillRef: React.RefObject<any>;
  onEmojiSelect?: (emoji: string) => void;
}

interface EmojiCategory {
  name: string;
  emojis: { emoji: string; name: string }[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: "Status & Actions",
    emojis: [
      { emoji: "✅", name: "Check" },
      { emoji: "✔️", name: "Check Mark" },
      { emoji: "❌", name: "Cross" },
      { emoji: "⚠️", name: "Warning" },
      { emoji: "🔄", name: "Repeat" },
      { emoji: "🚨", name: "Alert" },
      { emoji: "💡", name: "Lightbulb" },
      { emoji: "🎯", name: "Target" },
      { emoji: "📌", name: "Pin" },
      { emoji: "🔥", name: "Fire" },
      { emoji: "❓", name: "Question" },
      { emoji: "➤", name: "Arrow" },
    ],
  },
  {
    name: "Numbers",
    emojis: [
      { emoji: "1️⃣", name: "One" },
      { emoji: "2️⃣", name: "Two" },
      { emoji: "3️⃣", name: "Three" },
      { emoji: "4️⃣", name: "Four" },
      { emoji: "5️⃣", name: "Five" },
      { emoji: "6️⃣", name: "Six" },
      { emoji: "7️⃣", name: "Seven" },
      { emoji: "8️⃣", name: "Eight" },
      { emoji: "9️⃣", name: "Nine" },
      { emoji: "🔟", name: "Ten" },
    ],
  },
  {
    name: "Objects & Tools",
    emojis: [
      { emoji: "📝", name: "Memo" },
      { emoji: "📋", name: "Clipboard" },
      { emoji: "📚", name: "Books" },
      { emoji: "📘", name: "Blue Book" },
      { emoji: "🔑", name: "Key" },
      { emoji: "📦", name: "Package" },
      { emoji: "🧪", name: "Test Tube" },
      { emoji: "🧨", name: "Bomb" },
      { emoji: "🚀", name: "Rocket" },
      { emoji: "💻", name: "Laptop" },
      { emoji: "📱", name: "Phone" },
      { emoji: "⌚", name: "Watch" },
      { emoji: "🎧", name: "Headphones" },
      { emoji: "📷", name: "Camera" },
      { emoji: "🎬", name: "Movie Camera" },
      { emoji: "🔎", name: "Search" },
    ],
  },
  {
    name: "Emotions & Reactions",
    emojis: [
      { emoji: "😀", name: "Grinning" },
      { emoji: "😃", name: "Smiling" },
      { emoji: "😄", name: "Laughing" },
      { emoji: "😁", name: "Beaming" },
      { emoji: "😆", name: "Squinting" },
      { emoji: "😅", name: "Sweating" },
      { emoji: "🤣", name: "Rolling" },
      { emoji: "😂", name: "Tears" },
      { emoji: "🙂", name: "Slightly Smiling" },
      { emoji: "🙃", name: "Upside Down" },
      { emoji: "😉", name: "Winking" },
      { emoji: "😊", name: "Smiling Eyes" },
      { emoji: "😇", name: "Halo" },
      { emoji: "🥰", name: "Hearts" },
      { emoji: "😍", name: "Heart Eyes" },
      { emoji: "🤩", name: "Star Eyes" },
      { emoji: "😘", name: "Kiss" },
      { emoji: "😗", name: "Kissing" },
      { emoji: "😚", name: "Kissing Closed" },
      { emoji: "😙", name: "Kissing Smiling" },
      { emoji: "😋", name: "Yum" },
      { emoji: "😛", name: "Tongue" },
      { emoji: "😜", name: "Winking Tongue" },
      { emoji: "🤪", name: "Zany" },
      { emoji: "😝", name: "Squinting Tongue" },
      { emoji: "🤑", name: "Money Mouth" },
      { emoji: "🤗", name: "Hugging" },
      { emoji: "🤭", name: "Hand Over Mouth" },
      { emoji: "🤫", name: "Shushing" },
      { emoji: "🤔", name: "Thinking" },
      { emoji: "🤐", name: "Zipper Mouth" },
      { emoji: "🤨", name: "Raised Eyebrow" },
      { emoji: "😐", name: "Neutral" },
      { emoji: "😑", name: "Expressionless" },
      { emoji: "😶", name: "No Mouth" },
      { emoji: "😏", name: "Smirking" },
      { emoji: "😒", name: "Unamused" },
      { emoji: "🙄", name: "Rolling Eyes" },
      { emoji: "😬", name: "Grimacing" },
      { emoji: "🤥", name: "Lying" },
      { emoji: "😌", name: "Relieved" },
      { emoji: "😔", name: "Pensive" },
      { emoji: "😪", name: "Sleepy" },
      { emoji: "🤤", name: "Drooling" },
      { emoji: "😴", name: "Sleeping" },
      { emoji: "😷", name: "Medical Mask" },
      { emoji: "🤒", name: "Thermometer" },
      { emoji: "🤕", name: "Bandaged" },
      { emoji: "🤢", name: "Nauseated" },
      { emoji: "🤮", name: "Vomiting" },
      { emoji: "🤧", name: "Sneezing" },
      { emoji: "🥵", name: "Hot" },
      { emoji: "🥶", name: "Cold" },
      { emoji: "😱", name: "Screaming" },
      { emoji: "😨", name: "Fearful" },
      { emoji: "😰", name: "Anxious" },
      { emoji: "😕", name: "Confused" },
      { emoji: "😟", name: "Worried" },
      { emoji: "🙁", name: "Slightly Frowning" },
      { emoji: "😮", name: "Open Mouth" },
      { emoji: "😯", name: "Hushed" },
      { emoji: "😲", name: "Astonished" },
      { emoji: "😳", name: "Flushed" },
      { emoji: "🥺", name: "Pleading" },
      { emoji: "😦", name: "Frowning Open" },
      { emoji: "😧", name: "Anguished" },
      { emoji: "😢", name: "Crying" },
      { emoji: "😭", name: "Loudly Crying" },
      { emoji: "😤", name: "Steam" },
      { emoji: "😠", name: "Angry" },
      { emoji: "😡", name: "Pouting" },
      { emoji: "🤬", name: "Cursing" },
      { emoji: "😥", name: "Sad Relieved" },
      { emoji: "😓", name: "Downcast Sweat" },
      { emoji: "🤗", name: "Hugging" },
      { emoji: "🤯", name: "Exploding Head" },
      { emoji: "🤠", name: "Cowboy" },
      { emoji: "🥳", name: "Partying" },
      { emoji: "😎", name: "Sunglasses" },
      { emoji: "🤓", name: "Nerd" },
      { emoji: "🧐", name: "Monocle" },
      { emoji: "😈", name: "Devil" },
      { emoji: "👹", name: "Ogre" },
      { emoji: "👺", name: "Goblin" },
      { emoji: "💀", name: "Skull" },
      { emoji: "☠️", name: "Skull and Crossbones" },
      { emoji: "👻", name: "Ghost" },
      { emoji: "👽", name: "Alien" },
      { emoji: "🤖", name: "Robot" },
    ],
  },
  {
    name: "Body & Gestures",
    emojis: [
      { emoji: "👊", name: "Fist" },
      { emoji: "✊", name: "Raised Fist" },
      { emoji: "🤛", name: "Left Fist" },
      { emoji: "🤜", name: "Right Fist" },
      { emoji: "👏", name: "Clapping" },
      { emoji: "🙌", name: "Raising Hands" },
      { emoji: "👐", name: "Open Hands" },
      { emoji: "🤲", name: "Palms Up" },
      { emoji: "🤝", name: "Handshake" },
      { emoji: "🙏", name: "Praying" },
      { emoji: "✍️", name: "Writing Hand" },
      { emoji: "💪", name: "Muscle" },
      { emoji: "🦾", name: "Mechanical Arm" },
      { emoji: "🦿", name: "Mechanical Leg" },
      { emoji: "🦵", name: "Leg" },
      { emoji: "🦶", name: "Foot" },
      { emoji: "👂", name: "Ear" },
      { emoji: "🦻", name: "Ear with Hearing Aid" },
      { emoji: "👃", name: "Nose" },
      { emoji: "🧠", name: "Brain" },
      { emoji: "🦷", name: "Tooth" },
      { emoji: "🦴", name: "Bone" },
      { emoji: "👀", name: "Eyes" },
      { emoji: "👁️", name: "Eye" },
      { emoji: "👅", name: "Tongue" },
      { emoji: "👄", name: "Mouth" },
    ],
  },
  {
    name: "Awards & Achievements",
    emojis: [
      { emoji: "🥇", name: "Gold Medal" },
      { emoji: "🥈", name: "Silver Medal" },
      { emoji: "🥉", name: "Bronze Medal" },
      { emoji: "🏆", name: "Trophy" },
      { emoji: "🏅", name: "Sports Medal" },
      { emoji: "🎖️", name: "Military Medal" },
      { emoji: "⭐", name: "Star" },
      { emoji: "🌟", name: "Glowing Star" },
      { emoji: "💫", name: "Dizzy" },
      { emoji: "✨", name: "Sparkles" },
      { emoji: "🎉", name: "Party" },
      { emoji: "🎊", name: "Confetti" },
      { emoji: "🎈", name: "Balloon" },
      { emoji: "🎁", name: "Gift" },
    ],
  },
  {
    name: "Colors & Shapes",
    emojis: [
      { emoji: "🔴", name: "Red Circle" },
      { emoji: "🟠", name: "Orange Circle" },
      { emoji: "🟡", name: "Yellow Circle" },
      { emoji: "🟢", name: "Green Circle" },
      { emoji: "🔵", name: "Blue Circle" },
      { emoji: "🟣", name: "Purple Circle" },
      { emoji: "⚫", name: "Black Circle" },
      { emoji: "⚪", name: "White Circle" },
      { emoji: "🟤", name: "Brown Circle" },
      { emoji: "🔶", name: "Orange Diamond" },
      { emoji: "🔷", name: "Blue Diamond" },
      { emoji: "🔸", name: "Small Orange Diamond" },
      { emoji: "🔹", name: "Small Blue Diamond" },
      { emoji: "🔺", name: "Red Triangle" },
      { emoji: "🔻", name: "Red Triangle Down" },
      { emoji: "💠", name: "Diamond" },
      { emoji: "🔘", name: "Radio Button" },
      { emoji: "🔳", name: "White Square Button" },
      { emoji: "🔲", name: "Black Square Button" },
    ],
  },
  {
    name: "Arrows & Directions",
    emojis: [
      { emoji: "👉", name: "Point Right" },
      { emoji: "👈", name: "Point Left" },
      { emoji: "👆", name: "Point Up" },
      { emoji: "👇", name: "Point Down" },
      { emoji: "☝️", name: "Index Up" },
      { emoji: "👋", name: "Waving Hand" },
      { emoji: "🤚", name: "Raised Back of Hand" },
      { emoji: "🖐️", name: "Hand with Fingers" },
      { emoji: "✋", name: "Raised Hand" },
      { emoji: "🖖", name: "Vulcan Salute" },
      { emoji: "👌", name: "OK Hand" },
      { emoji: "🤏", name: "Pinching Hand" },
      { emoji: "✌️", name: "Victory Hand" },
      { emoji: "🤞", name: "Crossed Fingers" },
      { emoji: "🤟", name: "Love-You Gesture" },
      { emoji: "🤘", name: "Horns" },
      { emoji: "🤙", name: "Call Me Hand" },
      { emoji: "🖕", name: "Middle Finger" },
      { emoji: "👍", name: "Thumbs Up" },
      { emoji: "👎", name: "Thumbs Down" },
    ],
  },
  {
    name: "Symbols & Special",
    emojis: [
      { emoji: "❤️", name: "Red Heart" },
      { emoji: "🧡", name: "Orange Heart" },
      { emoji: "💛", name: "Yellow Heart" },
      { emoji: "💚", name: "Green Heart" },
      { emoji: "💙", name: "Blue Heart" },
      { emoji: "💜", name: "Purple Heart" },
      { emoji: "🖤", name: "Black Heart" },
      { emoji: "🤍", name: "White Heart" },
      { emoji: "🤎", name: "Brown Heart" },
      { emoji: "💔", name: "Broken Heart" },
      { emoji: "❣️", name: "Heart Exclamation" },
      { emoji: "💕", name: "Two Hearts" },
      { emoji: "💞", name: "Revolving Hearts" },
      { emoji: "💓", name: "Beating Heart" },
      { emoji: "💗", name: "Growing Heart" },
      { emoji: "💖", name: "Sparkling Heart" },
      { emoji: "💘", name: "Heart with Arrow" },
      { emoji: "💝", name: "Heart with Ribbon" },
      { emoji: "💟", name: "Heart Decoration" },
      { emoji: "☮️", name: "Peace Symbol" },
      { emoji: "✝️", name: "Latin Cross" },
      { emoji: "☪️", name: "Star and Crescent" },
      { emoji: "🕉️", name: "Om" },
      { emoji: "☸️", name: "Wheel of Dharma" },
      { emoji: "☯️", name: "Yin Yang" },
      { emoji: "✡️", name: "Star of David" },
      { emoji: "🔯", name: "Dotted Six-Pointed Star" },
      { emoji: "🕎", name: "Menorah" },
      { emoji: "☦️", name: "Orthodox Cross" },
      { emoji: "☢️", name: "Radioactive" },
      { emoji: "☣️", name: "Biohazard" },
      { emoji: "📴", name: "Mobile Phone Off" },
      { emoji: "📳", name: "Vibration Mode" },
      { emoji: "🈶", name: "Japanese 'Not Free of Charge'" },
      { emoji: "🈚", name: "Japanese 'Free of Charge'" },
      { emoji: "🈸", name: "Japanese 'Application'" },
      { emoji: "🈺", name: "Japanese 'Open for Business'" },
      { emoji: "🈷️", name: "Japanese 'Monthly Amount'" },
      { emoji: "✴️", name: "Eight-Pointed Star" },
      { emoji: "🆚", name: "VS Button" },
      { emoji: "💮", name: "White Flower" },
      { emoji: "🉐", name: "Japanese 'Bargain'" },
      { emoji: "㊙️", name: "Japanese 'Secret'" },
      { emoji: "㊗️", name: "Japanese 'Congratulations'" },
      { emoji: "🈴", name: "Japanese 'Passing Grade'" },
      { emoji: "🈵", name: "Japanese 'No Vacancy'" },
      { emoji: "🈹", name: "Japanese 'Discount'" },
      { emoji: "🈲", name: "Japanese 'Prohibited'" },
      { emoji: "🉑", name: "Japanese 'Acceptable'" },
      { emoji: "🈸", name: "Japanese 'Application'" },
      { emoji: "🈳", name: "Japanese 'Vacancy'" },
      { emoji: "㊗️", name: "Japanese 'Congratulations'" },
      { emoji: "㊙️", name: "Japanese 'Secret'" },
      { emoji: "🈺", name: "Japanese 'Open for Business'" },
      { emoji: "🈶", name: "Japanese 'Not Free of Charge'" },
    ],
  },
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ quillRef, onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const pickerRef = useRef<HTMLDivElement>(null);

  const insertEmoji = (emoji: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const selection = quill.getSelection();
      const position = selection ? selection.index : quill.getLength();
      quill.insertText(position, emoji);
      quill.setSelection(position + emoji.length, 0);
    }
    onEmojiSelect?.(emoji);
    setIsOpen(false);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="emoji-picker-container" ref={pickerRef}>
      <button
        className="emoji-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Insert Emoji"
        type="button"
      >
        😀
      </button>
      {isOpen && (
        <div className="emoji-picker-popup">
          <div className="emoji-picker-header">
            <div className="emoji-categories">
              {EMOJI_CATEGORIES.map((category, index) => (
                <button
                  key={index}
                  className={`emoji-category-btn ${activeCategory === index ? "active" : ""}`}
                  onClick={() => setActiveCategory(index)}
                  title={category.name}
                >
                  {category.emojis[0]?.emoji || "📁"}
                </button>
              ))}
            </div>
          </div>
          <div className="emoji-picker-body">
            <div className="emoji-category-title">{EMOJI_CATEGORIES[activeCategory].name}</div>
            <div className="emoji-grid">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((item, index) => (
                <button
                  key={index}
                  className="emoji-item"
                  onClick={() => insertEmoji(item.emoji)}
                  title={item.name}
                  type="button"
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;

