import React from 'react';

interface ViewToggleProps {
    value: 'table' | 'kanban';
    onChange: (value: 'table' | 'kanban') => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
    return (
        <div className="inline-flex rounded-md shadow-sm mb-4" role="group">
            <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700  ${value === 'table'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } rounded-l-md`}
                onClick={() => onChange('table')}
            >
                Table
            </button>
            <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700  ${value === 'kanban'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } rounded-r-md -ml-px`}
                onClick={() => onChange('kanban')}
            >
                Kanban
            </button>
        </div>
    );
} 