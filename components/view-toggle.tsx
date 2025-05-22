'use client'

import { Button } from './ui/button'
import { LayoutGrid, LayoutList } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  currentView: ViewMode
  onChange: (view: ViewMode) => void
  className?: string
}

export function ViewToggle({ currentView, onChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant={currentView === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('grid')}
        className="px-3"
        aria-label="Отображение сеткой"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Сетка</span>
      </Button>
      <Button
        variant={currentView === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('list')}
        className="px-3"
        aria-label="Отображение списком"
      >
        <LayoutList className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Список</span>
      </Button>
    </div>
  )
}
