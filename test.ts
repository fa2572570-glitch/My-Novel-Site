import React from 'react';

export const MemoizedChapterView = React.memo(({
  chap,
  idx,
  isFirstRendered,
  currentChapterIndex,
  frameEnabled,
  frameStyles,
  frameBorder,
  activeParagraphSpacing,
  currentTheme,
  bookTitle,
  activeFontSize,
  activeLineHeight,
  activeFontFamily,
  isLandscape,
  highlightedParagraph,
  renderTransformedText
}: any) => {
  return (
    <article ...>
  );
});
