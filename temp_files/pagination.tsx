'use client'

import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: PaginationProps) {
  // Функция для генерации массива страниц для отображения
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Максимальное количество страниц для отображения

    if (totalPages <= maxPagesToShow) {
      // Если общее количество страниц меньше или равно максимальному количеству для отображения,
      // показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Иначе показываем страницы вокруг текущей страницы
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      // Добавляем первую страницу и многоточие, если startPage > 1
      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
          pageNumbers.push('...')
        }
      }

      // Добавляем страницы вокруг текущей
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Добавляем многоточие и последнюю страницу, если endPage < totalPages
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...')
        }
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // Если всего одна страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <Button
            key={index}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="px-3"
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-1">
            {page}
          </span>
        )
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
