import { useEffect } from 'react';

export function useProtection() {
  useEffect(() => {
    // 禁用右键菜单
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 禁用拖拽（防止直接拖走图片）
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 禁用常用快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Ctrl + S (保存网页) or Command + S (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }
      
      // Ctrl + C (复制) or Command + C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        // 允许在输入框中复制
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
      }

      // Ctrl + P (打印) or Command + P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
      }

      // Ctrl + Shift + I/J/C (打开开发者工具) or Command + Option + I/J/C
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey)) {
        const key = e.key.toLowerCase();
        if (key === 'i' || key === 'j' || key === 'c') {
          e.preventDefault();
        }
      }

      // Ctrl + U (查看网页源代码) or Command + Option + U
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
