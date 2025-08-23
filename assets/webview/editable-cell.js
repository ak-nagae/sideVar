// Editable cell functionality
class EditableCell {
  static startEditing(cell) {
    const currentText = cell.textContent;
    
    // 編集状態にマーク
    cell.classList.add('editing');
    
    // 入力フィールドを作成
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    // セルの内容を入力フィールドに置き換え
    cell.innerHTML = '';
    cell.appendChild(input);
    
    // 入力フィールドにフォーカス
    input.focus();
    input.select();
    
    // キーボードイベントリスナー
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        EditableCell.confirmEdit(cell, input.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        EditableCell.cancelEdit(cell, currentText);
      }
    });
    
    // フォーカス離脱時も確定
    input.addEventListener('blur', () => {
      if (cell.classList.contains('editing')) {
        EditableCell.confirmEdit(cell, input.value);
      }
    });
  }

  static confirmEdit(cell, newValue) {
    cell.classList.remove('editing');
    cell.textContent = newValue;
  }

  static cancelEdit(cell, originalValue) {
    cell.classList.remove('editing');
    cell.textContent = originalValue;
  }

  static attachEditListeners(container) {
    // 編集可能セルにクリックイベントリスナーを追加
    container.querySelectorAll('.editable-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        if (!cell.classList.contains('editing')) {
          EditableCell.startEditing(cell);
        }
      });
    });
  }
}

// Global functions for backward compatibility
const startEditing = (cell) => EditableCell.startEditing(cell);
const confirmEdit = (cell, newValue) => EditableCell.confirmEdit(cell, newValue);
const cancelEdit = (cell, originalValue) => EditableCell.cancelEdit(cell, originalValue);