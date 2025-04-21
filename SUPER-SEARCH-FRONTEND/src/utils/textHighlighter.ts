export const scrollAndHighlightText = (
  startIndex: number,
  endIndex: number,
  containerId: string,
  matchedText?: string
): void => {
  const container = document.getElementById(containerId);
  if (!container) return;

  document.querySelectorAll('.highlight-active').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      parent.normalize(); 
    }
  });

  const textElement = container.querySelector('p');
  if (!textElement) return;

  const text = textElement.textContent || '';
  
  while (textElement.firstChild) {
    textElement.removeChild(textElement.firstChild);
  }
  
  startIndex = Math.max(0, Math.min(startIndex, text.length));
  endIndex = Math.max(startIndex, Math.min(endIndex, text.length));

  if (startIndex === endIndex && matchedText && matchedText.trim() !== '') {
    const searchIndex = text.toLowerCase().indexOf(matchedText.toLowerCase());
    if (searchIndex >= 0) {
      startIndex = searchIndex;
      endIndex = searchIndex + matchedText.length;
    }
  }
  const beforeText = document.createTextNode(text.substring(0, startIndex));
  const highlightSpan = document.createElement('span');
  highlightSpan.className = 'highlight-active';
  highlightSpan.textContent = text.substring(startIndex, endIndex);
  const afterText = document.createTextNode(text.substring(endIndex));

  textElement.appendChild(beforeText);
  textElement.appendChild(highlightSpan);
  textElement.appendChild(afterText);

  highlightSpan.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
};