// Create a nextjs tsx file to handle a text area input to type / or @ characters to display a select un top of the text area. it is a shortcouts text editor. use tailwind design to make it nice

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Hash, User, FileText, Image, Calendar, Link, Bold, Italic } from 'lucide-react';

interface ShortcutItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  insertText: string;
}

const slashCommands: ShortcutItem[] = [
  {
    id: 'heading',
    label: 'Heading',
    description: 'Create a heading',
    icon: <Hash className="w-4 h-4" />,
    insertText: '# '
  },
  {
    id: 'bold',
    label: 'Bold Text',
    description: 'Make text bold',
    icon: <Bold className="w-4 h-4" />,
    insertText: '**bold text**'
  },
  {
    id: 'italic',
    label: 'Italic Text',
    description: 'Make text italic',
    icon: <Italic className="w-4 h-4" />,
    insertText: '*italic text*'
  },
  {
    id: 'document',
    label: 'Document',
    description: 'Create a new document',
    icon: <FileText className="w-4 h-4" />,
    insertText: '📄 Document: '
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Insert an image',
    icon: <Image className="w-4 h-4" />,
    insertText: '![Image](url)'
  },
  {
    id: 'link',
    label: 'Link',
    description: 'Insert a link',
    icon: <Link className="w-4 h-4" />,
    insertText: '[Link text](url)'
  }
];

const atCommands: ShortcutItem[] = [
  {
    id: 'john',
    label: 'John Doe',
    description: 'Product Manager',
    icon: <User className="w-4 h-4" />,
    insertText: '@John Doe'
  },
  {
    id: 'jane',
    label: 'Jane Smith',
    description: 'Designer',
    icon: <User className="w-4 h-4" />,
    insertText: '@Jane Smith'
  },
  {
    id: 'bob',
    label: 'Bob Johnson',
    description: 'Developer',
    icon: <User className="w-4 h-4" />,
    insertText: '@Bob Johnson'
  },
  {
    id: 'meeting',
    label: 'Team Meeting',
    description: 'Weekly standup',
    icon: <Calendar className="w-4 h-4" />,
    insertText: '@Team Meeting'
  }
];

interface MenuPosition {
  top: number;
  left: number;
}

const ShortcutsTextEditor: React.FC = () => {
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [activeCommand, setActiveCommand] = useState<'/' | '@' | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [triggerIndex, setTriggerIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getCurrentCommands = (): ShortcutItem[] => {
    return activeCommand === '/' ? slashCommands : atCommands;
  };

  const getCaretPosition = () => {
    if (!textareaRef.current) return { top: 0, left: 0 };

    const textarea = textareaRef.current;
    const mirror = document.createElement('div');
    const computedStyle = window.getComputedStyle(textarea);

    // Copy textarea styles to mirror element
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';
    mirror.style.font = computedStyle.font;
    mirror.style.padding = computedStyle.padding;
    mirror.style.border = computedStyle.border;
    mirror.style.boxSizing = computedStyle.boxSizing;
    mirror.style.width = computedStyle.width;

    document.body.appendChild(mirror);

    const textBeforeCaret = text.substring(0, textarea.selectionStart);
    mirror.textContent = textBeforeCaret;

    const span = document.createElement('span');
    span.textContent = '|';
    mirror.appendChild(span);

    const rect = textarea.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();

    document.body.removeChild(mirror);

    return {
      top: rect.top + (spanRect.top - mirrorRect.top) - textarea.scrollTop + 25,
      left: rect.left + (spanRect.left - mirrorRect.left)
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const cursorPosition = e.target.selectionStart;

    setText(newText);

    // Check for trigger characters
    const textBeforeCursor = newText.substring(0, cursorPosition);
    const lastSlash = textBeforeCursor.lastIndexOf('/');
    const lastAt = textBeforeCursor.lastIndexOf('@');

    const shouldShowSlashMenu = lastSlash > -1 &&
      (lastSlash === 0 || /\s/.test(textBeforeCursor[lastSlash - 1])) &&
      !textBeforeCursor.substring(lastSlash + 1).includes(' ');

    const shouldShowAtMenu = lastAt > -1 &&
      (lastAt === 0 || /\s/.test(textBeforeCursor[lastAt - 1])) &&
      !textBeforeCursor.substring(lastAt + 1).includes(' ');

    if (shouldShowSlashMenu && lastSlash >= lastAt) {
      setActiveCommand('/');
      setTriggerIndex(lastSlash);
      setShowMenu(true);
      setSelectedIndex(0);
      const position = getCaretPosition();
      setMenuPosition(position);
    } else if (shouldShowAtMenu && lastAt > lastSlash) {
      setActiveCommand('@');
      setTriggerIndex(lastAt);
      setShowMenu(true);
      setSelectedIndex(0);
      const position = getCaretPosition();
      setMenuPosition(position);
    } else {
      setShowMenu(false);
      setActiveCommand(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMenu) return;

    const commands = getCurrentCommands();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        insertCommand(commands[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        setShowMenu(false);
        setActiveCommand(null);
        break;
    }
  };

  const insertCommand = (command: ShortcutItem) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBefore = text.substring(0, triggerIndex);
    const textAfter = text.substring(cursorPosition);

    const newText = textBefore + command.insertText + textAfter;
    setText(newText);

    setShowMenu(false);
    setActiveCommand(null);

    // Set cursor position after the inserted text
    setTimeout(() => {
      const newCursorPosition = textBefore.length + command.insertText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  const handleMenuItemClick = (command: ShortcutItem) => {
    insertCommand(command);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setActiveCommand(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Shortcuts Text Editor</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Type <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">/</kbd> for commands or{' '}
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">@</kbd> for mentions
          </p>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing... Use / for commands or @ for mentions"
            className="w-full h-64 p-4 resize-none border-none outline-none focus:ring-0 text-gray-800 dark:text-gray-100 dark:bg-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
            }}
          />

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-64 max-h-64 overflow-y-auto"
              style={{
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">
                  {activeCommand === '/' ? 'COMMANDS' : 'MENTIONS'}
                </div>
                {getCurrentCommands().map((command, index) => (
                  <div
                    key={command.id}
                    className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${index === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900 border-l-2 border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    onClick={() => handleMenuItemClick(command)}
                  >
                    <div className={`mr-3 ${index === selectedIndex ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`}>
                      {command.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${index === selectedIndex ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-200'}`}>
                        {command.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {command.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Characters: {text.length}</span>
              <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded mr-1">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded mr-1">Enter</kbd>
                Select
              </span>
              <span className="flex items-center">
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded mr-1">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ShortcutsTextEditor;