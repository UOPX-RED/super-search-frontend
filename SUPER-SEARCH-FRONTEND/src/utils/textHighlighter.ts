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
  
  if (matchedText && matchedText.trim() !== '') {
    const searchIndex = text.indexOf(matchedText);
    if (searchIndex >= 0) {
      startIndex = searchIndex;
      endIndex = searchIndex + matchedText.length;
    }
  }
  
  startIndex = Math.max(0, Math.min(startIndex, text.length));
  endIndex = Math.max(startIndex, Math.min(endIndex, text.length));
  
  const fragment = document.createDocumentFragment();
  
  if (startIndex > 0) {
    fragment.appendChild(document.createTextNode(text.substring(0, startIndex)));
  }
  
  const highlightSpan = document.createElement('span');
  highlightSpan.className = 'highlight-active';
  highlightSpan.textContent = text.substring(startIndex, endIndex);
  fragment.appendChild(highlightSpan);
  
  if (endIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.substring(endIndex)));
  }
  
  while (textElement.firstChild) {
    textElement.removeChild(textElement.firstChild);
  }
  textElement.appendChild(fragment);

  highlightSpan.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
};